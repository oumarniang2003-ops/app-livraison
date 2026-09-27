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

      ALTER TABLE livraisons ADD COLUMN IF NOT EXISTS code_pin text;
      UPDATE livraisons SET code_pin = LPAD(FLOOR(RANDOM() * 9000 + 1000)::text, 4, '0') WHERE code_pin IS NULL;
    `);
    schemaChecked = true;
  } catch (err) {
    console.error("Migration auto schema warning:", err);
  }
}
