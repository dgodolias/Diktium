import logging
from typing import Any

import psycopg

from . import db, extractors
from .api_client import ApiClient, ApiError
from .filters import (
    is_below_incorporation_threshold,
    matches_client_side,
    to_api_params,
)
from .models import CompanyFilter
from .settings import Settings

BELOW_THRESHOLD_STOP_STREAK = 400
"""Consecutive out-of-range rows that trigger an early stop.

Because `-incorporationDate` sort puts the (bogus) 9011 / 5015 future-dated entries at
the top and then good data in a valid descending order, we need tolerance before
concluding we've crossed the lower bound. Two full 200-record pages in a row of dates
below the filter threshold is the safety margin."""

logger = logging.getLogger(__name__)


def _list_page(
    api: ApiClient, filt: CompanyFilter, page: int, page_size: int
) -> list[dict[str, Any]]:
    params = to_api_params(filt)
    params["resultsOffset"] = page * page_size
    params["resultsSize"] = page_size
    response = api.get("/companies", params=params)

    if isinstance(response, dict):
        results = response.get("searchResults") or response.get("data") or []
    elif isinstance(response, list):
        results = response
    else:
        results = []

    return [r for r in results if isinstance(r, dict)]


def fetch_list(
    conn: psycopg.Connection,
    api: ApiClient,
    settings: Settings,
    filt: CompanyFilter,
    filter_set_id: int,
    max_pages: int | None = None,
) -> int:
    """Walk /companies pages, upserting records and linking them to this filter set.

    Pages already marked 'done' in fetch_progress are skipped, so closing and reopening
    the run picks up exactly where it left off.
    """
    cap = max_pages if max_pages is not None else settings.max_pages
    done = db.completed_pages(conn, filter_set_id)
    logger.info(
        "Filter set %d: %d page(s) already done, scanning up to page %d",
        filter_set_id, len(done), cap - 1,
    )

    new_company_count = 0
    matched_total = 0
    below_streak = 0
    for page in range(cap):
        if page in done:
            continue

        try:
            rows = _list_page(api, filt, page, settings.page_size)
        except ApiError as exc:
            logger.error("Page %d failed: %s", page, exc)
            db.mark_page(conn, filter_set_id, page, "errored", 0, str(exc)[:500])
            raise

        if not rows:
            logger.info("Page %d returned no results — scan complete", page)
            db.mark_page(conn, filter_set_id, page, "done", 0)
            break

        inserted_this_page = 0
        matched_this_page = 0
        for raw in rows:
            if "arGemi" not in raw:
                continue
            if is_below_incorporation_threshold(raw, filt):
                below_streak += 1
            else:
                below_streak = 0
            if not matches_client_side(raw, filt):
                continue
            matched_this_page += 1
            record = extractors.from_list_row(raw)
            was_new = db.upsert_company_from_list(conn, record, raw)
            db.link_company_to_filter_set(conn, filter_set_id, record.ar_gemi, page)
            if was_new:
                inserted_this_page += 1
        conn.commit()

        db.mark_page(conn, filter_set_id, page, "done", matched_this_page)
        new_company_count += inserted_this_page
        matched_total += matched_this_page
        logger.info(
            "Page %d: %d rows (%d matched, %d new). Matched total: %d. BelowStreak: %d",
            page, len(rows), matched_this_page, inserted_this_page,
            matched_total, below_streak,
        )

        if below_streak >= BELOW_THRESHOLD_STOP_STREAK:
            logger.info(
                "Early stop — %d consecutive rows below incorporation_from",
                below_streak,
            )
            break

    return new_company_count


def fetch_details(
    conn: psycopg.Connection,
    api: ApiClient,
    filter_set_id: int,
    detail_path: str = "/companies/{ar_gemi}",
    limit: int | None = None,
) -> int:
    """For every company in this filter set without detail_fetched_at, call the detail
    endpoint and enrich the row. Already-enriched companies (from prior runs) are skipped.
    """
    pending = db.pending_detail_gemis(conn, filter_set_id, limit=limit)
    logger.info("Filter set %d: %d companies pending detail fetch", filter_set_id, len(pending))

    processed = 0
    for ar_gemi in pending:
        path = detail_path.format(ar_gemi=ar_gemi)
        try:
            response = api.get(path)
        except ApiError as exc:
            logger.error("Detail fetch failed for %s: %s", ar_gemi, exc)
            continue

        if not isinstance(response, dict):
            logger.warning("Unexpected detail shape for %s: %s", ar_gemi, type(response).__name__)
            continue

        record = extractors.from_detail_payload(response)
        if record.ar_gemi != ar_gemi:
            record = record.model_copy(update={"ar_gemi": ar_gemi})
        db.update_company_from_detail(conn, record, response)
        conn.commit()
        processed += 1

    return processed
