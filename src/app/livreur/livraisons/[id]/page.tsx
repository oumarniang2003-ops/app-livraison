import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import LivreurLivraison, { Livraison } from "@/components/LivreurLivraison";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export default async function LivreurLivraisonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const result = await query<Livraison>(
    "select * from livraisons where id = $1 and livreur_id = $2",
    [id, session!.userId]
  );

  const livraison = result.rows[0];
  if (!livraison) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <NavBar titre="Course en cours" home="/livreur" />
      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">
        <LivreurLivraison livraison={livraison} />
      </main>
    </div>
  );
}
