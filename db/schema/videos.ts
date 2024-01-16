import { sql } from 'drizzle-orm';
import { playlists } from './playlists';
import { text, integer, sqliteTable, } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { nanoid } from 'nanoid';

export const videos = sqliteTable('videos', {
    videoId: text("video_id").$defaultFn(() => `v_${nanoid()}`).primaryKey(),
    originalYTVideoId: text("original_yt_video_id").notNull(),
    position: integer("position").notNull(),
    description: text("description").default('').notNull(),
    channelId: text("channel_id").notNull(),
    publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
    channelTitle: text("channel_title").notNull(),
    thumbnailUrl: text("thumbnail_url").notNull(),
    thumbnailHeight: integer("thumbnail_height").notNull(),
    thumbnailWidth: integer("thumbnail_width").notNull(),
    createdAt: integer('created_at', { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: "timestamp" }).notNull(),
    hasWatched: integer("has_watched", { mode: "boolean" }).default(false),
    playlistId: text("playlist_id").references(() => playlists.playlistId)
})

export const insertVideoSchema = createInsertSchema(videos);
export const selectVideoSchema = createSelectSchema(videos)
