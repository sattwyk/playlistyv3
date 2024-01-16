import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = sqliteTable('users', {
    clerkId: text("clerk_id").primaryKey(),
    isPro: integer("is_pro", { mode: "boolean" }).default(false),
    createdAt: integer('created_at', { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: "timestamp" }).notNull(),
})

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users)