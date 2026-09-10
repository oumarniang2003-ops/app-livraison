import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "livreur") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Champs invalides" }, { status: 400 });

  await query(
    `insert into livreur_position (livreur_id, lat, lng, updated_at)
     values ($1, $2, $3, now())
     on conflict (livreur_id) do update set lat = $2, lng = $3, updated_at = now()`,
    [session.userId, parsed.data.lat, parsed.data.lng]
  );

  return NextResponse.json({ ok: true });
}
