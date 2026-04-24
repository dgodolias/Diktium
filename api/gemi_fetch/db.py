import json
from datetime import datetime
from pathlib import Path
from typing import Any

import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb

from .models import CompanyFilter, CompanyRecord

SCHEMA_PATH = Path(__file__).resolve().parent.parent / "schema.sql"


def connect(database_url: str) -> psycopg.Connection:
    return psycopg.connect(database_url, row_factory=dict_row, autocommit=False)


def apply_schema(conn: psycopg.Connection) -> None:
    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
    with conn.cursor() as cur:
        cur.execute(schema_sql)
    conn.commit()


def upsert_filter_set(
    conn: psycopg.Connection, filt: CompanyFilter, filter_hash: str
) -> int:
    payload = filt.model_dump(mode="json")
    sql = """
        INSERT INTO filter_sets (
            filter_hash, search_scope,
            legal_form_id, legal_form_descr,
            status_id, status_descr,
            suspension_id, special_characterization_id, local_office_id,
            activity_code_prefixes, activity_descr,
            incorporation_from, incorporation_to,
            closing_from, closing_to,
            kak_change_from, kak_change_to,
            region_ids, region_descr,
            city, zip_code, raw_json
        )
        VALUES (
            %(filter_hash)s, %(search_scope)s,
            %(legal_form_id)s, %(legal_form_descr)s,
            %(status_id)s, %(status_descr)s,
            %(suspension_id)s, %(special_characterization_id)s, %(local_office_id)s,
            %(activity_code_prefixes)s, %(activity_descr)s,
            %(incorporation_from)s, %(incorporation_to)s,
            %(closing_from)s, %(closing_to)s,
            %(kak_change_from)s, %(kak_change_to)s,
            %(region_ids)s, %(region_descr)s,
            %(city)s, %(zip_code)s, %(raw_json)s
        )
        ON CONFLICT (filter_hash) DO UPDATE SET filter_hash = EXCLUDED.filter_hash
        RETURNING id
    """
    params = {**payload, "filter_hash": filter_hash, "raw_json": Jsonb(payload)}
    with conn.cursor() as cur:
        cur.execute(sql, params)
        row = cur.fetchone()
    conn.commit()
    return row["id"]


def completed_pages(conn: psycopg.Connection, filter_set_id: int) -> set[int]:
    with conn.cursor() as cur:
        cur.execute(
            "SELECT page FROM fetch_progress WHERE filter_set_id = %s AND status = 'done'",
            (filter_set_id,),
        )
        return {r["page"] for r in cur.fetchall()}


def reset_progress(conn: psycopg.Connection, filter_set_id: int) -> None:
    with conn.cursor() as cur:
        cur.execute("DELETE FROM fetch_progress WHERE filter_set_id = %s", (filter_set_id,))
    conn.commit()


def mark_page(
    conn: psycopg.Connection,
    filter_set_id: int,
    page: int,
    status: str,
    records_fetched: int = 0,
    error_message: str | None = None,
) -> None:
    sql = """
        INSERT INTO fetch_progress (filter_set_id, page, status, records_fetched, last_attempt_at, error_message)
        VALUES (%s, %s, %s, %s, NOW(), %s)
        ON CONFLICT (filter_set_id, page) DO UPDATE SET
            status = EXCLUDED.status,
            records_fetched = EXCLUDED.records_fetched,
            last_attempt_at = NOW(),
            error_message = EXCLUDED.error_message
    """
    with conn.cursor() as cur:
        cur.execute(sql, (filter_set_id, page, status, records_fetched, error_message))
    conn.commit()


def upsert_company_from_list(
    conn: psycopg.Connection, record: CompanyRecord, raw: dict[str, Any]
) -> bool:
    """Upsert a company from a list-response row. Returns True if newly inserted."""
    data = record.model_dump(exclude={"main_kad", "secondary_kads", "legal_form_history",
                                       "status_history", "raw_list_json", "raw_detail_json"})
    data["raw_list_json"] = Jsonb(raw)
    sql = """
        INSERT INTO companies (
            ar_gemi, euid, name_el, name_en, distinctive_titles, afm, incorporation_date,
            legal_form, status, status_date, street, street_number, city, municipality,
            region, zip_code, website, eshop, email, phone, raw_list_json
        )
        VALUES (
            %(ar_gemi)s, %(euid)s, %(name_el)s, %(name_en)s, %(distinctive_titles)s,
            %(afm)s, %(incorporation_date)s, %(legal_form)s, %(status)s, %(status_date)s,
            %(street)s, %(street_number)s, %(city)s, %(municipality)s, %(region)s,
            %(zip_code)s, %(website)s, %(eshop)s, %(email)s, %(phone)s, %(raw_list_json)s
        )
        ON CONFLICT (ar_gemi) DO UPDATE SET
            euid = COALESCE(EXCLUDED.euid, companies.euid),
            name_el = COALESCE(EXCLUDED.name_el, companies.name_el),
            name_en = COALESCE(EXCLUDED.name_en, companies.name_en),
            distinctive_titles = COALESCE(EXCLUDED.distinctive_titles, companies.distinctive_titles),
            afm = COALESCE(EXCLUDED.afm, companies.afm),
            incorporation_date = COALESCE(EXCLUDED.incorporation_date, companies.incorporation_date),
            legal_form = COALESCE(EXCLUDED.legal_form, companies.legal_form),
            status = COALESCE(EXCLUDED.status, companies.status),
            status_date = COALESCE(EXCLUDED.status_date, companies.status_date),
            street = COALESCE(EXCLUDED.street, companies.street),
            street_number = COALESCE(EXCLUDED.street_number, companies.street_number),
            city = COALESCE(EXCLUDED.city, companies.city),
            municipality = COALESCE(EXCLUDED.municipality, companies.municipality),
            region = COALESCE(EXCLUDED.region, companies.region),
            zip_code = COALESCE(EXCLUDED.zip_code, companies.zip_code),
            website = COALESCE(EXCLUDED.website, companies.website),
            eshop = COALESCE(EXCLUDED.eshop, companies.eshop),
            email = COALESCE(EXCLUDED.email, companies.email),
            phone = COALESCE(EXCLUDED.phone, companies.phone),
            raw_list_json = EXCLUDED.raw_list_json,
            last_seen_at = NOW()
        RETURNING (xmax = 0) AS inserted
    """
    with conn.cursor() as cur:
        cur.execute(sql, data)
        row = cur.fetchone()
    return bool(row["inserted"])


def link_company_to_filter_set(
    conn: psycopg.Connection, filter_set_id: int, ar_gemi: str, page: int
) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO filter_set_companies (filter_set_id, ar_gemi, page)
            VALUES (%s, %s, %s)
            ON CONFLICT (filter_set_id, ar_gemi) DO NOTHING
            """,
            (filter_set_id, ar_gemi, page),
        )


def update_company_from_detail(
    conn: psycopg.Connection, record: CompanyRecord, raw: dict[str, Any]
) -> None:
    """Enrich an existing company row with data from the detail endpoint."""
    data = record.model_dump(exclude={"main_kad", "secondary_kads", "legal_form_history",
                                       "status_history", "raw_list_json", "raw_detail_json"})
    data["raw_detail_json"] = Jsonb(raw)
    data["main_kad_code"] = record.main_kad.code if record.main_kad else None
    data["main_kad_descr"] = record.main_kad.descr if record.main_kad else None
    sql = """
        UPDATE companies SET
            euid               = COALESCE(%(euid)s, euid),
            name_el            = COALESCE(%(name_el)s, name_el),
            name_en            = COALESCE(%(name_en)s, name_en),
            distinctive_titles = COALESCE(%(distinctive_titles)s, distinctive_titles),
            afm                = COALESCE(%(afm)s, afm),
            incorporation_date = COALESCE(%(incorporation_date)s, incorporation_date),
            legal_form         = COALESCE(%(legal_form)s, legal_form),
            status             = COALESCE(%(status)s, status),
            status_date        = COALESCE(%(status_date)s, status_date),
            street             = COALESCE(%(street)s, street),
            street_number      = COALESCE(%(street_number)s, street_number),
            city               = COALESCE(%(city)s, city),
            municipality       = COALESCE(%(municipality)s, municipality),
            region             = COALESCE(%(region)s, region),
            zip_code           = COALESCE(%(zip_code)s, zip_code),
            website            = COALESCE(%(website)s, website),
            eshop              = COALESCE(%(eshop)s, eshop),
            email              = COALESCE(%(email)s, email),
            phone              = COALESCE(%(phone)s, phone),
            local_office       = COALESCE(%(local_office)s, local_office),
            office_department  = COALESCE(%(office_department)s, office_department),
            office_reg_number  = COALESCE(%(office_reg_number)s, office_reg_number),
            office_phone       = COALESCE(%(office_phone)s, office_phone),
            office_website     = COALESCE(%(office_website)s, office_website),
            office_reg_date    = COALESCE(%(office_reg_date)s, office_reg_date),
            purpose_text       = COALESCE(%(purpose_text)s, purpose_text),
            main_kad_code      = COALESCE(%(main_kad_code)s, main_kad_code),
            main_kad_descr     = COALESCE(%(main_kad_descr)s, main_kad_descr),
            raw_detail_json    = %(raw_detail_json)s,
            detail_fetched_at  = NOW(),
            last_seen_at       = NOW()
        WHERE ar_gemi = %(ar_gemi)s
    """
    with conn.cursor() as cur:
        cur.execute(sql, data)

    if record.secondary_kads:
        with conn.cursor() as cur:
            cur.executemany(
                """
                INSERT INTO company_secondary_kad (ar_gemi, kad_code, kad_descr)
                VALUES (%s, %s, %s)
                ON CONFLICT (ar_gemi, kad_code) DO UPDATE SET kad_descr = EXCLUDED.kad_descr
                """,
                [(record.ar_gemi, k.code, k.descr) for k in record.secondary_kads],
            )

    if record.legal_form_history:
        with conn.cursor() as cur:
            cur.executemany(
                """
                INSERT INTO company_legal_form_history (ar_gemi, change_date, legal_form)
                VALUES (%s, %s, %s) ON CONFLICT DO NOTHING
                """,
                [(record.ar_gemi, h.change_date, h.value) for h in record.legal_form_history],
            )

    if record.status_history:
        with conn.cursor() as cur:
            cur.executemany(
                """
                INSERT INTO company_status_history (ar_gemi, change_date, status)
                VALUES (%s, %s, %s) ON CONFLICT DO NOTHING
                """,
                [(record.ar_gemi, h.change_date, h.value) for h in record.status_history],
            )


def pending_detail_gemis(
    conn: psycopg.Connection, filter_set_id: int, limit: int | None = None
) -> list[str]:
    sql = """
        SELECT c.ar_gemi
        FROM filter_set_companies fsc
        JOIN companies c ON c.ar_gemi = fsc.ar_gemi
        WHERE fsc.filter_set_id = %s AND c.detail_fetched_at IS NULL
        ORDER BY fsc.page, c.ar_gemi
    """
    params: tuple[Any, ...] = (filter_set_id,)
    if limit is not None:
        sql += " LIMIT %s"
        params = (filter_set_id, limit)
    with conn.cursor() as cur:
        cur.execute(sql, params)
        return [r["ar_gemi"] for r in cur.fetchall()]


def count_companies_for_filter(conn: psycopg.Connection, filter_set_id: int) -> int:
    with conn.cursor() as cur:
        cur.execute(
            "SELECT COUNT(*) AS n FROM filter_set_companies WHERE filter_set_id = %s",
            (filter_set_id,),
        )
        return cur.fetchone()["n"]
