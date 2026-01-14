'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchRecommendations } from '@/lib/slices/booksSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BookCard from '@/components/book-card';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Loader } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function RecommendationsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user;
  const { books, isLoading, error } = useAppSelector((state) => state.books);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.id) {
      dispatch(fetchRecommendations());
    }
  }, [isAuthenticated, router, dispatch, user?.id]);

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Recommendation Error',
        description: error,
      });
    }
  }, [error]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <div className='mb-4 flex items-start gap-3'>
              <Lightbulb className='text-primary mt-1 h-6 w-6' />
              <div>
                <h1 className='text-foreground text-3xl font-bold md:text-4xl'>
                  Personalized Recommendations
                </h1>
                <p className='text-muted-foreground mt-2'>
                  {books.length > 0
                    ? 'Curated just for you based on your reading history'
                    : 'Discover books based on top-rated selections'}
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className='flex h-64 items-center justify-center'>
              <Loader className='animate-spin' />
            </div>
          ) : books.length === 0 ? (
            <Card className='bg-card border-border/50'>
              <CardContent className='pt-12 pb-12 text-center'>
                <p className='text-muted-foreground mb-4'>
                  Start reading books to get personalized recommendations!
                </p>
                <a href='/browse' className='text-primary font-medium hover:underline'>
                  Browse books to start →
                </a>
              </CardContent>
            </Card>
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
