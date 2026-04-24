"""CLI entry point — keep it thin. Runtime knobs live in `config.py`, not here.

    python -m gemi_fetch --setup   # apply schema.sql
    python -m gemi_fetch --reset   # clear fetch_progress for the current FILTER, then run
    python -m gemi_fetch           # run (phases controlled by config.RUN.list_phase/detail_phase)
"""

import argparse
import logging

from . import db
from .api_client import ApiClient
from .config import FILTER, RUN
from .fetcher import fetch_details, fetch_list
from .filters import canonical_hash
from .meta import MetadataResolver
from .settings import Settings


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="gemi_fetch",
        description="Smart Γ.Ε.ΜΗ. opendata scraper — business FILTER + runtime RUN in config.py.",
    )
    parser.add_argument("--setup", action="store_true", help="Apply schema.sql and exit")
    parser.add_argument(
        "--reset", action="store_true",
        help="Clear fetch_progress for the current FILTER before running",
    )
    return parser.parse_args()


def configure_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )


def run_setup(settings: Settings) -> None:
    with db.connect(settings.database_url) as conn:
        db.apply_schema(conn)
    print("Schema applied to", settings.database_url.split("@")[-1])


def run_fetch(settings: Settings, reset: bool) -> None:
    filter_hash = canonical_hash(FILTER)

    with db.connect(settings.database_url) as conn, ApiClient(settings, RUN) as api:
        resolver = MetadataResolver(api)
        enriched = resolver.enrich(FILTER)
        if enriched != FILTER:
            print(
                f"Resolved filter IDs: status={enriched.status_id}, "
                f"regions={enriched.region_ids}"
            )
        filter_set_id = db.upsert_filter_set(conn, enriched, filter_hash)
        print(f"Filter set id={filter_set_id} hash={filter_hash}")

        if reset:
            db.reset_progress(conn, filter_set_id)
            print("Cleared fetch_progress for this filter set")

        if RUN.list_phase:
            new_count = fetch_list(conn, api, RUN, enriched, filter_set_id)
            total = db.count_companies_for_filter(conn, filter_set_id)
            print(f"List phase done — {new_count} new, {total} total linked to filter set")

        if RUN.detail_phase:
            processed = fetch_details(conn, api, RUN, filter_set_id)
            print(f"Detail phase done — enriched {processed} companies")


def main() -> None:
    configure_logging()
    args = parse_args()
    settings = Settings()  # type: ignore[call-arg]

    if args.setup:
        run_setup(settings)
        return

    run_fetch(settings, reset=args.reset)


if __name__ == "__main__":
    main()
