CREATE TABLE `playlists` (
	`playlist_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`published_at` integer NOT NULL,
	`channel_id` text,
	`channel_title` text,
	`thumbnail_url` text NOT NULL,
	`thumbnail_height` integer NOT NULL,
	`thumbnail_width` integer NOT NULL,
	`has_finished` integer DEFAULT false,
	`clerk_id` text,
	FOREIGN KEY (`clerk_id`) REFERENCES `users`(`clerk_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`tag_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`playlist_id` text,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`playlist_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`clerk_id` text PRIMARY KEY NOT NULL,
	`is_pro` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`video_id` text PRIMARY KEY NOT NULL,
	`position` integer NOT NULL,
	`description` text NOT NULL,
	`channel_id` integer NOT NULL,
	`published_at` integer NOT NULL,
	`channel_title` integer NOT NULL,
	`thumbnail_url` text NOT NULL,
	`thumbnail_height` integer NOT NULL,
	`thumbnail_width` integer NOT NULL,
	`has_watched` integer DEFAULT false,
	`playlist_id` text,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`playlist_id`) ON UPDATE no action ON DELETE no action
);
