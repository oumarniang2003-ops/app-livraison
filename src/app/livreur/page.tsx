import Link from "next/link";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";
import NavBar from "@/components/NavBar";
import { IconBike, IconChevronRight, IconPackage, IconNavigation } from "@/components/Icons";

type Row = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  destinataire_nom: string;
  prix_fcfa: number | null;
  created_at: string;
};

export default async function LivreurDashboard() {
  const session = await getSession();
  const result = await query<Row>(
    `select id, statut, adresse_depart, adresse_arrivee, destinataire_nom, prix_fcfa, created_at
     from livraisons
     where livreur_id = $1 and statut not in ('livre', 'annule')
     order by created_at asc`,
    [session!.userId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <NavBar titre="Espace Livreur" home="/livreur" />
      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-6">
        {/* Driver Cockpit Header */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <IconBike className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-neutral-950">Cockpit Coursier</h1>
              <p className="text-xs text-neutral-500">
                {result.rows.length} course{result.rows.length > 1 ? "s" : ""} assignée{result.rows.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>En service</span>
          </div>
        </div>

        {/* Empty State */}
        {result.rows.length === 0 && (
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
          {result.rows.map((r) => (
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
      </main>
    </div>
  );
}
