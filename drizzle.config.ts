import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("no database url found in the .env");

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/database/schema.ts",
  out: "./app/database/.drizzle",
  dbCredentials: {
    url: databaseUrl,
  },
});
