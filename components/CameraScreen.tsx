
import React, { useRef, useState, useEffect } from 'react';

interface CameraScreenProps {
  onAnalyze: (imageData: string) => void;
  onBack: () => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onAnalyze, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera is not supported on this browser.");
      return;
    }
    try {
      stopCamera(); 
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please ensure permissions are granted and no other app is using it.");
      setTimeout(() => onBack(), 3000); 
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        onAnalyze(imageData);
      }
      stopCamera();
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  if (cameraError) {
      return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white text-center p-4">
            <h2 className="text-xl font-bold">Camera Error</h2>
            <p className="mt-2">{cameraError}</p>
            <p className="mt-4 text-sm">Returning to home screen...</p>
        </div>
      )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-fade-in">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-start">
         <button 
            onClick={onBack} 
            className="text-white bg-black/30 rounded-full py-2 px-4 hover:bg-black/50 transition-colors"
            aria-label="Cancel camera"
          >
            Cancel
          </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex justify-center items-center">
        <button 
          onClick={handleCapture} 
          className="w-16 h-16 rounded-full bg-white ring-4 ring-white/30 hover:ring-white/50 transition-all focus:outline-none"
          aria-label="Capture photo"
        ></button>
      </div>
    </div>
  );
};

export default CameraScreen;
