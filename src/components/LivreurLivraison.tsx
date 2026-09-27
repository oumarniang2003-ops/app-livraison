"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";
import {
  IconPhone,
  IconWhatsApp,
  IconNavigation,
  IconCheckCircle,
  IconBike,
  IconPackage,
  IconMapPin,
} from "@/components/Icons";

export type Livraison = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  depart_lat: number | null;
  depart_lng: number | null;
  arrivee_lat: number | null;
  arrivee_lng: number | null;
  description: string | null;
  destinataire_nom: string;
  destinataire_telephone: string;
  prix_fcfa: number | null;
  mode_paiement: string;
};

const ACTION_CONFIG: Record<
  string,
  { label: string; icon: string; bgClass: string; desc: string }
> = {
  assignee: {
    label: "J'AI RÉCUPÉRÉ LE COLIS",
    icon: "📦",
    bgClass: "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25",
    desc: "Appuyez une fois le colis en votre possession au point de départ",
  },
  colis_recupere: {
    label: "JE SUIS EN ROUTE VERS LE CLIENT",
    icon: "🛵",
    bgClass: "from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25",
    desc: "Appuyez lorsque vous démarrez vers l'adresse de destination",
  },
  en_livraison: {
    label: "COLIS LIVRÉ & TERMINÉ",
    icon: "✅",
    bgClass: "from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-emerald-500/25",
    desc: "Appuyez une fois le colis remis en main propre au destinataire",
  },
};

export default function LivreurLivraison({ livraison: initiale }: { livraison: Livraison }) {
  const router = useRouter();
  const [livraison, setLivraison] = useState(initiale);
  const [loading, setLoading] = useState(false);
  const [suiviActif, setSuiviActif] = useState(false);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    const enCours = !["livre", "annule"].includes(livraison.statut);
    if (!enCours || !("geolocation" in navigator)) return;

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setSuiviActif(true);
        fetch("/api/position", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        }).catch(() => {});
      },
      () => setSuiviActif(false),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [livraison.statut]);

  async function avancer() {
    setLoading(true);
    try {
      const res = await fetch(`/api/livraisons/${livraison.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "avancer" }),
      });
      const data = await res.json();
      if (res.ok) {
        setLivraison((l) => ({ ...l, statut: data.statut }));
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  const actionInfo = ACTION_CONFIG[livraison.statut];
  const cleanPhone = livraison.destinataire_telephone.replace(/\s+/g, "");
  const waPhone = cleanPhone.startsWith("221") ? cleanPhone : `221${cleanPhone}`;

  // Target coordinates for GPS navigation
  const targetLat =
    livraison.statut === "assignee"
      ? livraison.depart_lat
      : livraison.arrivee_lat;
  const targetLng =
    livraison.statut === "assignee"
      ? livraison.depart_lng
      : livraison.arrivee_lng;
  const targetQuery = targetLat && targetLng
    ? `${targetLat},${targetLng}`
    : encodeURIComponent(livraison.statut === "assignee" ? livraison.adresse_depart : livraison.adresse_arrivee);

  return (
    <div className="space-y-5">
      {/* GPS Broadcaster Status Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
              suiviActif ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-400"
            }`}
          >
            <IconNavigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-900">Partage de position GPS</span>
              {suiviActif ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-neutral-300" />
              )}
            </div>
            <p className="text-[11px] text-neutral-500">
              {suiviActif ? "Signal en direct transmis au client" : "En attente de localisation GPS..."}
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
            suiviActif ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {suiviActif ? "Actif" : "En veille"}
        </span>
      </div>

      {/* Main Delivery Task Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              STATUT_COLOR[livraison.statut] || "bg-neutral-100 text-neutral-700"
            }`}
          >
            {STATUT_LABEL[livraison.statut] || livraison.statut}
          </span>
          {livraison.prix_fcfa && (
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block font-medium">À encaisser</span>
              <span className="text-sm font-black text-neutral-900">
                {livraison.prix_fcfa.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          )}
        </div>

        {/* Addresses with Highlight for current step */}
        <div className="space-y-3">
          <div
            className={`p-3.5 rounded-2xl border transition ${
              livraison.statut === "assignee"
                ? "bg-orange-50/80 border-orange-300 ring-2 ring-orange-500/20"
                : "bg-neutral-50 border-neutral-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                1. Récupération (Départ)
              </span>
              {livraison.statut === "assignee" && (
                <span className="text-[10px] font-bold text-orange-600 bg-white px-2 py-0.5 rounded-md shadow-xs">
                  Étape actuelle
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-bold text-neutral-900">{livraison.adresse_depart}</p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition ${
              ["colis_recupere", "en_livraison"].includes(livraison.statut)
                ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20"
                : "bg-neutral-50 border-neutral-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                2. Remise (Destination)
              </span>
              {["colis_recupere", "en_livraison"].includes(livraison.statut) && (
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md shadow-xs">
                  Étape actuelle
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-bold text-neutral-900">{livraison.adresse_arrivee}</p>
          </div>
        </div>

        {/* GPS Navigation Launch Button */}
        {actionInfo && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${targetQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm transition active:scale-98"
          >
            <IconNavigation className="w-4 h-4 text-orange-400" />
            <span>Ouvrir l&apos;itinéraire GPS (Google Maps)</span>
          </a>
        )}

        {livraison.description && (
          <div className="text-xs bg-neutral-50 rounded-xl p-3 border border-neutral-100">
            <span className="text-neutral-400 block font-medium">Contenu du colis :</span>
            <span className="font-semibold text-neutral-800">{livraison.description}</span>
          </div>
        )}
      </div>

      {/* Recipient Contact Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Contact Destinataire
            </span>
            <h4 className="text-sm font-black text-neutral-900">{livraison.destinataire_nom}</h4>
            <p className="text-xs text-neutral-500">{livraison.destinataire_telephone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition active:scale-95 shadow-xs"
          >
            <IconPhone className="w-4 h-4" />
            <span>Appeler</span>
          </a>
          <a
            href={`https://wa.me/${waPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition active:scale-95 shadow-xs"
          >
            <IconWhatsApp className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Big Ergonomic Step Button (Mobile-First) */}
      {actionInfo && (
        <div className="sticky bottom-4 z-30 pt-2">
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-3xl shadow-xl border border-neutral-200/80">
            <button
              onClick={avancer}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r text-white font-extrabold text-sm sm:text-base shadow-lg transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-3 ${actionInfo.bgClass}`}
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-lg">{actionInfo.icon}</span>
                  <span>{actionInfo.label}</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-neutral-500 text-center mt-1.5">{actionInfo.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}
