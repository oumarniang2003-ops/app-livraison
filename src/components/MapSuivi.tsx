"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = { lat: number; lng: number };

function icone(couleur: string, taille: number) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${taille}px;height:${taille}px;border-radius:50%;background:${couleur};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15);"></div>`,
    iconSize: [taille, taille],
    iconAnchor: [taille / 2, taille / 2],
  });
}

const ICONE_DEPART = icone("#a3a3a3", 14);
const ICONE_ARRIVEE = icone("#171717", 14);
const ICONE_LIVREUR = icone("#f97316", 18);

export default function MapSuivi({
  depart,
  arrivee,
  position,
}: {
  depart: Point | null;
  arrivee: Point | null;
  position: Point | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapRef.current = L.map(containerRef.current, { attributionControl: false }).setView([14.7167, -17.4677], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapRef.current);
    L.control.attribution({ prefix: false }).addTo(mapRef.current);
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const points: L.LatLngExpression[] = [];

    if (depart) {
      markersRef.current.push(L.marker([depart.lat, depart.lng], { icon: ICONE_DEPART }).addTo(map));
      points.push([depart.lat, depart.lng]);
    }
    if (arrivee) {
      markersRef.current.push(L.marker([arrivee.lat, arrivee.lng], { icon: ICONE_ARRIVEE }).addTo(map));
      points.push([arrivee.lat, arrivee.lng]);
    }
    if (position) {
      markersRef.current.push(L.marker([position.lat, position.lng], { icon: ICONE_LIVREUR }).addTo(map));
      points.push([position.lat, position.lng]);
    }

    if (points.length === 1) {
      map.setView(points[0], 14);
    } else if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
    }
  }, [depart, arrivee, position]);

  return <div ref={containerRef} className="w-full h-64 rounded-2xl overflow-hidden border border-neutral-100" />;
}
