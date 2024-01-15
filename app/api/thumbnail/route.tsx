import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET(req: NextRequest) {
  try {
    return new ImageResponse(
      (
        <div tw='flex relative flex-col p-12 w-full h-full justify-center items-center bg-[#F26522]'>
          <h1 tw='text-9xl font-bold text-white'>New Playlist</h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
