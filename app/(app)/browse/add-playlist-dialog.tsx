'use client';

import { useRef, useState, useTransition } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { Button, buttonVariants } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function AddPlaylistDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [isCreateNewPending, setIsNewCreateNewPending] = useState(false);
  const [isImportPending, setIsImportPending] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = async () => {
    const playlistUrl = inputRef.current?.value;

    if (!playlistUrl) {
      return toast('Playlist URL Required', {
        description: 'Please enter a YouTube playlist URL.',
      });
    }

    const playlistId = playlistUrl.toString().split('list=')[1];

    if (!playlistId) {
      return toast('Invalid Playlist URL', {
        description: 'Please enter a valid YouTube playlist URL.',
      });
    }

    setIsImportPending(true);

    startTransition(() => {
      router.push(`/playlist/add/${playlistId}`);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent aria-disabled={isPending}>
        <DialogHeader>
          <DialogTitle>Add Playlist</DialogTitle>
          <DialogDescription>
            Copy and paste the Playlist URL to import.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='url'>Playlist URL</Label>
            <Input
              id='url'
              ref={inputRef}
              placeholder='https://www.youtube.com/playlist?list=[PLAYLIST_ID]'
            />
          </div>
        </div>
        <DialogFooter>
          <Link passHref prefetch href='/playlist/add/new'>
            <Button
              variant='secondary'
              disabled={isPending}
              onClick={() => {
                startTransition(() => {
                  setIsNewCreateNewPending(true);
                });
              }}
            >
              {isCreateNewPending ? (
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
              ) : null}
              Create New
            </Button>
          </Link>
          <Button disabled={isPending} onClick={handleClick}>
            {isImportPending ? (
              <Loader2 className='mr-2 h-5 w-5 animate-spin' />
            ) : null}
            Import Playlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
