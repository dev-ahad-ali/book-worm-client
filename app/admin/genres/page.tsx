'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchGenres, createGenre, updateGenre, deleteGenre } from '@/lib/slices/genresSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import type { Genre } from '@/lib/slices/genresSlice';

export default function ManageGenresPage() {
  const { genres, isLoading, error } = useAppSelector((state) => state.genres);
  const { books } = useAppSelector((state) => state.books);
  const dispatch = useAppDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  const getGenreBookCount = (genreName: string) => {
    return books.filter((book) => book.genre === genreName).length;
  };

  const handleOpenDialog = (genre?: Genre) => {
    if (genre) {
      setEditingGenre(genre);
      setName(genre.name);
      setDescription(genre.description || '');
    } else {
      setEditingGenre(null);
      setName('');
      setDescription('');
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!name) {
      alert('Please enter a genre name');
      return;
    }

    try {
      const genreData = { name, description };
      if (editingGenre) {
        await dispatch(updateGenre({ id: editingGenre._id, genreData })).unwrap();
      } else {
        await dispatch(createGenre(genreData)).unwrap();
      }
      setOpenDialog(false);
    } catch (error) {
      alert(error || 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this genre?')) {
      try {
        await dispatch(deleteGenre(id)).unwrap();
      } catch (error) {
        alert(error || 'Failed to delete genre');
      }
    }
  };

  if (isLoading) return <div className='p-8 text-center'>Loading genres...</div>;
  if (error) return <div className='p-8 text-center text-red-500'>Error: {error}</div>;

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8 flex items-start justify-between'>
            <div>
              <h1 className='text-foreground mb-2 text-3xl font-bold'>Manage Genres</h1>
              <p className='text-muted-foreground'>Create and manage book categories</p>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className='flex gap-2'>
                  <Plus className='h-4 w-4' />
                  Add Genre
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle>{editingGenre ? 'Edit Genre' : 'Add New Genre'}</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium'>Genre Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='bg-input border-border mt-1'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium'>Description</label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className='bg-input border-border mt-1'
                      placeholder='Optional'
                    />
                  </div>
                  <Button className='w-full' onClick={handleSubmit}>
                    {editingGenre ? 'Update Genre' : 'Add Genre'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Genres Grid */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {genres.map((genre) => (
              <Card key={genre._id} className='bg-card border-border/50'>
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <h3 className='text-foreground font-semibold'>{genre.name}</h3>
                      {genre.description && (
                        <p className='text-muted-foreground mt-1 text-xs'>{genre.description}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='bg-muted/50 border-border/50 mb-4 flex items-center gap-2 rounded-lg border p-3'>
                    <BookOpen className='text-primary h-4 w-4' />
                    <div>
                      <p className='text-muted-foreground text-xs'>Books</p>
                      <p className='text-foreground text-lg font-bold'>
                        {getGenreBookCount(genre.name)}
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleOpenDialog(genre)}
                      className='flex-1 bg-transparent'
                    >
                      <Edit2 className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDelete(genre._id)}
                      className='flex-1'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
