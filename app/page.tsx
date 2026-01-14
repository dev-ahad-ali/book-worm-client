'use client';

import { useAppDispatch } from '@/lib/hooks';
import { loadUser } from '@/lib/slices/authSlice';
import { useEffect } from 'react';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <p className='text-muted-foreground'>Redirecting...</p>
      </div>
    </div>
  );
}
