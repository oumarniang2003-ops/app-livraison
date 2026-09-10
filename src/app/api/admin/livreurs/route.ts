import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  nom: z.string().min(2),
  telephone: z.string().min(9),
  password: z.string().min(6),
  zone: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  const { nom, telephone, password, zone } = parsed.data;

  const existing = await query("select id from users where telephone = $1", [telephone]);
  if (existing.rowCount) {
    return NextResponse.json({ error: "Ce numéro est déjà utilisé" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await query(
    "insert into users (role, nom, telephone, password_hash, zone) values ('livreur', $1, $2, $3, $4)",
    [nom, telephone, passwordHash, zone ?? null]
  );

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const result = await query(
    "select id, nom, telephone, zone, actif, created_at from users where role = 'livreur' order by created_at desc"
  );
  return NextResponse.json({ livreurs: result.rows });
}
