'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { loginSuccess } from '@/lib/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo credentials
    if (email === 'user@example.com' && password === 'password') {
      dispatch(
        loginSuccess({
          id: 'user1',
          name: 'John Reader',
          email: 'user@example.com',
          role: 'user',
        })
      );
      router.push('/library');
    } else if (email === 'admin@example.com' && password === 'password') {
      dispatch(
        loginSuccess({
          id: 'admin1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        })
      );
      router.push('/admin/dashboard');
    } else {
      setError(
        "Invalid email or password. Try user@example.com / admin@example.com with password 'password'"
      );
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
                <div className='bg-destructive/10 border-destructive/30 text-destructive rounded-lg border p-3 text-sm'>
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
                  className='bg-input border-border'
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
                  className='bg-input border-border'
                />
              </div>

              <Button type='submit' className='w-full'>
                Sign In
              </Button>
            </form>

            <div className='border-border mt-6 space-y-4 border-t pt-6'>
              <p className='text-muted-foreground text-center text-xs'>Demo Credentials:</p>
              <div className='space-y-2 text-xs'>
                <div className='bg-muted/50 border-border/50 rounded border p-2'>
                  <p className='text-foreground font-medium'>User Demo:</p>
                  <p className='text-muted-foreground'>Email: user@example.com</p>
                  <p className='text-muted-foreground'>Password: password</p>
                </div>
                <div className='bg-muted/50 border-border/50 rounded border p-2'>
                  <p className='text-foreground font-medium'>Admin Demo:</p>
                  <p className='text-muted-foreground'>Email: admin@example.com</p>
                  <p className='text-muted-foreground'>Password: password</p>
                </div>
              </div>
            </div>

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
