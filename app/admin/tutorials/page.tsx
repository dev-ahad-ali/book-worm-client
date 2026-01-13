'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchTutorials, createTutorial, deleteTutorial } from '@/lib/slices/tutorialsSlice';
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
import { Plus, Trash2, Play } from 'lucide-react';

const ITEMS_PER_PAGE = 6;
export default function ManageTutorialsPage() {
  const { tutorials, isLoading, error } = useAppSelector((state) => state.tutorials);
  const dispatch = useAppDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchTutorials());
  }, [dispatch]);

  const handleOpenDialog = () => {
    setTitle('');
    setYoutubeId('');
    setDescription('');
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!title || !youtubeId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await dispatch(
        createTutorial({
          title,
          youtubeId,
          description,
          createdDate: new Date().toISOString(),
        })
      ).unwrap();
      setOpenDialog(false);
      setCurrentPage(1);
    } catch (error) {
      alert(error || 'Failed to create tutorial');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tutorial?')) {
      try {
        await dispatch(deleteTutorial(id)).unwrap();
      } catch (error) {
        alert(error || 'Failed to delete tutorial');
      }
    }
  };

  if (isLoading) return <div className='p-8 text-center'>Loading tutorials...</div>;
  if (error) return <div className='p-8 text-center text-red-500'>Error: {error}</div>;

  const totalPages = Math.ceil(tutorials.length / ITEMS_PER_PAGE);
  const paginatedTutorials = tutorials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8 flex items-start justify-between'>
            <div>
              <h1 className='text-foreground mb-2 text-3xl font-bold'>Manage Tutorials</h1>
              <p className='text-muted-foreground'>Add or remove YouTube tutorials</p>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenDialog} className='flex gap-2'>
                  <Plus className='h-4 w-4' />
                  Add Tutorial
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle>Add New Tutorial</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium'>Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className='bg-input border-border mt-1'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium'>YouTube Video ID</label>
                    <Input
                      value={youtubeId}
                      onChange={(e) => setYoutubeId(e.target.value)}
                      className='bg-input border-border mt-1'
                      placeholder='dQw4w9WgXcQ'
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
                    Add Tutorial
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tutorials Grid */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {paginatedTutorials.map((tutorial) => (
              <Card key={tutorial._id} className='bg-card border-border/50 overflow-hidden'>
                <div className='group relative aspect-video w-full overflow-hidden bg-black'>
                  <img
                    src={`https://img.youtube.com/vi/${tutorial.youtubeId}/maxresdefault.jpg`}
                    alt={tutorial.title}
                    className='h-full w-full object-cover transition-opacity group-hover:opacity-75'
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                    <Play className='h-8 w-8 fill-white text-white' />
                  </div>
                </div>

                <CardHeader className='pb-3'>
                  <h3 className='text-foreground line-clamp-2 font-semibold'>{tutorial.title}</h3>
                </CardHeader>

                <CardContent>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(tutorial._id)}
                    className='w-full gap-2'
                  >
                    <Trash2 className='h-4 w-4' />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

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
