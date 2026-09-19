"use client";

import { useState } from "react";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";
import { prixSuggere } from "@/lib/prix";
import AdminAssignation from "@/components/AdminAssignation";
import CreerLivreur from "@/components/CreerLivreur";

type LivraisonRow = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  depart_lat: number | null;
  depart_lng: number | null;
  arrivee_lat: number | null;
  arrivee_lng: number | null;
  destinataire_nom: string;
  prix_fcfa: number | null;
  client_nom: string;
  client_telephone: string;
  livreur_nom: string | null;
};

type HistoriqueRow = LivraisonRow & { updated_at: string };

type Livreur = { id: string; nom: string; telephone: string; zone: string | null; actif: boolean };

const ONGLETS = ["livraisons", "livreurs", "historique"] as const;
type Onglet = (typeof ONGLETS)[number];

const LABEL_ONGLET: Record<Onglet, string> = {
  livraisons: "Livraisons",
  livreurs: "Livreurs",
  historique: "Historique",
};

export default function AdminTabs({
  enAttente,
  enCours,
  livreursActifs,
  livreursTous,
  historique,
}: {
  enAttente: LivraisonRow[];
  enCours: LivraisonRow[];
  livreursActifs: { id: string; nom: string; zone: string | null }[];
  livreursTous: Livreur[];
  historique: HistoriqueRow[];
}) {
  const [onglet, setOnglet] = useState<Onglet>("livraisons");

  const livrees = historique.filter((r) => r.statut === "livre");
  const totalFcfa = livrees.reduce((sum, r) => sum + (r.prix_fcfa ?? 0), 0);

  return (
    <div>
      <div className="flex gap-1 mb-8 border-b border-neutral-200">
        {ONGLETS.map((o) => (
          <button
            key={o}
            onClick={() => setOnglet(o)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
              onglet === o ? "border-orange-500 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {LABEL_ONGLET[o]}
            {o === "livraisons" && enAttente.length > 0 ? ` (${enAttente.length})` : ""}
          </button>
        ))}
      </div>

      {onglet === "livraisons" && (
        <div>
          <section className="mb-10">
            <h2 className="font-semibold mb-3">En attente d&apos;assignation ({enAttente.length})</h2>
            <div className="grid gap-3">
              {enAttente.length === 0 && <p className="text-sm text-neutral-400">Rien en attente pour le moment.</p>}
              {enAttente.map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-neutral-100 p-4">
                  <p className="text-sm text-neutral-700 mb-1">
                    {r.adresse_depart} → {r.adresse_arrivee}
                  </p>
                  <p className="text-xs text-neutral-400 mb-3">
                    Client : {r.client_nom} ({r.client_telephone}) · Pour {r.destinataire_nom}
                  </p>
                  <AdminAssignation
                    livraisonId={r.id}
                    livreurs={livreursActifs}
                    prixSuggere={prixSuggere(
                      r.depart_lat && r.depart_lng ? { lat: r.depart_lat, lng: r.depart_lng } : null,
                      r.arrivee_lat && r.arrivee_lng ? { lat: r.arrivee_lat, lng: r.arrivee_lng } : null
                    )}
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-semibold mb-3">En cours ({enCours.length})</h2>
            <div className="grid gap-3">
              {enCours.length === 0 && <p className="text-sm text-neutral-400">Aucune course en cours.</p>}
              {enCours.map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-neutral-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUT_COLOR[r.statut]}`}>
                      {STATUT_LABEL[r.statut]}
                    </span>
                    {r.prix_fcfa && <span className="text-sm font-medium">{r.prix_fcfa} FCFA</span>}
                  </div>
                  <p className="text-sm text-neutral-700">
                    {r.adresse_depart} → {r.adresse_arrivee}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">Livreur : {r.livreur_nom}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {onglet === "livreurs" && (
        <div className="grid gap-8 max-w-2xl">
          <div>
            <h2 className="font-semibold mb-3">Ajouter un livreur</h2>
            <CreerLivreur />
          </div>
          <div>
            <h2 className="font-semibold mb-3">Équipe actuelle ({livreursTous.length})</h2>
            <div className="grid gap-2">
              {livreursTous.map((l) => (
                <div key={l.id} className="bg-white rounded-xl border border-neutral-100 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{l.nom}</p>
                    <p className="text-xs text-neutral-400">
                      {l.telephone}
                      {l.zone ? ` · ${l.zone}` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      l.actif ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {l.actif ? "Actif" : "Inactif"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {onglet === "historique" && (
        <div>
          <p className="text-sm text-neutral-500 mb-6">
            {livrees.length} livrée{livrees.length !== 1 ? "s" : ""} · {totalFcfa.toLocaleString("fr-FR")} FCFA au total
          </p>
          {historique.length === 0 && <p className="text-sm text-neutral-400">Aucune livraison terminée pour le moment.</p>}
          <div className="grid gap-3">
            {historique.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-neutral-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUT_COLOR[r.statut]}`}>
                    {STATUT_LABEL[r.statut]}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(r.updated_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-neutral-700">
                  {r.adresse_depart} → {r.adresse_arrivee}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Client : {r.client_nom} · Pour {r.destinataire_nom}
                  {r.livreur_nom ? ` · Livreur : ${r.livreur_nom}` : ""}
                  {r.prix_fcfa ? ` · ${r.prix_fcfa} FCFA` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
