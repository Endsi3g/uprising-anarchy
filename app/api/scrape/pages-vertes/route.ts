import { NextRequest, NextResponse } from "next/server";
import { scrapePageVertes } from "@/lib/scrapers/pages-vertes";

export async function POST(req: NextRequest) {
  const { keyword, ville, limit = 20 } = await req.json();
  if (!keyword || !ville)
    return NextResponse.json({ error: "keyword et ville requis" }, { status: 400 });
  try {
    const results = await scrapePageVertes(keyword, ville, limit);
    return NextResponse.json({ results, count: results.length });
  } catch (e) {
    return NextResponse.json(
      { error: "Scraping échoué", details: String(e) },
      { status: 500 }
    );
  }
}
