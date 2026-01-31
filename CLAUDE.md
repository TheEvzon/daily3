# Daily 3

## Critical Rules

- Never delete user data without explicit confirmation
- Dexie owns all persistent data. Zustand owns only ephemeral UI state. Never duplicate domain data into Zustand.
- Habits are vigils (identity statements), never checkboxes. No completion tracking on habits.
- shadcn/ui components live in `src/shared/ui/` — ESLint ignores this directory (generated code triggers false positives)

## Overview

An alignment system for intentional living based on the SuperSelf framework. Values → Dreams → Goals → Backlog → Daily 3.

**Repo:** https://github.com/TheEvzon/daily3

## Tech Stack

- **Build:** Vite
- **Framework:** React 19 + TypeScript
- **Routing:** React Router v6
- **State:** Zustand (UI state only)
- **Persistence:** Dexie.js (IndexedDB) with `useLiveQuery` for reactive reads
- **Styling:** Tailwind CSS v4 + shadcn/ui (New York style, neutral base)
- **PWA:** vite-plugin-pwa + Workbox
- **Gestures:** @use-gesture/react
- **Icons:** lucide-react

## Architecture

```
src/
  app/          # Shell, router, layout, PWA install banner
  features/     # Feature folders (values, dreams, goals, backlog, daily3, habits, setup)
  shared/
    ui/         # shadcn/ui primitives + custom components (swipeable-card, context-menu, etc.)
    hooks/      # Shared hooks (usePwaInstall, useLongPress)
    lib/        # Utilities (cn, colors, date helpers)
  db/           # Dexie schema, seed data
  stores/       # Zustand stores (UI state only)
  types/        # Shared TypeScript interfaces
```

## Development

```bash
npm run dev      # Start dev server
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run lint:fix # ESLint with auto-fix
npm run format   # Prettier on src/
npm run preview  # Preview production build
```

## Deployment

- Hosted on **Vercel**, auto-deploys from `main` branch
- SPA routing handled by `vercel.json` rewrite rule
- PWA service worker generated at build time by vite-plugin-pwa

## Gotchas

- **shadcn CLI path resolution:** `npx shadcn add` resolves `@/` alias literally — files land in project-root `@/` directory. After running, move files from `@/shared/ui/` to `src/shared/ui/`.
- **Dexie many-to-many:** dream_values, habit_values are separate tables with compound primary keys `[dreamId+valueId]`.
- **Dexie boolean indexing:** Never use `.where("boolField").equals(0)` for boolean fields. Dexie/IndexedDB treats `false` and `0` as distinct. Use `.filter(d => d.field === false)` instead.
- **React 19 purity:** `Date.now()` is flagged as impure in render (even in useMemo/useRef). Push time-dependent computation into Dexie async queries.
- **React 19 useRef:** `useRef()` with no argument is a type error. Always pass an initial value (e.g., `useRef<T | null>(null)`).
