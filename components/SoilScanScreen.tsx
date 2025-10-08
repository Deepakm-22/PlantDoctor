import React, { useRef } from 'react';
import { CameraIcon, UploadIcon, LightBulbIcon, MagnifyingGlassIcon } from './icons';

interface SoilScanScreenProps {
  onAnalyze: (imageData: string) => void;
  onNavigateToCamera: () => void;
  error: string | null;
}

const SoilScanScreen: React.FC<SoilScanScreenProps> = ({ onAnalyze, onNavigateToCamera, error }) => {
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
      <div className="w-full bg-yellow-100/50 border-2 border-dashed border-yellow-300 p-8 rounded-2xl text-center pt-10">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-full shadow-md">
            <MagnifyingGlassIcon className="w-12 h-12 text-yellow-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-yellow-900">Analyze Your Soil</h2>
        <p className="text-yellow-800/80 mt-2">
          Take or upload a clear photo of your soil to get recommendations
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

      <div className="flex items-start space-x-2 text-blue-700 p-4 bg-blue-50 rounded-lg">
        <LightBulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          <span className="font-bold">Tip:</span> Ensure the soil photo is taken in natural daylight and shows the texture clearly.
        </p>
      </div>
    </div>
  );
};

export default SoilScanScreen;
