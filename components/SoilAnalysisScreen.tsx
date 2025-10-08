import React, { useState, useEffect } from 'react';
import { SoilAnalysisResult } from '../types';
import { PlantIcon, MagnifyingGlassIcon } from './icons';
import LanguageSelector from './LanguageSelector';

interface SoilAnalysisScreenProps {
  isLoading: boolean;
  analysisResult: SoilAnalysisResult | null;
  image: string | null;
  onDoneAction: () => void;
  error: string | null;
  language: string;
  onLanguageChange: (lang: string) => void;
  isTranslating: boolean;
}

const loadingMessages = [
  "Uploading soil photo...",
  "Analyzing soil composition...",
  "Identifying soil type...",
  "Finding suitable plants...",
  "Finalizing your report...",
];

const LoadingIndicator: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex(prevIndex => {
        if (prevIndex >= loadingMessages.length - 1) {
          clearInterval(timer);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-6 animate-fade-in">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-[6px] border-yellow-200 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 border-t-[6px] border-yellow-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <MagnifyingGlassIcon className="w-12 h-12 text-yellow-500 opacity-75" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Analyzing Your Soil</h2>
        <p className="text-gray-600 mt-2 h-5" key={messageIndex}>
          {loadingMessages[messageIndex]}
        </p>
      </div>
    </div>
  );
};


const SoilAnalysisScreen: React.FC<SoilAnalysisScreenProps> = ({ isLoading, analysisResult, image, onDoneAction, error, language, onLanguageChange, isTranslating }) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-red-600">Analysis Failed</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button onClick={onDoneAction} className="mt-6 bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (!analysisResult) {
    return (
       <div className="text-center p-8">
        <h2 className="text-xl font-bold text-gray-600">No Result</h2>
        <p className="text-gray-600 mt-2">No analysis data is available.</p>
        <button onClick={onDoneAction} className="mt-6 bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-700 transition-colors">
          Analyze Soil
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end">
        <LanguageSelector 
            language={language}
            onLanguageChange={onLanguageChange}
            isTranslating={isTranslating}
            className="max-w-xs"
            />
      </div>

      {image && (
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200/80">
          <img src={image} alt="Analyzed soil" className="rounded-xl w-full h-auto max-h-80 object-cover" />
        </div>
      )}
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
        <div>
             <p className="text-sm font-semibold text-yellow-700">SOIL TYPE</p>
             <h2 className="text-3xl font-bold text-gray-800 mt-1">{analysisResult.soilType}</h2>
             <p className="text-gray-600 mt-3">{analysisResult.description}</p>
        </div>
      </div>

      {analysisResult.recommendedPlants && analysisResult.recommendedPlants.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Plants</h3>
          <div className="space-y-4">
            {analysisResult.recommendedPlants.map((plant, index) => (
              <div key={index} className="bg-green-50/70 p-4 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800 flex items-center space-x-2">
                  <PlantIcon className="w-5 h-5" />
                  <span>{plant.plantName}</span>
                </h4>
                <p className="text-gray-700 mt-1 pl-7">{plant.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onDoneAction}
        className="w-full bg-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-yellow-600/20 hover:bg-yellow-700 transition-colors"
      >
        Analyze Another Soil
      </button>
    </div>
  );
};

export default SoilAnalysisScreen;
