# Diktium — Greek Web Agency Website & Data Extraction System

Marketing website for a Greek web agency + Node.js scripts for extracting business data
from the Greek Business Portal. Single-page Next.js app with portfolio, pricing, and contact sections.

## Quick Start

```bash
# Website (Next.js at root)
npm install
npm run dev          # http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint (Next.js core web vitals + TS)

# Data extraction (separate Node.js project)
cd api && npm install && npm start
```

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
├── api/                            # Separate Node.js project (own package.json)
│   └── scripts/explore_api.js      # Greek Business Portal scraper → Excel
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
| Data Scripts | Node.js + Axios + XLSX |

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

- **SECURITY**: API key hardcoded in `api/scripts/explore_api.js` line 6. Move to `.env` before any deployment.
- **CONTEXT.md outdated**: References a `website/` subdirectory that does not exist. Next.js app is at root.
- **Contact form non-functional**: No form submission handler (no API route, no email service).
- **SSL verification disabled**: `rejectUnauthorized: false` in the API script.
- **Placeholder data**: Phone number (+30 210 1234567) and social media links (`href="#"`) in Footer/Contact.

## Data Extraction Script

`api/scripts/explore_api.js` scrapes IKE (private companies) from the Greek Business Portal API:
- Rate-limited: 8-second delay between requests, handles 429 responses
- Exports to `business_data.xlsx` with fields: GEMI, Name, AFM, Legal Form, Status, Address, Contact, Activities
- Run: `cd api && npm start`

## Maintenance

When making structural changes, update the relevant context file:
- `CLAUDE.md` (root) — architecture, conventions, tech stack changes
- `.claude/rules/nextjs-frontend.md` — frontend-specific patterns
