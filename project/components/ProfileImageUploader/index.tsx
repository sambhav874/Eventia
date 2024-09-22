import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImageIcon, Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProfileImageUploaderProps {
  onChange: (value: string) => void;
  value: string;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ onChange, value }) => {
  const [image, setImage] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(value || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setUploadedUrl(value);
    }
  }, [value]);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    setUploadedUrl(null);
    onChange('');
  };

  const handleImageUpload = async () => {
    if (!image) return;

    try {
      setUploadError(null);
      const formData = new FormData();
      formData.append('file', image);

      const response = await axios.post('/api/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = response.data.url;
      setImage(null);
      setPreviewUrl(null);
      setUploadedUrl(url);
      onChange(url);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload the image. Please try again.');
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 relative overflow-hidden"
          >
            {previewUrl || uploadedUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={previewUrl || uploadedUrl || ''}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
                <Button
                  onClick={removeImage}
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
            )}
            <Input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleImageSelection}
              accept="image/*"
            />
          </Label>

          {uploadError && (
            <Alert variant="destructive">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {image && (
            <Button
              onClick={handleImageUpload}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Image
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImageUploader;