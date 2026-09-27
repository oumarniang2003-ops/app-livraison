import Link from "next/link";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { ensureSchema } from "@/lib/ensureSchema";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";
import NavBar from "@/components/NavBar";
import {
  IconBike,
  IconChevronRight,
  IconPackage,
  IconNavigation,
  IconShield,
  IconClock,
  IconCheckCircle,
} from "@/components/Icons";

type Row = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  destinataire_nom: string;
  prix_fcfa: number | null;
  created_at: string;
};

type UserProfile = {
  id: string;
  nom: string;
  telephone: string;
  actif: boolean;
  statut_validation: string;
  cni_numero: string | null;
  permis_numero: string | null;
  plaque_moto: string | null;
  modele_moto: string | null;
  zone: string | null;
};

export default async function LivreurDashboard() {
  await ensureSchema();
  const session = await getSession();

  const [userRes, coursesRes] = await Promise.all([
    query<UserProfile>(
      `select id, nom, telephone, actif, statut_validation, cni_numero, permis_numero, plaque_moto, modele_moto, zone
       from users where id = $1`,
      [session!.userId]
    ),
    query<Row>(
      `select id, statut, adresse_depart, adresse_arrivee, destinataire_nom, prix_fcfa, created_at
       from livraisons
       where livreur_id = $1 and statut not in ('livre', 'annule')
       order by created_at asc`,
      [session!.userId]
    ),
  ]);

  const user = userRes.rows[0];
  const courses = coursesRes.rows;
  const isEnAttente = user && (user.statut_validation === "en_attente" || !user.actif);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <NavBar titre="Espace Livreur" home="/livreur" />
      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-6">
        {/* Verification Alert / Pending Banner */}
        {isEnAttente ? (
          <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <IconShield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-neutral-900">Dossier en cours de vérification</h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    En attente
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Bienvenue <strong className="text-neutral-800">{user.nom}</strong> ! Notre équipe de sécurité contrôle
                  vos informations.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5 text-xs">
              <div className="font-semibold text-neutral-700 pb-1 border-b border-neutral-200/70">
                Informations enregistrées pour validation :
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-neutral-600">
                <div>
                  <span className="text-neutral-400 block text-[11px]">N° Carte d&apos;Identité (CNI) :</span>
                  <span className="font-bold text-neutral-800">{user.cni_numero || "Non renseigné"}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">N° Permis de conduire :</span>
                  <span className="font-bold text-neutral-800">{user.permis_numero || "Non renseigné"}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Plaque d&apos;immatriculation moto :</span>
                  <span className="font-bold text-neutral-900 uppercase font-mono">
                    {user.plaque_moto || "Non renseigné"}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Véhicule & Zone :</span>
                  <span className="font-bold text-neutral-800">
                    {user.modele_moto || "Moto"} {user.zone ? `· ${user.zone}` : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-100">
              <IconClock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                L&apos;activation prend généralement moins de 2 heures. Vous pourrez accepter et réaliser des courses dès que
                l&apos;administrateur aura validé votre dossier.
              </span>
            </div>
          </div>
        ) : (
          /* Active Driver Cockpit */
          <>
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                  <IconBike className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-black text-neutral-950">Cockpit Coursier</h1>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Vérifié 🛡️
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {courses.length} course{courses.length > 1 ? "s" : ""} assignée{courses.length > 1 ? "s" : ""} ·{" "}
                    <span className="font-semibold text-neutral-700 uppercase">{user?.plaque_moto}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>En service</span>
              </div>
            </div>

            {/* Empty State */}
            {courses.length === 0 && (
              <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-3xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center mb-4">
                  <IconPackage className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Aucune course pour l&apos;instant</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  Gardez l&apos;application ouverte. Dès qu&apos;une nouvelle livraison vous est attribuée, elle apparaîtra ici.
                </p>
              </div>
            )}

            {/* Course Cards */}
            <div className="grid gap-3.5">
              {courses.map((r) => (
                <Link
                  key={r.id}
                  href={`/livreur/livraisons/${r.id}`}
                  className="group block bg-white rounded-3xl border border-neutral-200/80 p-5 hover:border-orange-300 hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between mb-3">
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

                  {/* Route */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-neutral-400 shrink-0">Départ :</span>
                      <span className="font-semibold text-neutral-800">{r.adresse_depart}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-neutral-400 shrink-0">Arrivée :</span>
                      <span className="font-semibold text-neutral-800">{r.adresse_arrivee}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span>
                      Pour <strong className="text-neutral-700">{r.destinataire_nom}</strong>
                    </span>
                    <span className="text-orange-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Gérer la course</span>
                      <IconChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
