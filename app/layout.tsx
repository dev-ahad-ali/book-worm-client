import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/lib/providers';

export const metadata: Metadata = {
  title: 'BookWorm - Your Personal Reading Companion',
  description:
    'Discover, track, and share your reading journey with BookWorm - a personalized book recommendation and reading tracker application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='bg-background'>
      <body className={`font-sans! antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
