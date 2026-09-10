"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Point = { lat: number; lng: number };

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
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-17.4677, 14.7167],
      zoom: 12,
    });
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !TOKEN) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    let hasPoint = false;

    if (depart) {
      const el = document.createElement("div");
      el.style.cssText = "width:14px;height:14px;border-radius:50%;background:#a3a3a3;border:2px solid white;";
      markersRef.current.push(new mapboxgl.Marker({ element: el }).setLngLat([depart.lng, depart.lat]).addTo(map));
      bounds.extend([depart.lng, depart.lat]);
      hasPoint = true;
    }
    if (arrivee) {
      const el = document.createElement("div");
      el.style.cssText = "width:14px;height:14px;border-radius:50%;background:#171717;border:2px solid white;";
      markersRef.current.push(new mapboxgl.Marker({ element: el }).setLngLat([arrivee.lng, arrivee.lat]).addTo(map));
      bounds.extend([arrivee.lng, arrivee.lat]);
      hasPoint = true;
    }
    if (position) {
      const el = document.createElement("div");
      el.style.cssText = "width:18px;height:18px;border-radius:50%;background:#f97316;border:3px solid white;box-shadow:0 0 0 2px #f97316;";
      markersRef.current.push(new mapboxgl.Marker({ element: el }).setLngLat([position.lng, position.lat]).addTo(map));
      bounds.extend([position.lng, position.lat]);
      hasPoint = true;
    }

    if (hasPoint) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 500 });
    }
  }, [depart, arrivee, position]);

  if (!TOKEN) return null;

  return <div ref={containerRef} className="w-full h-64 rounded-2xl overflow-hidden border border-neutral-100" />;
}
