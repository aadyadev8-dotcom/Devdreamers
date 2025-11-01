import React, { useRef, useState, useEffect } from 'react';
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
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false); // New state for video readiness
  const [triggerCameraRestart, setTriggerCameraRestart] = useState(0);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let videoElement: HTMLVideoElement | null = null; // To hold reference to video element for event listeners

    const handleCanPlay = () => {
      setIsVideoReady(true);
      console.log("Video is ready to play, Capture button should be enabled.");
    };

    const initCamera = async () => {
      setIsCapturing(true);
      setCapturedImage(null);
      setIsVideoReady(false); // Reset ready state when initializing camera

      try {
        console.log("Attempting to get user media...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        console.log("User media obtained:", mediaStream);
        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoElement = videoRef.current;
          videoElement.srcObject = mediaStream;
          videoElement.oncanplay = handleCanPlay; // Attach event listener
          videoElement.onerror = (event) => {
            setIsVideoReady(false);
            showError("Error loading camera feed.");
            console.error("Video element error:", event);
          };
          console.log("Video srcObject set.");
          try {
            await videoElement.play();
            console.log("Video playing successfully.");
          } catch (playError) {
            console.error("Error playing video:", playError);
            showError("Failed to play camera feed. Please check browser settings.");
            setIsVideoReady(false);
          }
        } else {
          console.warn("videoRef.current is null when trying to set srcObject.");
        }
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        let errorMessage = "Failed to access camera. Please ensure permissions are granted.";
        if (err.name === "NotAllowedError") {
          errorMessage = "Camera access denied. Please allow camera access in your browser settings.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera found on this device.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Camera is already in use by another application.";
        }
        showError(errorMessage);
        onCancel();
      }
    };

    initCamera();

    return () => {
      if (activeStream) {
        console.log("Stopping stream tracks on cleanup.");
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (videoElement) {
        videoElement.oncanplay = null; // Clean up event listener
        videoElement.onerror = null; // Clean up event listener
      }
    };
  }, [onCancel, triggerCameraRestart]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        showError("Camera feed not ready. Please wait a moment and try again.");
        console.error("Cannot take photo: video dimensions are zero.");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        setIsCapturing(false);
        if (stream) {
          console.log("Stopping stream tracks after photo capture.");
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
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
    setTriggerCameraRestart(prev => prev + 1);
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
            disabled={!stream || !isVideoReady} // Use new isVideoReady state
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