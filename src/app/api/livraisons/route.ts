import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { geocode } from "@/lib/geocode";

const createSchema = z.object({
  adresse_depart: z.string().min(3),
  depart_lat: z.number().optional(),
  depart_lng: z.number().optional(),
  adresse_arrivee: z.string().min(3),
  arrivee_lat: z.number().optional(),
  arrivee_lng: z.number().optional(),
  description: z.string().optional(),
  destinataire_nom: z.string().min(2),
  destinataire_telephone: z.string().min(9),
  mode_paiement: z.enum(["cash", "wave", "orange_money"]).default("cash"),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "client") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  }
  const d = parsed.data;

  const [departGeo, arriveeGeo] = await Promise.all([
    d.depart_lat && d.depart_lng ? null : geocode(d.adresse_depart),
    d.arrivee_lat && d.arrivee_lng ? null : geocode(d.adresse_arrivee),
  ]);

  const result = await query<{ id: string }>(
    `insert into livraisons
      (client_id, adresse_depart, depart_lat, depart_lng, adresse_arrivee, arrivee_lat, arrivee_lng,
       description, destinataire_nom, destinataire_telephone, mode_paiement, notes)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     returning id`,
    [
      session.userId,
      d.adresse_depart,
      d.depart_lat ?? departGeo?.lat ?? null,
      d.depart_lng ?? departGeo?.lng ?? null,
      d.adresse_arrivee,
      d.arrivee_lat ?? arriveeGeo?.lat ?? null,
      d.arrivee_lng ?? arriveeGeo?.lng ?? null,
      d.description ?? null,
      d.destinataire_nom,
      d.destinataire_telephone,
      d.mode_paiement,
      d.notes ?? null,
    ]
  );
  const id = result.rows[0].id;

  await query(
    `insert into livraison_evenements (livraison_id, statut) values ($1, 'en_attente')`,
    [id]
  );

  return NextResponse.json({ ok: true, id });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let sql = `
    select l.*, c.nom as client_nom, c.telephone as client_telephone,
           lv.nom as livreur_nom, lv.telephone as livreur_telephone
    from livraisons l
    join users c on c.id = l.client_id
    left join users lv on lv.id = l.livreur_id
  `;
  const params: unknown[] = [];

  if (session.role === "client") {
    sql += " where l.client_id = $1";
    params.push(session.userId);
  } else if (session.role === "livreur") {
    sql += " where l.livreur_id = $1";
    params.push(session.userId);
  }
  sql += " order by l.created_at desc";

  const result = await query(sql, params);
  return NextResponse.json({ livraisons: result.rows });
}
