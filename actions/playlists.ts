'use server'

import { insertPlaylistSchema, playlists, insertTagSchema, tags, playlistTags, userTags, insertVideoSchema, videos } from "@/db/schema"
import { z } from "zod"
import { db } from "@/db"
import { getErrorMessage } from "@/utils"
import { and, eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

type BasePlaylist = Omit<z.infer<typeof insertPlaylistSchema>, "publishedAt">;
type BaseVideo = Omit<z.infer<typeof insertVideoSchema>, "publishedAt">;
type BaseTag = z.infer<typeof insertTagSchema>;

interface Playlist extends BasePlaylist {
    publishedAt: string; // Override the publishedAt property for serialization
}

interface Video extends BaseVideo {
    publishedAt: string; // Override the publishedAt property for serialization
}


interface Data {
    playlist: Playlist;
    videos: Video[];
    tags: BaseTag[];
}

export async function addPlaylist(data: Data) {
    console.log('addPlaylist called with data:', data);
    try {
        const user = auth();
        const clerkId = user.userId;

        if (!clerkId) {
            console.log('No clerkId found, redirecting to sign-in');
            return redirect('/sign-in');
        }

        const safePlaylist = insertPlaylistSchema.parse({
            ...data.playlist, clerkId, publishedAt: new Date(Date.parse(data.playlist.publishedAt))
        });
        const safeVideos = data.videos.map((video) => insertVideoSchema.parse({
            ...video, publishedAt: new Date(Date.parse(video.publishedAt))
        }));
        const safeTags = data.tags.map((tag) => insertTagSchema.parse(tag));

        await db.transaction(async (tx) => {

            console.log('Starting transaction for playlist');

            const [playlistResult] = await tx.insert(playlists).values(safePlaylist).returning({ playlistId: playlists.playlistId });
            const { playlistId } = playlistResult;

            console.log('Inserted playlist with id:', playlistId);

            for (const video of safeVideos) {
                console.log('Inserted video with id:', video.videoId);

                await tx.insert(videos).values({ ...video, playlistId });
            }

            for (const tag of safeTags) {

                console.log('Processing tag:', tag.title);

                let tagId: number;
                let tagResult = (await tx.select().from(tags).where(eq(tags.title, tag.title)));

                if (tagResult.length > 0) {
                    tagId = tagResult[0].tagId;

                    console.log("Found existing tagId:", tagId);
                } else {

                    console.log("Inserting new tag:", tag.title);

                    const [result] = await tx.insert(tags).values(tag).returning({ tagId: tags.tagId });
                    tagId = result.tagId;

                    console.log('Inserted new tag with id:', tagId);
                }

                const userTagResult = await tx.select().from(userTags).where(and(eq(userTags.tagId, tagId), eq(userTags.clerkId, clerkId)))

                if (userTagResult.length === 0) {
                    await tx.insert(userTags).values({ clerkId, tagId });
                }

                const playerResult = await tx.select().from(playlistTags).where(and(eq(playlistTags.tagId, tagId), eq(playlistTags.playlistId, playlistId)))

                if (playerResult.length === 0) {
                    await tx.insert(playlistTags).values({ playlistId, tagId });
                }
            }
        });
        revalidatePath('/browse')
        console.log("Successfully added playlist with");
        return { success: "Successfully added playlist", error: null };
    } catch (error) {
        console.error("Error adding playlist:", getErrorMessage(error))
        return { error: getErrorMessage(error), success: null };
    }
}

export async function getPlaylist() {
    try {
        const user = auth()
        const clerkId = user.userId

        if (!clerkId) return redirect('/sign-in')

        const userPlaylists = await db.select({
            playlistId: playlists.playlistId,
            playlistTitle: playlists.title,
            channelTitle: playlists.channelTitle,
            thumbnail: {
                url: playlists.thumbnailUrl,
                height: playlists.thumbnailHeight,
                width: playlists.thumbnailWidth,
            }
        }).from(playlists).where(eq(playlists.clerkId, clerkId)).all()

        return { userPlaylists, error: null }


    } catch (error) {

        return { error: getErrorMessage(error), userPlaylists: null }
    }
}