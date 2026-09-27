"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconBike,
  IconArrowRight,
  IconUser,
  IconShield,
  IconPackage,
  IconCheckCircle,
} from "@/components/Icons";

const ZONES_DAKAR = [
  "Plateau / Médina",
  "Almadies / Ngor / Ouakam",
  "Sacré-Cœur / Mermoz / Fann",
  "Maristes / Hann",
  "Grand Yoff / Parcelles / Nord Foire",
  "Guédiawaye / Pikine",
  "Toute la région de Dakar",
];

export default function InscriptionPage() {
  const router = useRouter();
  const [role, setRole] = useState<"client" | "livreur">("client");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  // Spécifique livreur
  const [cniNumero, setCniNumero] = useState("");
  const [permisNumero, setPermisNumero] = useState("");
  const [plaqueMoto, setPlaqueMoto] = useState("");
  const [modeleMoto, setModeleMoto] = useState("");
  const [zone, setZone] = useState(ZONES_DAKAR[0]);

  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      const payload = {
        role,
        nom,
        telephone,
        password,
        ...(role === "livreur"
          ? {
              cni_numero: cniNumero,
              permis_numero: permisNumero,
              plaque_moto: plaqueMoto,
              modele_moto: modeleMoto,
              zone,
            }
          : {}),
      };

      const res = await fetch("/api/auth/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Erreur lors de l'inscription");
        return;
      }
      if (role === "livreur") {
        router.push("/livreur");
      } else {
        router.push("/app");
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden bg-[#F8FAFC]">
      {/* Background glow decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <IconBike className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-neutral-900">Yeggo</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Créer un compte</h1>
        <p className="text-xs text-neutral-500 mt-0.5">Rejoignez le réseau de livraison sécurisé à Dakar</p>
      </div>

      {/* Card Form */}
      <div className="w-full max-w-lg bg-white rounded-3xl border border-neutral-200/90 shadow-xl shadow-neutral-200/50 p-6 sm:p-8">
        {/* Role Switcher */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
            Vous souhaitez vous inscrire en tant que :
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                role === "client"
                  ? "bg-orange-50 border-orange-500 ring-2 ring-orange-500/20"
                  : "bg-white hover:bg-neutral-50 border-neutral-200"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <IconPackage className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Client / Vendeur</div>
                <div className="text-[10px] text-neutral-500">Expédier des colis</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("livreur")}
              className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                role === "livreur"
                  ? "bg-orange-50 border-orange-500 ring-2 ring-orange-500/20"
                  : "bg-white hover:bg-neutral-50 border-neutral-200"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <IconBike className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Livreur / Coursier</div>
                <div className="text-[10px] text-neutral-500">Effectuer des courses</div>
              </div>
            </button>
          </div>
        </div>

        {/* Security badge note */}
        {role === "livreur" && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
            <IconShield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Vérification de sécurité obligatoire</strong>
              <span>
                Pour la protection des clients et des commerçants, votre CNI, Permis et Plaque moto seront vérifiés par
                notre équipe avant l&apos;attribution des premières courses.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder={role === "livreur" ? "Ex: Modou Fall" : "Ex: Awa Ndiaye"}
              className="w-full px-4 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
              Numéro de téléphone (Sénégal)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-medium border-r border-neutral-200 pr-2.5 my-2">
                <span className="mr-1">🇸🇳</span> +221
              </div>
              <input
                type="tel"
                required
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="77 123 45 67"
                className="w-full pl-24 pr-4 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (6 car. min)"
              className="w-full px-4 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          {/* Livreur Document & Vehicle Inputs */}
          {role === "livreur" && (
            <div className="pt-2 border-t border-neutral-100 space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                <IconShield className="w-4 h-4 text-orange-500" />
                <span>Pièces d&apos;identité et véhicule</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Numéro CNI (Carte d&apos;Identité) *
                  </label>
                  <input
                    required
                    value={cniNumero}
                    onChange={(e) => setCniNumero(e.target.value)}
                    placeholder="Ex: 1 759 1995 01234"
                    className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Numéro de Permis de conduire *
                  </label>
                  <input
                    required
                    value={permisNumero}
                    onChange={(e) => setPermisNumero(e.target.value)}
                    placeholder="Ex: SN-DK-2021-8932"
                    className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Plaque d&apos;immatriculation moto *
                  </label>
                  <input
                    required
                    value={plaqueMoto}
                    onChange={(e) => setPlaqueMoto(e.target.value)}
                    placeholder="Ex: DK-4589-AB"
                    className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Modèle / Marque moto (facultatif)
                  </label>
                  <input
                    value={modeleMoto}
                    onChange={(e) => setModeleMoto(e.target.value)}
                    placeholder="Ex: TVS HLX / Boxer / Yamaha"
                    className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Zone principale d&apos;activité à Dakar
                </label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  {ZONES_DAKAR.map((z) => (
                    <option key={z} value={z}>
                      📍 {z}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {erreur && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>{erreur}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {role === "livreur" ? "Soumettre mon dossier coursier" : "Créer mon compte"}
                </span>
                <IconArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500">
            Vous avez déjà un compte ?{" "}
            <Link href="/connexion" className="text-orange-600 font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
