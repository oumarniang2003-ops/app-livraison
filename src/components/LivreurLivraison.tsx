"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";

export type Livraison = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  description: string | null;
  destinataire_nom: string;
  destinataire_telephone: string;
  prix_fcfa: number | null;
};

const ACTION_LABEL: Record<string, string> = {
  assignee: "J'ai récupéré le colis",
  colis_recupere: "Je suis en route pour livrer",
  en_livraison: "Colis livré",
};

export default function LivreurLivraison({ livraison: initiale }: { livraison: Livraison }) {
  const router = useRouter();
  const [livraison, setLivraison] = useState(initiale);
  const [loading, setLoading] = useState(false);
  const [suiviActif, setSuiviActif] = useState(false);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    const enCours = !["livre", "annule"].includes(livraison.statut);
    if (!enCours || !("geolocation" in navigator)) return;

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setSuiviActif(true);
        fetch("/api/position", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        }).catch(() => {});
      },
      () => setSuiviActif(false),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [livraison.statut]);

  async function avancer() {
    setLoading(true);
    try {
      const res = await fetch(`/api/livraisons/${livraison.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "avancer" }),
      });
      const data = await res.json();
      if (res.ok) {
        setLivraison((l) => ({ ...l, statut: data.statut }));
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  const prochaineAction = ACTION_LABEL[livraison.statut];

  return (
    <div className="grid gap-4">
      <div className="bg-white rounded-2xl border border-neutral-100 p-5">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUT_COLOR[livraison.statut]}`}>
          {STATUT_LABEL[livraison.statut]}
        </span>
        {suiviActif && (
          <span className="ml-2 text-xs text-green-600">● Position partagée</span>
        )}
        <div className="mt-3 grid gap-1 text-sm">
          <p><span className="text-neutral-400">Départ : </span>{livraison.adresse_depart}</p>
          <p><span className="text-neutral-400">Arrivée : </span>{livraison.adresse_arrivee}</p>
          {livraison.description && (
            <p><span className="text-neutral-400">Colis : </span>{livraison.description}</p>
          )}
        </div>
        {livraison.prix_fcfa && (
          <p className="text-sm font-medium mt-2">{livraison.prix_fcfa} FCFA</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 p-5">
        <h3 className="font-semibold text-sm mb-1">Destinataire</h3>
        <p className="text-sm text-neutral-700">{livraison.destinataire_nom}</p>
        <a href={`tel:${livraison.destinataire_telephone}`} className="text-sm text-orange-600">
          {livraison.destinataire_telephone}
        </a>
      </div>

      {prochaineAction && (
        <button
          onClick={avancer}
          disabled={loading}
          className="w-full bg-orange-500 text-white rounded-lg py-3 font-medium hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? "..." : prochaineAction}
        </button>
      )}
    </div>
  );
}
