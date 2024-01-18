'use client';

import { Thumbnail } from '@/components/thumbnail';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { SketchPicker } from 'react-color';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Loader2, Tag, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRef, useContext, createContext, useTransition } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { VideoInfo, PlaylistInfo } from '@/lib/youtube';
import { PlaylistStore, createPlaylistStore } from './playlist-store';
import { cn } from '@/utils';
import { useStore } from 'zustand';
import { addPlaylist } from '@/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const PlaylistContext = createContext<PlaylistStore | null>(null);
export function AddPlaylistForm({
  videos,
  playlist,
  userTags,
}: {
  videos: VideoInfo[];
  playlist: PlaylistInfo;
  userTags: { title: string; tagId: number; color: string }[];
}) {
  const store = useRef(
    createPlaylistStore({ videos, playlist, userTags, selectedTags: [] })
  ).current;

  return (
    <PlaylistContext.Provider value={store}>
      <AddPlaylistFormConsumer />
    </PlaylistContext.Provider>
  );
}

function AddPlaylistFormConsumer() {
  const contextStore = useContext(PlaylistContext);
  if (!contextStore)
    throw new Error('Missing PlaylistContext.Provider in the tree');
  const store = useStore(contextStore, (s) => s);
  const [parent] = useAutoAnimate();
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className='grid grid-cols-2 gap-3'>
      <div className='flex gap-3'>
        <div className='flex flex-col gap-3'>
          <Thumbnail
            className='w-full'
            idx={0}
            url={store.playlist.thumbnail.url}
            // title={playlist.title}
            // blurDataURL={store.playlist.thumbnail.blurDataURL}
            channel={store.playlist.channelTitle}
            height={store.playlist.thumbnail.height}
            width={store.playlist.thumbnail.width}
            aspectRatio='landscape'
          />
          <div className='grid w-full gap-1.5'>
            <Label htmlFor='title'>Title</Label>
            <Input
              name='title'
              id='title'
              type='text'
              required
              placeholder='Type your title here.'
              value={store.playlist.title}
              onChange={(e) => store.changePlaylistTitle(e.target.value)}
            />
          </div>

          <div className='grid w-full gap-1.5'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              className='line-clamp-6 h-fit'
              name='description'
              value={store.playlist.description}
              onChange={(e) => store.changePlaylistDescription(e.target.value)}
              placeholder='Type your description here.'
              id='description'
            />
          </div>

          <div className='grid w-full gap-1.5'>
            <Label htmlFor='tags'>Tags</Label>
            <div ref={parent} className='flex items-center gap-1'>
              {store.selectedTags.map((tag, index) => (
                <Badge
                  key={`selected_tabs__${index}`}
                  variant='outline'
                  className='w-fit h-8 hover:bg-secondary'
                >
                  <div
                    className={cn(
                      'p-1 h-3 w-3 rounded-full mr-1',
                      `bg-[${tag.color}]`
                    )}
                  />
                  <span>{tag.title}</span>
                  <Button
                    disabled={isPending}
                    size='icon'
                    onClick={() => {
                      store.removeSelectedTag(tag);
                    }}
                    variant='ghost'
                    className='rounded-full h-5 w-5 ml-1'
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </Badge>
              ))}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    disabled={isPending}
                    className='h-8 rounded-2xl'
                    variant='secondary'
                  >
                    <Tag className='h-5 w-5 mr-2' />
                    Add Tags
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Command className='w-[250px]'>
                    <CommandInput
                      ref={tagInputRef}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (e.currentTarget.value) {
                            store.addSelectedTag({
                              title: e.currentTarget.value
                                .toLowerCase()
                                .trim()
                                .split(' ')[0],
                              color: '#fff',
                            });
                          }
                        }
                      }}
                      className='h-9'
                      placeholder='Search tags...'
                    />
                    <CommandEmpty>No tags found.</CommandEmpty>
                    <CommandGroup>
                      {store.userTags
                        .filter(
                          (tag) =>
                            !store.selectedTags.some(
                              (selected) => selected.title === tag.title
                            )
                        )
                        .map((tag, index) => (
                          <CommandItem
                            onSelect={() => store.addSelectedTag(tag)}
                            key={`tag__${index}`}
                          >
                            {tag.title}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* <Textarea>{playlist.description}</Textarea> */}

          <Button
            disabled={isPending}
            onClick={async () => {
              const playlist = {
                ...store.playlist,
                originYTPlaylistId: store.playlist.youtubePlaylistId,
                thumbnailHeight: store.playlist.thumbnail.height,
                thumbnailWidth: store.playlist.thumbnail.width,
                thumbnailUrl: store.playlist.thumbnail.url,
              };

              const videos = store.videos.map((video) => ({
                ...video,
                originalYTVideoId: video.youtubeVideoId,
                thumbnailHeight: video.thumbnail.height,
                thumbnailWidth: video.thumbnail.width,
                thumbnailUrl: video.thumbnail.url,
              }));

              return startTransition(async () => {
                const { error, success } = await addPlaylist({
                  playlist,
                  videos,
                  tags: store.selectedTags,
                });
                if (error) toast(error);

                if (success) {
                  toast(success);
                  router.push('/browse');
                }
                return;
              });
            }}
          >
            {isPending ? (
              <Loader2 className='mr-2 h-5 w-5 animate-spin' />
            ) : null}
            Add Playlist
          </Button>
        </div>
        <Separator orientation='vertical' />
      </div>

      <div className='flex flex-col gap-3'>
        <div className='grid gap-5'>
          {/* <div className='justify-self-end'>
            <ThemeToggle />
          </div> */}

          <h2 className='text-2xl font-bold'>Videos</h2>
          <p className='text-muted-foreground'>Add videos to your playlist.</p>
          <div className='grid w-full gap-1.5'>
            <Label htmlFor='video'>Video URL</Label>
            <div className='flex items-center justify-center gap-3'>
              <Input
                // ref={inputVideoRef}
                name='video'
                id='video'
                type='text'
                placeholder='https://www.youtube.com/watch?v=...'
              />
              <Button
                disabled={isPending}
                type='button'
                className='justify-self-end'
                variant='secondary'
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        <ScrollArea className='h-[600px] w-full grid gap-1'>
          {store.videos.map((video, index) => (
            <div key={video.youtubeVideoId} className='flex gap-2 items-center'>
              <Thumbnail
                className='max-w-[120px]'
                idx={index}
                url={video.thumbnail.url}
                //   title={video.title}
                //   channel={video.channelTitle}
                // blurDataURL={video.thumbnail.blurDataURL}
                height={video.thumbnail.height}
                width={video.thumbnail.width}
                aspectRatio='landscape'
              />
              <p className='truncate'>{video.title}</p>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
