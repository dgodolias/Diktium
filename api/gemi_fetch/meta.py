import logging
from typing import Any

from ._text import strip_accents_casefold as _normalize
from ._text import strip_trailing_sigma as _strip_trailing_sigma
from .api_client import ApiClient, ApiError
from .models import CompanyFilter

logger = logging.getLogger(__name__)


def _tokens(text: str) -> list[str]:
    return [t for t in _normalize(text).split() if t]


class MetadataResolver:
    """Resolves human-readable descriptions from the UI (e.g. 'Ενεργή', 'Αττική')
    to the numeric IDs that /companies expects as filter parameters.

    Caches metadata responses in-process so we only pay the rate-limit cost once per run.
    """

    ENDPOINTS: dict[str, str] = {
        "legal_form": "/metadata/legalTypes",
        "status": "/metadata/companyStatuses",
        "activity": "/metadata/activities",
        "region": "/metadata/prefectures",
        "municipality": "/metadata/municipalities",
        "gemi_office": "/metadata/gemiOffices",
    }

    def __init__(self, api: ApiClient) -> None:
        self.api = api
        self._cache: dict[str, list[dict[str, Any]]] = {}

    def items(self, key: str) -> list[dict[str, Any]]:
        if key not in self.ENDPOINTS:
            raise KeyError(f"No metadata endpoint registered for '{key}'")
        if key not in self._cache:
            logger.info("Fetching metadata: %s", self.ENDPOINTS[key])
            try:
                response = self.api.get(self.ENDPOINTS[key])
            except ApiError as exc:
                logger.warning("Metadata endpoint %s unavailable (%s) — skipping", self.ENDPOINTS[key], exc)
                self._cache[key] = []
                return self._cache[key]
            self._cache[key] = response if isinstance(response, list) else response.get("data", [])
        return self._cache[key]

    def resolve_id(self, key: str, descr: str) -> int | None:
        ids = self.resolve_ids(key, descr)
        return ids[0] if ids else None

    def resolve_ids(self, key: str, descr: str) -> list[int]:
        """Return all metadata IDs whose descr contains the target as a standalone token.

        Example: 'Αττική' → [5, 52, 53] because those are the three Attica prefectures
        ('ΑΤΤΙΚΗΣ', 'ΑΝΑΤΟΛΙΚΗΣ ΑΤΤΙΚΗΣ', 'ΔΥΤΙΚΗΣ ΑΤΤΙΚΗΣ'). Exact matches on descr or
        descrEn always win and are returned alone — only when we have to fall back to
        token matching do we return the full fan-out.
        """
        target = _normalize(descr)
        target_stem = _strip_trailing_sigma(target)
        items = self.items(key)
        if not items:
            return []

        exact_matches: list[int] = []
        token_matches: list[int] = []
        for item in items:
            item_descr = _normalize(str(item.get("descr", "")))
            item_descr_en = _normalize(str(item.get("descrEn", "")))
            if target in {item_descr, item_descr_en}:
                exact_matches.append(int(item["id"]))
                continue
            if target_stem in {
                _strip_trailing_sigma(item_descr),
                _strip_trailing_sigma(item_descr_en),
            }:
                exact_matches.append(int(item["id"]))
                continue
            tokens = _tokens(str(item.get("descr", "")))
            stems = {_strip_trailing_sigma(t) for t in tokens}
            if target in stems or target_stem in stems:
                token_matches.append(int(item["id"]))

        merged: list[int] = []
        seen: set[int] = set()
        for candidate in exact_matches + token_matches:
            if candidate not in seen:
                seen.add(candidate)
                merged.append(candidate)
        if not merged:
            logger.warning("Could not resolve %s='%s' against metadata", key, descr)
        return merged

    def enrich(self, filt: CompanyFilter) -> CompanyFilter:
        """Fill *_id fields for any *_descr that has no id set yet."""
        updates: dict[str, Any] = {}
        single_pairs = (
            ("legal_form", filt.legal_form_id, filt.legal_form_descr, "legal_form_id"),
            ("status", filt.status_id, filt.status_descr, "status_id"),
        )
        for key, current_id, descr, field in single_pairs:
            if current_id is None and descr:
                resolved = self.resolve_id(key, descr)
                if resolved is not None:
                    updates[field] = resolved

        if not filt.region_ids and filt.region_descr:
            resolved_ids = self.resolve_ids("region", filt.region_descr)
            if resolved_ids:
                updates["region_ids"] = resolved_ids

        if not updates:
            return filt
        return filt.model_copy(update=updates)
