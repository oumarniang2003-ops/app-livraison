import Link from "next/link";
import { query } from "@/lib/db";
import { STATUT_LABEL, STATUT_COLOR } from "@/lib/statut";
import { prixSuggere } from "@/lib/prix";
import NavBar from "@/components/NavBar";
import AdminAssignation from "@/components/AdminAssignation";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  statut: string;
  adresse_depart: string;
  adresse_arrivee: string;
  depart_lat: number | null;
  depart_lng: number | null;
  arrivee_lat: number | null;
  arrivee_lng: number | null;
  destinataire_nom: string;
  prix_fcfa: number | null;
  client_nom: string;
  client_telephone: string;
  livreur_nom: string | null;
};

export default async function AdminDashboard() {
  const [enAttente, enCours, livreurs] = await Promise.all([
    query<Row>(
      `select l.*, c.nom as client_nom, c.telephone as client_telephone
       from livraisons l join users c on c.id = l.client_id
       where l.statut = 'en_attente' order by l.created_at asc`
    ),
    query<Row>(
      `select l.*, c.nom as client_nom, c.telephone as client_telephone, lv.nom as livreur_nom
       from livraisons l
       join users c on c.id = l.client_id
       left join users lv on lv.id = l.livreur_id
       where l.statut not in ('en_attente', 'livre', 'annule')
       order by l.created_at desc`
    ),
    query<{ id: string; nom: string; zone: string | null }>(
      "select id, nom, zone from users where role = 'livreur' and actif = true order by nom"
    ),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <NavBar titre="Admin" home="/admin" />
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <Link href="/admin/livreurs" className="text-sm text-orange-600 font-medium">
            Gérer les livreurs →
          </Link>
        </div>

        <section className="mb-10">
          <h2 className="font-semibold mb-3">
            En attente d&apos;assignation ({enAttente.rows.length})
          </h2>
          <div className="grid gap-3">
            {enAttente.rows.length === 0 && (
              <p className="text-sm text-neutral-400">Rien en attente pour le moment.</p>
            )}
            {enAttente.rows.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-neutral-100 p-4">
                <p className="text-sm text-neutral-700 mb-1">
                  {r.adresse_depart} → {r.adresse_arrivee}
                </p>
                <p className="text-xs text-neutral-400 mb-3">
                  Client : {r.client_nom} ({r.client_telephone}) · Pour {r.destinataire_nom}
                </p>
                <AdminAssignation
                  livraisonId={r.id}
                  livreurs={livreurs.rows}
                  prixSuggere={prixSuggere(
                    r.depart_lat && r.depart_lng ? { lat: r.depart_lat, lng: r.depart_lng } : null,
                    r.arrivee_lat && r.arrivee_lng ? { lat: r.arrivee_lat, lng: r.arrivee_lng } : null
                  )}
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-3">En cours ({enCours.rows.length})</h2>
          <div className="grid gap-3">
            {enCours.rows.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-neutral-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUT_COLOR[r.statut]}`}>
                    {STATUT_LABEL[r.statut]}
                  </span>
                  {r.prix_fcfa && <span className="text-sm font-medium">{r.prix_fcfa} FCFA</span>}
                </div>
                <p className="text-sm text-neutral-700">
                  {r.adresse_depart} → {r.adresse_arrivee}
                </p>
                <p className="text-xs text-neutral-400 mt-1">Livreur : {r.livreur_nom}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
