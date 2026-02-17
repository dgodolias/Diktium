---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
  - "src/app/globals.css"
---

# Next.js Frontend Rules

## Component Patterns

- All components are client components — include `"use client"` directive at top.
- Section components live in `src/components/` (flat, no subdirectories).
- Shadcn primitives are in `src/components/ui/` — never hand-edit these files.
- Use `cn()` from `@/lib/utils` for conditional class merging.

## Styling

- Tailwind CSS 4 syntax: `@import "tailwindcss"` in globals.css, NOT `@tailwind` directives.
- Use CSS variable color names (`bg-primary`, `text-accent`), not raw hex values.
- Glassmorphism pattern for cards: `bg-background/40 backdrop-blur-md border border-border/50`.
- Entrance animations use Framer Motion (`motion.div` with `initial`/`animate`/`whileInView`).
- `tailwindcss-animate` plugin is available for CSS-only animations.

## Imports & Paths

- Always use `@/` path alias (maps to `./src/*`).
- Icons: import from `lucide-react`.
- Shadcn components: import from `@/components/ui/<name>`.

## Language

- All user-facing text MUST be in Greek.
- Keep HTML `lang="el"` on the root element (set in layout.tsx).

## Adding Shadcn Components

```bash
npx shadcn@latest add <component-name>
```

Config in `components.json`: new-york style, lucide icons, CSS variables enabled.

## Images

- Portfolio screenshots go in `public/screenshots/`.
- Use Next.js `Image` component with appropriate `width`/`height` or `fill` + `sizes` props.
