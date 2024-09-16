import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';


const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange, value }) => {
  const [images, setImages] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(value);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviewUrls(updatedPreviews);
  };

  const handleImageUpload = async () => {
    try {
      setUploadError(null);
      const uploadPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append('file', image);

        const response = await axios.post('/api/upload-images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data.url;
      });

      const urls = await Promise.all(uploadPromises);

      setImages([]);
      setPreviewUrls([]);
      const newUploadedUrls = [...uploadedUrls, ...urls];
      setUploadedUrls(newUploadedUrls);
      onChange(newUploadedUrls);
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadError('Failed to upload images. Please try again.');
    }
  };

  return (
    <div className="image-uploader">
      <div className="flex items-center justify-center w-full">
        <Label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">SVG, PNG, JPG, or GIF (MAX. 800x400px)</p>
          </div>
          <Input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleImageSelection}
            multiple
            accept="image/*"
          />
        </Label>
      </div>

      <div className="mt-4">
        {previewUrls.length > 0 && (
          <div>
            <p>Image Previews:</p>
            <div className="flex flex-wrap gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="object-cover rounded"
                  />
                  <Button
                    onClick={() => removeImage(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        {uploadedUrls.length > 0 && (
          <div>
            <p>Uploaded Image URLs:</p>
            <div className="flex flex-wrap gap-4">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="relative">
                  <Image
                    src={url}
                    alt={`Uploaded Image ${index + 1}`}
                    width={200}
                    height={200}
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="mt-4 text-red-500">{uploadError}</p>
      )}

      {images.length > 0 && (
        <Button
          onClick={handleImageUpload}
          className="mt-4 bg-green-500 text-white rounded p-2"
        >
          Upload Images
        </Button>
      )}
    </div>
  );
};

export default ImageUploader;