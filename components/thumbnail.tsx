import Image from 'next/image';
import { PlusCircleIcon } from 'lucide-react';
import { match } from 'ts-pattern';

import { cn } from '@/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface ThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio: 'portrait' | 'square' | 'landscape';
  width: number;
  height: number;
  title?: string;
  url: string;
  idx: number;
  channel?: string;
  blurDataURL: string;
}

export function Thumbnail({
  aspectRatio = 'portrait',
  width,
  height,
  title,
  channel,
  blurDataURL,
  url,
  idx,
  className,
  ...props
}: ThumbnailProps) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className='overflow-hidden rounded-md'>
            <Image
              src={url}
              style={{ transform: 'translate3d(0, 0, 0)' }}
              alt={title ?? ''}
              width={width}
              height={height}
              placeholder='blur'
              blurDataURL={blurDataURL}
              priority={idx < 4}
              loading={idx < 4 ? 'eager' : 'lazy'}
              className={cn(
                'transform h-auto w-auto object-cover transition-all hover:scale-105',
                match(aspectRatio)
                  .with('portrait', () => 'aspect-[3/4]')
                  .with('square', () => 'aspect-square')
                  .with('landscape', () => 'aspect-video')
                  .exhaustive()
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className='w-40'>
          <ContextMenuItem>Add to Library</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
            <ContextMenuSubContent className='w-48'>
              <ContextMenuItem>
                <PlusCircleIcon className='mr-2 h-4 w-4' />
                New Playlist
              </ContextMenuItem>
              <ContextMenuSeparator />
              {/* {playlists.map((playlist) => (
                <ContextMenuItem key={playlist}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='mr-2 h-4 w-4'
                    viewBox='0 0 24 24'
                  >
                    <path d='M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3' />
                  </svg>
                  {playlist}
                </ContextMenuItem>
              ))} */}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Play Next</ContextMenuItem>
          <ContextMenuItem>Play Later</ContextMenuItem>
          <ContextMenuItem>Create Station</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className='space-y-1 text-sm'>
        {title ? <h3 className='font-medium leading-none'>{title}</h3> : null}
        {channel ? (
          <p className='text-xs text-muted-foreground'>{channel}</p>
        ) : null}
      </div>
    </div>
  );
}
