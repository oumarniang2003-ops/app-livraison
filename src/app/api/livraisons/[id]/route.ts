import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Livraison = {
  id: string;
  client_id: string;
  livreur_id: string | null;
  statut: string;
};

async function fetchLivraison(id: string) {
  const result = await query<Livraison>("select * from livraisons where id = $1", [id]);
  return result.rows[0] ?? null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const livraison = await fetchLivraison(id);
  if (!livraison) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  if (
    (session.role === "client" && livraison.client_id !== session.userId) ||
    (session.role === "livreur" && livraison.livreur_id !== session.userId)
  ) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const evenements = await query(
    "select statut, lat, lng, note, created_at from livraison_evenements where livraison_id = $1 order by created_at asc",
    [id]
  );

  let position = null;
  if (livraison.livreur_id) {
    const pos = await query(
      "select lat, lng, updated_at from livreur_position where livreur_id = $1",
      [livraison.livreur_id]
    );
    position = pos.rows[0] ?? null;
  }

  return NextResponse.json({ livraison, evenements: evenements.rows, position });
}

const STATUT_SUIVANT: Record<string, string> = {
  assignee: "colis_recupere",
  colis_recupere: "en_livraison",
  en_livraison: "livre",
};

const patchSchema = z.object({
  action: z.enum(["assigner", "avancer", "annuler"]),
  livreur_id: z.string().uuid().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  prix_fcfa: z.number().int().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const livraison = await fetchLivraison(id);
  if (!livraison) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  const d = parsed.data;

  if (d.action === "assigner") {
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    if (!d.livreur_id) {
      return NextResponse.json({ error: "livreur_id requis" }, { status: 400 });
    }
    await query(
      "update livraisons set livreur_id = $1, statut = 'assignee', prix_fcfa = coalesce($2, prix_fcfa), updated_at = now() where id = $3",
      [d.livreur_id, d.prix_fcfa ?? null, id]
    );
    await query(
      "insert into livraison_evenements (livraison_id, statut, note) values ($1, 'assignee', 'Livreur assigné')",
      [id]
    );
    return NextResponse.json({ ok: true });
  }

  if (d.action === "avancer") {
    if (session.role !== "livreur" || livraison.livreur_id !== session.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    const suivant = STATUT_SUIVANT[livraison.statut];
    if (!suivant) {
      return NextResponse.json({ error: "Transition impossible depuis ce statut" }, { status: 409 });
    }
    await query("update livraisons set statut = $1, updated_at = now() where id = $2", [suivant, id]);
    await query(
      "insert into livraison_evenements (livraison_id, statut, lat, lng) values ($1,$2,$3,$4)",
      [id, suivant, d.lat ?? null, d.lng ?? null]
    );
    return NextResponse.json({ ok: true, statut: suivant });
  }

  if (d.action === "annuler") {
    const estClientProprietaire = session.role === "client" && livraison.client_id === session.userId;
    const estAdmin = session.role === "admin";
    if (!estClientProprietaire && !estAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    if (!["en_attente", "assignee"].includes(livraison.statut)) {
      return NextResponse.json({ error: "Trop tard pour annuler" }, { status: 409 });
    }
    await query("update livraisons set statut = 'annule', updated_at = now() where id = $1", [id]);
    await query("insert into livraison_evenements (livraison_id, statut) values ($1, 'annule')", [id]);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
