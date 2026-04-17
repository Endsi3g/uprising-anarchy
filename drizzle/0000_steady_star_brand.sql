CREATE TABLE "campagne_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campagne_id" uuid,
	"prospect_id" uuid,
	"etape_actuelle" integer DEFAULT 0,
	"derniere_action_at" timestamp,
	"statut" text DEFAULT 'en_cours'
);
--> statement-breakpoint
CREATE TABLE "campagnes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" text NOT NULL,
	"statut" text DEFAULT 'brouillon',
	"etapes" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_id" uuid,
	"valeur_contrat" numeric(10, 2),
	"statut_projet" text DEFAULT 'devis',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"company_name" text,
	"company_website" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "prospects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text DEFAULT 'manuel' NOT NULL,
	"nom" text NOT NULL,
	"adresse" text,
	"ville" text,
	"province" text DEFAULT 'QC',
	"code_postal" text,
	"telephone" text,
	"email" text,
	"site_web" text,
	"categorie" text,
	"tags" text[],
	"coords_lat" double precision,
	"coords_lng" double precision,
	"statut" text DEFAULT 'nouveau' NOT NULL,
	"score" integer DEFAULT 0,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "territoires" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" text NOT NULL,
	"description" text,
	"geometry" jsonb,
	"couleur" text DEFAULT '#264DEB',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "campagne_contacts" ADD CONSTRAINT "campagne_contacts_campagne_id_campagnes_id_fk" FOREIGN KEY ("campagne_id") REFERENCES "public"."campagnes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campagne_contacts" ADD CONSTRAINT "campagne_contacts_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE no action ON UPDATE no action;