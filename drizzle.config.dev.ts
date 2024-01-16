import type { Config } from "drizzle-kit";
export default {
    schema: "./db/schema/*",
    out: "./db/migrations/dev",
    driver: "libsql",
    dbCredentials: {
        url: "http://localhost:8080/"
    }
} satisfies Config;