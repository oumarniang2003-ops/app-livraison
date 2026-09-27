"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBike, IconPlus, IconArrowRight } from "@/components/Icons";

export default function CreerLivreur() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [zone, setZone] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/livreurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, telephone, password, zone: zone || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Erreur lors de la création");
        return;
      }
      setNom("");
      setTelephone("");
      setPassword("");
      setZone("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="grid sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Nom du coursier</label>
          <input
            required
            placeholder="Ex: Modou Fall"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Téléphone (Sénégal)</label>
          <input
            required
            type="tel"
            placeholder="77 123 45 67"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Mot de passe temporaire</label>
          <input
            required
            type="password"
            placeholder="••••••••"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Zone de prédilection (facultatif)</label>
          <input
            placeholder="Ex: Plateau / Almadies / Médina"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      {erreur && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
          {erreur}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <IconPlus className="w-4 h-4" />
            <span>Créer le compte coursier</span>
          </>
        )}
      </button>
    </form>
  );
}
