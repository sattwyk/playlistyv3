'use server'

import { google, youtube_v3 } from 'googleapis';
import { z } from 'zod';
import { getYouTubeThumbnail } from './thubmanail'
import { getErrorMessage } from '@/utils';


const VideoSchema = z.object({
    title: z.string(),
    description: z.string(),
    videoId: z.string(),
    channelId: z.string(),
    channelTitle: z.string(),
    publishedAt: z.string(),
    position: z.number(),
    thumbnail: z.object({
        url: z.string().url(),
        height: z.number(),
        width: z.number(),
    })
});

export type VideoInfo = z.infer<typeof VideoSchema>;

function getVideosInfo(videos: youtube_v3.Schema$PlaylistItem[]): VideoInfo[] {
    console.log(`Extracting video information from ${videos.length} items`);
    const result: VideoInfo[] = [];

    for (const video of videos) {
        const thumbnail = getYouTubeThumbnail(video.snippet?.thumbnails);
        const videoInfo = VideoSchema.safeParse({
            title: video.snippet?.title,
            description: video.snippet?.description,
            videoId: video.snippet?.resourceId?.videoId,
            channelId: video.snippet?.channelId,
            channelTitle: video.snippet?.channelTitle,
            publishedAt: video.snippet?.publishedAt,
            position: video.snippet?.position,
            thumbnail: thumbnail
        });

        if (videoInfo.success) {
            console.log(`Video information parsed successfully for video ID: ${videoInfo.data.videoId}`);
            result.push(videoInfo.data);
        } else {
            console.error(`Failed to parse video information for a video: ${videoInfo.error}`);
        }
    }

    console.log(`Successfully extracted information for ${result.length} videos`);
    return result;
}



export async function getPlaylistVideos(playlistId: string) {
    console.log(`Attempting to fetch videos for playlist ID: ${playlistId}`);
    try {
        const youtube = google.youtube("v3");
        const response = await youtube.playlistItems.list({
            key: process.env.GOOGLE_API_KEY,
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
            return { videos: getVideosInfo(videos), error: null };
        }
    } catch (error) {
        console.error(`Error fetching videos for playlist ID: ${playlistId}: ${getErrorMessage(error)}`);
        return { error: getErrorMessage(error), videos: null };
    }
}
