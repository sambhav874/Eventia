import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VideoIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';



const VideoUploader: React.FC<VideoUploaderProps> = ({ onChange, value }) => {
  const [videos, setVideos] = useState<File[]>([]);
  const [uploadedVidUrls, setUploadedVidUrls] = useState<string[]>(value);
  const [vidPreviewUrls, setVidPreviewUrls] = useState<string[]>([]);

  const handleVideoSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      setVideos((prevVideos) => [...prevVideos, ...selectedFiles]);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setVidPreviewUrls((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };

  const removeVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    const updatedPreviews = vidPreviewUrls.filter((_, i) => i !== index);
    setVideos(updatedVideos);
    setVidPreviewUrls(updatedPreviews);
  };

  const handleVideoUpload = async () => {
    try {
      const uploadPromises = videos.map(async (video) => {
        const formData = new FormData();
        formData.append('file', video);

        const response = await axios.post('/api/upload-videos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data.url; 
      });

      const urls = await Promise.all(uploadPromises);

      setVideos([]);
      setVidPreviewUrls([]);
      const newUploadedUrls = [...uploadedVidUrls, ...urls];
      setUploadedVidUrls(newUploadedUrls);
      onChange(newUploadedUrls);
      alert('Videos uploaded successfully!');
    } catch (error) {
      console.error('Error uploading videos:', error);
    }
  };

  return (
    <div className="video-uploader-container">
      <div className="flex items-center justify-center w-full">
        <Label
          htmlFor="video-dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <VideoIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">MP4, AVI, MKV (MAX. 500MB)</p>
          </div>
          <Input
            id="video-dropzone-file"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoSelection}
            multiple
          />
        </Label>
      </div>

      {/* Video Previews */}
      <div className="mt-4">
        {vidPreviewUrls.length > 0 && (
          <div>
            <p>Video Previews:</p>
            <div className="flex flex-wrap gap-4">
              {vidPreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <video
                    src={url}
                    controls
                    width={200}
                    height={200}
                    className="object-cover rounded"
                  />
                  <Button
                    onClick={() => removeVideo(index)}
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
        {uploadedVidUrls.length > 0 && (
          <div>
            <p>Uploaded Video URLs:</p>
            <div>
              {uploadedVidUrls.map((url, index) => (
                <div key={index} className="mb-2">
                  <video
                    src={url}
                    controls
                    width={200}
                    height={200}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handleVideoUpload}
        className="mt-4 bg-green-500 text-white rounded p-2"
        disabled={videos.length === 0}
      >
        Upload Videos
      </Button>
    </div>
  );
};

export default VideoUploader;