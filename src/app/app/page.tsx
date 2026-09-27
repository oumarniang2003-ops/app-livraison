import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import NavBar from "@/components/NavBar";
import ClientDashboardView, { DeliveryItem } from "@/components/ClientDashboardView";

export default async function ClientDashboard() {
  const session = await getSession();
  const result = await query<DeliveryItem>(
    `select l.id, l.statut, l.adresse_depart, l.adresse_arrivee, l.destinataire_nom, l.prix_fcfa, l.created_at, lv.nom as livreur_nom
     from livraisons l
     left join users lv on lv.id = l.livreur_id
     where l.client_id = $1
     order by l.created_at desc`,
    [session!.userId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <NavBar titre="Mes livraisons" home="/app" />
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">
        <ClientDashboardView initialRows={result.rows} />
      </main>
    </div>
  );
}
