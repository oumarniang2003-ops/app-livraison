import { query } from "@/lib/db";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  destinataire_nom: string;
  prix_fcfa: number | null;
  updated_at: string;
  client_nom: string;
  livreur_nom: string | null;
};

export default async function HistoriquePage() {
  const result = await query<Row>(
    `select l.*, c.nom as client_nom, lv.nom as livreur_nom
     from livraisons l
     join users c on c.id = l.client_id
     left join users lv on lv.id = l.livreur_id
     where l.statut in ('livre', 'annule')
     order by l.updated_at desc
     limit 200`
  );

  const livrees = result.rows.filter((r) => r.statut === "livre");
  const totalFcfa = livrees.reduce((sum, r) => sum + (r.prix_fcfa ?? 0), 0);

  return (
    <div className="flex-1 flex flex-col">
      <NavBar titre="Historique" home="/admin" />
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-2">Historique des livraisons</h1>
        <p className="text-sm text-neutral-500 mb-8">
          {livrees.length} livrée{livrees.length !== 1 ? "s" : ""} · {totalFcfa.toLocaleString("fr-FR")} FCFA au total
        </p>

        {result.rows.length === 0 && (
          <p className="text-sm text-neutral-400">Aucune livraison terminée pour le moment.</p>
        )}

        <div className="grid gap-3">
          {result.rows.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-neutral-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUT_COLOR[r.statut]}`}>
                  {STATUT_LABEL[r.statut]}
                </span>
                <span className="text-xs text-neutral-400">
                  {new Date(r.updated_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-sm text-neutral-700">
                {r.adresse_depart} → {r.adresse_arrivee}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Client : {r.client_nom} · Pour {r.destinataire_nom}
                {r.livreur_nom ? ` · Livreur : ${r.livreur_nom}` : ""}
                {r.prix_fcfa ? ` · ${r.prix_fcfa} FCFA` : ""}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
