import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import SuiviLivraison, { Livraison } from "@/components/SuiviLivraison";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export default async function SuiviPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const result = await query<Livraison>(
    `select l.*, lv.nom as livreur_nom, lv.telephone as livreur_telephone, lv.plaque_moto as livreur_plaque, lv.modele_moto as livreur_modele
     from livraisons l
     left join users lv on lv.id = l.livreur_id
     where l.id = $1 and l.client_id = $2`,
    [id, session!.userId]
  );

  const livraison = result.rows[0];
  if (!livraison) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <NavBar titre="Suivi de livraison" home="/app" />
      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">
        <SuiviLivraison livraisonId={id} livraisonInitiale={livraison} role="client" />
      </main>
    </div>
  );
}
