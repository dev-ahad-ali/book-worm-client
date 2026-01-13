'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
}

export function ImageUpload({
  onImageSelect,
  currentImage,
  label = 'Upload Image',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const imageUrl = await uploadToCloudinary(file);
      onImageSelect(imageUrl);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleClearImage = () => {
    onImageSelect('');
  };

  return (
    <div className='space-y-2'>
      <label className='text-foreground text-sm font-medium'>{label}</label>

      {currentImage ? (
        <div className='relative'>
          <img
            src={currentImage}
            alt='Preview'
            className='border-border h-48 w-full rounded-lg border object-cover'
          />
          {!isUploading && (
            <Button
              type='button'
              variant='destructive'
              size='sm'
              className='absolute top-2 right-2'
              onClick={handleClearImage}
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
      ) : (
        <Card
          className={`cursor-pointer border-2 border-dashed transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
          } ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <label className='flex cursor-pointer flex-col items-center justify-center px-4 py-8'>
            {isUploading ? (
              <>
                <Loader2 className='text-muted-foreground mb-2 h-8 w-8 animate-spin' />
                <p className='text-foreground text-sm font-medium'>Uploading...</p>
              </>
            ) : (
              <>
                <Upload className='text-muted-foreground mb-2 h-8 w-8' />
                <p className='text-foreground text-sm font-medium'>Drag and drop your image here</p>
                <p className='text-muted-foreground mt-1 text-xs'>or click to select a file</p>
              </>
            )}
            <input
              type='file'
              accept='image/*'
              onChange={handleInputChange}
              className='hidden'
              aria-label='Upload image'
              disabled={isUploading}
            />
          </label>
        </Card>
      )}

      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
}
