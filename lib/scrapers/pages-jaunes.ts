import type { RawProspect } from "./index";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Données mockées réalistes pour le développement local. */
function getMockData(keyword: string, ville: string, limit: number): RawProspect[] {
  const mocks: RawProspect[] = [
    {
      nom: "Restauration La Belle Province",
      adresse: "1234 Rue Sainte-Catherine O",
      ville: "Montréal",
      telephone: "514-555-0101",
      siteWeb: "https://labellerprovince.ca",
      categorie: keyword,
      source: "pages-jaunes-mock",
    },
    {
      nom: "Boulangerie St-Viateur",
      adresse: "263 Rue Saint-Viateur O",
      ville: "Montréal",
      telephone: "514-276-8044",
      siteWeb: "https://stviateurbagel.com",
      categorie: keyword,
      source: "pages-jaunes-mock",
    },
    {
      nom: "Électrique Lafortune Inc.",
      adresse: "456 Boul. Décarie",
      ville: "Saint-Laurent",
      telephone: "514-555-0202",
      siteWeb: undefined,
      categorie: keyword,
      source: "pages-jaunes-mock",
    },
    {
      nom: "Plomberie Gagnon & Fils",
      adresse: "789 Rue Principale",
      ville: "Laval",
      telephone: "450-555-0303",
      siteWeb: "https://plomberiegagnon.ca",
      categorie: keyword,
      source: "pages-jaunes-mock",
    },
    {
      nom: "Garage Beauchamp Auto",
      adresse: "321 Boul. des Laurentides",
      ville: "Laval",
      telephone: "450-555-0404",
      siteWeb: undefined,
      categorie: keyword,
      source: "pages-jaunes-mock",
    },
  ];

  return mocks
    .map((m) => ({ ...m, ville: m.ville === "Montréal" ? ville : m.ville }))
    .slice(0, limit);
}

/**
 * Extrait une valeur depuis du HTML brut avec une regex.
 * Retourne `undefined` si aucun match.
 */
function extractFirst(html: string, pattern: RegExp): string | undefined {
  const match = pattern.exec(html);
  return match?.[1]?.trim() ?? undefined;
}

/** Décode les entités HTML les plus courantes. */
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
 * Scrape pagesjaunes.ca pour un mot-clé et une ville donnés.
 * Retourne un fallback mocké si le fetch échoue (timeout Vercel, blocage, etc.).
 */
export async function scrapePageJaunes(
  keyword: string,
  ville: string,
  limit: number
): Promise<RawProspect[]> {
  const url = `https://www.pagesjaunes.ca/search/si/${encodeURIComponent(keyword)}/${encodeURIComponent(ville)}`;

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
      console.warn(`[pages-jaunes] HTTP ${res.status} — fallback mock`);
      return getMockData(keyword, ville, limit);
    }

    html = await res.text();
  } catch (err) {
    console.warn(`[pages-jaunes] fetch error: ${String(err)} — fallback mock`);
    return getMockData(keyword, ville, limit);
  }

  const results: RawProspect[] = [];

  // Chaque fiche est dans un bloc <div class="listing ..."> ou <div class="result ...">
  // On extrait les blocs individuels puis on parse chacun.
  const listingBlockPattern =
    /<div[^>]+class="[^"]*(?:listing|result|merchant)[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<div|<\/section|<\/ul)/g;

  let blockMatch: RegExpExecArray | null;
  while (
    results.length < limit &&
    (blockMatch = listingBlockPattern.exec(html)) !== null
  ) {
    const block = blockMatch[1];

    const nom = extractFirst(
      block,
      /<(?:h[1-4]|span)[^>]*class="[^"]*(?:listing-name|business-name|merchant-name)[^"]*"[^>]*>([^<]+)/
    );
    if (!nom) continue;

    const adresse = extractFirst(
      block,
      /<(?:span|address)[^>]*class="[^"]*(?:listing-address|address|street)[^"]*"[^>]*>([^<]+)/
    );
    const telephone = extractFirst(
      block,
      /<(?:span|a)[^>]*class="[^"]*(?:listing-phone|phone)[^"]*"[^>]*>([^<]+)/
    );
    const siteWeb = extractFirst(
      block,
      /href="(https?:\/\/(?!www\.pagesjaunes)[^"]+)"/
    );
    const categorie = extractFirst(
      block,
      /<(?:span|a)[^>]*class="[^"]*(?:listing-category|category)[^"]*"[^>]*>([^<]+)/
    );

    results.push({
      nom: decodeHtmlEntities(nom),
      adresse: adresse ? decodeHtmlEntities(adresse) : undefined,
      ville,
      telephone: telephone ? decodeHtmlEntities(telephone) : undefined,
      siteWeb,
      categorie: categorie ? decodeHtmlEntities(categorie) : keyword,
      source: "pages-jaunes",
    });
  }

  // Si aucun résultat parsé (structure HTML changée), retourner le mock.
  if (results.length === 0) {
    console.warn("[pages-jaunes] parsing yielded 0 results — fallback mock");
    return getMockData(keyword, ville, limit);
  }

  return results;
}
