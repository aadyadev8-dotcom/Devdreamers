"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; // Import Input component
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Video, Upload } from 'lucide-react';

const NewComplaintMedia: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category || 'General Issue';

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>(''); // New state for URL input

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const backendBaseUrl = 'http://localhost:3001'; // Ensure this matches your backend port

  useEffect(() => {
    // Clean up object URL when component unmounts or previewUrl changes
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsVideo(file.type.startsWith('video/'));
      setUploadStatus(null); // Clear previous status
      setUrlInput(''); // Clear URL input if a file is selected
      console.log('File selected for preview:', file.name, 'Type:', file.type);
    }
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
    setSelectedFile(null); // Clear selected file if URL is entered
    setPreviewUrl(null); // Clear preview
    setUploadStatus(null); // Clear upload status
  };

  const uploadMedia = async (): Promise<string | null> => {
    setUploadStatus('Uploading...');
    console.log('Attempting to upload media...');

    if (selectedFile) {
      const formData = new FormData();
      formData.append('media', selectedFile);

      try {
        const response = await fetch(`${backendBaseUrl}/api/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          setUploadStatus('✅ Upload Successful!');
          console.log('Media upload successful:', data.fileUrl);
          return data.fileUrl;
        } else {
          setUploadStatus(`❌ Upload failed: ${data.message || 'Unknown error'}`);
          console.error('Media upload failed:', data.message);
          return null;
        }
      } catch (error) {
        setUploadStatus('❌ Upload failed: Network error');
        console.error('Network error during media upload:', error);
        return null;
      }
    }
    return null;
  };

  const handleContinueToLocation = async () => {
    let fileUrl = null;
    let isMediaVideo = false;

    if (selectedFile) {
      fileUrl = await uploadMedia();
      if (!fileUrl) {
        console.error('Failed to get file URL, cannot continue to location.');
        return; // Stop if upload failed
      }
      isMediaVideo = isVideo; // Use the state from file selection
    } else if (urlInput) {
      fileUrl = urlInput;
      // Simple check for video based on URL extension for testing purposes
      isMediaVideo = /\.(mp4|webm|ogg|mov)$/i.test(urlInput);
    }

    const tempComplaint = {
      category,
      description,
      fileUrl,
      isVideo: isMediaVideo,
    };
    localStorage.setItem('tempComplaint', JSON.stringify(tempComplaint));
    console.log('Temporary complaint data stored in localStorage:', tempComplaint);
    navigate('/map.html'); // Navigate to the static map page
  };

  return (
    <>
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">Add Photo or Video</h2>
      <p className="text-md md:text-lg text-gray-600 mb-8">Category: <span className="font-semibold text-action-red">{category}</span></p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Button
          onClick={() => photoInputRef.current?.click()}
          className="flex flex-col items-center justify-center text-white p-4 rounded-lg shadow-button-3d border border-transparent w-full h-24 text-center transition-all transform hover:scale-105 active:scale-95 bg-action-blue"
        >
          <Camera className="h-6 w-6 mb-1" />
          <span className="text-sm font-semibold text-wrap">Take Photo</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={photoInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </Button>
        <Button
          onClick={() => videoInputRef.current?.click()}
          className="flex flex-col items-center justify-center text-white p-4 rounded-lg shadow-button-3d border border-transparent w-full h-24 text-center transition-all transform hover:scale-105 active:scale-95 bg-action-blue"
        >
          <Video className="h-6 w-6 mb-1" />
          <span className="text-sm font-semibold text-wrap">Record Video</span>
          <input
            type="file"
            accept="video/*"
            capture="environment"
            ref={videoInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </Button>
        <Button
          onClick={() => galleryInputRef.current?.click()}
          className="flex flex-col items-center justify-center text-white p-4 rounded-lg shadow-button-3d border border-transparent w-full h-24 text-center transition-all transform hover:scale-105 active:scale-95 bg-action-blue"
        >
          <Upload className="h-6 w-6 mb-1" />
          <span className="text-sm font-semibold text-wrap">Upload from Gallery</span>
          <input
            type="file"
            accept="image/*,video/*"
            ref={galleryInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </Button>
      </div>

      {/* URL Input Field */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Or paste image/video URL here (for testing)"
          value={urlInput}
          onChange={handleUrlInputChange}
          className="w-full p-2 border rounded-md text-gray-700 focus:ring-action-blue focus:border-action-blue"
        />
      </div>

      {previewUrl && (
        <div className="mb-6 animate-fade-in max-h-96 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview:</h3>
          {isVideo ? (
            <video src={previewUrl} controls className="max-w-full h-auto rounded-lg shadow-md mx-auto"></video>
          ) : (
            <img src={previewUrl} alt="Media Preview" className="max-w-full h-auto rounded-lg shadow-md mx-auto" />
          )}
        </div>
      )}

      {uploadStatus && (
        <p className={cn("text-sm mb-4", {
          "text-green-600": uploadStatus.startsWith('✅'),
          "text-red-600": uploadStatus.startsWith('❌'),
          "text-gray-600": uploadStatus.startsWith('Uploading'),
        })}>
          {uploadStatus}
        </p>
      )}

      <div className="mb-6">
        <Textarea
          placeholder="Add a description for the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded-md text-gray-700 focus:ring-action-blue focus:border-action-blue"
        />
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleContinueToLocation}
          disabled={!description && !selectedFile && !urlInput} // Disable if no description, no media file, and no URL
          className="w-full bg-action-green text-white py-3 px-6 rounded-lg shadow-button-3d hover:scale-105 active:scale-95 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Location
        </Button>
      </div>
    </>
  );
};

export default NewComplaintMedia;