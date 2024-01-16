
import { text, sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { playlists } from "./playlists";
import { users } from "./users"
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { sql } from "drizzle-orm";

export const tags = sqliteTable("tags", {
    tagId: integer("tag_id").primaryKey({ autoIncrement: true }),
    title: text("title").unique().notNull(),
    color: text("color").notNull(),
    createdAt: integer('created_at', { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: "timestamp" }).notNull(),
},)

export const insertTagSchema = createInsertSchema(tags);
export const selectTagSchema = createSelectSchema(tags);


// Junction table for Tags and Users
export const userTags = sqliteTable('user_tags', {
    clerkId: text("clerk_id").references(() => users.clerkId),
    tagId: integer("tag_id").references(() => tags.tagId),
}, (t) => ({
    pk: primaryKey({ columns: [t.clerkId, t.tagId] }),
}));


export const insertUserTagsSchema = createInsertSchema(userTags);
export const selectUserTagSchema = createSelectSchema(userTags);


// Junction table for Tags and Playlists
export const playlistTags = sqliteTable('playlist_tags', {
    tagId: integer("tag_id").references(() => tags.tagId),
    playlistId: text("playlist_id").references(() => playlists.playlistId),
}, (t) => ({
    pk: primaryKey({ columns: [t.tagId, t.playlistId] }),
}));

export const insertPlaylistTagsSchema = createInsertSchema(playlistTags);
export const selectPlaylistTagSchema = createSelectSchema(playlistTags);
