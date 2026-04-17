# Uprising Anarchy Development Guide

## Build & Run Commands
- `npm run dev`: Start development server (Next.js 16)
- `npm run build`: Production build
- `npm run lint`: Run ESLint
- `npx drizzle-kit push`: Sync database schema to Neon
- `npx drizzle-kit studio`: Open Drizzle database explorer

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Animation**: Framer Motion, Three.js, React Three Fiber
- **Backend / Auth**: Supabase SSR, Drizzle ORM, Neon Postgres
- **Components**: Radix UI, Lucide React, Shadcn/UI structure

## Architecture Notes
- Components reside in `components/ui/` or domain-specific folders like `components/prospection/`.
- Auth callbacks are handled in `app/auth/callback/route.ts`.
- Geocoding utility: `lib/scrapers/geocode.ts` (Nominatim based).
- Database Schema: `lib/db/schema.ts`.

## UI/UX Standards
- Use `DropdownMenu` from `@/components/ui/material-ui-dropdown-menu` for all drill-down menus.
- Ensure all forms use the `SignInPage` 3D style for high-impact entry points.
- Sequential geocoding MUST happen during DB import to avoid rate limits.
