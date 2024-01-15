import { AddPlaylistDialog } from './add-playlist-dialog';
import { PlaylistThumbnail } from '@/components/playlist-thumbnail';
import { PlaylistEmptyPlaceholder } from './playlist-empty-placeholder';
import { Button } from '@/components/ui/button';
import { ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PlusCircleIcon } from 'lucide-react';
import { getPlaylist } from '@/actions';

export default async function BrowsePage() {
  const { userPlaylists, error } = await getPlaylist();

  if (error) {
  }
  return (
    <main className='h-full'>
      <Tabs defaultValue='playlists' className='h-full space-y-6'>
        <div className='space-between flex items-center'>
          <TabsList>
            <TabsTrigger value='playlists' className='relative'>
              Playlists
            </TabsTrigger>
            <TabsTrigger value='libraries'>Libraries</TabsTrigger>
            <TabsTrigger value='videos' disabled>
              Videos <span className='italic'>(coming soon)</span>
            </TabsTrigger>
          </TabsList>
          <div className='ml-auto mr-4'>
            <AddPlaylistDialog>
              <Button>
                <PlusCircleIcon className='mr-2 h-4 w-4' />
                Add Playlist
              </Button>
            </AddPlaylistDialog>
          </div>
        </div>
        <TabsContent value='playlists' className='border-none p-0 outline-none'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Welcome back!
              </h2>
              <p className='text-muted-foreground'>
                Here&apos;s a list of your tasks for this month!
              </p>
            </div>
          </div>
          <Separator className='my-4' />
          <div className='relative'>
            <ScrollArea>
              <div className='flex space-x-4 pb-4'>
                {userPlaylists?.map((playlist) => (
                  <PlaylistThumbnail
                    key={playlist.playlistId}
                    className='w-[250px]'
                    aspectRatio='landscape'
                    title={playlist.title}
                    channel={playlist.channelTitle ?? ''}
                    url={playlist.thumbnail.url}
                    // blurDataURL={playlist.thumbnail?.blurDataURL!}
                    width={playlist.thumbnail.width}
                    height={playlist.thumbnail.height}
                  />
                ))}
              </div>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </div>
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
                {/* {madeForYouAlbums.map((album) => (
                              <AlbumArtwork
                                key={album.name}
                                album={album}
                                className='w-[150px]'
                                aspectRatio='square'
                                width={150}
                                height={150}
                              />
                            ))} */}
              </div>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent
          value='libraries'
          className='h-full flex-col border-none p-0 data-[state=active]:flex'
        >
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h2 className='text-2xl font-semibold tracking-tight'>
                New Episodes
              </h2>
              <p className='text-sm text-muted-foreground'>
                Your favorite podcasts. Updated daily.
              </p>
            </div>
          </div>
          <Separator className='my-4' />
          <PlaylistEmptyPlaceholder />
        </TabsContent>
      </Tabs>
    </main>
  );
}
