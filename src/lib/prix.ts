const PRIX_BASE = 1000;
const PRIX_PAR_KM = 350;

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function prixSuggere(
  depart: { lat: number; lng: number } | null,
  arrivee: { lat: number; lng: number } | null
): number | null {
  if (!depart || !arrivee) return null;
  const km = distanceKm(depart, arrivee);
  const prix = PRIX_BASE + PRIX_PAR_KM * km;
  return Math.round(prix / 50) * 50;
}
