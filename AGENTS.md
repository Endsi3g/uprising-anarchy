<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Uprising Anarchy (Agency OS)

## UI & Design Rules
- **Premium Aesthetics**: Every component must feel elite. Use `three.js`, `framer-motion`, and `radix-ui` for cinematic interactions.
- **Material 3 Influence**: Use the custom `DropdownMenu` with dynamic ripples and drill-down navigation for settings.
- **Micro-interactions**: Use `sonner` for feedback and smooth transitions for all routing.

## Tech Stack
- **Framework**: Next.js 16.2.4 + React 19 (Experimental)
- **Styling**: Tailwind CSS 4
- **Auth**: Supabase (Next.js SSR)
- **Database**: Drizzle ORM + Neon Postgres
- **Icons**: Lucide React

## Development Workflow
- **Database**: All storage must go through Drizzle. No more in-memory mocks.
- **Geocoding**: Use the geocoding utility during data import to ensure map consistency.
- **Auth**: Always handle `Promise` based params in Next.js 16 Route Handlers and Layouts.
