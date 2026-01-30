# Daily 3

## Critical Rules

- Never delete user data without explicit confirmation
- Dexie owns all persistent data. Zustand owns only ephemeral UI state. Never duplicate domain data into Zustand.
- Habits are vigils (identity statements), never checkboxes. No completion tracking on habits.
- shadcn/ui components live in `src/shared/ui/` — ESLint ignores this directory (generated code)

## Overview

An alignment system for intentional living based on the SuperSelf framework. Values → Dreams → Goals → Backlog → Daily 3.

**Repo:** https://github.com/evanhafers/daily3

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
  app/          # Shell, router, layout
  features/     # Feature folders (values, dreams, goals, backlog, daily3, habits, setup)
  shared/
    ui/         # shadcn/ui primitives (ESLint-ignored, generated)
    hooks/      # Shared hooks
    lib/        # Utilities (cn, date helpers)
  db/           # Dexie schema, seed data
  stores/       # Zustand stores (UI state only)
  types/        # Shared TypeScript interfaces
```

## Development

```bash
npm run dev      # Start dev server
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Gotchas

- shadcn CLI resolves `@/` alias literally — files land in project-root `@/` directory. After running `npx shadcn add`, move files from `@/shared/ui/` to `src/shared/ui/`.
- Many-to-many relationships (dream_values, habit_values) are separate Dexie tables with compound primary keys `[dreamId+valueId]`.
