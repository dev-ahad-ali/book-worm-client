'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchReviews, approveReview, rejectReview } from '@/lib/slices/reviewsSlice';
import { fetchBooks } from '@/lib/slices/booksSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Star } from 'lucide-react';

const ITEMS_PER_PAGE = 6;
export default function ModerateReviewsPage() {
  const { reviews, isLoading, error } = useAppSelector((state) => state.reviews);
  const { books } = useAppSelector((state) => state.books);
  const dispatch = useAppDispatch();
  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);

  useEffect(() => {
    dispatch(fetchReviews());
    dispatch(fetchBooks());
  }, [dispatch]);

  const pendingReviews = reviews.filter((r) => r.status === 'pending');
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const paginatedPending = pendingReviews.slice(
    (pendingPage - 1) * ITEMS_PER_PAGE,
    pendingPage * ITEMS_PER_PAGE
  );

  const paginatedApproved = approvedReviews.slice(
    (approvedPage - 1) * ITEMS_PER_PAGE,
    approvedPage * ITEMS_PER_PAGE
  );

  const pendingTotalPages = Math.ceil(pendingReviews.length / ITEMS_PER_PAGE);
  const approvedTotalPages = Math.ceil(approvedReviews.length / ITEMS_PER_PAGE);

  const handleApprove = async (reviewId: string) => {
    try {
      await dispatch(approveReview(reviewId)).unwrap();
    } catch (error) {
      alert(error || 'Failed to approve review');
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await dispatch(rejectReview(reviewId)).unwrap();
    } catch (error) {
      alert(error || 'Failed to reject review');
    }
  };

  const getBookTitle = (bookId: string) => books.find((b) => b._id === bookId)?.title || 'Unknown';

  if (isLoading) return <div className='p-8 text-center'>Loading reviews...</div>;
  if (error) return <div className='p-8 text-center text-red-500'>Error: {error}</div>;
  const ReviewCard = ({ review }: { review: (typeof reviews)[0] }) => (
    <Card className='bg-card border-border/50'>
      <CardContent className='pt-6'>
        <div className='space-y-4'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-foreground font-semibold'>{review.userName}</p>
              <p className='text-muted-foreground text-xs'>{getBookTitle(review.bookId)}</p>
            </div>
            <div className='flex gap-1'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
          </div>

          <p className='text-foreground text-sm'>{review.reviewText}</p>

          {review.status === 'pending' && (
            <div className='flex gap-2'>
              <Button size='sm' onClick={() => handleApprove(review._id)} className='flex-1 gap-2'>
                <Check className='h-4 w-4' />
                Approve
              </Button>
              <Button
                size='sm'
                variant='destructive'
                onClick={() => handleReject(review._id)}
                className='flex-1 gap-2'
              >
                <X className='h-4 w-4' />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-foreground mb-2 text-3xl font-bold'>Moderate Reviews</h1>
            <p className='text-muted-foreground'>Approve or reject user reviews</p>
          </div>

          <Tabs defaultValue='pending' className='space-y-6'>
            <TabsList className='bg-muted border-border'>
              <TabsTrigger value='pending'>Pending ({pendingReviews.length})</TabsTrigger>
              <TabsTrigger value='approved'>Approved ({approvedReviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value='pending'>
              {paginatedPending.length === 0 ? (
                <Card className='bg-card border-border/50'>
                  <CardContent className='pt-8 pb-8 text-center'>
                    <p className='text-muted-foreground'>No pending reviews</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className='space-y-4'>
                    {paginatedPending.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                  {pendingTotalPages > 1 && (
                    <div className='mt-8 flex justify-center gap-2'>
                      <Button
                        variant='outline'
                        disabled={pendingPage === 1}
                        onClick={() => setPendingPage(pendingPage - 1)}
                        className='bg-transparent'
                      >
                        Previous
                      </Button>
                      {Array.from({ length: pendingTotalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === pendingPage ? 'default' : 'outline'}
                          onClick={() => setPendingPage(page)}
                          className={page !== pendingPage ? 'bg-transparent' : ''}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant='outline'
                        disabled={pendingPage === pendingTotalPages}
                        onClick={() => setPendingPage(pendingPage + 1)}
                        className='bg-transparent'
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value='approved'>
              {paginatedApproved.length === 0 ? (
                <Card className='bg-card border-border/50'>
                  <CardContent className='pt-8 pb-8 text-center'>
                    <p className='text-muted-foreground'>No approved reviews</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className='space-y-4'>
                    {paginatedApproved.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                  {approvedTotalPages > 1 && (
                    <div className='mt-8 flex justify-center gap-2'>
                      <Button
                        variant='outline'
                        disabled={approvedPage === 1}
                        onClick={() => setApprovedPage(approvedPage - 1)}
                        className='bg-transparent'
                      >
                        Previous
                      </Button>
                      {Array.from({ length: approvedTotalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === approvedPage ? 'default' : 'outline'}
                          onClick={() => setApprovedPage(page)}
                          className={page !== approvedPage ? 'bg-transparent' : ''}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant='outline'
                        disabled={approvedPage === approvedTotalPages}
                        onClick={() => setApprovedPage(approvedPage + 1)}
                        className='bg-transparent'
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
