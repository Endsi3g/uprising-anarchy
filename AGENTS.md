# Uprising Anarchy — Plateforme de Prospection & Agency OS

> Ce fichier est lu automatiquement par Claude Code et tous les agents IA qui travaillent sur ce projet.
> Il contient l'architecture complète, le design system, les décisions techniques, et le plan de build.

## Contexte

Uprising Studio MTL est une agence montréalaise de croissance numérique (sites web Framer, stratégie contenu, automatisations IA). Elle a besoin d'un outil interne complet pour gérer sa prospection outbound : scraper des prospects depuis Pages Jaunes, Pages Vertes, et Google Maps, les visualiser sur une carte interactive, gérer un pipeline CRM simple, et envoyer des séquences d'outreach.

**Design de référence** : Origin Financial (useorigin.com) — UI minimaliste blanc/gris, sidebar gauche groupée, panneau contextuel droit, AI assistant, typographie Inter, cartes légères avec borders subtiles.

**Identité Uprising** : bleu `#264DEB`, violet `#6C3AED`, blanc/noir, Inter 600, ton direct québécois, light mode.

---

## Stack Technique

| Couche | Choix |
|--------|-------|
| Frontend | Next.js 15 (App Router) + TypeScript |
| UI | shadcn/ui + Tailwind CSS 4 |
| Carte | **MapCN** (MapLibre GL + Tailwind + shadcn) |
| Auth + Realtime | Supabase Auth + Supabase Realtime |
| Base de données | Neon Postgres (via Drizzle ORM) |
| Scraping | Playwright (server actions) + API routes Next.js |
| IA assistant | Claude Sonnet 4.6 (Anthropic SDK) avec prompt caching |
| Déploiement | Vercel |

---

## Architecture des dossiers

```
uprising-anarchy/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Split screen style Origin Financial
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Sidebar + Header + Right Panel (3 colonnes)
│   │   ├── page.tsx                # Dashboard "Bonjour [Prénom]"
│   │   ├── prospection/
│   │   │   ├── page.tsx            # Table prospects + filtres
│   │   │   ├── carte/page.tsx      # MapCN full-screen
│   │   │   ├── scraper/page.tsx    # Wizard de scraping multi-step
│   │   │   └── territoires/page.tsx
│   │   ├── clients/page.tsx        # CRM kanban pipeline
│   │   └── campagnes/page.tsx      # Séquences outreach
│   └── api/
│       ├── scrape/pages-jaunes/route.ts
│       ├── scrape/pages-vertes/route.ts
│       ├── scrape/google-maps/route.ts
│       └── ai/assistant/route.ts
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx             # Nav groupée : PROSPECTION / AGENCE / OUTILS
│   │   ├── header.tsx              # Greeting + avatar + actions
│   │   └── right-panel.tsx         # Cartes contextuelles empilées
│   ├── prospection/
│   │   ├── prospect-table.tsx      # DataTable shadcn avec filtres
│   │   ├── prospect-card.tsx       # Card popup sur carte
│   │   ├── scraper-dialog.tsx      # Wizard multi-step
│   │   └── status-badge.tsx
│   ├── map/
│   │   ├── prospect-map.tsx        # MapCN provider + markers
│   │   ├── territory-layer.tsx     # Polygones dessinables
│   │   └── walkin-route.tsx        # Ordre de visite optimisé
│   ├── crm/
│   │   └── pipeline-board.tsx      # Kanban drag-and-drop
│   └── ai/
│       └── assistant-panel.tsx     # Chat Claude intégré
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── db/
│   │   ├── schema.ts               # Drizzle schema
│   │   └── queries.ts
│   ├── scrapers/
│   │   ├── pages-jaunes.ts
│   │   ├── pages-vertes.ts
│   │   └── google-maps.ts
│   └── ai/
│       └── claude.ts               # SDK Anthropic avec prompt caching
└── styles/
    └── globals.css                 # Variables CSS Uprising
```

---

## Design System (Origin x Uprising)

### Layout 3-colonnes

```
┌──────────────────────────────────────────────────────────┐
│ HEADER : Logo Uprising  |  Bonjour [Prénom]  |  Avatar  │
├────────────┬────────────────────────────┬────────────────┤
│  SIDEBAR   │     CONTENU PRINCIPAL      │  PANNEAU DROIT │
│  200px     │     ~60% viewport          │  280px         │
│            │                            │                │
│ PROSPECTION│  [Page active]             │  Cartes        │
│ · Prospects│                            │  contextuelles │
│ · Carte    │                            │                │
│ · Scraper  │                            │                │
│ · Zones    │                            │                │
│            │                            │                │
│ AGENCE     │                            │                │
│ · Clients  │                            │                │
│ · Campagnes│                            │                │
│            │                            │                │
│ OUTILS     │                            │                │
│ · Assistant│                            │                │
│ + Claude   │                            │                │
└────────────┴────────────────────────────┴────────────────┘
```

### Tokens de couleur CSS

```css
--color-primary: #264DEB;      /* Bleu Uprising — CTAs majeurs */
--color-secondary: #6C3AED;    /* Violet — accents, sélections */
--color-bg: #FFFFFF;
--color-bg-subtle: #F9FAFB;    /* Sidebar, cartes alternées */
--color-border: #E5E7EB;
--color-text: #111827;
--color-text-muted: #6B7280;
--color-success: #16A34A;
--color-danger: #DC2626;
```

### Typographie

```
Display : Inter 700 / 28-32px
H1 page : Inter 600 / 20px
H2 section : Inter 600 / 14px uppercase tracking-wide text-muted
Body : Inter 400 / 14px
Label/Button : Inter 500 / 13px
Stat large : Inter 700 / 32-40px
```

---

## Schéma Base de Données (Neon Postgres / Drizzle)

```typescript
// prospects
id, source ('pages_jaunes'|'pages_vertes'|'google_maps'|'manuel'),
nom, adresse, ville, province, code_postal,
telephone, email, site_web, categorie, tags text[],
coords_lat, coords_lng,
statut ('nouveau'|'contacte'|'interesse'|'client'|'perdu'),
score int (0-100, calculé par IA),
notes text, created_at, updated_at

// territoires
id, nom, description, geometry jsonb (GeoJSON polygon),
couleur, created_at

// clients
id, prospect_id FK, valeur_contrat decimal,
statut_projet ('devis'|'actif'|'termine'), created_at

// campagnes
id, nom, statut ('brouillon'|'active'|'pause'|'terminee'),
etapes jsonb (array: {delai_jours, type, template}),
created_at

// campagne_contacts
id, campagne_id FK, prospect_id FK,
etape_actuelle int, derniere_action_at,
statut ('en_cours'|'repondu'|'desabonne')
```

---

## Module Scraping

- **Route API Next.js** : `POST /api/scrape/[source]` reçoit `{keyword, ville, limite}`
- **Worker Playwright** côté serveur
- **Dédoublonnage** : hash `(nom + adresse)`
- **Géocodage** : Nominatim (OpenStreetMap, gratuit) → coords

### Sources

| Source | URL pattern |
|--------|-------------|
| Pages Jaunes | `pagesjaunes.ca/search?what={keyword}&where={ville}` |
| Pages Vertes | `pagesvertes.ca/recherche?q={keyword}&l={ville}` |
| Google Maps | `maps.google.com` via Playwright (fallback SerpAPI) |

---

## Module Carte (MapCN)

```typescript
// Installation : npm install @mapcn/react maplibre-gl supercluster
<ProspectMap
  prospects={prospects}          // markers colorés par statut
  territories={territoires}       // couches polygon GeoJSON
  onProspectClick={openPanel}
  enableDrawing={true}           // dessiner nouvelles zones
  enableRoute={true}             // mode walk-in
/>
```

- **Clustering** : `supercluster`
- **Walk-in routing** : algorithme nearest-neighbor
- **Style carte** : MapLibre personnalisé (fond gris clair, routes blanches, labels Inter)

---

## Assistant IA (Claude Sonnet 4.6)

```typescript
// lib/ai/claude.ts — avec prompt caching obligatoire
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic();

export async function askAssistant(question: string, context: string) {
  return client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: question }],
  });
}
```

**Capacités** : résumer prospects d'une zone, générer emails, analyser campagnes, répondre aux données.

---

## Pages v1

| Route | Description |
|-------|-------------|
| `/login` | Split screen : form gauche / dark visuel droit (style Origin) |
| `/` | Dashboard : stats + graphique activité + derniers prospects |
| `/prospection` | DataTable prospects avec filtres multi-colonnes |
| `/prospection/carte` | MapCN full-screen + markers + territoires |
| `/prospection/scraper` | Wizard 4 étapes : source → params → preview → import |
| `/prospection/territoires` | Gestion zones GeoJSON |
| `/clients` | CRM kanban : Devis → Actif → Terminé → Perdu |
| `/campagnes` | Séquences outreach + templates email |

---

## Plan d'implémentation (Multi-Agents)

| Agent | Responsabilité | Dépendances |
|-------|---------------|-------------|
| **A1** | Init Next.js 15, Supabase, Neon/Drizzle, shadcn, Tailwind, MapCN | — |
| **A2** | Layout 3-col (sidebar, header, right panel), design tokens, auth pages | A1 |
| **A3** | API routes + Playwright scrapers (PJ, PV, GMaps) + géocodage | A1 |
| **A4** | MapCN intégration, markers, territoires GeoJSON, walk-in routing | A1 + A3 |
| **A5** | Dashboard, table prospects, kanban CRM, pages principales | A2 + A3 |
| **A6** | Claude assistant panel, séquences outreach, templates | A2 + A5 |

---

## Vérification End-to-End

1. `npm run dev` → `localhost:3000` sans erreurs
2. Auth : signup → login → dashboard
3. Scraper : "plombier" + "Montréal" → résultats en table
4. Carte : prospects apparaissent sur MapCN
5. Territoire : polygone dessiné → filtre les prospects
6. Walk-in : ordre de visite calculé sur carte
7. CRM : drag prospect vers colonne "Client"
8. IA : question → réponse Claude dans le panneau
9. Campagne : séquence 3 étapes → prospects assignés
