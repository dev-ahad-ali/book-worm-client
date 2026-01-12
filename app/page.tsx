'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

export default function Home() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/home');
      }
    }
  }, [isAuthenticated, user?.role, router]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <p className='text-muted-foreground'>Redirecting...</p>
      </div>
    </div>
  );
}
