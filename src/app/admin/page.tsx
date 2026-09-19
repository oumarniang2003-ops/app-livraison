import { query } from "@/lib/db";
import NavBar from "@/components/NavBar";
import AdminTabs from "@/components/AdminTabs";

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

type HistoriqueRow = Row & { updated_at: string };

type Livreur = { id: string; nom: string; telephone: string; zone: string | null; actif: boolean };

export default async function AdminDashboard() {
  const [enAttente, enCours, livreursActifs, livreursTous, historique] = await Promise.all([
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
    query<Livreur>(
      "select id, nom, telephone, zone, actif from users where role = 'livreur' order by created_at desc"
    ),
    query<HistoriqueRow>(
      `select l.*, c.nom as client_nom, c.telephone as client_telephone, lv.nom as livreur_nom
       from livraisons l
       join users c on c.id = l.client_id
       left join users lv on lv.id = l.livreur_id
       where l.statut in ('livre', 'annule')
       order by l.updated_at desc
       limit 200`
    ),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <NavBar titre="Admin" home="/admin" />
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>
        <AdminTabs
          enAttente={enAttente.rows}
          enCours={enCours.rows}
          livreursActifs={livreursActifs.rows}
          livreursTous={livreursTous.rows}
          historique={historique.rows}
        />
      </main>
    </div>
  );
}
