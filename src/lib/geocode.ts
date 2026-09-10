const DAKAR_BBOX = "-17.63,14.60,-17.10,14.85";

export async function geocode(adresse: string): Promise<{ lat: number; lng: number } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;

  const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(adresse)}.json`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("bbox", DAKAR_BBOX);
  url.searchParams.set("limit", "1");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;
    const [lng, lat] = feature.center;
    return { lat, lng };
  } catch {
    return null;
  }
}
