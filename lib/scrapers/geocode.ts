const USER_AGENT = "UprisingAnarchy/1.0 (contact: contact@uprisingstudio.ca)";

/** Délai minimal entre deux appels Nominatim (rate-limit : 1 req/s). */
const NOMINATIM_DELAY_MS = 1100;

let lastNominatimCall = 0;

async function waitForNominatim(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastNominatimCall;
  if (elapsed < NOMINATIM_DELAY_MS) {
    await new Promise<void>((resolve) =>
      setTimeout(resolve, NOMINATIM_DELAY_MS - elapsed)
    );
  }
  lastNominatimCall = Date.now();
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

/**
 * Géocode une adresse québécoise via Nominatim (OpenStreetMap).
 * Respecte la limite de 1 requête/seconde.
 * Retourne `null` si aucun résultat.
 */
export async function geocodeAddress(
  adresse: string,
  ville: string
): Promise<{ lat: number; lng: number } | null> {
  await waitForNominatim();

  const query = encodeURIComponent(`${adresse} ${ville} QC`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8_000),
    });

    if (!res.ok) {
      console.warn(`[geocode] HTTP ${res.status} pour "${adresse}, ${ville}"`);
      return null;
    }

    const data = (await res.json()) as NominatimResult[];

    if (!Array.isArray(data) || data.length === 0) return null;

    const first = data[0];
    const lat = parseFloat(first.lat);
    const lng = parseFloat(first.lon);

    if (isNaN(lat) || isNaN(lng)) return null;

    return { lat, lng };
  } catch (err) {
    console.warn(`[geocode] erreur pour "${adresse}, ${ville}": ${String(err)}`);
    return null;
  }
}
