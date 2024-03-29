'use client';

import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { UserButton } from '@clerk/nextjs';
import { Box, Globe, LayoutGrid } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useTransition, useCallback, memo, useEffect } from 'react';
import { selectPlaylistSchema, selectTagSchema } from '@/db/schema';
import { z } from 'zod';
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Partial<z.infer<typeof selectPlaylistSchema>>[];
  userTags: Partial<z.infer<typeof selectTagSchema>>[];
}

const TOP_SIDEBAR_NAV = [
  {
    title: 'Browse',
    icon: LayoutGrid,
    href: '/browse',
  },
  {
    title: 'Discover',
    icon: Globe,
    href: '/discover',
  },
  {
    title: 'Extension',
    icon: Box,
    href: '/extension',
  },
];

export const Sidebar = memo(function Sidebar({
  className,
  playlists,
  userTags,
}: SidebarProps) {
  const path = usePathname();
  const [currentPath, setCurrentPath] = useState(path);
  const [isPending, startTransition] = useTransition();

  const handleNavLinkClick = useCallback(
    (href: string) => {
      startTransition(() => {
        setCurrentPath(href);
      });
    },
    [startTransition]
  );

  useEffect(() => {
    if (path !== currentPath) {
      setCurrentPath(path);
    }
  }, [path, currentPath]);

  return (
    <div className={cn('pb-12', className)}>
      <div className='space-y-4 py-4'>
        <div className='px-3 py-2'>
          <div className='flex items-center gap-2 mb-2 px-4'>
            <UserButton afterSignOutUrl='/' />
            <h2 className=' text-lg font-semibold tracking-tight'>Playlisty</h2>
          </div>

          <div className='space-y-1'>
            {TOP_SIDEBAR_NAV.map((nav) => (
              <Link passHref key={nav.href} href={nav.href}>
                <Button
                  disabled={isPending && nav.href != currentPath}
                  onClick={() => handleNavLinkClick(nav.href)}
                  variant={currentPath == nav.href ? 'default' : 'ghost'}
                  className='w-full justify-start'
                >
                  <nav.icon
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    viewBox='0 0 24 24'
                    className='mr-2 h-4 w-4 stroke-2 stroke-current fill-none'
                  />
                  {nav.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className='py-2'>
          <h2 className='relative px-7 text-lg font-semibold tracking-tight'>
            Tags
          </h2>
          <ScrollArea className='h-[300px] px-1'>
            <div className='space-y-1 p-2'>
              {userTags?.map((tag, i) => (
                <Link
                  key={`${tag.tagId}-${i}`}
                  href={`/playlist/tag/${tag.title}`}
                  passHref
                >
                  <Button
                    variant={
                      currentPath === `/playlist/tag/${tag.title}`
                        ? 'default'
                        : 'ghost'
                    }
                    className='w-full justify-start font-normal'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='mr-2 h-4 w-4'
                    >
                      <path d='M21 15V6' />
                      <path d='M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z' />
                      <path d='M12 12H3' />
                      <path d='M16 6H3' />
                      <path d='M12 18H3' />
                    </svg>
                    {tag.title}
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className='py-2'>
          <h2 className='relative px-7 text-lg font-semibold tracking-tight'>
            Playlists
          </h2>
          <ScrollArea className='h-[300px] px-1'>
            <div className='space-y-1 p-2'>
              {playlists?.map((playlist, i) => (
                <Button
                  key={`${playlist.playlistId}-${i}`}
                  variant='ghost'
                  className='w-full justify-start font-normal'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='mr-2 h-4 w-4'
                  >
                    <path d='M21 15V6' />
                    <path d='M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z' />
                    <path d='M12 12H3' />
                    <path d='M16 6H3' />
                    <path d='M12 18H3' />
                  </svg>
                  {playlist.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
});
