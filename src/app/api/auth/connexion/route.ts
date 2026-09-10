import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { query } from "@/lib/db";
import { createSession, Role } from "@/lib/auth";

const schema = z.object({
  telephone: z.string().min(9),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  }
  const { telephone, password } = parsed.data;

  const result = await query<{
    id: string;
    nom: string;
    role: Role;
    password_hash: string;
    actif: boolean;
  }>("select id, nom, role, password_hash, actif from users where telephone = $1", [telephone]);

  const user = result.rows[0];
  if (!user || !user.actif) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  await createSession({ userId: user.id, role: user.role, nom: user.nom });

  return NextResponse.json({ ok: true, role: user.role });
}
