import { NextRequest, NextResponse } from "next/server";
import { scrapePageJaunes } from "@/lib/scrapers/pages-jaunes";

export async function POST(req: NextRequest) {
  const { keyword, ville, limit = 20 } = await req.json();
  if (!keyword || !ville)
    return NextResponse.json({ error: "keyword et ville requis" }, { status: 400 });
  try {
    const results = await scrapePageJaunes(keyword, ville, limit);
    return NextResponse.json({ results, count: results.length });
  } catch (e) {
    return NextResponse.json(
      { error: "Scraping échoué", details: String(e) },
      { status: 500 }
    );
  }
}
