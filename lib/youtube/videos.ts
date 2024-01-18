'use server'

import { google, youtube_v3 } from 'googleapis';
import { z } from 'zod';
import { getYouTubeThumbnail } from './thubmanail'
import { getErrorMessage } from '@/utils';
import { unstable_cache } from "next/cache"
import { env } from "@/env.mjs"

const VideoSchema = z.object({
    title: z.string(),
    description: z.string(),
    youtubeVideoId: z.string(),
    channelId: z.string(),
    channelTitle: z.string(),
    publishedAt: z.string(),
    position: z.number(),
    thumbnail: z.object({
        url: z.string().url(),
        height: z.number(),
        width: z.number(),
        // blurDataURL: z.string()
    })
});

export type VideoInfo = z.infer<typeof VideoSchema>;

async function getVideosInfo(videos: youtube_v3.Schema$PlaylistItem[]): Promise<VideoInfo[]> {
    console.log(`Extracting video information from ${videos.length} items`);
    const result: VideoInfo[] = [];

    for (const video of videos) {
        const thumbnail = await getYouTubeThumbnail(video.snippet?.thumbnails);
        const videoInfo = VideoSchema.safeParse({
            title: video.snippet?.title,
            description: video.snippet?.description,
            youtubeVideoId: video.snippet?.resourceId?.videoId,
            channelId: video.snippet?.channelId,
            channelTitle: video.snippet?.channelTitle,
            publishedAt: video.snippet?.publishedAt,
            position: video.snippet?.position,
            thumbnail: thumbnail
        });

        if (videoInfo.success) {
            console.log(`Video information parsed successfully for video ID: ${videoInfo.data.youtubeVideoId}`);
            result.push(videoInfo.data);
        } else {
            console.error(`Failed to parse video information for a video: ${videoInfo.error}`);
        }
    }

    console.log(`Successfully extracted information for ${result.length} videos`);
    return result;
}



export const getPlaylistVideos = unstable_cache(async (playlistId: string) => {
    console.log(`Attempting to fetch videos for playlist ID: ${playlistId}`);
    try {
        const youtube = google.youtube("v3");
        const response = await youtube.playlistItems.list({
            key: env.GOOGLE_API_KEY,
            playlistId: playlistId,
            part: ["snippet"],
            maxResults: 50,
        });
        let videos = response.data.items;
        console.log(`Fetched ${videos?.length} videos for playlist ID: ${playlistId}`);

        if (videos?.length == 0 || !videos) {
            console.log(`No videos found for playlist ID: ${playlistId}`);
            return { error: "No Videos found", videos: null };
        } else {
            console.log(`Processing video information for playlist ID: ${playlistId}`);
            return { videos: await getVideosInfo(videos), error: null };
        }
    } catch (error) {
        console.error(`Error fetching videos for playlist ID: ${playlistId}: ${getErrorMessage(error)}`);
        return { error: getErrorMessage(error), videos: null };
    }
}, ['yt-playlist-videos'], {
    tags: ['yt-playlist-videos']
})
