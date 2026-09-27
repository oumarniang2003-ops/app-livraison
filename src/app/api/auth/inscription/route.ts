import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { query } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { ensureSchema } from "@/lib/ensureSchema";

const schema = z.object({
  role: z.enum(["client", "livreur"]).default("client"),
  nom: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  telephone: z.string().min(9, "Le numéro de téléphone est invalide"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
  // Champs spécifiques livreur
  cni_numero: z.string().optional(),
  permis_numero: z.string().optional(),
  plaque_moto: z.string().optional(),
  modele_moto: z.string().optional(),
  zone: z.string().optional(),
});

export async function POST(req: Request) {
  await ensureSchema();

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Champs invalides" }, { status: 400 });
  }
  const { role, nom, telephone, password, cni_numero, permis_numero, plaque_moto, modele_moto, zone } = parsed.data;

  // Validation supplémentaire stricte pour les livreurs
  if (role === "livreur") {
    if (!cni_numero || cni_numero.trim().length < 5) {
      return NextResponse.json({ error: "Le numéro de Carte Nationale d'Identité (CNI) est obligatoire" }, { status: 400 });
    }
    if (!permis_numero || permis_numero.trim().length < 4) {
      return NextResponse.json({ error: "Le numéro de Permis de conduire est obligatoire" }, { status: 400 });
    }
    if (!plaque_moto || plaque_moto.trim().length < 3) {
      return NextResponse.json({ error: "La plaque d'immatriculation de la moto est obligatoire" }, { status: 400 });
    }
  }

  const existing = await query("select id from users where telephone = $1", [telephone]);
  if (existing.rowCount) {
    return NextResponse.json({ error: "Ce numéro de téléphone est déjà enregistré" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const isLivreur = role === "livreur";
  const actif = isLivreur ? false : true;
  const statutValidation = isLivreur ? "en_attente" : "valide";

  const result = await query<{ id: string }>(
    `insert into users (role, nom, telephone, password_hash, zone, actif, cni_numero, permis_numero, plaque_moto, modele_moto, statut_validation) 
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning id`,
    [role, nom, telephone, passwordHash, zone || null, actif, cni_numero || null, permis_numero || null, plaque_moto || null, modele_moto || null, statutValidation]
  );
  const userId = result.rows[0].id;

  await createSession({ userId, role, nom });

  return NextResponse.json({ ok: true, role, statutValidation });
}
