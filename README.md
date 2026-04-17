# Uprising Anarchy

**Plateforme de prospection & Agency OS pour Uprising Studio MTL**

Scraping Pages Jaunes / Pages Vertes / Google Maps → carte interactive → pipeline CRM → séquences outreach → assistant IA Claude.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **shadcn/ui** + Tailwind CSS 4
- **MapCN** (MapLibre GL + shadcn)
- **Supabase** Auth + Realtime
- **Neon Postgres** + Drizzle ORM
- **Playwright** scraping
- **Claude Sonnet 4.6** (Anthropic)
- **Vercel** deployment

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run db:push
npm run dev
```

## Architecture

Voir `AGENTS.md` pour l'architecture complète, le design system, et les décisions techniques.
