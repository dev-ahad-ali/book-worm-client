'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchTutorials } from '@/lib/slices/tutorialsSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Loader } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { extractYoutubeId } from '@/lib/utils';

export default function TutorialsPage() {
  const { tutorials, isLoading, error } = useAppSelector((state) => state.tutorials);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTutorials());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error loading tutorials',
        description: error,
      });
    }
  }, [error]);

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
          <div className='mb-12'>
            <h1 className='text-foreground mb-2 text-3xl font-bold md:text-4xl'>
              Tutorials & Tips
            </h1>
            <p className='text-muted-foreground'>
              Learn how to get the most out of BookWorm and improve your reading
            </p>
          </div>

          {isLoading ? (
            <div className='flex h-64 items-center justify-center'>
              <Loader className='animate-spin' />
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {tutorials.map((tutorial) => (
                <Card
                  key={tutorial._id}
                  className='bg-card border-border/50 overflow-hidden transition-shadow hover:shadow-lg'
                >
                  <div className='group relative aspect-video w-full overflow-hidden bg-black'>
                    <img
                      src={`https://img.youtube.com/vi/${extractYoutubeId(tutorial.youtubeId)}/maxresdefault.jpg`}
                      alt={tutorial.title}
                      className='h-full w-full object-cover transition-opacity group-hover:opacity-75'
                    />
                    <div className='absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/50'>
                      <Play className='h-12 w-12 fill-white text-white' />
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className='line-clamp-2 text-lg'>{tutorial.title}</CardTitle>
                  </CardHeader>

                  {tutorial.description && (
                    <CardContent>
                      <p className='text-muted-foreground line-clamp-2 text-sm'>
                        {tutorial.description}
                      </p>
                    </CardContent>
                  )}

                  <div className='px-6 pb-4'>
                    <a
                      href={tutorial.youtubeId}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='bg-primary text-primary-foreground inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90'
                    >
                      <Play className='h-4 w-4' />
                      Watch Video
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && tutorials.length === 0 && (
            <Card className='bg-card border-border/50'>
              <CardContent className='pt-12 pb-12 text-center'>
                <p className='text-muted-foreground'>
                  No tutorials available yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
