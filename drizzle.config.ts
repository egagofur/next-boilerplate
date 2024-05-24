import { defineConfig, Config } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "postgres",
  },
  migrations: {
    table: "migrations",
    schema: "public",
  },
  driver: "node-postgres",
} as Config);
