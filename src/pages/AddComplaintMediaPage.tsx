import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, Video, Upload, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import CameraCapture from '@/components/CameraCapture'; // Import the new CameraCapture component

const AddComplaintMediaPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category || 'General Issue';

  const [description, setDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false); // State to control camera visibility

  // Separate refs for each input type (only used for video/gallery now)
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Store category in localStorage for multi-step form
    localStorage.setItem('newComplaintCategory', category);
  }, [category]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (file.type.startsWith('image/')) {
        setMediaType('image');
      } else if (file.type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setMediaType(null);
      }
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setMediaType(null);
    }
    // Clear the input value to allow selecting the same file again if needed
    event.target.value = '';
  };

  const handleCapturedPhoto = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMediaType('image');
    setShowCamera(false); // Hide camera after capture
  };

  const handleClearMedia = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setMediaType(null);
    // Clear all file inputs
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const uploadMediaToSupabase = async (file: File) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const filePath = `complaint_media/${fileName}`;

    const { data, error } = await supabase.storage
      .from('complaint-media') // Ensure this bucket exists in your Supabase project
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('complaint-media')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleContinue = async () => {
    const toastId = showLoading('Processing complaint...');
    try {
      let mediaUrl = '';
      if (selectedFile) {
        mediaUrl = await uploadMediaToSupabase(selectedFile);
        localStorage.setItem('newComplaintMediaUrl', mediaUrl);
      } else {
        localStorage.removeItem('newComplaintMediaUrl');
      }

      localStorage.setItem('newComplaintDescription', description);

      dismissToast(toastId);
      showSuccess('Media and description saved. Continuing to location.');
      navigate('/new-complaint-location');
    } catch (error: any) {
      dismissToast(toastId);
      showError(`Failed to upload media: ${error.message}`);
      console.error('Upload error:', error);
    }
  };

  if (showCamera) {
    return <CameraCapture onCapture={handleCapturedPhoto} onCancel={() => setShowCamera(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-gray-800">
          <h1 className="text-2xl font-bold mb-4">Add Photo or Video</h1>
          <p className="text-red-600 font-semibold mb-6">Category: {category}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button
              className="h-24 bg-gray-700 hover:bg-gray-800 text-white flex flex-col items-center justify-center"
              onClick={() => setShowCamera(true)} // Show in-app camera
            >
              <Camera className="h-6 w-6 mb-1" />
              Take Photo
            </Button>
            <Button
              className="h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video className="h-6 w-6 mb-1" />
              Record Video
            </Button>
            <Button
              className="h-24 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center"
              onClick={() => galleryInputRef.current?.click()}
            >
              <Upload className="h-6 w-6 mb-1" />
              Upload from Gallery
            </Button>
            
            {/* Hidden input for recording videos */}
            <input
              type="file"
              accept="video/*"
              capture="user"
              ref={videoInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Hidden input for uploading from gallery */}
            <input
              type="file"
              accept="image/*,video/*"
              ref={galleryInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {previewUrl && (
            <div className="relative mb-4">
              {mediaType === 'image' ? (
                <img src={previewUrl} alt="Media Preview" className="max-w-full h-auto rounded-md mx-auto" />
              ) : (
                <video src={previewUrl} controls className="max-w-full h-auto rounded-md mx-auto" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 rounded-full"
                onClick={handleClearMedia}
              >
                <XCircle className="h-6 w-6" />
              </Button>
            </div>
          )}

          <Textarea
            placeholder="Add a description for the issue..."
            className="mb-6 p-2 border rounded-md w-full min-h-[100px] text-gray-800"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="space-y-4">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
              onClick={handleContinue}
              disabled={!selectedFile} // Now requires a selected file to proceed
            >
              Continue to Location
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddComplaintMediaPage;