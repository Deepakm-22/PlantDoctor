

import React, { useRef } from 'react';
import { CameraIcon, UploadIcon, LightBulbIcon } from './icons';

interface ScanScreenProps {
  onAnalyze: (imageData: string) => void;
  onNavigateToCamera: () => void;
  error: string | null;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onAnalyze, onNavigateToCamera, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAnalyze(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pt-8">
      <div className="w-full bg-green-100/50 border-2 border-dashed border-green-300 p-8 rounded-2xl text-center pt-10">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-full shadow-md">
            <CameraIcon className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-green-900">Analyze Your Plant's Health</h2>
        <p className="text-green-800/80 mt-2">
          Take a clear photo of your plant's leaves to detect potential diseases or issues
        </p>
      </div>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center">{error}</p>}


      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="w-full space-y-4">
        <button
          onClick={onNavigateToCamera}
          className="w-full flex items-center justify-center space-x-3 bg-gray-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-gray-900 transition-colors transform hover:scale-105"
        >
          <CameraIcon className="w-6 h-6" />
          <span>Take Photo</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center space-x-3 bg-white text-gray-800 font-bold py-4 px-6 rounded-xl shadow-md border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <UploadIcon className="w-6 h-6" />
          <span>Upload from Gallery</span>
        </button>
      </div>

      <div className="flex items-start space-x-2 text-yellow-700 p-4 bg-yellow-50 rounded-lg">
        <LightBulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          <span className="font-bold">Tip:</span> For best results, take photos in good lighting with the affected area clearly visible.
        </p>
      </div>
    </div>
  );
};

export default ScanScreen;