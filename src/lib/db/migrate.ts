import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "boilerplate",
});
export const db = drizzle(pool);

async function main() {
  console.log("Running your migrations...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Woohoo! Migrations completed!");
  return process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
