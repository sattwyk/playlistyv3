import { text, integer, sqliteTable, } from "drizzle-orm/sqlite-core";

// Define the schema for the users table

export const users = sqliteTable('users', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    clerkId: text("clerk_id").notNull(),
    isPro: integer("is_pro", { mode: "boolean" }).default(false)
})