"""Pure functions that normalize raw API JSON into CompanyRecord / subfield models.

Kept separate from the DB and HTTP layers so they are trivial to unit-test — feed in a
raw dict, get back a CompanyRecord. The list-response schema is derived from the legacy
JS scraper; the detail-response schema is a best effort based on the Γ.Ε.ΜΗ. web UI and
should be adjusted once a real detail payload is captured.
"""

from datetime import date, datetime
from typing import Any

from ._text import strip_accents_casefold
from .models import CompanyRecord, HistoryEntry, KadEntry


def _str_or_none(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _date_or_none(value: Any) -> date | None:
    if value is None:
        return None
    if isinstance(value, date):
        return value
    text = str(value).strip()
    if not text:
        return None
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%S.%f"):
        try:
            return datetime.strptime(text[: len(fmt) + 10], fmt).date()
        except ValueError:
            continue
    return None


def _descr(container: Any) -> str | None:
    if isinstance(container, dict):
        return _str_or_none(container.get("descr"))
    return None


def _id(container: Any) -> int | None:
    if isinstance(container, dict):
        raw = container.get("id")
        if raw is None:
            return None
        try:
            return int(raw)
        except (TypeError, ValueError):
            return None
    return None


def _names_en(raw: dict[str, Any]) -> str | None:
    names = raw.get("coNamesEn")
    if isinstance(names, list) and names:
        first = names[0]
        if isinstance(first, dict):
            return _str_or_none(first.get("name") or first.get("descr"))
        return _str_or_none(first)
    return _str_or_none(raw.get("coNameEn"))


def _distinctive_titles(raw: dict[str, Any]) -> list[str]:
    titles_raw = raw.get("distinctiveTitles") or raw.get("coDistinctiveTitles") or []
    result: list[str] = []
    if isinstance(titles_raw, list):
        for item in titles_raw:
            if isinstance(item, dict):
                text = _str_or_none(item.get("descr") or item.get("name") or item.get("title"))
            else:
                text = _str_or_none(item)
            if text:
                result.append(text)
    return result


MAIN_ACTIVITY_TYPES: frozenset[str] = frozenset({"κυρια", "main", "primary"})


def _activities_as_kads(raw: dict[str, Any]) -> tuple[KadEntry | None, list[KadEntry]]:
    """The API shape is: {"type": "Κύρια"|"Δευτερεύουσα", "activity": {"id": "56110100", "descr": "..."}}.

    The ΚΑΔ code lives in `activity.id`, not `activity.code`.
    """
    activities = raw.get("activities")
    if not isinstance(activities, list):
        return None, []
    main: KadEntry | None = None
    secondary: list[KadEntry] = []
    for entry in activities:
        if not isinstance(entry, dict):
            continue
        activity = entry.get("activity") if isinstance(entry.get("activity"), dict) else entry
        code = _str_or_none(activity.get("id") or activity.get("code") or activity.get("kad"))
        descr = _str_or_none(activity.get("descr"))
        if code is None and descr is None:
            continue
        kad = KadEntry(code=code or "", descr=descr)
        type_text = _str_or_none(entry.get("type")) or ""
        is_main = strip_accents_casefold(type_text) in MAIN_ACTIVITY_TYPES
        if is_main and main is None:
            main = kad
        else:
            secondary.append(kad)
    return main, secondary


def _history(raw: dict[str, Any], key: str, value_key: str) -> list[HistoryEntry]:
    items = raw.get(key)
    if not isinstance(items, list):
        return []
    result: list[HistoryEntry] = []
    for entry in items:
        if not isinstance(entry, dict):
            continue
        change_date = _date_or_none(entry.get("date") or entry.get("changeDate"))
        value = entry.get(value_key)
        if isinstance(value, dict):
            value = value.get("descr")
        value_text = _str_or_none(value)
        if change_date and value_text:
            result.append(HistoryEntry(change_date=change_date, value=value_text))
    return result


def from_list_row(raw: dict[str, Any]) -> CompanyRecord:
    main_kad, secondary_kads = _activities_as_kads(raw)
    municipality = raw.get("municipality") if isinstance(raw.get("municipality"), dict) else None
    region_raw = raw.get("region") if isinstance(raw.get("region"), dict) else None
    status_raw = raw.get("status") if isinstance(raw.get("status"), dict) else None

    return CompanyRecord(
        ar_gemi=str(raw["arGemi"]),
        euid=_str_or_none(raw.get("euid")),
        name_el=_str_or_none(raw.get("coNameEl")),
        name_en=_names_en(raw),
        distinctive_titles=_distinctive_titles(raw),
        afm=_str_or_none(raw.get("afm")),
        incorporation_date=_date_or_none(raw.get("incorporationDate")),
        legal_form=_descr(raw.get("legalType")),
        status=_descr(status_raw),
        status_date=_date_or_none(raw.get("statusDate")),
        street=_str_or_none(raw.get("street")),
        street_number=_str_or_none(raw.get("streetNumber")),
        city=_str_or_none(raw.get("city")),
        municipality=_descr(municipality) if municipality else None,
        region=_descr(region_raw) if region_raw else None,
        zip_code=_str_or_none(raw.get("zipCode")),
        website=_str_or_none(raw.get("url") or raw.get("website")),
        eshop=_str_or_none(raw.get("eshop")),
        email=_str_or_none(raw.get("email")),
        phone=_str_or_none(raw.get("phone")),
        main_kad=main_kad,
        secondary_kads=secondary_kads,
    )


def from_detail_payload(raw: dict[str, Any]) -> CompanyRecord:
    """Normalize the detail-endpoint payload.

    The list-row extractor already handles most fields; here we just layer in the
    extras that are only exposed on the detail page — local office, KAD text, history.
    """
    base = from_list_row(raw)

    office_raw = raw.get("localOffice") if isinstance(raw.get("localOffice"), dict) else {}
    purpose = _str_or_none(raw.get("purpose") or raw.get("scope"))

    updates = {
        "local_office": _str_or_none(office_raw.get("name") or office_raw.get("descr")),
        "office_department": _str_or_none(office_raw.get("department")),
        "office_reg_number": _str_or_none(office_raw.get("registrationNumber") or office_raw.get("regNumber")),
        "office_phone": _str_or_none(office_raw.get("phone")),
        "office_website": _str_or_none(office_raw.get("url") or office_raw.get("website")),
        "office_reg_date": _date_or_none(office_raw.get("registrationDate") or office_raw.get("regDate")),
        "purpose_text": purpose,
        "legal_form_history": _history(raw, "legalTypeHistory", "legalType"),
        "status_history": _history(raw, "statusHistory", "status"),
    }
    return base.model_copy(update=updates)
