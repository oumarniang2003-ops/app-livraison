"use client";

import { useState } from "react";
import Link from "next/link";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";
import {
  IconPlus,
  IconPackage,
  IconMapPin,
  IconNavigation,
  IconBike,
  IconChevronRight,
  IconClock,
  IconCheckCircle,
} from "@/components/Icons";

export type DeliveryItem = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  destinataire_nom: string;
  prix_fcfa: number | null;
  created_at: string;
  livreur_nom: string | null;
};

export default function ClientDashboardView({ initialRows }: { initialRows: DeliveryItem[] }) {
  const [filter, setFilter] = useState<"tous" | "en_cours" | "livres">("tous");

  const enCoursList = initialRows.filter((r) => ["en_attente", "assignee", "colis_recupere", "en_livraison"].includes(r.statut));
  const livresList = initialRows.filter((r) => r.statut === "livre");

  const filtered = filter === "en_cours" ? enCoursList : filter === "livres" ? livresList : initialRows;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">Mes livraisons</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Suivez en direct l&apos;acheminement de vos colis à Dakar
          </p>
        </div>
        <Link
          href="/app/nouvelle"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition active:scale-95"
        >
          <IconPlus className="w-4 h-4" />
          <span>Nouvelle livraison</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setFilter("tous")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            filter === "tous"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80"
          }`}
        >
          <span>Toutes</span>
          <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${filter === "tous" ? "bg-neutral-800 text-neutral-200" : "bg-neutral-100 text-neutral-600"}`}>
            {initialRows.length}
          </span>
        </button>

        <button
          onClick={() => setFilter("en_cours")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            filter === "en_cours"
              ? "bg-orange-500 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>En cours</span>
          <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${filter === "en_cours" ? "bg-orange-600 text-white" : "bg-neutral-100 text-neutral-600"}`}>
            {enCoursList.length}
          </span>
        </button>

        <button
          onClick={() => setFilter("livres")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            filter === "livres"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80"
          }`}
        >
          <span>Livrées</span>
          <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${filter === "livres" ? "bg-emerald-700 text-emerald-100" : "bg-neutral-100 text-neutral-600"}`}>
            {livresList.length}
          </span>
        </button>
      </div>

      {/* Delivery Cards List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-10 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center mb-4 shadow-inner">
            <IconPackage className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">Aucune livraison trouvée</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {filter === "en_cours"
              ? "Vous n'avez aucune course active en ce moment."
              : filter === "livres"
              ? "Vos colis livrés avec succès s'afficheront ici."
              : "Vous n'avez pas encore envoyé de colis. Commandez votre première course en quelques clics."}
          </p>
          <div className="mt-5">
            <Link
              href="/app/nouvelle"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition shadow-sm"
            >
              <IconPlus className="w-4 h-4" />
              <span>Créer une demande</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-3.5">
          {filtered.map((r) => {
            const isActive = ["en_attente", "assignee", "colis_recupere", "en_livraison"].includes(r.statut);
            return (
              <Link
                key={r.id}
                href={`/app/livraisons/${r.id}`}
                className="group block bg-white rounded-2xl border border-neutral-200/80 p-5 hover:border-orange-300 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                        STATUT_COLOR[r.statut] || "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
                      <span>{STATUT_LABEL[r.statut] || r.statut}</span>
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {new Date(r.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {r.prix_fcfa ? (
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900">
                      {r.prix_fcfa.toLocaleString("fr-FR")} FCFA
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-400 font-medium italic">Tarif en attente</span>
                  )}
                </div>

                {/* Route Visualizer */}
                <div className="relative pl-6 space-y-2 py-1 my-2">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-neutral-200 border-l border-dashed border-neutral-300" />

                  <div className="relative flex items-center gap-2">
                    <span className="absolute -left-6 w-3.5 h-3.5 rounded-full bg-neutral-900 border-2 border-white shadow-xs" />
                    <span className="text-xs font-semibold text-neutral-800 line-clamp-1">
                      {r.adresse_depart}
                    </span>
                  </div>

                  <div className="relative flex items-center gap-2">
                    <span className="absolute -left-6 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-xs" />
                    <span className="text-xs font-semibold text-neutral-800 line-clamp-1">
                      {r.adresse_arrivee}
                    </span>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span>
                      Pour <strong className="text-neutral-700 font-semibold">{r.destinataire_nom}</strong>
                    </span>
                    {r.livreur_nom && (
                      <span className="inline-flex items-center gap-1 font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">
                        <IconBike className="w-3.5 h-3.5 text-orange-600" />
                        <span>{r.livreur_nom}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-orange-600 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Suivre</span>
                    <IconChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
