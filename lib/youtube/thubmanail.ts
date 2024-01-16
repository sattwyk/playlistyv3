import { youtube_v3 } from 'googleapis';
import { z } from 'zod';
import { getBase64BlurImageUrl } from '@/utils';
import { env } from "@/env.mjs"

const ThumbnailSchema = z.object({
    url: z.string().url(),
    height: z.number(),
    width: z.number()
});

type Thumbnail = {
    url: string;
    height: number;
    width: number;
    blurDataURL: string
}


export async function getYouTubeThumbnail(thumbnails: youtube_v3.Schema$ThumbnailDetails | undefined): Promise<Thumbnail> {
    console.log('Attempting to extract the YouTube thumbnail.');

    if (!thumbnails) {
        console.log('No thumbnails provided, returning default not found thumbnail.');
        return {
            url: `${env.NEXT_PUBLIC_URL}/api/thumbnail`,
            height: 630, width: 1200,
            blurDataURL: await getBase64BlurImageUrl(`${env.NEXT_PUBLIC_URL}/api/thumbnail`)
        }
    }

    const thumbnailTypes = ['maxres', 'standard', 'high', 'medium', 'default'] as const;

    for (const type of thumbnailTypes) {
        if (thumbnails[type]) {
            console.log(`Found thumbnail of type: ${type}`);
            const thumbnail = ThumbnailSchema.safeParse(thumbnails[type]);
            if (thumbnail.success) {
                console.log(`Successfully parsed thumbnail of type: ${type}`);
                return { ...thumbnail.data, blurDataURL: await getBase64BlurImageUrl(thumbnail.data.url) }
            } else {
                console.error(`Failed to parse thumbnail of type: ${type}: ${thumbnail.error}`);
            }
        }
    }

    console.log('No thumbnails provided, returning default not found thumbnail.');
    return {
        url: `${env.NEXT_PUBLIC_URL}/api/thumbnail`,
        height: 630, width: 1200,
        blurDataURL: await getBase64BlurImageUrl(`${env.NEXT_PUBLIC_URL}/api/thumbnail`)
    }
}
