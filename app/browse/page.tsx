'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchFilteredBooks, setCurrentPage } from '@/lib/slices/booksSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BookCard from '@/components/book-card';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export default function BrowsePage() {
  const dispatch = useAppDispatch();
  const { filteredBooks, isLoading, error, totalCount, currentPage, totalPages } = useAppSelector(
    (state) => state.books
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState<'rating' | 'shelved' | 'newest' | 'oldest'>('rating');
  const itemsPerPage = 6;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatch(
        fetchFilteredBooks({
          search: searchTerm,
          genres: selectedGenres,
          rating: ratingFilter,
          sort: sortBy,
          page: currentPage,
          limit: itemsPerPage,
        })
      );
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedGenres, ratingFilter, sortBy, currentPage, dispatch]);

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
    );
    dispatch(setCurrentPage(1));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenres([]);
    setRatingFilter(0);
    dispatch(setCurrentPage(1));
  };

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          <div className='mb-8'>
            <h1 className='text-foreground mb-2 text-3xl font-bold md:text-4xl'>Browse Books</h1>
            <p className='text-muted-foreground'>Discover new books and add them to your shelves</p>
          </div>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
            {/* Filters Sidebar */}
            <div className='lg:col-span-1'>
              <Card className='bg-card border-border/50 sticky top-20'>
                <CardContent className='space-y-6 p-6'>
                  <div>
                    <label className='text-foreground mb-2 block text-sm font-medium'>Search</label>
                    <div className='relative'>
                      <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                      <Input
                        placeholder='Title or author...'
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          dispatch(setCurrentPage(1));
                        }}
                        className='bg-input border-border pl-8'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='text-foreground mb-3 block text-sm font-medium'>
                      Minimum Rating
                    </label>
                    <div className='space-y-2'>
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <label key={rating} className='flex cursor-pointer items-center gap-2'>
                          <input
                            type='radio'
                            name='rating'
                            value={rating}
                            checked={ratingFilter === rating}
                            onChange={(e) => {
                              setRatingFilter(Number(e.target.value));
                              dispatch(setCurrentPage(1));
                            }}
                            className='h-4 w-4'
                          />
                          <span className='text-muted-foreground text-sm'>
                            {rating === 0 ? 'All' : `${rating} stars`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {(searchTerm || selectedGenres.length > 0 || ratingFilter > 0) && (
                    <Button
                      variant='outline'
                      className='w-full bg-transparent'
                      onClick={clearFilters}
                    >
                      <X className='mr-2 h-4 w-4' />
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Books Grid */}
            <div className='lg:col-span-3'>
              <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                <p className='text-muted-foreground text-sm'>
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} books
                </p>
                <select
                  value={sortBy}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm'
                >
                  <option value='rating'>Sort by Rating</option>
                  <option value='shelved'>Sort by Most Shelved</option>
                  <option value='newest'>Sort by Newest</option>
                  <option value='oldest'>Sort by Oldest</option>
                </select>
              </div>

              {isLoading ? (
                <div className='p-8 text-center'>Loading books...</div>
              ) : error ? (
                <div className='p-8 text-center text-red-500'>{error}</div>
              ) : filteredBooks.length === 0 ? (
                <Card className='bg-card border-border/50'>
                  <CardContent className='pt-12 pb-12 text-center'>
                    <p className='text-muted-foreground mb-2'>
                      No books found matching your criteria.
                    </p>
                    {(searchTerm || selectedGenres.length > 0 || ratingFilter > 0) && (
                      <Button variant='link' onClick={clearFilters} className='text-primary'>
                        Clear filters and try again
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {filteredBooks.map((book) => (
                      <BookCard key={book._id} book={book} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className='mt-8 flex justify-center gap-2'>
                      <Button
                        variant='outline'
                        disabled={currentPage === 1}
                        onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                        className='bg-transparent'
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'default' : 'outline'}
                          onClick={() => dispatch(setCurrentPage(page))}
                          className={page !== currentPage ? 'bg-transparent' : ''}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant='outline'
                        disabled={currentPage === totalPages}
                        onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                        className='bg-transparent'
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
