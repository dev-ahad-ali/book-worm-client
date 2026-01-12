'use client';

import type React from 'react';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useAppDispatch } from './hooks';
import { useEffect } from 'react';
import { loadUser } from './slices/authSlice';

export default function Providers({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return <Provider store={store}>{children}</Provider>;
}
