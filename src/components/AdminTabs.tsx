"use client";

import { useState } from "react";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";
import { prixSuggere } from "@/lib/prix";
import AdminAssignation from "@/components/AdminAssignation";
import CreerLivreur from "@/components/CreerLivreur";
import {
  IconBike,
  IconClock,
  IconPackage,
  IconCheckCircle,
  IconNavigation,
  IconUser,
} from "@/components/Icons";

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
  livraisons: "Courses & Assignations",
  livreurs: "Équipe Livreurs",
  historique: "Historique & Clôtures",
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
    <div className="space-y-6">
      {/* Top Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">En attente</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <IconClock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900">{enAttente.length}</div>
          <p className="text-[11px] text-neutral-400 mt-0.5">À attribuer</p>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">En cours</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <IconNavigation className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-orange-600">{enCours.length}</div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Sur la route</p>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Livreurs en service</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <IconBike className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900">
            {livreursActifs.length} <span className="text-xs font-normal text-neutral-400">/ {livreursTous.length}</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Disponibles</p>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500">Volume clôturé</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IconCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600">
            {totalFcfa.toLocaleString("fr-FR")} <span className="text-xs font-semibold text-neutral-600">FCFA</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">{livrees.length} livraisons terminées</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {ONGLETS.map((o) => (
          <button
            key={o}
            onClick={() => setOnglet(o)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              onglet === o
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80"
            }`}
          >
            <span>{LABEL_ONGLET[o]}</span>
            {o === "livraisons" && enAttente.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-500 text-white font-black">
                {enAttente.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Livraisons */}
      {onglet === "livraisons" && (
        <div className="space-y-8">
          {/* En attente */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>En attente d&apos;attribution ({enAttente.length})</span>
              </h2>
            </div>

            {enAttente.length === 0 ? (
              <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 text-center text-xs text-neutral-400">
                Toutes les demandes ont été assignées. Rien en attente pour le moment.
              </div>
            ) : (
              <div className="grid gap-3.5">
                {enAttente.map((r) => {
                  const suggere = prixSuggere(
                    r.depart_lat && r.depart_lng ? { lat: r.depart_lat, lng: r.depart_lng } : null,
                    r.arrivee_lat && r.arrivee_lng ? { lat: r.arrivee_lat, lng: r.arrivee_lng } : null
                  );
                  return (
                    <div
                      key={r.id}
                      className="bg-white rounded-3xl border border-amber-200/70 p-5 shadow-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Nouvelle demande
                        </span>
                        <span className="text-xs text-neutral-400 font-medium">
                          Client : <strong className="text-neutral-700">{r.client_nom}</strong> ({r.client_telephone})
                        </span>
                      </div>

                      <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-100 space-y-1 text-xs">
                        <p>
                          <strong className="text-neutral-500">Départ :</strong> {r.adresse_depart}
                        </p>
                        <p>
                          <strong className="text-neutral-500">Arrivée :</strong> {r.adresse_arrivee}
                        </p>
                        <p className="text-[11px] text-neutral-400 pt-1">
                          Destinataire : {r.destinataire_nom}
                        </p>
                      </div>

                      <AdminAssignation
                        livraisonId={r.id}
                        livreurs={livreursActifs}
                        prixSuggere={suggere}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* En cours */}
          <section className="space-y-3">
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Courses en cours ({enCours.length})</span>
            </h2>

            {enCours.length === 0 ? (
              <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 text-center text-xs text-neutral-400">
                Aucune course active en ce moment.
              </div>
            ) : (
              <div className="grid gap-3.5">
                {enCours.map((r) => (
                  <div key={r.id} className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          STATUT_COLOR[r.statut] || "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {STATUT_LABEL[r.statut]}
                      </span>
                      {r.prix_fcfa && (
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900">
                          {r.prix_fcfa.toLocaleString("fr-FR")} FCFA
                        </span>
                      )}
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-medium text-neutral-800">
                        {r.adresse_depart} ➔ {r.adresse_arrivee}
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        Client : {r.client_nom} · Livreur : <strong className="text-orange-600 font-bold">{r.livreur_nom}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Tab: Livreurs */}
      {onglet === "livreurs" && (
        <div className="grid gap-8 max-w-2xl">
          <div>
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider mb-3">
              Ajouter un nouveau coursier
            </h2>
            <CreerLivreur />
          </div>

          <div>
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider mb-3">
              Flotte de livreurs ({livreursTous.length})
            </h2>
            <div className="grid gap-2.5">
              {livreursTous.map((l) => (
                <div
                  key={l.id}
                  className="bg-white rounded-2xl border border-neutral-200/80 p-4 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                      <IconBike className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">{l.nom}</p>
                      <p className="text-[11px] text-neutral-500">
                        {l.telephone} {l.zone ? `· Zone: ${l.zone}` : ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      l.actif ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-neutral-100 text-neutral-500"
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

      {/* Tab: Historique */}
      {onglet === "historique" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-neutral-200/80 text-xs">
            <span className="text-neutral-500">
              {livrees.length} livraison{livrees.length > 1 ? "s" : ""} terminée{livrees.length > 1 ? "s" : ""} avec succès
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
              Total : {totalFcfa.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          {historique.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 text-center text-xs text-neutral-400">
              Aucune course terminée dans l&apos;historique.
            </div>
          ) : (
            <div className="grid gap-3">
              {historique.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        STATUT_COLOR[r.statut] || "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {STATUT_LABEL[r.statut]}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {new Date(r.updated_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-neutral-800">
                    {r.adresse_depart} ➔ {r.adresse_arrivee}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-100">
                    <span>
                      Client : {r.client_nom} · Livreur : {r.livreur_nom ?? "N/A"}
                    </span>
                    {r.prix_fcfa && <span className="font-bold text-neutral-900">{r.prix_fcfa} FCFA</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
