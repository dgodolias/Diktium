import hashlib
import json
from datetime import date
from typing import Any

from ._text import strip_accents_casefold
from .models import CompanyFilter


def canonical_hash(filt: CompanyFilter) -> str:
    """Stable 16-hex-char identifier for a filter set — identical filters map to the same id."""
    payload = filt.model_dump(mode="json")
    canonical = json.dumps(payload, sort_keys=True, ensure_ascii=False, default=str)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:16]


def _fmt_date(d: date | None) -> str | None:
    return d.isoformat() if d else None


SERVER_SIDE_FIELDS: tuple[str, ...] = (
    "legal_form_id", "status_id", "region_id",
)
CLIENT_SIDE_FIELDS: tuple[str, ...] = (
    "activity_code_prefixes",
    "incorporation_from", "incorporation_to",
    "closing_from", "closing_to",
    "kak_change_from", "kak_change_to",
    "city", "zip_code",
)


def to_api_params(filt: CompanyFilter) -> dict[str, Any]:
    """Translate a CompanyFilter into /companies query params.

    The live Γ.Ε.ΜΗ. API only reliably honours three filter params right now:
    `legalTypes`, `statuses`, and `prefectures`. Everything else (dates, ΚΑΔ,
    suspensions, etc.) was probed and either 404s or is silently ignored, so we
    apply those client-side during pagination — see `matches_client_side` below.
    """
    params: dict[str, Any] = {"resultsSortBy": "-incorporationDate"}
    if filt.legal_form_id is not None:
        params["legalTypes"] = filt.legal_form_id
    if filt.status_id is not None:
        params["statuses"] = filt.status_id
    if filt.region_ids:
        params["prefectures"] = list(filt.region_ids)
    if filt.local_office_id is not None:
        params["gemiOffices"] = filt.local_office_id
    return params


_MAIN_ACTIVITY_TYPES: frozenset[str] = frozenset({"κυρια", "main", "primary"})


def _main_activity_code(raw_row: dict[str, Any]) -> str | None:
    """Return the ΚΑΔ id of the company's primary activity (type == 'Κύρια').

    Secondary activities are deliberately ignored — a hardware store that
    registered a restaurant ΚΑΔ on the side shouldn't pass a restaurant filter.
    """
    activities = raw_row.get("activities")
    if not isinstance(activities, list):
        return None
    for entry in activities:
        if not isinstance(entry, dict):
            continue
        type_text = strip_accents_casefold(str(entry.get("type") or ""))
        if type_text not in _MAIN_ACTIVITY_TYPES:
            continue
        activity = entry.get("activity") if isinstance(entry.get("activity"), dict) else entry
        code = activity.get("id") or activity.get("code") or activity.get("kad")
        if code:
            return str(code)
    return None


def _parse_iso_date(value: Any) -> date | None:
    if value is None:
        return None
    text = str(value)[:10]
    try:
        return date.fromisoformat(text)
    except ValueError:
        return None


def matches_client_side(raw_row: dict[str, Any], filt: CompanyFilter) -> bool:
    """Client-side filter for fields the API doesn't honour server-side."""
    inc_date = _parse_iso_date(raw_row.get("incorporationDate"))
    if filt.incorporation_from and inc_date and inc_date < filt.incorporation_from:
        return False
    if filt.incorporation_to and inc_date and inc_date > filt.incorporation_to:
        return False

    if filt.activity_code_prefixes:
        main_code = _main_activity_code(raw_row)
        if main_code is None:
            return False
        if not any(main_code.startswith(prefix) for prefix in filt.activity_code_prefixes):
            return False

    if filt.zip_code:
        if str(raw_row.get("zipCode") or "") != filt.zip_code:
            return False

    if filt.city:
        row_city = str(raw_row.get("city") or "").strip().casefold()
        if filt.city.strip().casefold() not in row_city:
            return False

    return True


def is_below_incorporation_threshold(raw_row: dict[str, Any], filt: CompanyFilter) -> bool:
    """True when the row's incorporation date is older than `incorporation_from`.

    Used with `-incorporationDate` sorting to detect when the scan has crossed the
    lower bound and can stop early. Sanity-guards against the bogus 9011 / 5015
    entries in the source data by requiring a plausible year.
    """
    if not filt.incorporation_from:
        return False
    inc_date = _parse_iso_date(raw_row.get("incorporationDate"))
    if inc_date is None:
        return False
    if inc_date.year > 2100:
        return False
    return inc_date < filt.incorporation_from
