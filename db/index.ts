import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@/env.mjs"

const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.AUTH_TOKEN
});

export const db = drizzle(client);