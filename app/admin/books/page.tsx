'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchBooks, createBook, editBook, removeBook } from '@/lib/slices/booksSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ImageUpload } from '@/components/image-upload';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { Book } from '@/lib/slices/booksSlice';

const ITEMS_PER_PAGE = 5;

export default function ManageBooksPage() {
  const { books, isLoading, error } = useAppSelector((state) => state.books);
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    coverImage: '',
    totalPages: 0,
  });

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        coverImage: book.coverImage,
        totalPages: book.totalPages,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        genre: '',
        description: '',
        coverImage: '',
        totalPages: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: imageUrl,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.author || !formData.genre) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingBook) {
        await dispatch(
          editBook({
            id: editingBook._id,
            bookData: formData,
          })
        ).unwrap();
      } else {
        await dispatch(
          createBook({
            ...formData,
            averageRating: 0,
            reviewCount: 0,
            addedToShelvesCount: 0,
          } as Omit<Book, '_id'>)
        ).unwrap();
      }
      setOpenDialog(false);
      setCurrentPage(1);
    } catch (error) {
      alert(error || 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await dispatch(removeBook(id)).unwrap();
      } catch (error) {
        alert(error || 'Failed to delete book');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const paginatedBooks = books.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8 flex items-start justify-between'>
            <div>
              <h1 className='text-foreground mb-2 text-3xl font-bold md:text-4xl'>Manage Books</h1>
              <p className='text-muted-foreground'>Add, edit, or delete books from your catalog</p>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className='flex gap-2'>
                  <Plus className='h-4 w-4' />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent className='max-h-[90vh] max-w-md overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <ImageUpload
                    onImageSelect={handleImageUpload}
                    currentImage={formData.coverImage}
                    label='Book Cover Image'
                  />
                  <div>
                    <label className='text-sm font-medium'>Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className='bg-input border-border mt-1'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium'>Author</label>
                    <Input
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className='bg-input border-border mt-1'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium'>Genre</label>
                    <Input
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className='bg-input border-border mt-1'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium'>Pages</label>
                    <Input
                      type='number'
                      value={formData.totalPages}
                      onChange={(e) =>
                        setFormData({ ...formData, totalPages: Number(e.target.value) })
                      }
                      className='bg-input border-border mt-1'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium'>Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className='bg-input border-border mt-1'
                    />
                  </div>
                  <Button className='w-full' onClick={handleSubmit} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : editingBook ? 'Update Book' : 'Add Book'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Books Table */}
          <Card className='bg-card border-border/50'>
            <CardContent className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-border border-b'>
                    <th className='text-foreground px-4 py-4 text-left font-semibold'>Title</th>
                    <th className='text-foreground px-4 py-4 text-left font-semibold'>Author</th>
                    <th className='text-foreground px-4 py-4 text-left font-semibold'>Genre</th>
                    <th className='text-foreground px-4 py-4 text-left font-semibold'>Pages</th>
                    <th className='text-foreground px-4 py-4 text-left font-semibold'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book) => (
                    <tr key={book._id} className='border-border hover:bg-muted/50 border-b'>
                      <td className='px-4 py-4'>
                        <p className='text-foreground line-clamp-1 font-medium'>{book.title}</p>
                      </td>
                      <td className='text-muted-foreground px-4 py-4'>{book.author}</td>
                      <td className='text-muted-foreground px-4 py-4'>{book.genre}</td>
                      <td className='text-muted-foreground px-4 py-4'>{book.totalPages}</td>
                      <td className='flex gap-2 px-4 py-4'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleOpenDialog(book)}
                          className='bg-transparent'
                        >
                          <Edit2 className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => handleDelete(book._id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className='mt-8 flex justify-center gap-2'>
              <Button
                variant='outline'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className='bg-transparent'
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className={page !== currentPage ? 'bg-transparent' : ''}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant='outline'
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className='bg-transparent'
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
