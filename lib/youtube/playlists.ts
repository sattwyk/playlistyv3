'use server'

import { google, youtube_v3 } from 'googleapis';
import { clerkClient, auth, isClerkAPIResponseError } from '@clerk/nextjs'
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getErrorMessage } from '@/utils';
import { getPlaylistVideos } from './videos';
import { getYouTubeThumbnail } from './thubmanail';
import { unstable_cache } from 'next/cache';
import { env } from "@/env.mjs"

export async function getPlaylistData(playlistId: string) {
    console.log(`Starting to fetch data for playlist ID: ${playlistId}`);

    const results = await Promise.allSettled([
        getPlaylist(playlistId),
        getPlaylistVideos(playlistId),
    ]);

    console.log(`Data fetching completed for playlist ID: ${playlistId}`);

    const playlistResult =
        results[0].status === 'fulfilled' ? results[0].value : null;
    const videosResult =
        results[1].status === 'fulfilled' ? results[1].value : null;

    if (playlistResult?.error || videosResult?.error) {
        console.error(`Error fetching playlist data: ${playlistResult?.error || videosResult?.error}`);
        return null;
    }

    if (!playlistResult?.playlist) {
        console.error(`No playlist found for ID: ${playlistId}`);
        return null;
    }

    if (!videosResult?.videos) {
        console.error(`No videos found for playlist ID: ${playlistId}`);
        return null;
    }

    console.log(`Successfully retrieved data for playlist ID: ${playlistId}`);
    return { playlist: playlistResult.playlist, videos: videosResult.videos };
}

const PlaylistSchema = z.object({
    title: z.string(),
    youtubePlaylistId: z.string(),
    description: z.string(),
    channelId: z.string(),
    channelTitle: z.string(),
    publishedAt: z.string(),
    thumbnail: z.object({
        url: z.string().url(),
        height: z.number(),
        width: z.number(),
        // blurDataURL: z.string()
    })
});

export type PlaylistInfo = z.infer<typeof PlaylistSchema>;


export const getPlaylist = async (playlistId: string): Promise<{ playlist: PlaylistInfo | null, error: string | null }> => {
    console.log(`Fetching playlist information for ID: ${playlistId}`);
    try {
        const youtube = google.youtube('v3');
        const response = await youtube.playlists.list({
            key: env.GOOGLE_API_KEY,
            id: [playlistId],
            part: ['snippet'],
            maxResults: 1
        });
        const playlists = response.data.items;
        if (playlists?.length == 0 || !playlists) {
            console.log(`Playlist with ID: ${playlistId} not found.`);
            return { error: 'Playlist not found', playlist: null };
        } else {
            console.log(`Parsing playlist data for ID: ${playlistId}`);
            const playlist = await getPlaylistsInfo(playlists);

            if (playlist.length) {
                console.log(`Playlist data parsed successfully for ID: ${playlistId}`);
                return { playlist: playlist[0], error: null };
            } else {
                console.error(`Error parsing playlist data for ID: ${playlistId}`);
                return { error: 'Error parsing playlist data', playlist: null };
            }
        }
    } catch (error) {
        console.error(`Error fetching playlist information for ID: ${playlistId}: ${getErrorMessage(error)}`);
        return { error: getErrorMessage(error), playlist: null };
    }
}

export const getUserYoutubePlaylists = unstable_cache(async (): Promise<{ error: string | null, playlists: PlaylistInfo[] | null }> => {
    console.log('Starting to fetch user playlists...');
    //TODO: Fetch all playlists if more that 50 and handle retries
    try {
        const { userId } = auth()
        if (!userId) {
            console.log('No user ID found, redirecting to sign-in');
            return redirect('/sign-in');
        }
        console.log(`User ID for playlist retrieval: ${userId}`);
        // TODO: Fix how the retry new access token issue
        const [accessToken] = await clerkClient.users.getUserOauthAccessToken(userId, "oauth_google")
        console.log(`Access token retrieved: ${accessToken.token}`);
        const youtube = google.youtube("v3")
        const response = await youtube.playlists.list({
            key: env.GOOGLE_API_KEY,
            access_token: accessToken.token,
            part: ['snippet', 'contentDetails'],
            mine: true,
            maxResults: 50
        })

        let playlists = response?.data.items;
        if (playlists?.length == 0 || !playlists) {
            console.log('No playlists found for the user.');
            return { error: "No playlists found", playlists: null }
        } else {
            console.log(`Found ${playlists.length} playlists for the user.`);
            const userYoutubePlaylists = await getPlaylistsInfo(playlists)
            if (!userYoutubePlaylists.length) {
                console.log('No valid playlist information could be parsed.');
                return { error: "No playlists found", playlists: null }
            }

            console.log(`Playlist information parsed for ${userYoutubePlaylists.length} playlists.`);

            return { playlists: userYoutubePlaylists, error: null }
        }
    } catch (error) {
        if (isClerkAPIResponseError(error)) {
            console.error("Clerk Error happened")
        }
        console.error(`Error fetching user playlists: ${getErrorMessage(error)}`);
        return { error: getErrorMessage(error), playlists: null }
    }
}, ['yt-user-playlists'], {
    tags: ['yt-user-playlists'],
})


async function getPlaylistsInfo(playlists: youtube_v3.Schema$Playlist[]): Promise<PlaylistInfo[]> {
    console.log(`Processing ${playlists.length} playlists to extract information.`);
    const result: PlaylistInfo[] = [];

    for (const playlist of playlists) {
        console.log(`Extracting information for playlist ID: ${playlist.id}`);
        const thumbnail = await getYouTubeThumbnail(playlist.snippet?.thumbnails);
        const playlistInfo = PlaylistSchema.safeParse({
            title: playlist.snippet?.title,
            youtubePlaylistId: playlist.id,
            description: playlist.snippet?.description,
            channelId: playlist.snippet?.channelId,
            publishedAt: playlist.snippet?.publishedAt,
            channelTitle: playlist.snippet?.channelTitle,
            thumbnail: thumbnail
        });

        if (playlistInfo.success) {
            console.log(`Successfully parsed playlist ID: ${playlist.id}`);
            result.push(playlistInfo.data);
        } else {
            console.error(`Failed to parse playlist ID: ${playlist.id}: ${playlistInfo.error}`);
        }
    }

    console.log(`Finished processing playlists. Total playlists extracted: ${result.length}`);
    return result;
}
