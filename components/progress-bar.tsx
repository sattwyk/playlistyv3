'use client';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './progress-bar.css';
import { useEffect, useTransition } from 'react';

export function ProgressBar({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const path = usePathname();
  const Progress = NProgress.configure({
    speed: 500,
  });

  useEffect(() => {
    startTransition(() => {
      Progress.start();
    });
  }, [path, Progress]);

  if (isPending) {
    Progress.start();
  } else {
    Progress.done();
  }

  return <>{children}</>;
}
