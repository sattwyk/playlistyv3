import { text, integer, sqliteTable, } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
    clerkId: text("clerk_id").primaryKey(),
    isPro: integer("is_pro", { mode: "boolean" }).default(false)
})