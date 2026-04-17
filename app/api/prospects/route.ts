import { NextRequest, NextResponse } from "next/server";

// In-memory store for mock mode (no DB required)
const inMemoryProspects: Record<string, unknown>[] = [];

/**
 * GET /api/prospects
 * Returns the full list of prospects (in-memory mock for now)
 */
export async function GET() {
  return NextResponse.json({ prospects: inMemoryProspects, count: inMemoryProspects.length });
}

/**
 * POST /api/prospects
 * Creates one or multiple prospects from the scraper wizard.
 * Body: { prospects: ScrapedResult[], source?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rawProspects: Record<string, unknown>[] = Array.isArray(body.prospects)
      ? body.prospects
      : body.nom
      ? [body]
      : [];

    if (rawProspects.length === 0) {
      return NextResponse.json(
        { error: "Aucun prospect fourni. Envoyez { prospects: [...] } ou un objet prospect unique." },
        { status: 400 }
      );
    }

    const created = rawProspects.map((p) => ({
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      nom: String(p.nom ?? ""),
      ville: String(p.ville ?? ""),
      categorie: String(p.categorie ?? ""),
      telephone: String(p.telephone ?? ""),
      email: String(p.email ?? ""),
      source: String(body.source ?? p.source ?? "scraper"),
      statut: "nouveau",
      score: Math.floor(Math.random() * 40) + 50, // 50–90 par défaut
      createdAt: new Date().toISOString(),
    }));

    inMemoryProspects.push(...created);

    return NextResponse.json(
      { prospects: created, count: created.length },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur lors de la création des prospects", details: String(e) },
      { status: 500 }
    );
  }
}
