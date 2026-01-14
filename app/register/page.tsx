'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { registerUser } from '@/lib/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/image-upload';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: '',
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData({ ...formData, photo: imageUrl });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    const result = await dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photo: formData.photo,
      })
    );

    if (registerUser.fulfilled.match(result)) {
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
              <CardTitle className='text-2xl'>Join BookWorm</CardTitle>
              <CardDescription>Create your account to start reading</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className='space-y-4'>
              {error && (
                <div className='border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-3 text-sm'>
                  {error}
                </div>
              )}

              <ImageUpload
                onImageSelect={handleImageSelect}
                label='Profile Picture (Optional)'
                currentImage={formData.photo}
              />

              <div className='space-y-2'>
                <label htmlFor='name' className='text-foreground text-sm font-medium'>
                  Full Name
                </label>
                <Input
                  id='name'
                  type='text'
                  name='name'
                  placeholder='John Doe'
                  value={formData.name}
                  onChange={handleChange}
                  className='border-border bg-input'
                  required
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='email' className='text-foreground text-sm font-medium'>
                  Email Address
                </label>
                <Input
                  id='email'
                  type='email'
                  name='email'
                  placeholder='you@example.com'
                  value={formData.email}
                  onChange={handleChange}
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
                  name='password'
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={handleChange}
                  className='border-border bg-input'
                  required
                  minLength={6}
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='confirmPassword' className='text-foreground text-sm font-medium'>
                  Confirm Password
                </label>
                <Input
                  id='confirmPassword'
                  type='password'
                  name='confirmPassword'
                  placeholder='••••••••'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='border-border bg-input'
                  required
                  minLength={6}
                />
              </div>

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className='text-muted-foreground mt-6 text-center text-sm'>
              Already have an account?{' '}
              <Link href='/login' className='text-primary font-medium hover:underline'>
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
