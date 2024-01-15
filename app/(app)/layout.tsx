import { Metadata } from 'next';

import { Sidebar } from './sidebar';

import React from 'react';
import { ProgressBar } from '@/components/progress-bar';

export const metadata: Metadata = {
  title: 'Music App',
  description: 'Example music app using the components.',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: LayoutProps) {
  return (
    <ProgressBar>
      <main className='min-h-screen bg-background'>
        <div className='md:block'>
          {/* <Menu /> */}
          <div className='border-t'>
            <div className='bg-background'>
              <div className='grid lg:grid-cols-5'>
                <Sidebar className='lg:block' />
                <div className='col-span-3 lg:col-span-4 lg:border-l'>
                  <div className='h-full px-4 py-6 lg:px-8'>{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProgressBar>
  );
}