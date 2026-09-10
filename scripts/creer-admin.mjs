import { Pool } from "pg";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const nom = await rl.question("Nom : ");
const telephone = await rl.question("Téléphone : ");
const password = await rl.question("Mot de passe : ");
rl.close();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const passwordHash = await bcrypt.hash(password, 10);

await pool.query(
  "insert into users (role, nom, telephone, password_hash) values ('admin', $1, $2, $3)",
  [nom, telephone, passwordHash]
);

console.log("Compte admin créé.");
await pool.end();
