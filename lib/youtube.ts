'use server'


import { google, youtube_v3 } from 'googleapis';
import { clerkClient, auth } from '@clerk/nextjs'
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getErrorMessage } from './utils';

export async function getUserPlaylists(): Promise<{ error: string | null, playlists: youtube_v3.Schema$Playlist[] | null }> {
    try {
        const { userId } = auth()
        if (!userId) return redirect('/sign-in')

        const [accessToken] = await clerkClient.users.getUserOauthAccessToken(userId, "oauth_google")
        const youtube = google.youtube("v3")

        const response = await youtube.playlists.list({
            access_token: accessToken.token,
            part: ['snippet', 'contentDetails'],
            mine: true,
            maxResults: 50
        })

        let playlists = response?.data.items;
        if (playlists?.length == 0 || !playlists) {
            return { error: "No playlists found", playlists: null }
        } else {
            return { playlists: playlists, error: null }
        }

    } catch (error) {
        return { error: getErrorMessage(error), playlists: null }
    }
}

const ThumbnailSchema = z.object({
    url: z.string().url(),
    height: z.number(),
    width: z.number()
});

type Thumbnail = z.infer<typeof ThumbnailSchema>;

function getYouTubeThumbnailUrl(thumbnails: youtube_v3.Schema$ThumbnailDetails): Thumbnail | null {
    const thumbnailTypes = ['maxres', 'high', 'medium', 'standard', 'default'] as const;

    for (const type of thumbnailTypes) {
        if (thumbnails[type]) {
            const thumbnail = ThumbnailSchema.safeParse(thumbnails[type]);
            if (thumbnail.success) {
                return thumbnail.data;
            }
        }
    }

    return null;
}
