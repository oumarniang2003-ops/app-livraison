import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import SuiviLivraison, { Livraison } from "@/components/SuiviLivraison";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export default async function SuiviPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const result = await query<Livraison>(
    `select l.*, lv.nom as livreur_nom, lv.telephone as livreur_telephone
     from livraisons l
     left join users lv on lv.id = l.livreur_id
     where l.id = $1 and l.client_id = $2`,
    [id, session!.userId]
  );

  const livraison = result.rows[0];
  if (!livraison) notFound();

  return (
    <div className="flex-1 flex flex-col">
      <NavBar titre="Suivi de livraison" home="/app" />
      <main className="max-w-lg mx-auto w-full px-6 py-8 flex-1">
        <SuiviLivraison livraisonId={id} livraisonInitiale={livraison} role="client" />
      </main>
    </div>
  );
}
