import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BookWorm',
  description: 'A Personalized Book Recommendation & Reading Tracker Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='dark'>
      <body className={`bg-background font-sans antialiased`}>{children}</body>
    </html>
  );
}
