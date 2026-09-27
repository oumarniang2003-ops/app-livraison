import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { ensureSchema } from "@/lib/ensureSchema";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureSchema();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { action } = body;

  if (action === "valider") {
    await query(
      "update users set statut_validation = 'valide', actif = true where id = $1 and role = 'livreur'",
      [id]
    );
    return NextResponse.json({ ok: true, statut_validation: "valide", actif: true });
  }

  if (action === "rejeter") {
    await query(
      "update users set statut_validation = 'rejete', actif = false where id = $1 and role = 'livreur'",
      [id]
    );
    return NextResponse.json({ ok: true, statut_validation: "rejete", actif: false });
  }

  if (action === "toggle_actif") {
    const user = await query<{ actif: boolean }>("select actif from users where id = $1", [id]);
    if (!user.rowCount) return NextResponse.json({ error: "Livreur introuvable" }, { status: 404 });
    const newActif = !user.rows[0].actif;
    await query("update users set actif = $1 where id = $2", [newActif, id]);
    return NextResponse.json({ ok: true, actif: newActif });
  }

  return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
}
