# Diktium Agency Website & Data System

## Current Status
- **Phase**: Refactoring & Verification
- **Last Updated**: 2026-01-16 10:35
- **Current Focus**: Restoring automation scripts and finalizing project structure.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Node.js (Extraction Scripts)
- **Database**: Excel (Temporary Data Storage)
- **Tools**: Semgrep, Puppeteer (removed), Axios

## Architecture
```text
Diktium/
├── .git/
├── .mid/                 # Middleware / Agent Config
├── api/
│   ├── scripts/
│   │   └── explore_api.js # Business Data Extraction
│   ├── package.json
│   ├── business_data.xlsx
│   └── node_modules/
├── website/              # Next.js Application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── CONTEXT.md            # Source of Truth
└── README.md
```

## Key Dependencies
- **Frontend**: `framer-motion`, `lucide-react`, `tailwindcss`
- **Scripting**: `axios`, `xlsx`

## Development Log (History)
- 2026-01-14 20:00 **Visual Enhancement**: Implemented particle background and glassmorphic UI.
- 2026-01-14 22:00 **Data Extraction**: Built and verified IKE business extraction script (400 records).
- 2026-01-16 10:30 **Git Maintenance**: Reverted accidental commit and restored `api` folder structure.

## Roadmap (All Steps)
- [x] Create Navigation Bar
- [x] Build Hero Section
- [x] Implement Particle Background
- [x] Business Data Extraction Script (v1 Verified)
- [ ] Automate Weekly Data Extraction
- [ ] Integrate Data with Frontend Dashboard
