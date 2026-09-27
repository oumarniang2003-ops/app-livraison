"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";
import {
  IconBike,
  IconPhone,
  IconWhatsApp,
  IconMapPin,
  IconNavigation,
  IconPackage,
  IconCheckCircle,
  IconClock,
  IconShield,
} from "@/components/Icons";

const MapSuivi = dynamic(() => import("@/components/MapSuivi"), { ssr: false });

export type Livraison = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  depart_lat: number | null;
  depart_lng: number | null;
  arrivee_lat: number | null;
  arrivee_lng: number | null;
  destinataire_nom: string;
  destinataire_telephone: string;
  prix_fcfa: number | null;
  mode_paiement: string;
  livreur_nom: string | null;
  livreur_telephone: string | null;
  livreur_plaque?: string | null;
  livreur_modele?: string | null;
};

type Evenement = {
  statut: string;
  created_at: string;
};

type Position = {
  lat: number;
  lng: number;
  updated_at: string;
} | null;

const STEPS = [
  { key: "en_attente", label: "Demande créée" },
  { key: "assignee", label: "Livreur assigné" },
  { key: "colis_recupere", label: "Colis récupéré" },
  { key: "en_livraison", label: "En livraison" },
  { key: "livre", label: "Livré" },
];

function getStepIndex(statut: string): number {
  if (statut === "annule") return -1;
  const idx = STEPS.findIndex((s) => s.key === statut);
  return idx >= 0 ? idx : 0;
}

export default function SuiviLivraison({
  livraisonId,
  livraisonInitiale,
  role,
}: {
  livraisonId: string;
  livraisonInitiale: Livraison;
  role: "client" | "livreur";
}) {
  const router = useRouter();
  const [livraison, setLivraison] = useState<Livraison>(livraisonInitiale);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [position, setPosition] = useState<Position>(null);
  const [maintenant, setMaintenant] = useState(() => Date.now());

  useEffect(() => {
    const tick = setInterval(() => setMaintenant(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let annule = false;
    async function poll() {
      const res = await fetch(`/api/livraisons/${livraisonId}`);
      if (!res.ok || annule) return;
      const data = await res.json();
      setLivraison(data.livraison);
      setEvenements(data.evenements);
      setPosition(data.position);
    }
    poll();
    const interval = setInterval(poll, 4000);
    return () => {
      annule = true;
      clearInterval(interval);
    };
  }, [livraisonId]);

  async function annuler() {
    if (!confirm("Voulez-vous vraiment annuler cette livraison ?")) return;
    await fetch(`/api/livraisons/${livraisonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "annuler" }),
    });
    router.refresh();
  }

  const currentStep = getStepIndex(livraison.statut);
  const isEnCours = ["assignee", "colis_recupere", "en_livraison"].includes(livraison.statut);
  const cleanPhone = livraison.livreur_telephone?.replace(/\s+/g, "") || "";
  const waPhone = cleanPhone.startsWith("221") ? cleanPhone : `221${cleanPhone}`;

  return (
    <div className="space-y-6">
      {/* Live Status Hero Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                STATUT_COLOR[livraison.statut] || "bg-neutral-100 text-neutral-800"
              }`}
            >
              {isEnCours && <span className="w-2 h-2 rounded-full bg-current animate-ping" />}
              <span>{STATUT_LABEL[livraison.statut] || livraison.statut}</span>
            </span>
            <span className="text-xs text-neutral-400 font-mono">#YG-{livraison.id.slice(0, 8)}</span>
          </div>

          {livraison.prix_fcfa && (
            <div className="text-right">
              <span className="text-xs text-neutral-400 block font-medium">Prix convenu</span>
              <span className="text-base font-black text-neutral-900">
                {livraison.prix_fcfa.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          )}
        </div>

        {/* Visual Progress Stepper */}
        {livraison.statut !== "annule" && (
          <div className="my-6 pt-2">
            <div className="relative flex items-center justify-between">
              {/* Progress track background */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-100 rounded-full z-0" />
              {/* Active progress fill */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500 z-0"
                style={{ width: `${Math.max(0, (currentStep / (STEPS.length - 1)) * 100)}%` }}
              />

              {STEPS.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCurrent
                          ? "bg-orange-500 text-white ring-4 ring-orange-100 scale-110"
                          : isPassed
                          ? "bg-neutral-900 text-white"
                          : "bg-white text-neutral-400 border-2 border-neutral-200"
                      }`}
                    >
                      {isPassed && !isCurrent ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`hidden sm:block text-[11px] font-semibold mt-2 text-center whitespace-nowrap ${
                        isCurrent ? "text-orange-600 font-bold" : isPassed ? "text-neutral-800" : "text-neutral-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Route Details */}
        <div className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-100 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
              D
            </span>
            <div>
              <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider block">
                Point de ramassage
              </span>
              <p className="text-xs sm:text-sm font-semibold text-neutral-800">{livraison.adresse_depart}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
              A
            </span>
            <div>
              <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider block">
                Destination de livraison
              </span>
              <p className="text-xs sm:text-sm font-semibold text-neutral-800">{livraison.adresse_arrivee}</p>
            </div>
          </div>
        </div>

        {/* Recipient & Payment info */}
        <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-neutral-400 block font-medium">Destinataire</span>
            <span className="font-bold text-neutral-800">{livraison.destinataire_nom}</span>
            <span className="text-neutral-500 block">{livraison.destinataire_telephone}</span>
          </div>
          <div>
            <span className="text-neutral-400 block font-medium">Paiement</span>
            <span className="font-bold text-neutral-800 capitalize">
              {livraison.mode_paiement === "cash"
                ? "Espèces"
                : livraison.mode_paiement === "wave"
                ? "Wave"
                : "Orange Money"}
            </span>
          </div>
        </div>
      </div>

      {/* Driver Card with Security / Plate verification */}
      {livraison.livreur_nom && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-base font-bold shadow-md shadow-orange-500/20">
                <IconBike className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <IconShield className="w-3 h-3 text-emerald-600" />
                    <span>Coursier Certifié Yeggo</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 mt-0.5">{livraison.livreur_nom}</h3>
                <p className="text-xs text-neutral-500">{livraison.livreur_telephone}</p>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            {livraison.livreur_telephone && (
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs transition active:scale-95"
                >
                  <IconPhone className="w-4 h-4" />
                  <span>Appeler</span>
                </a>
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
                >
                  <IconWhatsApp className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Vehicle & Plate Info for security */}
          {livraison.livreur_plaque && (
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-neutral-600">
                <span className="font-semibold">Véhicule :</span>
                <span>{livraison.livreur_modele || "Moto"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400 font-medium">Plaque :</span>
                <span className="font-bold text-neutral-900 uppercase font-mono px-2 py-0.5 bg-white border border-neutral-200 rounded-md">
                  {livraison.livreur_plaque}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Map Card */}
      {(position || livraison.depart_lat || livraison.arrivee_lat) && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <IconNavigation className="w-4 h-4 text-orange-500" />
              <span>Suivi GPS en direct</span>
            </div>
            {position && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Signal GPS il y a {Math.max(0, Math.round((maintenant - new Date(position.updated_at).getTime()) / 1000))}s
                </span>
              </span>
            )}
          </div>

          <MapSuivi
            depart={
              livraison.depart_lat && livraison.depart_lng
                ? { lat: livraison.depart_lat, lng: livraison.depart_lng }
                : null
            }
            arrivee={
              livraison.arrivee_lat && livraison.arrivee_lng
                ? { lat: livraison.arrivee_lat, lng: livraison.arrivee_lng }
                : null
            }
            position={position ? { lat: position.lat, lng: position.lng } : null}
          />

          {position && (
            <div className="pt-2 flex items-center justify-end">
              <a
                href={`https://www.google.com/maps?q=${position.lat},${position.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>Ouvrir la position dans Google Maps</span>
                <span>→</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* History timeline */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-900">
          <IconClock className="w-4 h-4 text-neutral-500" />
          <span>Journal d&apos;activité</span>
        </div>

        <div className="space-y-3 pl-2">
          {evenements.map((e, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 ring-4 ring-orange-100" />
              <span className="font-semibold text-neutral-800 flex-1">{STATUT_LABEL[e.statut] || e.statut}</span>
              <span className="text-neutral-400 font-mono">
                {new Date(e.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel button */}
      {role === "client" && ["en_attente", "assignee"].includes(livraison.statut) && (
        <div className="text-center pt-2">
          <button
            onClick={annuler}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition"
          >
            Annuler cette demande de livraison
          </button>
        </div>
      )}
    </div>
  );
}
