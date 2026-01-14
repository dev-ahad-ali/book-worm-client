'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchBookDetails } from '@/lib/slices/booksSlice';
import { fetchBookReviews } from '@/lib/slices/reviewsSlice';
import { addToLibrary, removeFromLibrary, moveToShelf } from '@/lib/slices/librarySlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Star, BookOpen, Clock, CheckCircle, MessageCircle } from 'lucide-react';

export default function BookDetailsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { books, isLoading, error } = useAppSelector((state) => state.books);
  const { bookReviews, isLoading: reviewsLoading } = useAppSelector((state) => state.reviews);
  const { items: libraryItems } = useAppSelector((state) => state.library);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  useEffect(() => {
    if (bookId) {
      dispatch(fetchBookDetails(bookId));
      dispatch(fetchBookReviews(bookId));
    }
  }, [bookId, dispatch]);

  const book = books.find((b) => b._id === bookId);
  const libraryItem = libraryItems.find((item) => item.bookId === bookId);

  const handleAddToShelf = async (shelf: 'wantToRead' | 'currentlyReading' | 'read') => {
    if (libraryItem) {
      await dispatch(moveToShelf({ bookId, shelfType: shelf })).unwrap();
    } else {
      await dispatch(
        addToLibrary({
          bookId,
          shelfType: shelf,
          addedDate: new Date().toISOString(),
        })
      ).unwrap();
    }
    // Refresh library
    // dispatch(fetchLibrary());
  };

  const handleRemove = async () => {
    await dispatch(removeFromLibrary(bookId)).unwrap();
    // dispatch(fetchLibrary());
  };

  if (isLoading) {
    return <div className='p-8 text-center'>Loading book details...</div>;
  }

  if (error) {
    return <div className='p-8 text-center text-red-500'>Error: {error}</div>;
  }

  if (!book) {
    return <div className='p-8 text-center'>Book not found</div>;
  }

  const avgReviewRating =
    bookReviews.length > 0
      ? (bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length).toFixed(1)
      : '0';

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* Back Button */}
          <Button variant='outline' onClick={() => router.back()} className='mb-6 bg-transparent'>
            ← Back
          </Button>

          {/* Book Header */}
          <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {/* Book Cover */}
            <div className='md:col-span-1'>
              <div className='bg-muted relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg'>
                <img
                  src={book.coverImage || '/placeholder.svg'}
                  alt={book.title}
                  className='h-full w-full object-cover'
                />
              </div>
            </div>

            {/* Book Info */}
            <div className='space-y-6 md:col-span-2'>
              <div>
                <p className='text-primary mb-2 text-sm font-medium uppercase'>{book.genre}</p>
                <h1 className='text-foreground mb-2 text-3xl font-bold md:text-4xl'>
                  {book.title}
                </h1>
                <p className='text-muted-foreground text-lg'>by {book.author}</p>
              </div>

              {/* Rating */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.round(book.averageRating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <span className='text-foreground font-semibold'>
                    {book.averageRating.toFixed(1)}
                  </span>
                  <span className='text-muted-foreground'>({book.reviewCount} ratings)</span>
                </div>
              </div>

              {/* Description */}
              <p className='text-muted-foreground leading-relaxed'>{book.description}</p>

              {/* Details */}
              <div className='space-y-2'>
                <p className='text-sm'>
                  <span className='text-foreground font-medium'>Pages:</span>
                  <span className='text-muted-foreground'> {book.totalPages}</span>
                </p>
                <p className='text-sm'>
                  <span className='text-foreground font-medium'>Added to Shelves:</span>
                  <span className='text-muted-foreground'>
                    {' '}
                    {book.addedToShelvesCount.toLocaleString()}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className='flex flex-col gap-3 pt-4 sm:flex-row'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className='flex-1'>
                      {libraryItem ? 'Move to Shelf' : 'Add to Shelf'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start'>
                    <DropdownMenuItem onClick={() => handleAddToShelf('wantToRead')}>
                      <BookOpen className='mr-2 h-4 w-4' />
                      Want to Read
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddToShelf('currentlyReading')}>
                      <Clock className='mr-2 h-4 w-4' />
                      Currently Reading
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddToShelf('read')}>
                      <CheckCircle className='mr-2 h-4 w-4' />
                      Read
                    </DropdownMenuItem>
                    {libraryItem && (
                      <>
                        <hr className='border-border my-1' />
                        <DropdownMenuItem onClick={handleRemove} className='text-destructive'>
                          Remove from Library
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant='outline' asChild className='flex-1 bg-transparent'>
                  <a href={`/book/${bookId}/reviews`}>
                    <MessageCircle className='mr-2 h-4 w-4' />
                    Write Review
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className='space-y-6'>
            <div>
              <h2 className='text-foreground mb-2 text-2xl font-bold'>Reviews</h2>
              <p className='text-muted-foreground'>
                {bookReviews.length === 0 ? 'No reviews yet' : `${bookReviews.length} reviews`}
              </p>
            </div>

            {bookReviews.length === 0 ? (
              <Card className='bg-card border-border/50'>
                <CardContent className='pt-8 pb-8 text-center'>
                  <p className='text-muted-foreground mb-4'>Be the first to review this book!</p>
                  <Button asChild>
                    <a href={`/book/${bookId}/reviews`}>Write a Review</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-4'>
                {bookReviews.map((review) => (
                  <Card key={review._id} className='bg-card border-border/50'>
                    <CardContent className='pt-6'>
                      <div className='mb-3 flex items-start justify-between'>
                        <div>
                          <h4 className='text-foreground font-semibold'>{review.userName}</h4>
                          <div className='mt-1 flex items-center gap-1'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className='text-muted-foreground text-xs'>
                          {new Date(review.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className='text-muted-foreground'>{review.reviewText}</p>
                    </CardContent>
                  </Card>
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
