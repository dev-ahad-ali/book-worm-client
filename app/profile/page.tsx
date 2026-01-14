'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar } from 'lucide-react';
import { Loader } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const { user, loading: isLoading, error } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user;

  const { items: libraryItems } = useAppSelector((state) => state.library);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error loading profile',
        description: error,
      });
    }
  }, [error]);

  if (!isAuthenticated || !user) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader className='animate-spin' />
      </div>
    );
  }

  const readBooks = libraryItems.filter((item) => item.shelfType === 'read').length;
  const currentlyReading = libraryItems.filter(
    (item) => item.shelfType === 'currentlyReading'
  ).length;
  const wantToRead = libraryItems.filter((item) => item.shelfType === 'wantToRead').length;

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-foreground mb-2 text-3xl font-bold md:text-4xl'>My Profile</h1>
            <p className='text-muted-foreground'>
              Manage your account settings and view your reading stats
            </p>
          </div>

          {isLoading ? (
            <div className='flex h-64 items-center justify-center'>
              <Loader className='animate-spin' />
            </div>
          ) : (
            <>
              {/* Profile Card */}
              <Card className='bg-card border-border/50 mb-8'>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* User Avatar */}
                  <div className='flex items-center gap-4'>
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt={user.name}
                        className='h-16 w-16 rounded-full object-cover'
                      />
                    ) : (
                      <div className='bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold'>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h2 className='text-foreground text-xl font-semibold'>{user.name}</h2>
                      <p className='text-muted-foreground text-sm capitalize'>{user.role} User</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className='border-border space-y-4 border-t pt-4'>
                    <div className='flex items-center gap-3'>
                      <Mail className='text-muted-foreground h-5 w-5' />
                      <div>
                        <p className='text-muted-foreground text-sm'>Email Address</p>
                        <p className='text-foreground font-medium'>{user.email}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <User className='text-muted-foreground h-5 w-5' />
                      <div>
                        <p className='text-muted-foreground text-sm'>Account Type</p>
                        <p className='text-foreground font-medium capitalize'>{user.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-3'>
                <Card className='bg-card border-border/50'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-sm font-medium'>Books Read</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-foreground text-3xl font-bold'>{readBooks}</p>
                  </CardContent>
                </Card>

                <Card className='bg-card border-border/50'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-sm font-medium'>Currently Reading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-foreground text-3xl font-bold'>{currentlyReading}</p>
                  </CardContent>
                </Card>

                <Card className='bg-card border-border/50'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-sm font-medium'>Want to Read</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-foreground text-3xl font-bold'>{wantToRead}</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
