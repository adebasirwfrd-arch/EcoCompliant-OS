import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
    throw new Error("SUPABASE_DATABASE_URL is missing in .env");
}

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
