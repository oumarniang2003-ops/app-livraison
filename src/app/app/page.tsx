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
  created_at: string;
  livreur_nom: string | null;
};

export default async function ClientDashboard() {
  const session = await getSession();
  const result = await query<Row>(
    `select l.id, l.statut, l.adresse_depart, l.adresse_arrivee, l.destinataire_nom, l.prix_fcfa, l.created_at, lv.nom as livreur_nom
     from livraisons l
     left join users lv on lv.id = l.livreur_id
     where l.client_id = $1
     order by l.created_at desc`,
    [session!.userId]
  );

  return (
    <div className="flex-1 flex flex-col">
      <NavBar titre="Mes livraisons" home="/app" />
      <main className="max-w-3xl mx-auto w-full px-6 py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mes livraisons</h1>
          <Link
            href="/app/nouvelle"
            className="px-5 py-2.5 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
          >
            + Nouvelle livraison
          </Link>
        </div>

        {result.rows.length === 0 && (
          <div className="text-center py-16 text-neutral-500">
            Vous n&apos;avez pas encore envoyé de colis.
          </div>
        )}

        <div className="grid gap-3">
          {result.rows.map((r) => (
            <Link
              key={r.id}
              href={`/app/livraisons/${r.id}`}
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
              <p className="text-xs text-neutral-400 mt-1">
                Pour {r.destinataire_nom}
                {r.livreur_nom ? ` · Livreur : ${r.livreur_nom}` : ""}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
