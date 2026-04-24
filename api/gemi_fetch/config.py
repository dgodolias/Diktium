"""User-editable filter configuration.

Edit the values below to change what the scraper fetches. Anything you change here
produces a new filter hash, which means the scraper treats it as a fresh job:
- Pages already scanned under the OLD filter stay cached and are skipped next time
  you re-run with those same settings (nothing is lost).
- The new filter starts its own fetch_progress counter from page 0.

The Γ.Ε.ΜΗ. opendata API only honours three server-side filters reliably:
`statuses`, `prefectures`, and `gemiOffices`. Everything else — date ranges,
ΚΑΔ prefix, city, zip — is applied client-side as the scanner walks results
sorted by `-incorporationDate`. See filters.to_api_params for the split.
"""

from datetime import date

from .models import CompanyFilter

# Target: active food-venue businesses in Attica, incorporated since 2025-10-10,
# with a ΚΑΔ indicating a dine-in / sit-down venue that benefits from a QR menu.
# Excluded: catering (56.21) and institutional canteens (56.29) — they don't run
# a fixed menu or a physical dining room.
FILTER = CompanyFilter(
    status_descr="Ενεργή",
    region_descr="Αττική",
    incorporation_from=date(2025, 10, 10),
    incorporation_to=None,
    activity_code_prefixes=[
        "5610",  # Εστιατόρια & κινητές μονάδες εστίασης (KAD 2008)
        "5611",  # Εστιατόρια (KAD 2026 re-numbering)
        "5630",  # Μπαρ, καφέ, ποτά (all vintages)
    ],
    activity_descr="Εστιατόρια / καφετέριες / μπαρ (QR menu target)",
)
