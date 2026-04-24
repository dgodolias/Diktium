# Diktium — Greek Web Agency Website & Γ.Ε.ΜΗ. Scraper

Marketing website for a Greek web agency + Python scraper that pulls food-venue
businesses from the Γ.Ε.ΜΗ. opendata API into a local Postgres DB — target: lead
generation for QR menu sales (restaurants, cafes, bars).

## Quick Start

```bash
# Website (Next.js at root)
npm install
npm run dev          # http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint (Next.js core web vitals + TS)

# Γ.Ε.ΜΗ. scraper (Python, in api/)
cd api
pip install -r requirements.txt
python -m gemi_fetch --setup            # apply schema.sql to gemh_records DB
python -m gemi_fetch --list-only        # fetch listing only
python -m gemi_fetch                    # list + per-company detail
python -m gemi_fetch --reset            # clear fetch_progress for current filter
```

The `api/scripts/explore_api.js` Node script is **legacy** — replaced by `api/gemi_fetch/`.

## Architecture

```
Diktium/                            # Next.js app at ROOT
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout: lang="el", Inter + Roboto Mono fonts
│   │   ├── page.tsx                # Homepage: composes all section components
│   │   └── globals.css             # Tailwind 4 config + CSS variables (light/dark)
│   ├── components/
│   │   ├── Navbar.tsx              # Fixed top nav, mobile Sheet menu
│   │   ├── Hero.tsx                # Animated hero with Framer Motion, GEMI badges
│   │   ├── ParticleBackground.tsx  # Canvas particle system with mouse interaction
│   │   ├── Portfolio.tsx           # 6-project showcase grid
│   │   ├── Services.tsx            # 3-tier pricing (Basic €80 / Pro €100 / Premium €120)
│   │   ├── WhyUs.tsx               # 4 value proposition cards
│   │   ├── Contact.tsx             # Form + info sidebar
│   │   ├── Footer.tsx              # 4-col footer with social links
│   │   └── ui/                     # Shadcn components (do not hand-edit)
│   └── lib/
│       └── utils.ts                # cn() = clsx + tailwind-merge
├── api/                            # Python scraper + Postgres persistence
│   ├── .env                        # DATABASE_URL, API_KEY, API_BASE_URL
│   ├── requirements.txt            # pydantic, pydantic-settings, psycopg, httpx
│   ├── schema.sql                  # filter_sets, companies, kad/history, fetch_progress
│   ├── gemi_fetch/
│   │   ├── __main__.py             # CLI entry: --setup / --list-only / --reset
│   │   ├── config.py               # USER-EDITABLE filter (FILTER = CompanyFilter(...))
│   │   ├── settings.py             # Pydantic Settings loading .env
│   │   ├── models.py               # CompanyFilter, CompanyRecord, KadEntry, HistoryEntry
│   │   ├── filters.py              # to_api_params + matches_client_side + early-stop
│   │   ├── meta.py                 # Descr→ID resolver (Greek accent/sigma tolerant)
│   │   ├── api_client.py           # httpx + 429/5xx/timeout retries + 8.5s throttle
│   │   ├── extractors.py           # Raw API JSON → CompanyRecord
│   │   ├── fetcher.py              # List fetch (resumable) + detail fetch
│   │   ├── db.py                   # psycopg CRUD; schema.sql apply
│   │   └── _text.py                # strip_accents_casefold, strip_trailing_sigma
│   └── scripts/explore_api.js      # LEGACY — do not modify, superseded by gemi_fetch/
├── public/screenshots/             # Portfolio images (6 PNGs)
├── components.json                 # Shadcn: new-york style, lucide icons
├── tsconfig.json                   # ES2017, strict, @/* → ./src/*
└── CONTEXT.md                      # Legacy docs (outdated directory structure)
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.1.1 (App Router) + React 19.2.3 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 (PostCSS plugin) + CSS variables |
| UI Components | Shadcn/ui (New York style) + Radix primitives |
| Animations | Framer Motion 12 + tailwindcss-animate |
| Icons | Lucide React |
| Data Scripts | Python 3.13 + Pydantic + psycopg3 + httpx |
| Database | PostgreSQL (local, `gemh_records`) |

## Homepage Section Order

`page.tsx` renders: ParticleBackground → Navbar → Hero → Portfolio → Services → WhyUs → Contact → Footer

Anchor IDs: `#services`, `#portfolio`, `#why-us`, `#contact`

## Conventions

- **Greek language**: All user-facing text in Greek. Root `<html lang="el">`.
- **Client components**: Every component uses `"use client"` directive.
- **Colors**: Navy primary (`#0f172a`), Teal accent (`#14b8a6`). Use CSS variable names (`bg-primary`, `text-accent`), not raw hex.
- **Imports**: Always use `@/` path alias (maps to `./src/*`).
- **Class merging**: Use `cn()` from `@/lib/utils` for conditional Tailwind classes.
- **Shadcn**: Add components via `npx shadcn@latest add <name>`. Never hand-edit `src/components/ui/` files.
- **Glassmorphism**: Card pattern is `bg-background/40 backdrop-blur-md border border-border/50`.
- **Tailwind 4 syntax**: `@import "tailwindcss"` in globals.css (not `@tailwind` directives).
- **Images**: Portfolio screenshots in `public/screenshots/`. Use Next.js `Image` component.
- **No API routes**: The Next.js app has no backend endpoints.
- **No tests**: No testing framework is configured.

## Known Issues

- **Legacy code**: `api/scripts/explore_api.js` still has a hardcoded API key — leave it alone; it's been superseded by `api/gemi_fetch/` which reads from `.env`
- **CONTEXT.md outdated**: References a `website/` subdirectory that does not exist. Next.js app is at root.
- **Contact form non-functional**: No form submission handler (no API route, no email service).
- **SSL verification disabled**: `verify_ssl=False` default in `Settings` — the Γ.Ε.ΜΗ. chain has intermediate issues; flip via `VERIFY_SSL=true` in `.env` once fixed upstream.
- **Placeholder data**: Phone number (+30 210 1234567) and social media links (`href="#"`) in Footer/Contact.

## Γ.Ε.ΜΗ. Scraper (api/gemi_fetch/)

Pulls active food-service businesses from the Γ.Ε.ΜΗ. opendata API into local Postgres,
deduped by GEMI number. Resumable: closing and re-opening the script picks up exactly
where the previous page scan left off.

**Rate limit**: 8 req/min enforced via 8.5s sleep after every successful request.
Hard-coded 429 retry (65s wait) and 504/timeout exponential backoff (20→40→80s).

**Filter setup**: edit `api/gemi_fetch/config.py` — it exports a single `FILTER` object.
Defaults target active food venues in Attica incorporated since 2025-10-10, matching
primary-ΚΑΔ prefixes `5610` / `5611` / `5630` (restaurants, cafes, bars — NOT catering,
NOT institutional canteens).

**Server vs client-side filtering**: the Γ.Ε.ΜΗ. API only honours three filter params
(`statuses`, `prefectures`, `gemiOffices`). Date ranges, ΚΑΔ prefixes, city, zip are
applied client-side as the scanner walks `-incorporationDate`-sorted pages, with an
early-stop when it sees `BELOW_THRESHOLD_STOP_STREAK` (400) consecutive out-of-range
rows. ΚΑΔ matching is **primary-activity only** by design — a hardware store that
registered a restaurant ΚΑΔ on the side should not pass a restaurant filter.

**Tables** (see `api/schema.sql`):
- `filter_sets` — canonical hash per CompanyFilter; each distinct filter gets its own row
- `companies` — one per arGemi (PK); `first_seen_at`, `last_seen_at`, `raw_list_json`, `raw_detail_json`
- `company_secondary_kad`, `company_legal_form_history`, `company_status_history`
- `filter_set_companies` — many-to-many link
- `fetch_progress` — page-level checkpoint table powering resume / retry

**Known upstream quirks**:
- `incorporationDateFrom` and similar date params are silently ignored (no server-side date filter)
- Some rows have bogus `incorporationDate` values like `9011-12-09` — handled by the sanity check in `is_below_incorporation_threshold`
- Prefecture descriptions are in **genitive** (`ΑΤΤΙΚΗΣ`) — `meta.resolve_ids` handles the nominative/genitive collapse
- UI concept "Αττική" expands to three prefecture IDs (5, 52, 53); the resolver returns all of them as a single filter value

## Maintenance

When making structural changes, update the relevant context file:
- `CLAUDE.md` (root) — architecture, conventions, tech stack changes
- `.claude/rules/nextjs-frontend.md` — frontend-specific patterns
