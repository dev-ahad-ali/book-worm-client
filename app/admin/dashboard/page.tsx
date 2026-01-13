'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchAdminStats } from '@/lib/slices/adminStatsSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, MessageSquare, Star, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { stats, isLoading, error } = useAppSelector((state) => state.adminStats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (isLoading) {
    return <div className='p-8 text-center'>Loading dashboard...</div>;
  }

  if (error) {
    return <div className='p-8 text-center text-red-500'>Error: {error}</div>;
  }

  if (!stats) {
    return null;
  }

  const booksPerGenreData = stats.booksPerGenre.map((genre) => ({
    name: genre._id,
    books: genre.count,
  }));

  const statsData = [
    { label: 'Total Books', value: stats.books, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-green-600' },
    { label: 'Total Genres', value: stats.genres, icon: BookOpen, color: 'text-purple-600' },
    {
      label: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: MessageSquare,
      color: 'text-orange-600',
    },
    {
      label: 'Approved Reviews',
      value: stats.approvedReviews,
      icon: Star,
      color: 'text-yellow-600',
    },
  ];

  const totalReviews = stats.pendingReviews + stats.approvedReviews;

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-foreground mb-2 text-3xl font-bold md:text-4xl'>Admin Dashboard</h1>
            <p className='text-muted-foreground'>Manage your BookWorm platform</p>
          </div>

          {/* Stats Grid */}
          <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className='bg-card border-border/50'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='flex items-center gap-2 text-sm font-medium'>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-foreground text-3xl font-bold'>{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Books Per Genre Chart */}
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <TrendingUp className='text-primary h-5 w-5' />
                  <CardTitle>Books Per Genre</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart
                    data={booksPerGenreData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' angle={-45} textAnchor='end' height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey='books'
                      fill='hsl(var(--chart-1))'
                      name='Books'
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reviews Overview */}
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle>Reviews Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='bg-muted/50 border-border rounded-lg border p-4'>
                    <div className='mb-2 flex items-center justify-between'>
                      <p className='text-foreground text-sm font-medium'>Pending Reviews</p>
                      <span className='text-2xl font-bold text-orange-600'>
                        {stats.pendingReviews}
                      </span>
                    </div>
                    <p className='text-muted-foreground text-xs'>Awaiting moderation</p>
                  </div>
                  <div className='bg-muted/50 border-border rounded-lg border p-4'>
                    <div className='mb-2 flex items-center justify-between'>
                      <p className='text-foreground text-sm font-medium'>Approved Reviews</p>
                      <span className='text-2xl font-bold text-green-600'>
                        {stats.approvedReviews}
                      </span>
                    </div>
                    <p className='text-muted-foreground text-xs'>Published reviews</p>
                  </div>
                  <div className='bg-muted/50 border-border rounded-lg border p-4'>
                    <div className='mb-2 flex items-center justify-between'>
                      <p className='text-foreground text-sm font-medium'>Total Reviews</p>
                      <span className='text-2xl font-bold text-blue-600'>{totalReviews}</span>
                    </div>
                    <p className='text-muted-foreground text-xs'>All reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Cards */}
          <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Recent Books */}
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle>Recent Books ({stats.recentBooks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {stats.recentBooks.map((book) => (
                    <div
                      key={book._id}
                      className='bg-muted/50 border-border/50 flex items-start justify-between rounded border p-3'
                    >
                      <div>
                        <p className='text-foreground text-sm font-medium'>{book.title}</p>
                        <p className='text-muted-foreground text-xs'>{book.author}</p>
                      </div>
                      <span className='text-primary text-xs font-medium'>{book.genre}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle>Pending Reviews ({stats.pendingReviewsList.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.pendingReviewsList.length === 0 ? (
                  <p className='text-muted-foreground text-sm'>No pending reviews</p>
                ) : (
                  <div className='space-y-3'>
                    {stats.pendingReviewsList.map((review) => (
                      <div
                        key={review._id}
                        className='bg-muted/50 border-border/50 rounded border p-3'
                      >
                        <p className='text-foreground text-sm font-medium'>{review.userName}</p>
                        <p className='text-muted-foreground line-clamp-1 text-xs'>
                          {review.reviewText}
                        </p>
                        <p className='text-muted-foreground mt-1 text-xs'>
                          For book: {review.book.title}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Management Links */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                title: 'Manage Books',
                href: '/admin/books',
                description: 'Add, edit, or delete books',
              },
              {
                title: 'Manage Genres',
                href: '/admin/genres',
                description: 'Create and manage genres',
              },
              {
                title: 'Manage Users',
                href: '/admin/users',
                description: 'View and change user roles',
              },
              {
                title: 'Moderate Reviews',
                href: '/admin/reviews',
                description: 'Approve or delete reviews',
              },
              {
                title: 'Manage Tutorials',
                href: '/admin/tutorials',
                description: 'Add or remove tutorials',
              },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className='border-border bg-card rounded-lg border p-6 transition-shadow hover:shadow-lg'
              >
                <h3 className='text-foreground mb-1 font-semibold'>{link.title}</h3>
                <p className='text-muted-foreground text-sm'>{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
