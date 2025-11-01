import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, Check, X } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const startCamera = useCallback(async () => {
    setIsCapturing(true);
    setCapturedImage(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      showError("Failed to access camera. Please ensure permissions are granted.");
      onCancel(); // Go back if camera access fails
    }
  }, [stream, onCancel]);

  useEffect(() => {
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        setIsCapturing(false);
        if (stream) {
          stream.getTracks().forEach(track => track.stop()); // Stop camera stream after capture
        }
      }
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      // Convert data URL to Blob, then to File
      const byteString = atob(capturedImage.split(',')[1]);
      const mimeString = capturedImage.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], `captured-photo-${Date.now()}.png`, { type: mimeString });
      onCapture(file);
      showSuccess("Photo captured successfully!");
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera(); // Restart camera
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-900 text-white">
      {isCapturing && !capturedImage && (
        <video ref={videoRef} className="w-full h-auto max-h-[70vh] object-cover rounded-md mb-4" autoPlay playsInline muted />
      )}
      {capturedImage && (
        <img src={capturedImage} alt="Captured" className="w-full h-auto max-h-[70vh] object-contain rounded-md mb-4" />
      )}
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex space-x-4 mt-4">
        {!capturedImage && isCapturing && (
          <Button
            className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded-full"
            onClick={takePhoto}
            disabled={!stream}
          >
            <Camera className="h-6 w-6 mr-2" />
            Capture
          </Button>
        )}
        {capturedImage && (
          <>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-full"
              onClick={confirmPhoto}
            >
              <Check className="h-6 w-6 mr-2" />
              Confirm
            </Button>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-semibold px-6 py-3 rounded-full"
              onClick={retakePhoto}
            >
              <RotateCcw className="h-6 w-6 mr-2" />
              Retake
            </Button>
          </>
        )}
        <Button
          className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-6 py-3 rounded-full"
          onClick={onCancel}
        >
          <X className="h-6 w-6 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CameraCapture;