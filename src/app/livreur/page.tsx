import Link from "next/link";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";
import NavBar from "@/components/NavBar";

type Row = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  destinataire_nom: string;
  prix_fcfa: number | null;
};

export default async function LivreurDashboard() {
  const session = await getSession();
  const result = await query<Row>(
    `select id, statut, adresse_depart, adresse_arrivee, destinataire_nom, prix_fcfa
     from livraisons
     where livreur_id = $1 and statut not in ('livre', 'annule')
     order by created_at asc`,
    [session!.userId]
  );

  return (
    <div className="flex-1 flex flex-col">
      <NavBar titre="Mes courses" home="/livreur" />
      <main className="max-w-lg mx-auto w-full px-6 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-6">Mes courses en cours</h1>

        {result.rows.length === 0 && (
          <div className="text-center py-16 text-neutral-500">
            Aucune course assignée pour le moment.
          </div>
        )}

        <div className="grid gap-3">
          {result.rows.map((r) => (
            <Link
              key={r.id}
              href={`/livreur/livraisons/${r.id}`}
              className="block bg-white rounded-xl border border-neutral-100 p-4 hover:border-orange-300 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUT_COLOR[r.statut]}`}>
                  {STATUT_LABEL[r.statut]}
                </span>
                {r.prix_fcfa && <span className="text-sm font-medium">{r.prix_fcfa} FCFA</span>}
              </div>
              <p className="text-sm text-neutral-700">
                {r.adresse_depart} → {r.adresse_arrivee}
              </p>
              <p className="text-xs text-neutral-400 mt-1">Pour {r.destinataire_nom}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
