"""Shared text-normalization helpers for matching Greek strings from the API."""

import unicodedata


def strip_accents_casefold(text: str) -> str:
    """Case-fold and strip combining marks — 'Κύρια' → 'κυρια', 'Αττική' → 'αττικη'."""
    decomposed = unicodedata.normalize("NFD", text)
    return "".join(c for c in decomposed if not unicodedata.combining(c)).strip().casefold()


def strip_trailing_sigma(text: str) -> str:
    """Collapse Greek genitive to nominative — 'αττικησ' → 'αττικη'."""
    return text[:-1] if text.endswith("σ") else text
