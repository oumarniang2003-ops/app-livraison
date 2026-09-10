"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Livreur = { id: string; nom: string; zone: string | null };

export default function AdminAssignation({
  livraisonId,
  livreurs,
}: {
  livraisonId: string;
  livreurs: Livreur[];
}) {
  const router = useRouter();
  const [livreurId, setLivreurId] = useState(livreurs[0]?.id ?? "");
  const [prix, setPrix] = useState("");
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
    return <p className="text-xs text-neutral-400">Aucun livreur actif. Créez-en un d&apos;abord.</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={livreurId}
        onChange={(e) => setLivreurId(e.target.value)}
        className="border border-neutral-300 rounded-lg px-2 py-1.5 text-sm"
      >
        {livreurs.map((l) => (
          <option key={l.id} value={l.id}>
            {l.nom}
            {l.zone ? ` (${l.zone})` : ""}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Prix FCFA"
        value={prix}
        onChange={(e) => setPrix(e.target.value)}
        className="border border-neutral-300 rounded-lg px-2 py-1.5 text-sm w-28"
      />
      <button
        onClick={assigner}
        disabled={loading}
        className="bg-neutral-900 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-neutral-700 transition disabled:opacity-50"
      >
        {loading ? "..." : "Assigner"}
      </button>
    </div>
  );
}
