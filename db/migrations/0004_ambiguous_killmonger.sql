/*
 SQLite does not support "Set default to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE playlists ADD `origin_yt_playlist_id` text;--> statement-breakpoint
ALTER TABLE playlists ADD `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE playlists ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE tags ADD `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE tags ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE users ADD `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE users ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE videos ADD `original_yt_video_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE videos ADD `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE videos ADD `updated_at` integer NOT NULL;