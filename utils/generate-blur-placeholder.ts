'use server'

import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";

const cache = new Map<string, string>();

export async function getBase64ImageUrl(
    imageUrl: string,
): Promise<string> {
    let url = cache.get(imageUrl);
    if (url) {
        return url;
    }
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const minified = await imagemin.buffer(Buffer.from(buffer), {
        plugins: [imageminJpegtran()],
    });

    url = `data:image/jpeg;base64,${Buffer.from(minified).toString("base64")}`;
    cache.set(imageUrl, url);
    return url;
}