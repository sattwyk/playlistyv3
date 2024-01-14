import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';

import { siteConfig } from '@/config/site';
import { buttonVariants } from '@/components/ui/button';

export default function IndexPage() {
  return (
    <section className='container grid items-center gap-6 pb-8 pt-6 md:py-10'>
      <div className='flex max-w-[980px] flex-col items-start gap-2'>
        <h1 className='text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl'>
          Finally, a way to manage your YouTube playlists{' '}
          <br className='hidden sm:inline' />
          without getting distracted.
        </h1>
        <p className='max-w-[700px] text-lg text-muted-foreground sm:text-xl'>
          Playlisty is the perfect tool for students, professionals, and anyone
          who wants to stay on track and get things done. It&apos;s free and
          open source, so you can use it to your heart&apos;s content.
        </p>
      </div>
      <div className='flex gap-4'>
        <SignedIn>
          <Link href='/browse' className={buttonVariants({ size: 'lg' })}>
            Browse
          </Link>
        </SignedIn>
        <SignedOut>
          <Link href='/sign-in' className={buttonVariants({ size: 'lg' })}>
            Get Started
          </Link>
        </SignedOut>
        <Link
          target='_blank'
          rel='noreferrer'
          href={siteConfig.links.github}
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          GitHub
        </Link>
      </div>
    </section>
  );
}
