"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBike, IconArrowRight } from "@/components/Icons";

type Livreur = { id: string; nom: string; zone: string | null };

export default function AdminAssignation({
  livraisonId,
  livreurs,
  prixSuggere,
}: {
  livraisonId: string;
  livreurs: Livreur[];
  prixSuggere: number | null;
}) {
  const router = useRouter();
  const [livreurId, setLivreurId] = useState(livreurs[0]?.id ?? "");
  const [prix, setPrix] = useState(prixSuggere ? String(prixSuggere) : "");
  const [loading, setLoading] = useState(false);

  async function assigner() {
    if (!livreurId) return;
    setLoading(true);
    try {
      await fetch(`/api/livraisons/${livraisonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assigner",
          livreur_id: livreurId,
          prix_fcfa: prix ? Number(prix) : undefined,
        }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (livreurs.length === 0) {
    return (
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium">
        Aucun livreur actif disponible. Veuillez en ajouter un dans l&apos;onglet &quot;Livreurs&quot;.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-2">
      <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
        <select
          value={livreurId}
          onChange={(e) => setLivreurId(e.target.value)}
          className="w-full bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          {livreurs.map((l) => (
            <option key={l.id} value={l.id}>
              🛵 {l.nom} {l.zone ? `(${l.zone})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="relative">
          <input
            type="number"
            placeholder="Prix FCFA"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            className="w-32 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        {prixSuggere && (
          <button
            type="button"
            onClick={() => setPrix(String(prixSuggere))}
            className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition"
            title="Appliquer le prix calculé"
          >
            Suggéré: {prixSuggere} F
          </button>
        )}
      </div>

      <button
        onClick={assigner}
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
      >
        {loading ? (
          <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>Assigner</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </div>
  );
}
