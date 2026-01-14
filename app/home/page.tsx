'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchRecommendations } from '@/lib/slices/booksSlice';
import { fetchReadingStats, updateAnnualGoal } from '@/lib/slices/readingGoalsSlice';
import { fetchActivityFeed, fetchSuggestedUsers, followUser } from '@/lib/slices/socialSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BookCard from '@/components/book-card';
import { ReadingGoalCard } from '@/components/reading-goal-card';
import { GenreDistributionChart } from '@/components/charts/genre-distribution-chart';
import { MonthlyBooksChart } from '@/components/charts/monthly-books-chart';
import { PagesOverTimeChart } from '@/components/charts/pages-over-time-chart';
import { ActivityFeed } from '@/components/activity-feed';
import { FollowUsersCard } from '@/components/follow-users-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, BookMarked, Clock, CheckCircle, Loader } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import type { SocialUser } from '@/lib/slices/socialSlice';
import type { Book } from '@/lib/slices/booksSlice';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user;
  const {
    books,
    isLoading: booksLoading,
    error: booksError,
  } = useAppSelector((state) => state.books);
  const { items: libraryItems } = useAppSelector((state) => state.library);
  const {
    currentGoal,
    isLoading: goalsLoading,
    error: goalsError,
  } = useAppSelector((state) => state.readingGoals);
  const {
    activities,
    suggestedUsers,
    isLoading: socialLoading,
    error: socialError,
  } = useAppSelector((state) => state.social);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.id) {
      // Changed from user?.id to user?._id
      dispatch(fetchRecommendations());
      dispatch(fetchReadingStats());
      dispatch(fetchActivityFeed());
      dispatch(fetchSuggestedUsers());
    }
  }, [isAuthenticated, router, dispatch, user?.id]); // Fixed dependency array

  useEffect(() => {
    const error = booksError || goalsError || socialError;
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Loading Error',
        description: error,
      });
    }
  }, [booksError, goalsError, socialError]);

  const handleUpdateGoal = async (newGoal: number) => {
    try {
      await dispatch(updateAnnualGoal(newGoal)).unwrap();
      toast({
        title: 'Goal Updated',
        description: 'Your reading goal has been updated successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update goal',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader className='animate-spin' />
      </div>
    );
  }

  const isLoading = booksLoading || goalsLoading || socialLoading;

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          <div className='mb-12'>
            <h1 className='text-foreground mb-2 text-4xl font-bold md:text-5xl'>
              {currentGoal?.booksReadThisYear
                ? `You've read ${currentGoal.booksReadThisYear} books this year!`
                : 'Welcome Back'}
            </h1>
            <p className='text-muted-foreground text-lg'>
              {currentGoal?.annualGoal
                ? `${currentGoal.annualGoal - currentGoal.booksReadThisYear} books left to reach your goal`
                : 'Set a reading goal to get started'}
            </p>
          </div>

          <div className='mb-12 grid grid-cols-1 gap-4 md:grid-cols-3'>
            <StatCard
              icon={<BookMarked className='text-primary h-4 w-4' />}
              title='Want to Read'
              value={libraryItems.filter((i) => i.shelfType === 'wantToRead').length}
            />
            <StatCard
              icon={<Clock className='text-accent h-4 w-4' />}
              title='Currently Reading'
              value={libraryItems.filter((i) => i.shelfType === 'currentlyReading').length}
            />
            <StatCard
              icon={<CheckCircle className='h-4 w-4 text-green-600' />}
              title='Books Read'
              value={currentGoal?.booksReadThisYear || 0}
            />
          </div>

          {currentGoal && (
            <div className='mb-12'>
              <h2 className='text-foreground mb-6 text-3xl font-bold'>Your Reading Challenge</h2>
              <ReadingGoalCard goal={currentGoal} onUpdateGoal={handleUpdateGoal} />
            </div>
          )}

          <div className='mb-12'>
            <h2 className='text-foreground mb-6 text-3xl font-bold'>Your Reading Analytics</h2>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {currentGoal?.genreDistribution && (
                <GenreDistributionChart data={currentGoal.genreDistribution} />
              )}
              {currentGoal?.monthlyProgress && (
                <MonthlyBooksChart data={currentGoal.monthlyProgress} />
              )}
              {currentGoal?.weeklyPages && <PagesOverTimeChart data={currentGoal.weeklyPages} />}
              <div className='space-y-6'>
                <ActivityFeed activities={activities} />
                <FollowUsersCard
                  suggestedUsers={suggestedUsers}
                  onFollow={(user: SocialUser) => dispatch(followUser(user))}
                />
              </div>
            </div>
          </div>

          <div className='mb-12'>
            <div className='mb-6 flex items-start gap-3'>
              <Lightbulb className='text-primary mt-1 h-6 w-6' />
              <div>
                <h2 className='text-foreground text-3xl font-bold'>Personalized Recommendations</h2>
                <p className='text-muted-foreground mt-2'>
                  {books.length > 0
                    ? 'Curated based on your reading preferences'
                    : 'Loading recommendations...'}
                </p>
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
                </CardContent>
              </Card>
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {books.slice(0, 6).map((book: Book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) => (
  <Card className='bg-card border-border/50'>
    <CardHeader className='pb-3'>
      <CardTitle className='flex items-center gap-2 text-sm font-medium'>
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className='text-foreground text-2xl font-bold'>{value}</p>
    </CardContent>
  </Card>
);
