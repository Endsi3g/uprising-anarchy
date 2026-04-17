import type { RawProspect } from "./index";

const USER_AGENT = "UprisingAnarchy/1.0 (contact: contact@uprisingstudio.ca)";

/** Données mockées réalistes pour le développement local. */
function getMockData(keyword: string, ville: string, limit: number): RawProspect[] {
  const mocks: RawProspect[] = [
    {
      nom: "Café Olimpico",
      adresse: "124 Rue Saint-Viateur O",
      ville: "Montréal",
      telephone: "514-495-0746",
      siteWeb: "https://cafeolimp.com",
      categorie: keyword,
      coordsLat: 45.5254,
      coordsLng: -73.6012,
      source: "google-maps-mock",
    },
    {
      nom: "Marché Jean-Talon",
      adresse: "7070 Av. Henri-Julien",
      ville: "Montréal",
      telephone: "514-277-1588",
      siteWeb: "https://marchespublics-mtl.com",
      categorie: keyword,
      coordsLat: 45.5368,
      coordsLng: -73.6133,
      source: "google-maps-mock",
    },
    {
      nom: "Librairie Drawn & Quarterly",
      adresse: "211 Rue Bernard O",
      ville: "Montréal",
      telephone: "514-279-2224",
      siteWeb: "https://drawnandquarterly.com",
      categorie: keyword,
      coordsLat: 45.5245,
      coordsLng: -73.6027,
      source: "google-maps-mock",
    },
    {
      nom: "Boutique Scandale",
      adresse: "3639 Boul. Saint-Laurent",
      ville: "Montréal",
      telephone: "514-842-4707",
      siteWeb: "https://scandale.com",
      categorie: keyword,
      coordsLat: 45.5181,
      coordsLng: -73.5794,
      source: "google-maps-mock",
    },
    {
      nom: "Studio Fabrika",
      adresse: "5765 Rue Sherbrooke O",
      ville: "Montréal",
      telephone: "514-488-4458",
      siteWeb: undefined,
      categorie: keyword,
      coordsLat: 45.4692,
      coordsLng: -73.6133,
      source: "google-maps-mock",
    },
  ];

  return mocks
    .map((m) => ({ ...m, ville: m.ville === "Montréal" ? ville : m.ville }))
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// SerpAPI path (optionnel — nécessite SERPAPI_KEY)
// ---------------------------------------------------------------------------

interface SerpApiLocalResult {
  title?: string;
  address?: string;
  phone?: string;
  website?: string;
  type?: string;
  gps_coordinates?: { latitude?: number; longitude?: number };
}

interface SerpApiResponse {
  local_results?: SerpApiLocalResult[];
}

async function scrapeViaSerpApi(
  keyword: string,
  ville: string,
  limit: number,
  apiKey: string
): Promise<RawProspect[]> {
  const params = new URLSearchParams({
    engine: "google_maps",
    q: `${keyword} ${ville} QC`,
    hl: "fr",
    gl: "ca",
    api_key: apiKey,
    num: String(limit),
  });

  const url = `https://serpapi.com/search.json?${params.toString()}`;

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`SerpAPI HTTP ${res.status}`);
  }

  const data = (await res.json()) as SerpApiResponse;
  const localResults = data.local_results ?? [];

  return localResults.slice(0, limit).map((r) => ({
    nom: r.title ?? "Inconnu",
    adresse: r.address,
    ville,
    telephone: r.phone,
    siteWeb: r.website,
    categorie: r.type ?? keyword,
    coordsLat: r.gps_coordinates?.latitude,
    coordsLng: r.gps_coordinates?.longitude,
    source: "google-maps-serpapi",
  }));
}

// ---------------------------------------------------------------------------
// Nominatim fallback (OpenStreetMap)
// ---------------------------------------------------------------------------

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
  };
  namedetails?: { name?: string };
  name?: string;
}

async function scrapeViaNominatim(
  keyword: string,
  ville: string,
  limit: number
): Promise<RawProspect[]> {
  const query = encodeURIComponent(`${keyword} ${ville} QC Canada`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=${limit}&addressdetails=1&namedetails=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Nominatim HTTP ${res.status}`);
  }

  const data = (await res.json()) as NominatimResult[];

  return data.slice(0, limit).map((r) => {
    const addrObj = r.address ?? {};
    const streetParts = [addrObj.house_number, addrObj.road].filter(Boolean);
    const adresse = streetParts.length > 0 ? streetParts.join(" ") : undefined;
    const resolvedVille =
      addrObj.city ?? addrObj.town ?? addrObj.village ?? ville;

    return {
      nom: r.name ?? r.namedetails?.name ?? r.display_name.split(",")[0] ?? "Inconnu",
      adresse,
      ville: resolvedVille,
      telephone: undefined,
      siteWeb: undefined,
      categorie: keyword,
      coordsLat: parseFloat(r.lat),
      coordsLng: parseFloat(r.lon),
      source: "google-maps-nominatim",
    };
  });
}

// ---------------------------------------------------------------------------
// Export principal
// ---------------------------------------------------------------------------

/**
 * Scrape des points d'intérêt via SerpAPI (si SERPAPI_KEY disponible)
 * ou Nominatim/OSM en fallback.
 * Retourne des données mockées si toutes les sources échouent.
 */
export async function scrapeGoogleMaps(
  keyword: string,
  ville: string,
  limit: number
): Promise<RawProspect[]> {
  const serpApiKey = process.env.SERPAPI_KEY;

  if (serpApiKey) {
    try {
      const results = await scrapeViaSerpApi(keyword, ville, limit, serpApiKey);
      if (results.length > 0) return results;
    } catch (err) {
      console.warn(`[google-maps] SerpAPI error: ${String(err)} — essai Nominatim`);
    }
  }

  try {
    const results = await scrapeViaNominatim(keyword, ville, limit);
    if (results.length > 0) return results;
  } catch (err) {
    console.warn(`[google-maps] Nominatim error: ${String(err)} — fallback mock`);
  }

  return getMockData(keyword, ville, limit);
}
