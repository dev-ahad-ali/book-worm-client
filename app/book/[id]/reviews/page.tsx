'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { addReview } from '@/lib/slices/reviewsSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

export default function WriteReviewPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { books, isLoading } = useAppSelector((state) => state.books);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const book = books.find((b) => b._id === bookId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rating || !reviewText.trim()) {
      setError('Please provide a rating and review text');
      return;
    }

    if (reviewText.length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    try {
      await dispatch(
        addReview({
          bookId,
          userId: user!.id,
          userName: user!.name,
          rating,
          reviewText,
          status: 'pending',
          createdDate: new Date().toISOString(),
        })
      ).unwrap();

      setSubmitted(true);
      setTimeout(() => router.push(`/book/${bookId}`), 2000);
    } catch (err) {
      // setError(err as || 'Failed to submit review');
      console.log(err);
    }
  };

  if (isLoading) {
    return <div className='p-8 text-center'>Loading...</div>;
  }

  if (!book) {
    return <div className='p-8 text-center'>Book not found</div>;
  }

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8'>
          <Button variant='outline' onClick={() => router.back()} className='mb-6 bg-transparent'>
            ← Back to Book
          </Button>

          <div className='space-y-6'>
            {/* Book Info */}
            <div className='flex gap-4'>
              <div className='bg-muted h-24 w-16 flex-shrink-0 overflow-hidden rounded'>
                <img
                  src={book.coverImage || '/placeholder.svg'}
                  alt={book.title}
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='flex-grow'>
                <h2 className='text-foreground text-xl font-bold'>{book.title}</h2>
                <p className='text-muted-foreground'>by {book.author}</p>
              </div>
            </div>

            {/* Review Form */}
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle>Write Your Review</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className='space-y-3 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950'>
                    <p className='font-medium text-green-800 dark:text-green-200'>
                      Review submitted successfully!
                    </p>
                    <p className='text-sm text-green-700 dark:text-green-300'>
                      Your review is pending approval. Youll be redirected shortly...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    {error && (
                      <div className='bg-destructive/10 border-destructive/30 text-destructive rounded-lg border p-3 text-sm'>
                        {error}
                      </div>
                    )}

                    {/* Rating */}
                    <div className='space-y-3'>
                      <label className='text-foreground text-sm font-medium'>Rating</label>
                      <div className='flex gap-2'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type='button'
                            onClick={() => setRating(star)}
                            className='transition-transform hover:scale-110'
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= rating
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-muted-foreground hover:text-yellow-500'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <p className='text-muted-foreground text-sm'>{rating} out of 5 stars</p>
                      )}
                    </div>

                    {/* Review Text */}
                    <div className='space-y-3'>
                      <label htmlFor='review' className='text-foreground text-sm font-medium'>
                        Your Review
                      </label>
                      <Textarea
                        id='review'
                        placeholder='Share your thoughts about this book...'
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={6}
                        className='bg-input border-border resize-none'
                      />
                      <p className='text-muted-foreground text-xs'>
                        {reviewText.length} characters
                      </p>
                    </div>

                    <Button type='submit' className='w-full'>
                      Submit Review
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
