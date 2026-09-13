"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import NavBar from "@/components/NavBar";

const PickerCarte = dynamic(() => import("@/components/PickerCarte"), { ssr: false });

type Point = { lat: number; lng: number };

export default function NouvelleLivraisonPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    adresse_depart: "",
    adresse_arrivee: "",
    description: "",
    destinataire_nom: "",
    destinataire_telephone: "",
    mode_paiement: "cash",
    notes: "",
  });
  const [pointDepart, setPointDepart] = useState<Point | null>(null);
  const [pointArrivee, setPointArrivee] = useState<Point | null>(null);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onPointChange(champ: "depart" | "arrivee", point: Point) {
    if (champ === "depart") setPointDepart(point);
    else setPointArrivee(point);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      const body = {
        ...form,
        ...(pointDepart ? { depart_lat: pointDepart.lat, depart_lng: pointDepart.lng } : {}),
        ...(pointArrivee ? { arrivee_lat: pointArrivee.lat, arrivee_lng: pointArrivee.lng } : {}),
      };
      const res = await fetch("/api/livraisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Erreur lors de la création");
        return;
      }
      router.push(`/app/livraisons/${data.id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <NavBar titre="Nouvelle livraison" home="/app" />
      <main className="max-w-lg mx-auto w-full px-6 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-6">Envoyer un colis</h1>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-neutral-100 p-6 grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Adresse de récupération</label>
            <input
              required
              value={form.adresse_depart}
              onChange={(e) => update("adresse_depart", e.target.value)}
              placeholder="Ex : Boutique X, Sacré-Cœur 3, près de la pharmacie"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Adresse de livraison</label>
            <input
              required
              value={form.adresse_arrivee}
              onChange={(e) => update("adresse_arrivee", e.target.value)}
              placeholder="Ex : Almadies, Cité Djily Mbaye, villa 12"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Pointer les emplacements sur la carte <span className="text-neutral-400 font-normal">(recommandé)</span>
            </label>
            <PickerCarte depart={pointDepart} arrivee={pointArrivee} onChange={onPointChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom du destinataire</label>
              <input
                required
                value={form.destinataire_nom}
                onChange={(e) => update("destinataire_nom", e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone du destinataire</label>
              <input
                required
                type="tel"
                value={form.destinataire_telephone}
                onChange={(e) => update("destinataire_telephone", e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description du colis (facultatif)</label>
            <input
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Ex : sac à main, documents, vêtements..."
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mode de paiement</label>
            <select
              value={form.mode_paiement}
              onChange={(e) => update("mode_paiement", e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="cash">Espèces à la livraison</option>
              <option value="wave">Wave</option>
              <option value="orange_money">Orange Money</option>
            </select>
          </div>

          {erreur && <p className="text-sm text-red-600">{erreur}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white rounded-lg py-2.5 font-medium hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Confirmer la demande"}
          </button>
          <p className="text-xs text-neutral-400 text-center">
            Le prix est confirmé par notre équipe au moment de l&apos;attribution du livreur.
          </p>
        </form>
      </main>
    </div>
  );
}
