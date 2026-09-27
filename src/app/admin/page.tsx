import { query } from "@/lib/db";
import { ensureSchema } from "@/lib/ensureSchema";
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

type Livreur = {
  id: string;
  nom: string;
  telephone: string;
  zone: string | null;
  actif: boolean;
  cni_numero: string | null;
  permis_numero: string | null;
  plaque_moto: string | null;
  modele_moto: string | null;
  statut_validation: string;
  created_at: string;
};

export default async function AdminDashboard() {
  await ensureSchema();

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
    query<{ id: string; nom: string; zone: string | null; plaque_moto: string | null }>(
      "select id, nom, zone, plaque_moto from users where role = 'livreur' and actif = true and statut_validation = 'valide' order by nom"
    ),
    query<Livreur>(
      "select id, nom, telephone, zone, actif, cni_numero, permis_numero, plaque_moto, modele_moto, statut_validation, created_at from users where role = 'livreur' order by created_at desc"
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <NavBar titre="Supervision & Dispatch" home="/admin" />
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">Supervision des livraisons</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Centre de régulation des courses, assignations et validation des livreurs certifiés
          </p>
        </div>

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
