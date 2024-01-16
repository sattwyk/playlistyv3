CREATE TABLE `playlists` (
	`playlist_id` text PRIMARY KEY NOT NULL,
	`origin_yt_playlist_id` text,
	`title` text NOT NULL,
	`description` text DEFAULT '',
	`published_at` integer NOT NULL,
	`channel_id` text,
	`channel_title` text,
	`thumbnail_url` text NOT NULL,
	`thumbnail_height` integer NOT NULL,
	`thumbnail_width` integer NOT NULL,
	`has_finished` integer DEFAULT false,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer NOT NULL,
	`clerk_id` text,
	FOREIGN KEY (`clerk_id`) REFERENCES `users`(`clerk_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `playlist_tags` (
	`tag_id` integer,
	`playlist_id` text,
	PRIMARY KEY(`playlist_id`, `tag_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`tag_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`playlist_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`tag_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_tags` (
	`clerk_id` text,
	`tag_id` integer,
	PRIMARY KEY(`clerk_id`, `tag_id`),
	FOREIGN KEY (`clerk_id`) REFERENCES `users`(`clerk_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`tag_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`clerk_id` text PRIMARY KEY NOT NULL,
	`is_pro` integer DEFAULT false,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`video_id` text PRIMARY KEY NOT NULL,
	`original_yt_video_id` text NOT NULL,
	`position` integer NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`channel_id` text NOT NULL,
	`published_at` integer NOT NULL,
	`channel_title` text NOT NULL,
	`thumbnail_url` text NOT NULL,
	`thumbnail_height` integer NOT NULL,
	`thumbnail_width` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer NOT NULL,
	`has_watched` integer DEFAULT false,
	`playlist_id` text,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`playlist_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_title_unique` ON `tags` (`title`);