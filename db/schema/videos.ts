import { playlists } from './playlists';
import { text, integer, sqliteTable, } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const videos = sqliteTable('videos', {
    videoId: text("video_id").primaryKey(),
    position: integer("position").notNull(),
    description: text("description").notNull(),
    channelId: text("channel_id").notNull(),
    publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
    channelTitle: text("channel_title").notNull(),
    thumbnailUrl: text("thumbnail_url").notNull(),
    thumbnailHeight: integer("thumbnail_height").notNull(),
    thumbnailWidth: integer("thumbnail_width").notNull(),
    hasWatched: integer("has_watched", { mode: "boolean" }).default(false),
    playlistId: text("playlist_id").references(() => playlists.playlistId)
})

export const insertVideoSchema = createInsertSchema(videos);
export const selectVideoSchema = createSelectSchema(videos)
