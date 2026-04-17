export interface RawProspect {
  nom: string;
  adresse?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  categorie?: string;
  coordsLat?: number;
  coordsLng?: number;
  source: string;
}

/**
 * Déduplique les prospects sur la base de nom + adresse (insensible à la casse).
 * Le premier exemplaire rencontré est conservé.
 */
export function deduplicateProspects(prospects: RawProspect[]): RawProspect[] {
  const seen = new Set<string>();
  return prospects.filter((p) => {
    const key = `${p.nom.toLowerCase()}|${(p.adresse ?? "").toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export { scrapePageJaunes } from "./pages-jaunes";
export { scrapePageVertes } from "./pages-vertes";
export { scrapeGoogleMaps } from "./google-maps";
export { geocodeAddress } from "./geocode";
