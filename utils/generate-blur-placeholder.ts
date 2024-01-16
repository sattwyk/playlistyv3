'use server';

import sharp from 'sharp';
import { unstable_cache } from 'next/cache';

// TODO: Add default base64 url
const defaultBase64BlurUrl = 'data:image/jpeg;base64,...'

export const getBase64BlurImageUrl = unstable_cache(async (
    imageUrl: string,
): Promise<string> => {
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();

        // Create a blurred placeholder image using sharp
        const blurred = await sharp(Buffer.from(buffer))
            .resize(30) // Resize to a small image for the blur effect
            .blur() // Apply the blur effect
            .toBuffer();

        const base64BlurUrl = `data:image/jpeg;base64,${blurred.toString('base64')}`;
        return base64BlurUrl;
    } catch (error) {
        console.error('')
        return defaultBase64BlurUrl
    }
}, ["blur-placeholder"], {
    tags: ["blur-placeholder"]
})
