import * as schema from "@/database/schema";
import { drizzle } from "drizzle-orm/neon-http";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("no database url found in the .env");

export const db = drizzle(databaseUrl, { schema });
