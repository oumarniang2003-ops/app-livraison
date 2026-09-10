import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { query } from "@/lib/db";
import { createSession } from "@/lib/auth";

const schema = z.object({
  nom: z.string().min(2),
  telephone: z.string().min(9),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  }
  const { nom, telephone, password } = parsed.data;

  const existing = await query("select id from users where telephone = $1", [telephone]);
  if (existing.rowCount) {
    return NextResponse.json({ error: "Ce numéro est déjà utilisé" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query<{ id: string }>(
    `insert into users (role, nom, telephone, password_hash) values ('client', $1, $2, $3) returning id`,
    [nom, telephone, passwordHash]
  );
  const userId = result.rows[0].id;

  await createSession({ userId, role: "client", nom });

  return NextResponse.json({ ok: true });
}
