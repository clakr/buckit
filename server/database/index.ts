import { useRuntimeConfig } from "#imports";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(useRuntimeConfig().databaseUrl, { schema });
