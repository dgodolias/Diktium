-- Γ.Ε.ΜΗ. opendata schema
-- Canonical filter sets, companies, their ΚΑΔ/history, and per-page resume checkpoints.

CREATE TABLE IF NOT EXISTS filter_sets (
    id               SERIAL PRIMARY KEY,
    filter_hash      TEXT UNIQUE NOT NULL,
    search_scope     TEXT        NOT NULL,
    legal_form_id    INT,
    legal_form_descr TEXT,
    status_id        INT,
    status_descr     TEXT,
    suspension_id    INT,
    special_characterization_id INT,
    local_office_id  INT,
    activity_code_prefixes TEXT[],
    activity_descr   TEXT,
    incorporation_from DATE,
    incorporation_to   DATE,
    closing_from       DATE,
    closing_to         DATE,
    kak_change_from    DATE,
    kak_change_to      DATE,
    region_ids         INTEGER[],
    region_descr       TEXT,
    city               TEXT,
    zip_code           TEXT,
    raw_json           JSONB NOT NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS companies (
    ar_gemi            TEXT PRIMARY KEY,
    euid               TEXT,
    name_el            TEXT,
    name_en            TEXT,
    distinctive_titles TEXT[],
    afm                TEXT,
    incorporation_date DATE,
    legal_form         TEXT,
    status             TEXT,
    status_date        DATE,
    street             TEXT,
    street_number      TEXT,
    city               TEXT,
    municipality       TEXT,
    region             TEXT,
    zip_code           TEXT,
    website            TEXT,
    eshop              TEXT,
    email              TEXT,
    phone              TEXT,
    local_office       TEXT,
    office_department  TEXT,
    office_reg_number  TEXT,
    office_phone       TEXT,
    office_website     TEXT,
    office_reg_date    DATE,
    purpose_text       TEXT,
    main_kad_code      TEXT,
    main_kad_descr     TEXT,
    raw_list_json      JSONB,
    raw_detail_json    JSONB,
    detail_fetched_at  TIMESTAMPTZ,
    first_seen_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS companies_afm_idx            ON companies (afm);
CREATE INDEX IF NOT EXISTS companies_main_kad_idx       ON companies (main_kad_code);
CREATE INDEX IF NOT EXISTS companies_region_idx         ON companies (region);
CREATE INDEX IF NOT EXISTS companies_detail_fetched_idx ON companies (detail_fetched_at);

CREATE TABLE IF NOT EXISTS company_secondary_kad (
    ar_gemi   TEXT NOT NULL REFERENCES companies (ar_gemi) ON DELETE CASCADE,
    kad_code  TEXT NOT NULL,
    kad_descr TEXT,
    PRIMARY KEY (ar_gemi, kad_code)
);

CREATE TABLE IF NOT EXISTS company_legal_form_history (
    ar_gemi     TEXT NOT NULL REFERENCES companies (ar_gemi) ON DELETE CASCADE,
    change_date DATE NOT NULL,
    legal_form  TEXT NOT NULL,
    PRIMARY KEY (ar_gemi, change_date, legal_form)
);

CREATE TABLE IF NOT EXISTS company_status_history (
    ar_gemi     TEXT NOT NULL REFERENCES companies (ar_gemi) ON DELETE CASCADE,
    change_date DATE NOT NULL,
    status      TEXT NOT NULL,
    PRIMARY KEY (ar_gemi, change_date, status)
);

CREATE TABLE IF NOT EXISTS filter_set_companies (
    filter_set_id INT  NOT NULL REFERENCES filter_sets (id) ON DELETE CASCADE,
    ar_gemi       TEXT NOT NULL REFERENCES companies (ar_gemi) ON DELETE CASCADE,
    page          INT  NOT NULL,
    found_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (filter_set_id, ar_gemi)
);

CREATE INDEX IF NOT EXISTS filter_set_companies_fs_idx ON filter_set_companies (filter_set_id);

CREATE TABLE IF NOT EXISTS fetch_progress (
    filter_set_id    INT  NOT NULL REFERENCES filter_sets (id) ON DELETE CASCADE,
    page             INT  NOT NULL,
    status           TEXT NOT NULL,
    records_fetched  INT  NOT NULL DEFAULT 0,
    last_attempt_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    error_message    TEXT,
    PRIMARY KEY (filter_set_id, page)
);
