const DAKAR_VIEWBOX = "-17.63,14.85,-17.10,14.60";

export async function geocode(adresse: string): Promise<{ lat: number; lng: number } | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", `${adresse}, Dakar, Sénégal`);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("viewbox", DAKAR_VIEWBOX);
  url.searchParams.set("bounded", "1");

  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "Yeggo/1.0 (livraison-dakar)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data[0];
    if (!result) return null;
    return { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
  } catch {
    return null;
  }
}
