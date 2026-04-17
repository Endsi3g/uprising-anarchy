import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prospects } from "@/lib/db/schema";
import { geocodeAddress } from "@/lib/scrapers/geocode";

/**
 * GET /api/prospects
 * Fetches all prospects from the database.
 */
export async function GET() {
  try {
    const list = await db.select().from(prospects);
    return NextResponse.json({ prospects: list, count: list.length });
  } catch (error) {
    return NextResponse.json(
      { error: "Impossible de récupérer les prospects", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/prospects
 * Creates prospects and performs sequential geocoding for real map positioning.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawProspects: any[] = Array.isArray(body.prospects)
      ? body.prospects
      : body.nom
      ? [body]
      : [];

    if (rawProspects.length === 0) {
      return NextResponse.json({ error: "Aucun prospect fourni." }, { status: 400 });
    }

    const created = [];

    // Option B: Sequential Geocoding during import to keep it reliable
    for (const p of rawProspects) {
      let lat = p.coords_lat || null;
      let lng = p.coords_lng || null;

      // Only geocode if coordinates are missing
      if (!lat || !lng) {
        const coords = await geocodeAddress(p.adresse || p.nom, p.ville || "Montréal");
        if (coords) {
          lat = coords.lat.toString();
          lng = coords.lng.toString();
        }
      }

      const [newProspect] = await db.insert(prospects).values({
        nom: String(p.nom || "Sans nom"),
        ville: String(p.ville || p.city || "Québec"),
        adresse: String(p.adresse || p.address || ""),
        categorie: String(p.categorie || p.category || "Inconnu"),
        telephone: String(p.telephone || p.phone || ""),
        email: String(p.email || ""),
        siteWeb: String(p.siteWeb || p.website || ""),
        source: String(body.source || p.source || "scraper"),
        statut: "nouveau",
        score: Math.floor(Math.random() * 40) + 50,
        coordsLat: lat,
        coordsLng: lng,
      }).returning();

      created.push(newProspect);
    }

    return NextResponse.json(
      { prospects: created, count: created.length },
      { status: 201 }
    );
  } catch (e) {
    console.error("[api/prospects] ERROR:", e);
    return NextResponse.json(
      { error: "Échec de l'importation", details: String(e) },
      { status: 500 }
    );
  }
}
