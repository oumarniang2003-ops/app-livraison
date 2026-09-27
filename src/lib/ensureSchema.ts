import { query } from "./db";

let schemaChecked = false;

export async function ensureSchema() {
  if (schemaChecked) return;
  try {
    await query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS cni_numero text;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS permis_numero text;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plaque_moto text;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS modele_moto text;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS statut_validation text DEFAULT 'valide';
    `);
    schemaChecked = true;
  } catch (err) {
    console.error("Migration auto schema warning:", err);
  }
}
