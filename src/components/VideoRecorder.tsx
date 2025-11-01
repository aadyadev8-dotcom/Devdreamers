import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, StopCircle, Check, RotateCcw, X } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface VideoRecorderProps {
  onRecord: (file: File) => void;
  onCancel: () => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ onRecord, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [triggerRecorderRestart, setTriggerRecorderRestart] = useState(0);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let videoElement: HTMLVideoElement | null = null;

    const handleCanPlay = () => {
      setIsVideoReady(true);
      console.log("Video is ready to play, recording controls should be enabled.");
    };

    const initRecorder = async () => {
      setRecordedVideoUrl(null);
      setRecordedChunks([]);
      setIsRecording(false);
      setIsVideoReady(false);

      try {
        console.log("Attempting to get user media for video recording...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
        console.log("User media obtained for recording:", mediaStream);
        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoElement = videoRef.current;
          videoElement.srcObject = mediaStream;
          videoElement.oncanplay = handleCanPlay;
          videoElement.onerror = (event) => {
            setIsVideoReady(false);
            showError("Error loading camera feed for recording.");
            console.error("Video element error during recording:", event);
          };
          console.log("Video srcObject set for recording.");
          try {
            await videoElement.play();
            console.log("Video playing successfully for recording.");
          } catch (playError) {
            console.error("Error playing video for recording:", playError);
            showError("Failed to play camera feed. Please check browser settings.");
            setIsVideoReady(false);
          }
        } else {
          console.warn("videoRef.current is null when trying to set srcObject for recording.");
        }
      } catch (err: any) {
        console.error("Error accessing camera/mic for recording:", err);
        let errorMessage = "Failed to access camera/microphone. Please ensure permissions are granted.";
        if (err.name === "NotAllowedError") {
          errorMessage = "Camera/microphone access denied. Please allow access in your browser settings.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera or microphone found on this device.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Camera/microphone is already in use by another application.";
        }
        showError(errorMessage);
        onCancel();
      }
    };

    initRecorder();

    return () => {
      if (activeStream) {
        console.log("Stopping stream tracks on cleanup for video recorder.");
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (videoElement) {
        videoElement.oncanplay = null;
        videoElement.onerror = null;
      }
    };
  }, [onCancel, triggerRecorderRestart]);

  const startRecording = () => {
    if (stream && videoRef.current && isVideoReady) {
      setRecordedChunks([]);
      // Check for supported MIME types
      let options: MediaRecorderOptions = { mimeType: 'video/webm' }; // Default to webm
      if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
        options = { mimeType: 'video/webm; codecs=vp9' };
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        options = { mimeType: 'video/mp4' }; // Fallback to mp4 if webm/vp9 not supported
      }
      console.log("Using MIME type for recording:", options.mimeType);

      try {
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => {
              console.log(`Data available: ${event.data.size} bytes. Total chunks: ${prev.length + 1}`);
              return [...prev, event.data];
            });
          }
        };

        mediaRecorder.onstop = () => {
          console.log("Recording stopped. Total chunks collected:", recordedChunks.length);
          if (recordedChunks.length === 0) {
            showError("No video data was recorded. Please ensure you recorded for a sufficient duration.");
            setRecordedVideoUrl(null); // Ensure no black screen from empty data
            retakeVideo(); // Go back to live camera view
            return;
          }

          const blob = new Blob(recordedChunks, { type: options.mimeType });
          console.log("Created Blob with size:", blob.size, "bytes and type:", blob.type);
          if (blob.size === 0) {
            showError("Recorded video is empty. Please try again.");
            setRecordedVideoUrl(null);
            retakeVideo();
            return;
          }

          const url = URL.createObjectURL(blob);
          setRecordedVideoUrl(url);
          setIsRecording(false);
          showSuccess("Video recorded successfully!");
          // Stop stream tracks after recording is complete
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
          }
        };

        mediaRecorder.onerror = (event) => {
          console.error("MediaRecorder error:", event);
          showError("An error occurred during recording. Please try again.");
          setIsRecording(false);
          setRecordedVideoUrl(null);
          retakeVideo();
        };

        mediaRecorder.start();
        setIsRecording(true);
        showSuccess("Recording started!");
      } catch (error) {
        console.error("Error starting media recorder:", error);
        showError("Failed to start video recording. Please try again.");
      }
    } else {
      showError("Camera feed not ready or stream unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const confirmVideo = () => {
    if (recordedVideoUrl) {
      const blob = new Blob(recordedChunks, { type: mediaRecorderRef.current?.mimeType || 'video/webm' }); // Use the actual mimeType used for recording
      const file = new File([blob], `recorded-video-${Date.now()}.webm`, { type: blob.type });
      onRecord(file);
      // Revoke the object URL after confirming to free up memory
      URL.revokeObjectURL(recordedVideoUrl);
    }
  };

  const retakeVideo = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl); // Revoke previous URL
    }
    setRecordedVideoUrl(null);
    setRecordedChunks([]);
    setTriggerRecorderRestart(prev => prev + 1); // Trigger useEffect to re-initialize camera
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-900 text-white">
      {!recordedVideoUrl ? (
        <video ref={videoRef} className="w-full h-auto max-h-[70vh] object-cover rounded-md mb-4" autoPlay playsInline muted />
      ) : (
        <video 
          src={recordedVideoUrl} 
          controls 
          className="w-full h-auto max-h-[70vh] object-contain rounded-md mb-4" 
          onError={(e) => {
            console.error("Error playing recorded video:", e);
            showError("Failed to play recorded video. It might be corrupted or in an unsupported format.");
            // Optionally, offer to retake or go back
          }}
        />
      )}

      <div className="flex space-x-4 mt-4">
        {!recordedVideoUrl && !isRecording && (
          <Button
            className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded-full"
            onClick={startRecording}
            disabled={!stream || !isVideoReady}
          >
            <Video className="h-6 w-6 mr-2" />
            Start Recording
          </Button>
        )}
        {isRecording && (
          <Button
            className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-6 py-3 rounded-full"
            onClick={stopRecording}
          >
            <StopCircle className="h-6 w-6 mr-2" />
            Stop Recording
          </Button>
        )}
        {recordedVideoUrl && (
          <>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-full"
              onClick={confirmVideo}
            >
              <Check className="h-6 w-6 mr-2" />
              Confirm
            </Button>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-semibold px-6 py-3 rounded-full"
              onClick={retakeVideo}
            >
              <RotateCcw className="h-6 w-6 mr-2" />
              Retake
            </Button>
          </>
        )}
        <Button
          className="bg-gray-600 hover:bg-gray-700 text-white text-lg font-semibold px-6 py-3 rounded-full"
          onClick={onCancel}
        >
          <X className="h-6 w-6 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default VideoRecorder;