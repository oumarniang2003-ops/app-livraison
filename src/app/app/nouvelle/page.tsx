"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import NavBar from "@/components/NavBar";
import {
  IconMapPin,
  IconUser,
  IconPackage,
  IconArrowRight,
  IconSparkles,
} from "@/components/Icons";

const PickerCarte = dynamic(() => import("@/components/PickerCarte"), { ssr: false });

type Point = { lat: number; lng: number };

const QUARTIERS_DAKAR = [
  "Almadies",
  "Plateau",
  "Sacré-Cœur",
  "Mermoz",
  "Ouakam",
  "Maristes",
  "Médina",
  "Yoff",
  "Point E",
  "Fann-Résidence",
  "Grand Yoff",
  "Liberté 6",
];

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

  function addQuartierTo(target: "adresse_depart" | "adresse_arrivee", quartier: string) {
    setForm((prev) => {
      const current = prev[target];
      if (!current) return { ...prev, [target]: quartier };
      if (current.includes(quartier)) return prev;
      return { ...prev, [target]: `${current}, ${quartier}` };
    });
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <NavBar titre="Nouvelle livraison" home="/app" />

      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-neutral-950 tracking-tight">Envoyer un colis</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Indiquez les points de départ et d&apos;arrivée de votre livraison
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Section 1: Adresses */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-sm font-bold text-neutral-900">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <IconMapPin className="w-4 h-4" />
              </div>
              <span>1. Adresses & Repères</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Adresse de récupération (Départ)
              </label>
              <input
                required
                value={form.adresse_depart}
                onChange={(e) => update("adresse_depart", e.target.value)}
                placeholder="Ex : Boutique X, Sacré-Cœur 3, près de la pharmacie"
                className="w-full px-3.5 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
              {/* Dakar Quick chips */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                <span className="text-neutral-400 font-medium whitespace-nowrap">Quartiers :</span>
                {QUARTIERS_DAKAR.slice(0, 6).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => addQuartierTo("adresse_depart", q)}
                    className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-orange-50 hover:text-orange-700 text-neutral-600 transition whitespace-nowrap"
                  >
                    + {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Adresse de livraison (Arrivée)
              </label>
              <input
                required
                value={form.adresse_arrivee}
                onChange={(e) => update("adresse_arrivee", e.target.value)}
                placeholder="Ex : Almadies, Cité Djily Mbaye, villa 12"
                className="w-full px-3.5 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
              {/* Dakar Quick chips */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                <span className="text-neutral-400 font-medium whitespace-nowrap">Quartiers :</span>
                {QUARTIERS_DAKAR.slice(6, 12).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => addQuartierTo("adresse_arrivee", q)}
                    className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-orange-50 hover:text-orange-700 text-neutral-600 transition whitespace-nowrap"
                  >
                    + {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                Pointage précis sur la carte Dakar <span className="text-orange-600 font-bold">(Recommandé)</span>
              </label>
              <PickerCarte depart={pointDepart} arrivee={pointArrivee} onChange={onPointChange} />
            </div>
          </div>

          {/* Section 2: Destinataire */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-sm font-bold text-neutral-900">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <IconUser className="w-4 h-4" />
              </div>
              <span>2. Destinataire</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Nom du destinataire
                </label>
                <input
                  required
                  value={form.destinataire_nom}
                  onChange={(e) => update("destinataire_nom", e.target.value)}
                  placeholder="Ex : Fatou Sow"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Téléphone du destinataire
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-medium border-r border-neutral-200 pr-2 my-2">
                    <span>🇸🇳 +221</span>
                  </div>
                  <input
                    required
                    type="tel"
                    value={form.destinataire_telephone}
                    onChange={(e) => update("destinataire_telephone", e.target.value)}
                    placeholder="77 000 00 00"
                    className="w-full pl-22 pr-3.5 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Détails du colis & Paiement */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-sm font-bold text-neutral-900">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <IconPackage className="w-4 h-4" />
              </div>
              <span>3. Colis & Mode de paiement</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Description du colis (facultatif)
              </label>
              <input
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Ex : Sac à dos, documents urgents, vêtements, repas..."
                className="w-full px-3.5 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                Mode de paiement
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "cash", label: "Espèces", desc: "À la livraison", icon: "💵" },
                  { id: "wave", label: "Wave", desc: "Mobile Money", icon: "🌊" },
                  { id: "orange_money", label: "Orange Money", desc: "Mobile Money", icon: "🍊" },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => update("mode_paiement", pm.id)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      form.mode_paiement === pm.id
                        ? "bg-orange-50/70 border-orange-500 ring-2 ring-orange-500/20"
                        : "bg-white hover:bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <div className="text-xl mb-1">{pm.icon}</div>
                    <div className="text-xs font-bold text-neutral-900">{pm.label}</div>
                    <div className="text-[10px] text-neutral-500">{pm.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {erreur && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {erreur}
            </div>
          )}

          {/* Submit Action */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Confirmer la demande de livraison</span>
                  <IconArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-[11px] text-neutral-400 text-center">
              Le tarif est validé par notre équipe lors de l&apos;attribution du coursier le plus proche.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
