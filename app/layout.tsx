import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
    <html lang='en' className='dark'>
      <body className={`font-sans! antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
