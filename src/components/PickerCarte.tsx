"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IconMapPin } from "@/components/Icons";

type Point = { lat: number; lng: number };

function icone(couleur: string, lettre: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${couleur};transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2.5px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.3);"><span style="transform:rotate(45deg);color:white;font-size:12px;font-weight:800;">${lettre}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
}

const ICONE_DEPART = icone("#1e293b", "D");
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
    const map = L.map(containerRef.current, { attributionControl: false, scrollWheelZoom: false }).setView(
      [14.7167, -17.4677],
      12
    );
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
        markerDepartRef.current = L.marker([depart.lat, depart.lng], { icon: ICONE_DEPART, draggable: true }).addTo(
          map
        );
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
        markerArriveeRef.current = L.marker([arrivee.lat, arrivee.lng], { icon: ICONE_ARRIVEE, draggable: true }).addTo(
          map
        );
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
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("depart")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs ${
            mode === "depart"
              ? "bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900/20"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
          <span>Point Départ (D)</span>
          {depart && <span className="text-[10px] text-emerald-400">✓</span>}
        </button>

        <button
          type="button"
          onClick={() => setMode("arrivee")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs ${
            mode === "arrivee"
              ? "bg-orange-500 text-white shadow-sm ring-2 ring-orange-500/20"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-200" />
          <span>Point Arrivée (A)</span>
          {arrivee && <span className="text-[10px] text-emerald-400">✓</span>}
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full h-56 rounded-2xl overflow-hidden border border-neutral-200/90 shadow-inner"
      />

      <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
        <span>Touchez la carte ou glissez les marqueurs pour ajuster.</span>
        {(depart || arrivee) && (
          <span className="font-semibold text-emerald-600">
            {depart && arrivee ? "2/2 points fixés" : "1/2 point fixé"}
          </span>
        )}
      </div>
    </div>
  );
}
