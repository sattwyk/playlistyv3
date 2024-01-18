import { AddPlaylistDialog } from './add-playlist-dialog';
import { Thumbnail } from '@/components/thumbnail';
import { PlaylistEmptyPlaceholder } from './playlist-empty-placeholder';
import { Button } from '@/components/ui/button';
import { ScrollBar } from '@/components/ui/scroll-area';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PlusCircleIcon } from 'lucide-react';
import { getUserPlaylists } from '@/actions';
import Link from 'next/link';
import { PrivatePlaylists } from './private-playlists';

export default async function BrowsePage() {
  const { userPlaylists, error } = await getUserPlaylists();

  if (error) {
  }
  return (
    <main className='h-full'>
      {userPlaylists?.length ? (
        <>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Welcome back!
              </h2>
              <p className='text-muted-foreground'>
                Here&apos;s a list of your tasks for this month!
              </p>
            </div>
            <div className='ml-auto mr-4'>
              <AddPlaylistDialog>
                <Button>
                  <PlusCircleIcon className='mr-2 h-4 w-4' />
                  Add Playlist
                </Button>
              </AddPlaylistDialog>
            </div>
          </div>
          <Separator className='my-4' />
          <div className='relative'>
            <ScrollArea>
              <div className='flex space-x-4 pb-4'>
                {userPlaylists?.map((playlist, index) => (
                  <Link
                    key={playlist.playlistId}
                    href={`/playlist/${playlist.playlistId}`}
                    passHref
                  >
                    <Thumbnail
                      idx={index}
                      className='w-[250px]'
                      aspectRatio='landscape'
                      title={playlist.title}
                      channel={playlist.channelTitle ?? ''}
                      url={playlist.thumbnail.url}
                      // blurDataURL={playlist.thumbnail.blurDataURL}
                      width={playlist.thumbnail.width}
                      height={playlist.thumbnail.height}
                    />
                  </Link>
                ))}
              </div>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </div>
          <PrivatePlaylists />
        </>
      ) : (
        <>
          <PrivatePlaylists />
          <div className='mt-6 space-y-1'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Hey, Looks like you need to add some awesome playlists
            </h2>
            <p className='text-sm text-muted-foreground'>
              Here are some of your existing playlists you might add
            </p>
          </div>
          <Separator className='my-4' />
          <PlaylistEmptyPlaceholder />
        </>
      )}
    </main>
  );
}
