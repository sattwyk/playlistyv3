import { text, integer, sqliteTable, } from "drizzle-orm/sqlite-core";

import { users } from "./users";

export const playlists = sqliteTable('playlists', {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    desc: text("description"),
    thumbnailUrl: text("thumbnail_url").notNull(),
    hasFinished: integer("has_finished", { mode: "boolean" }).default(false),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" })
})