"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = { lat: number; lng: number };

function icone(couleur: string, lettre: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:${couleur};transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"><span style="transform:rotate(45deg);color:white;font-size:11px;font-weight:600;">${lettre}</span></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });
}

const ICONE_DEPART = icone("#a3a3a3", "D");
const ICONE_ARRIVEE = icone("#f97316", "A");

export default function PickerCarte({
  depart,
  arrivee,
  onChange,
}: {
  depart: Point | null;
  arrivee: Point | null;
  onChange: (champ: "depart" | "arrivee", point: Point) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerDepartRef = useRef<L.Marker | null>(null);
  const markerArriveeRef = useRef<L.Marker | null>(null);
  const [mode, setMode] = useState<"depart" | "arrivee">("depart");
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { attributionControl: false }).setView([14.7167, -17.4677], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    L.control.attribution({ prefix: false }).addTo(map);
    map.on("click", (e: L.LeafletMouseEvent) => {
      onChangeRef.current(modeRef.current, { lat: e.latlng.lat, lng: e.latlng.lng });
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (depart) {
      if (!markerDepartRef.current) {
        markerDepartRef.current = L.marker([depart.lat, depart.lng], { icon: ICONE_DEPART, draggable: true }).addTo(map);
        markerDepartRef.current.on("dragend", () => {
          const pos = markerDepartRef.current!.getLatLng();
          onChangeRef.current("depart", { lat: pos.lat, lng: pos.lng });
        });
      } else {
        markerDepartRef.current.setLatLng([depart.lat, depart.lng]);
      }
    }
    if (arrivee) {
      if (!markerArriveeRef.current) {
        markerArriveeRef.current = L.marker([arrivee.lat, arrivee.lng], { icon: ICONE_ARRIVEE, draggable: true }).addTo(map);
        markerArriveeRef.current.on("dragend", () => {
          const pos = markerArriveeRef.current!.getLatLng();
          onChangeRef.current("arrivee", { lat: pos.lat, lng: pos.lng });
        });
      } else {
        markerArriveeRef.current.setLatLng([arrivee.lat, arrivee.lng]);
      }
    }
  }, [depart, arrivee]);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode("depart")}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            mode === "depart" ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 text-neutral-600"
          }`}
        >
          ● Placer le départ
        </button>
        <button
          type="button"
          onClick={() => setMode("arrivee")}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            mode === "arrivee" ? "bg-orange-500 text-white border-orange-500" : "border-neutral-300 text-neutral-600"
          }`}
        >
          ● Placer l&apos;arrivée
        </button>
      </div>
      <div ref={containerRef} className="w-full h-56 rounded-xl overflow-hidden border border-neutral-200" />
      <p className="text-xs text-neutral-400 mt-1">
        Clique sur la carte pour placer le point sélectionné (tu peux aussi glisser les repères).
      </p>
    </div>
  );
}
