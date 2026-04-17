import { pgTable, uuid, text, integer, decimal, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";

export const prospects = pgTable("prospects", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: text("source").notNull().default("manuel"), // pages_jaunes | pages_vertes | google_maps | manuel
  nom: text("nom").notNull(),
  adresse: text("adresse"),
  ville: text("ville"),
  province: text("province").default("QC"),
  codePostal: text("code_postal"),
  telephone: text("telephone"),
  email: text("email"),
  siteWeb: text("site_web"),
  categorie: text("categorie"),
  tags: text("tags").array(),
  coordsLat: doublePrecision("coords_lat"),
  coordsLng: doublePrecision("coords_lng"),
  statut: text("statut").notNull().default("nouveau"), // nouveau | contacte | interesse | client | perdu
  score: integer("score").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const territoires = pgTable("territoires", {
  id: uuid("id").primaryKey().defaultRandom(),
  nom: text("nom").notNull(),
  description: text("description"),
  geometry: jsonb("geometry"), // GeoJSON polygon
  couleur: text("couleur").default("#264DEB"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  prospectId: uuid("prospect_id").references(() => prospects.id),
  valeurContrat: decimal("valeur_contrat", { precision: 10, scale: 2 }),
  statutProjet: text("statut_projet").default("devis"), // devis | actif | termine | perdu
  createdAt: timestamp("created_at").defaultNow(),
});

export const campagnes = pgTable("campagnes", {
  id: uuid("id").primaryKey().defaultRandom(),
  nom: text("nom").notNull(),
  statut: text("statut").default("brouillon"), // brouillon | active | pause | terminee
  etapes: jsonb("etapes"), // [{delai_jours, type, template}]
  createdAt: timestamp("created_at").defaultNow(),
});

export const campagneContacts = pgTable("campagne_contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  campagneId: uuid("campagne_id").references(() => campagnes.id),
  prospectId: uuid("prospect_id").references(() => prospects.id),
  etapeActuelle: integer("etape_actuelle").default(0),
  derniereActionAt: timestamp("derniere_action_at"),
  statut: text("statut").default("en_cours"), // en_cours | repondu | desabonne
});

export type Prospect = typeof prospects.$inferSelect;
export type NewProspect = typeof prospects.$inferInsert;
export type Territoire = typeof territoires.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Campagne = typeof campagnes.$inferSelect;
