import { getUserPlaylistsForTag } from '@/actions';
import { Thumbnail } from '@/components/thumbnail';
import { Separator } from '@/components/ui/separator';

export default async function TagPlaylists({
  params,
}: {
  params: {
    tagTitle: string;
  };
}) {
  const { error, userPlaylists } = await getUserPlaylistsForTag(
    params.tagTitle
  );

  if (error) {
    throw Error(error);
  }

  return (
    <main className='h-full'>
      <div className='mt-6 space-y-1'>
        <h2 className='text-2xl font-semibold tracking-tight'>Made for You</h2>
        <p className='text-sm text-muted-foreground'>
          Your personal playlists. Updated daily.
        </p>
      </div>
      <Separator className='my-4' />
      <div className='grid grid-cols-4'>
        {userPlaylists?.map((playlist, index) => {
          return (
            <div key={playlist.playlistId}>
              <Thumbnail
                idx={index}
                className='w-[250px]'
                title={playlist.playlistTitle}
                channel={playlist.channelTitle ?? ''}
                url={playlist.thumbnailUrl}
                height={playlist.thumbnailHeight}
                width={playlist.thumbnailWidth}
                aspectRatio='landscape'
                blurDataURL={playlist.blurDataURL}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}
