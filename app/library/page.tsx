'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchFilteredBooks } from '@/lib/slices/booksSlice';
import { fetchLibrary } from '@/lib/slices/librarySlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BookCard from '@/components/book-card';
import { BookMarked, Clock, CheckCircle } from 'lucide-react';

export default function LibraryPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { books, isLoading } = useAppSelector((state) => state.books);
  const { items: libraryItems, isLoading: libraryLoading } = useAppSelector(
    (state) => state.library
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      dispatch(fetchLibrary());
      // Fetch books that are in the library
      if (libraryItems.length > 0) {
        const bookIds = libraryItems.map((item) => item.bookId);
        dispatch(fetchFilteredBooks({ page: 1, limit: 100 })); // Fetch all books to filter client-side
      }
    }
  }, [user, dispatch]);

  const wantToRead = libraryItems.filter((item) => item.shelfType === 'wantToRead');
  const currentlyReading = libraryItems.filter((item) => item.shelfType === 'currentlyReading');
  const read = libraryItems.filter((item) => item.shelfType === 'read');

  const getBookById = (bookId: string) => books.find((b) => b._id === bookId);

  if (libraryLoading || isLoading) {
    return <div className='p-8 text-center'>Loading library...</div>;
  }

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-foreground mb-2 text-3xl font-bold md:text-4xl'>My Library</h1>
            <p className='text-muted-foreground'>Manage and track your reading journey</p>
          </div>

          {/* Stats */}
          <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-3'>
            <Card className='bg-card border-border/50'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-sm font-medium'>
                  <BookMarked className='text-primary h-4 w-4' />
                  Want to Read
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-foreground text-2xl font-bold'>{wantToRead.length}</p>
              </CardContent>
            </Card>

            <Card className='bg-card border-border/50'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-sm font-medium'>
                  <Clock className='text-accent h-4 w-4' />
                  Currently Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-foreground text-2xl font-bold'>{currentlyReading.length}</p>
              </CardContent>
            </Card>

            <Card className='bg-card border-border/50'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-sm font-medium'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                  Read
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-foreground text-2xl font-bold'>{read.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Shelves */}
          <Tabs defaultValue='wantToRead' className='space-y-4'>
            <TabsList className='bg-muted border-border'>
              <TabsTrigger value='wantToRead'>Want to Read ({wantToRead.length})</TabsTrigger>
              <TabsTrigger value='currentlyReading'>
                Currently Reading ({currentlyReading.length})
              </TabsTrigger>
              <TabsTrigger value='read'>Read ({read.length})</TabsTrigger>
            </TabsList>

            <TabsContent value='wantToRead' className='space-y-4'>
              {wantToRead.length === 0 ? (
                <Card className='bg-card border-border/50'>
                  <CardContent className='pt-8 text-center'>
                    <p className='text-muted-foreground mb-4'>
                      No books in your Want to Read shelf yet.
                    </p>
                    <a href='/browse' className='text-primary font-medium hover:underline'>
                      Browse books to add
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {wantToRead.map((item) => {
                    const book = getBookById(item.bookId);
                    return book ? (
                      <BookCard key={item.bookId} book={book} shelfType={item.shelfType} />
                    ) : null;
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value='currentlyReading' className='space-y-4'>
              {currentlyReading.length === 0 ? (
                <Card className='bg-card border-border/50'>
                  <CardContent className='pt-8 text-center'>
                    <p className='text-muted-foreground mb-4'>
                      You{"'"}re not currently reading any books.
                    </p>
                    <a href='/browse' className='text-primary font-medium hover:underline'>
                      Start reading a book
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {currentlyReading.map((item) => {
                    const book = getBookById(item.bookId);
                    return book ? (
                      <BookCard key={item.bookId} book={book} shelfType={item.shelfType} />
                    ) : null;
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value='read' className='space-y-4'>
              {read.length === 0 ? (
                <Card className='bg-card border-border/50'>
                  <CardContent className='pt-8 text-center'>
                    <p className='text-muted-foreground mb-4'>
                      You haven{"'"}t finished reading any books yet.
                    </p>
                    <a href='/browse' className='text-primary font-medium hover:underline'>
                      Explore books and start reading
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {read.map((item) => {
                    const book = getBookById(item.bookId);
                    return book ? (
                      <BookCard key={item.bookId} book={book} shelfType={item.shelfType} />
                    ) : null;
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
