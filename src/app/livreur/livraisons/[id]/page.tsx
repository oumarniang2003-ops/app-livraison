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
    <div className="flex-1 flex flex-col">
      <NavBar titre="Course" home="/livreur" />
      <main className="max-w-lg mx-auto w-full px-6 py-8 flex-1">
        <LivreurLivraison livraison={livraison} />
      </main>
    </div>
  );
}
