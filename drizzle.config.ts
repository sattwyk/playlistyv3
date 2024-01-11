import type { Config } from "drizzle-kit";
export default {
    schema: "./db/schema/*",
    out: "./db/migrations",
    driver: "libsql",
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
} satisfies Config;