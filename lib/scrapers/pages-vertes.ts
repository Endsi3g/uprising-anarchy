import type { RawProspect } from "./index";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Données mockées réalistes pour le développement local. */
function getMockData(keyword: string, ville: string, limit: number): RawProspect[] {
  const mocks: RawProspect[] = [
    {
      nom: "Toitures Éco-Vert Montréal",
      adresse: "567 Rue Notre-Dame O",
      ville: "Montréal",
      telephone: "514-555-1001",
      siteWeb: "https://toituresecovertes.ca",
      categorie: keyword,
      source: "pages-vertes-mock",
    },
    {
      nom: "Construction Durable Leblanc",
      adresse: "890 Rue du Commerce",
      ville: "Québec",
      telephone: "418-555-1002",
      siteWeb: "https://constructiondurable.qc.ca",
      categorie: keyword,
      source: "pages-vertes-mock",
    },
    {
      nom: "Paysagement Nature & Jardin",
      adresse: "234 Boul. Laurier",
      ville: "Longueuil",
      telephone: "450-555-1003",
      siteWeb: undefined,
      categorie: keyword,
      source: "pages-vertes-mock",
    },
    {
      nom: "Énergies Renouvelables Tremblay",
      adresse: "101 Rue du Soleil",
      ville: "Sherbrooke",
      telephone: "819-555-1004",
      siteWeb: "https://energiestremblay.ca",
      categorie: keyword,
      source: "pages-vertes-mock",
    },
    {
      nom: "Isolation Thermique Paradis",
      adresse: "678 Chemin du Lac",
      ville: "Saint-Jérôme",
      telephone: "450-555-1005",
      siteWeb: undefined,
      categorie: keyword,
      source: "pages-vertes-mock",
    },
  ];

  return mocks
    .map((m) => ({ ...m, ville: m.ville === "Montréal" ? ville : m.ville }))
    .slice(0, limit);
}

function extractFirst(html: string, pattern: RegExp): string | undefined {
  const match = pattern.exec(html);
  return match?.[1]?.trim() ?? undefined;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code))
    );
}

/**
 * Scrape pagesvertes.ca pour un mot-clé et une ville donnés.
 * Retourne un fallback mocké si le fetch échoue.
 */
export async function scrapePageVertes(
  keyword: string,
  ville: string,
  limit: number
): Promise<RawProspect[]> {
  const url = `https://www.pagesvertes.ca/recherche?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(ville)}`;

  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-CA,fr;q=0.9,en-CA;q=0.8",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.warn(`[pages-vertes] HTTP ${res.status} — fallback mock`);
      return getMockData(keyword, ville, limit);
    }

    html = await res.text();
  } catch (err) {
    console.warn(`[pages-vertes] fetch error: ${String(err)} — fallback mock`);
    return getMockData(keyword, ville, limit);
  }

  const results: RawProspect[] = [];

  // Les fiches pagesvertes utilisent des balises article ou div avec classe "result" ou "company"
  const blockPattern =
    /<(?:article|div)[^>]+class="[^"]*(?:result|company|listing|card)[^"]*"[^>]*>([\s\S]*?)<\/(?:article|div)>\s*(?:<(?:article|div)|<\/section|<\/ul)/g;

  let blockMatch: RegExpExecArray | null;
  while (
    results.length < limit &&
    (blockMatch = blockPattern.exec(html)) !== null
  ) {
    const block = blockMatch[1];

    const nom = extractFirst(
      block,
      /<(?:h[1-4]|span)[^>]*class="[^"]*(?:name|title|company-name|business-name)[^"]*"[^>]*>([^<]+)/
    );
    if (!nom) continue;

    const adresse = extractFirst(
      block,
      /<(?:span|address|p)[^>]*class="[^"]*(?:address|street|location)[^"]*"[^>]*>([^<]+)/
    );
    const telephone = extractFirst(
      block,
      /<(?:span|a)[^>]*class="[^"]*(?:phone|tel|telephone)[^"]*"[^>]*>([^<]+)/
    );
    const siteWeb = extractFirst(
      block,
      /href="(https?:\/\/(?!www\.pagesvertes)[^"]+)"/
    );
    const categorie = extractFirst(
      block,
      /<(?:span|a)[^>]*class="[^"]*(?:category|categorie|sector)[^"]*"[^>]*>([^<]+)/
    );

    results.push({
      nom: decodeHtmlEntities(nom),
      adresse: adresse ? decodeHtmlEntities(adresse) : undefined,
      ville,
      telephone: telephone ? decodeHtmlEntities(telephone) : undefined,
      siteWeb,
      categorie: categorie ? decodeHtmlEntities(categorie) : keyword,
      source: "pages-vertes",
    });
  }

  if (results.length === 0) {
    console.warn("[pages-vertes] parsing yielded 0 results — fallback mock");
    return getMockData(keyword, ville, limit);
  }

  return results;
}
