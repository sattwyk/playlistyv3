import { playlists } from './playlists';
import { text, integer, sqliteTable, } from "drizzle-orm/sqlite-core";


export const videos = sqliteTable('videos', {
    id: integer("id").primaryKey(),
    hasWatched: integer("has_watched", { mode: "boolean" }).default(false),
    playlistId: integer("playlist_id").references(() => playlists.id, { onDelete: "cascade" })
})