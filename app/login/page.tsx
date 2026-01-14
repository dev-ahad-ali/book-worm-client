'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser } from '@/lib/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      router.push(result.payload.role === 'admin' ? '/admin/dashboard' : '/library');
    }
  };

  return (
    <div className='from-background to-secondary/10 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-8'>
      <div className='w-full max-w-md'>
        <Card className='border-border/50 shadow-lg'>
          <CardHeader className='space-y-4 text-center'>
            <div className='flex justify-center'>
              <div className='bg-primary/10 rounded-lg p-3'>
                <BookOpen className='text-primary h-8 w-8' />
              </div>
            </div>
            <div>
              <CardTitle className='text-2xl'>Welcome to BookWorm</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className='space-y-4'>
              {error && (
                <div className='border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-3 text-sm'>
                  {error}
                </div>
              )}

              <div className='space-y-2'>
                <label htmlFor='email' className='text-foreground text-sm font-medium'>
                  Email Address
                </label>
                <Input
                  id='email'
                  type='email'
                  placeholder='user@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='border-border bg-input'
                  required
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='password' className='text-foreground text-sm font-medium'>
                  Password
                </label>
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='border-border bg-input'
                  required
                />
              </div>

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <p className='text-muted-foreground mt-6 text-center text-sm'>
              Don{"'"}t have an account?{' '}
              <Link href='/register' className='text-primary font-medium hover:underline'>
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
