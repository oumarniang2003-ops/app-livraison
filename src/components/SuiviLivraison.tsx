"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";

const MapSuivi = dynamic(() => import("@/components/MapSuivi"), { ssr: false });

export type Livraison = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  depart_lat: number | null;
  depart_lng: number | null;
  arrivee_lat: number | null;
  arrivee_lng: number | null;
  destinataire_nom: string;
  destinataire_telephone: string;
  prix_fcfa: number | null;
  mode_paiement: string;
  livreur_nom: string | null;
  livreur_telephone: string | null;
};

type Evenement = {
  statut: string;
  created_at: string;
};

type Position = {
  lat: number;
  lng: number;
  updated_at: string;
} | null;

export default function SuiviLivraison({
  livraisonId,
  livraisonInitiale,
  role,
}: {
  livraisonId: string;
  livraisonInitiale: Livraison;
  role: "client" | "livreur";
}) {
  const router = useRouter();
  const [livraison, setLivraison] = useState<Livraison>(livraisonInitiale);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [position, setPosition] = useState<Position>(null);
  const [maintenant, setMaintenant] = useState(() => Date.now());

  useEffect(() => {
    const tick = setInterval(() => setMaintenant(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let annule = false;
    async function poll() {
      const res = await fetch(`/api/livraisons/${livraisonId}`);
      if (!res.ok || annule) return;
      const data = await res.json();
      setLivraison(data.livraison);
      setEvenements(data.evenements);
      setPosition(data.position);
    }
    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      annule = true;
      clearInterval(interval);
    };
  }, [livraisonId]);

  async function annuler() {
    if (!confirm("Annuler cette livraison ?")) return;
    await fetch(`/api/livraisons/${livraisonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "annuler" }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      <div className="bg-white rounded-2xl border border-neutral-100 p-5">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUT_COLOR[livraison.statut]}`}>
          {STATUT_LABEL[livraison.statut]}
        </span>
        <p className="mt-3 text-sm text-neutral-700">
          {livraison.adresse_depart} → {livraison.adresse_arrivee}
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Destinataire : {livraison.destinataire_nom} · {livraison.destinataire_telephone}
        </p>
        {livraison.prix_fcfa && (
          <p className="text-sm font-medium mt-2">{livraison.prix_fcfa} FCFA</p>
        )}
      </div>

      {livraison.livreur_nom && (
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <h3 className="font-semibold text-sm mb-1">Votre livreur</h3>
          <p className="text-sm text-neutral-700">{livraison.livreur_nom}</p>
          <a href={`tel:${livraison.livreur_telephone}`} className="text-sm text-orange-600">
            {livraison.livreur_telephone}
          </a>
        </div>
      )}

      {(position || livraison.depart_lat || livraison.arrivee_lat) && (
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <h3 className="font-semibold text-sm mb-3">Position actuelle du livreur</h3>
          <MapSuivi
            depart={livraison.depart_lat && livraison.depart_lng ? { lat: livraison.depart_lat, lng: livraison.depart_lng } : null}
            arrivee={livraison.arrivee_lat && livraison.arrivee_lng ? { lat: livraison.arrivee_lat, lng: livraison.arrivee_lng } : null}
            position={position ? { lat: position.lat, lng: position.lng } : null}
          />
          {position && (
            <>
              <p className="text-xs text-neutral-500 mt-3 mb-1">
                Mise à jour il y a {Math.max(0, Math.round((maintenant - new Date(position.updated_at).getTime()) / 1000))}s
              </p>
              <a
                href={`https://www.google.com/maps?q=${position.lat},${position.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-orange-600 font-medium"
              >
                Ouvrir dans Google Maps →
              </a>
            </>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-neutral-100 p-5">
        <h3 className="font-semibold text-sm mb-3">Historique</h3>
        <div className="grid gap-2">
          {evenements.map((e, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="flex-1">{STATUT_LABEL[e.statut]}</span>
              <span className="text-xs text-neutral-400">
                {new Date(e.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {role === "client" && ["en_attente", "assignee"].includes(livraison.statut) && (
        <button
          onClick={annuler}
          className="text-sm text-red-600 font-medium hover:underline text-left"
        >
          Annuler cette livraison
        </button>
      )}
    </div>
  );
}
