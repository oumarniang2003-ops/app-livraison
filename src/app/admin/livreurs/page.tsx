import NavBar from "@/components/NavBar";
import { query } from "@/lib/db";
import CreerLivreur from "@/components/CreerLivreur";

export const dynamic = "force-dynamic";

type Livreur = {
  id: string;
  nom: string;
  telephone: string;
  zone: string | null;
  actif: boolean;
};

export default async function LivreursPage() {
  const result = await query<Livreur>(
    "select id, nom, telephone, zone, actif from users where role = 'livreur' order by created_at desc"
  );

  return (
    <div className="flex-1 flex flex-col">
      <NavBar titre="Livreurs" home="/admin" />
      <main className="max-w-2xl mx-auto w-full px-6 py-8 flex-1 grid gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-4">Ajouter un livreur</h1>
          <CreerLivreur />
        </div>

        <div>
          <h2 className="font-semibold mb-3">Équipe actuelle ({result.rows.length})</h2>
          <div className="grid gap-2">
            {result.rows.map((l) => (
              <div key={l.id} className="bg-white rounded-xl border border-neutral-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{l.nom}</p>
                  <p className="text-xs text-neutral-400">
                    {l.telephone}
                    {l.zone ? ` · ${l.zone}` : ""}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${l.actif ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                  {l.actif ? "Actif" : "Inactif"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
