import { Button } from '@/components/ui/button';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-6xl'>Playlisty</h1>

      <p>Manage your youtube playlists without getting distracted</p>
      <SignedIn>
        <Link passHref href='/dashboard'>
          <Button variant='secondary'>Dashboard</Button>
        </Link>
      </SignedIn>
      <SignedOut>
        <SignInButton mode='modal'>
          <Button variant='default'>Sign in with Google</Button>
        </SignInButton>
      </SignedOut>
    </main>
  );
}
