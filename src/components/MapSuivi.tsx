"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = { lat: number; lng: number };

function icone(couleur: string, lettre: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${couleur};transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2.5px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.3);"><span style="transform:rotate(45deg);color:white;font-size:12px;font-weight:800;">${lettre}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
}

function iconeLivreur() {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:100%;height:100%;border-radius:50%;background:rgba(249,115,22,0.35);animation:pulse-subtle 1.8s infinite ease-in-out;"></div>
        <div style="position:relative;width:26px;height:26px;border-radius:50%;background:#ea580c;border:2.5px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(234,88,12,0.45);color:white;font-size:13px;">
          🛵
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

const ICONE_DEPART = icone("#1e293b", "D");
const ICONE_ARRIVEE = icone("#16a34a", "A");
const ICONE_LIVREUR = iconeLivreur();

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
    mapRef.current = L.map(containerRef.current, { attributionControl: false, scrollWheelZoom: false }).setView(
      [14.7167, -17.4677],
      12
    );
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
      map.fitBounds(L.latLngBounds(points), { padding: [45, 45], maxZoom: 15 });
    }
  }, [depart, arrivee, position]);

  return (
    <div
      ref={containerRef}
      className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-neutral-200/90 shadow-inner"
    />
  );
}
