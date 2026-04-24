"""User-editable scraper configuration — BUSINESS FILTER + RUNTIME behavior.

Secrets (API key, database URL) live in `.env` and are loaded by `settings.py`.
Everything non-secret — what to pull and how fast — lives here. Edit values in
`FILTER` or `RUN` and re-run; nothing else needs to change.

A new `FILTER` produces a new `canonical_hash`, so the scraper treats it as a
fresh job. Previously-scanned pages stay cached under the OLD hash, so re-running
with the same filter never repeats work.

Γ.Ε.ΜΗ. API caveats (do not remove the knobs these depend on):
- 8 req/min hard rate limit — leave `request_delay_sec` ≥ 8.0 or you'll get 429s
- Only `statuses` / `prefectures` / `gemiOffices` are honoured server-side;
  everything else in `FILTER` is applied client-side as pages are walked
- 504 gateway timeouts happen often under load — the retry knobs cover them
"""

from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from .models import CompanyFilter


# ═══════════════════════════════════════════════════════════════════════════
# BUSINESS FILTER — what to pull
# ═══════════════════════════════════════════════════════════════════════════
# Active food-venue businesses in Attica incorporated since 2026-01-01.
# ΚΑΔ prefixes match the PRIMARY activity only (secondary ΚΑΔ is ignored to
# avoid false positives like a hardware store with a restaurant ΚΑΔ on the side).
# Catering (56.21) and institutional canteens (56.29) are deliberately excluded.

FILTER = CompanyFilter(
    status_descr="Ενεργή",
    region_descr="Αττική",
    incorporation_from=date(2026, 1, 1),
    incorporation_to=None,
    activity_code_prefixes=[
        "5610",  # Εστιατόρια & κινητές μονάδες εστίασης (KAD 2008)
        "5611",  # Εστιατόρια (KAD 2026 re-numbering)
        "5630",  # Μπαρ, καφέ, ποτά (all vintages)
    ],
    activity_descr="Εστιατόρια / καφετέριες / μπαρ (QR menu target)",
)


# ═══════════════════════════════════════════════════════════════════════════
# RUNTIME — how to run
# ═══════════════════════════════════════════════════════════════════════════

class RunConfig(BaseModel):
    """Everything that controls how the scraper walks the API.

    Edit the defaults on the `RUN` instance below to change behavior. Nothing
    in this class is a secret — secrets stay in `.env` / `Settings`.
    """

    model_config = ConfigDict(frozen=True)

    # ── Phases ─────────────────────────────────────────────────────────────
    list_phase: bool = Field(
        default=True, description="Run the /companies list walk and upsert rows"
    )
    detail_phase: bool = Field(
        default=True, description="Call /companies/{arGemi} for rows missing detail_fetched_at"
    )

    # ── Pagination / scope ─────────────────────────────────────────────────
    page_size: int = Field(
        default=100, description="Records per /companies call (API max is 200)"
    )
    max_pages: int = Field(
        default=500,
        description="Safety cap on pages per filter set — early-stop normally terminates far earlier",
    )
    detail_limit: int | None = Field(
        default=None, description="Cap detail calls this run (None = all pending)"
    )

    # ── Rate limit & retries ───────────────────────────────────────────────
    request_delay_sec: float = Field(
        default=8.5, description="Sleep after every successful call — Γ.Ε.ΜΗ. enforces 8 req/min"
    )
    rate_limit_retry_sec: float = Field(
        default=65.0, description="Wait after 429 before retry"
    )
    server_error_retries: int = Field(
        default=6,
        description="Retry attempts for 5xx / read-timeout before marking a page errored",
    )
    server_error_backoff_sec: float = Field(
        default=30.0,
        description="Base seconds for 5xx backoff — doubled per attempt",
    )
    server_error_backoff_max_sec: float = Field(
        default=180.0, description="Cap for 5xx backoff — stops the doubling here"
    )
    skip_page_on_exhausted_retries: bool = Field(
        default=True,
        description="When retries are exhausted, log & skip to next page instead of aborting the run",
    )

    # ── Client-side scan behavior ──────────────────────────────────────────
    below_threshold_stop_streak: int = Field(
        default=400,
        description="Stop after this many consecutive rows older than incorporation_from",
    )

    # ── Endpoints ──────────────────────────────────────────────────────────
    detail_path: str = Field(
        default="/companies/{ar_gemi}",
        description="Template for detail-phase GET — {ar_gemi} is substituted at runtime",
    )

    # ── TLS ────────────────────────────────────────────────────────────────
    verify_ssl: bool = Field(
        default=False,
        description="Γ.Ε.ΜΗ. intermediate chain has issues upstream — flip once fixed",
    )


RUN = RunConfig()
