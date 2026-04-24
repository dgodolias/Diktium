import argparse
import logging

from . import db
from .api_client import ApiClient
from .config import FILTER
from .fetcher import fetch_details, fetch_list
from .filters import canonical_hash
from .meta import MetadataResolver
from .settings import Settings


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="gemi_fetch",
        description="Smart Γ.Ε.ΜΗ. opendata scraper with resumable checkpoints.",
    )
    parser.add_argument("--setup", action="store_true", help="Apply schema.sql and exit")
    parser.add_argument("--reset", action="store_true", help="Clear fetch_progress for this filter before running")
    parser.add_argument("--list-only", action="store_true", help="Skip the detail fetch phase")
    parser.add_argument("--details-only", action="store_true", help="Skip the list fetch phase")
    parser.add_argument("--max-pages", type=int, help="Cap pages scanned (overrides Settings.max_pages)")
    parser.add_argument("--detail-limit", type=int, help="Cap detail calls this run")
    parser.add_argument("--detail-path", default="/companies/{ar_gemi}",
                        help="Detail endpoint template; {ar_gemi} is substituted")
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


def run_fetch(settings: Settings, args: argparse.Namespace) -> None:
    filt = FILTER
    filter_hash = canonical_hash(filt)

    with db.connect(settings.database_url) as conn, ApiClient(settings) as api:
        resolver = MetadataResolver(api)
        enriched = resolver.enrich(filt)
        if enriched != filt:
            print(
                f"Resolved filter IDs: status={enriched.status_id}, "
                f"regions={enriched.region_ids}"
            )
        filter_set_id = db.upsert_filter_set(conn, enriched, filter_hash)
        print(f"Filter set id={filter_set_id} hash={filter_hash}")

        if args.reset:
            db.reset_progress(conn, filter_set_id)
            print("Cleared fetch_progress for this filter set")

        if not args.details_only:
            new_count = fetch_list(
                conn, api, settings, enriched, filter_set_id, max_pages=args.max_pages,
            )
            total = db.count_companies_for_filter(conn, filter_set_id)
            print(f"List phase done — {new_count} new, {total} total linked to filter set")

        if not args.list_only:
            processed = fetch_details(
                conn, api, filter_set_id,
                detail_path=args.detail_path,
                limit=args.detail_limit,
            )
            print(f"Detail phase done — enriched {processed} companies")


def main() -> None:
    configure_logging()
    args = parse_args()
    settings = Settings()  # type: ignore[call-arg]

    if args.setup:
        run_setup(settings)
        return

    run_fetch(settings, args)


if __name__ == "__main__":
    main()
