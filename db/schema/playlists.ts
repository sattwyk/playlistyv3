import { text, integer, sqliteTable, } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from "./users";
import nanoid from "nanoid"

export const playlists = sqliteTable('playlists', {
    playlistId: text("playlist_id").$defaultFn(() => nanoid.nanoid()).primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
    channelId: text("channel_id"),
    channelTitle: text("channel_title"),
    thumbnailUrl: text("thumbnail_url").notNull(),
    thumbnailHeight: integer("thumbnail_height").notNull(),
    thumbnailWidth: integer("thumbnail_width").notNull(),
    hasFinished: integer("has_finished", { mode: "boolean" }).default(false),
    clerkId: text("clerk_id").references(() => users.clerkId)
})

export const insertPlaylistSchema = createInsertSchema(playlists);
export const selectPlaylistSchema = createSelectSchema(playlists)