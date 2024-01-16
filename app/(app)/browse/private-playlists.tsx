import { getUserOriginPlaylistIds } from '@/actions';
import { Thumbnail } from '@/components/thumbnail';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getUserYoutubePlaylists } from '@/lib/youtube';
import Link from 'next/link';

export async function PrivatePlaylists() {
  const [userYTPlaylistsResult, userPlaylistsResult] = await Promise.allSettled(
    [getUserYoutubePlaylists(), getUserOriginPlaylistIds()]
  );

  const userYTPlaylistsData =
    userYTPlaylistsResult.status === 'fulfilled'
      ? userYTPlaylistsResult.value
      : null;
  const userPlaylistsData =
    userPlaylistsResult.status === 'fulfilled'
      ? userPlaylistsResult.value
      : null;

  if (!userPlaylistsData && !userYTPlaylistsData) return null;

  const userPlaylists = userPlaylistsData?.userOriginPlaylistIds ?? [];
  const userYTPlaylists = userYTPlaylistsData?.playlists ?? null;

  return (
    <>
      {userYTPlaylists && userYTPlaylists.length ? (
        <>
          <div className='mt-6 space-y-1'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Made for You
            </h2>
            <p className='text-sm text-muted-foreground'>
              Your personal playlists. Updated daily.
            </p>
          </div>
          <Separator className='my-4' />

          <div className='relative'>
            <ScrollArea>
              <div className='flex space-x-4 pb-4'>
                {userYTPlaylists
                  .filter(({ youtubePlaylistId }) =>
                    userPlaylists.every((id) => id !== youtubePlaylistId)
                  )
                  .map((playlist, index) => (
                    <Link
                      href={`/playlist/add/${playlist.youtubePlaylistId}`}
                      passHref
                      key={playlist.youtubePlaylistId}
                    >
                      <Thumbnail
                        idx={index}
                        title={playlist.title}
                        url={playlist.thumbnail.url}
                        className='w-[150px]'
                        aspectRatio='square'
                        blurDataURL={playlist.thumbnail.blurDataURL}
                        channel={playlist.channelTitle}
                        width={playlist.thumbnail.width}
                        height={playlist.thumbnail.height}
                      />
                    </Link>
                  ))}
              </div>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </div>
        </>
      ) : null}
    </>
  );
}
