import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, PlantIcon } from './icons';
import LanguageSelector from './LanguageSelector';

interface AnalysisScreenProps {
  isLoading: boolean;
  analysisResult: AnalysisResult | null;
  image: string | null;
  onDoneAction: () => void;
  onDoneLabel: string;
  error: string | null;
  language: string;
  onLanguageChange: (lang: string) => void;
  isTranslating: boolean;
}

const loadingMessages = [
  "Uploading plant photo...",
  "Identifying plant species...",
  "Scanning for potential issues...",
  "Compiling care recommendations...",
  "Finalizing your report...",
];

const LoadingIndicator: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex(prevIndex => {
        // Stop at the last message to give a sense of completion
        if (prevIndex >= loadingMessages.length - 1) {
          clearInterval(timer);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 2000); // Cycle every 2 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-6 animate-fade-in">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-[6px] border-green-200 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 border-t-[6px] border-green-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <PlantIcon className="w-12 h-12 text-green-500 opacity-75" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Analyzing Your Plant</h2>
        <p className="text-gray-600 mt-2 h-5" key={messageIndex}>
          {loadingMessages[messageIndex]}
        </p>
      </div>
    </div>
  );
};


export const HealthStatusBadge: React.FC<{ status: AnalysisResult['healthStatus'] }> = ({ status }) => {
    const baseClasses = "px-4 py-1.5 text-sm font-bold rounded-full inline-flex items-center space-x-2";
    if (status === 'Healthy') {
        return <div className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircleIcon className="w-5 h-5" /><span>Healthy</span></div>;
    }
    if (status === 'Unhealthy') {
        return <div className={`${baseClasses} bg-red-100 text-red-800`}><ExclamationTriangleIcon className="w-5 h-5" /><span>Unhealthy</span></div>;
    }
    return <div className={`${baseClasses} bg-yellow-100 text-yellow-800`}><InformationCircleIcon className="w-5 h-5" /><span>Needs Care</span></div>;
};

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ isLoading, analysisResult, image, onDoneAction, onDoneLabel, error, language, onLanguageChange, isTranslating }) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-red-600">Analysis Failed</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button onClick={onDoneAction} className="mt-6 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (!analysisResult) {
    // This should ideally not be reached if there's no loading and no error, but it's a safe fallback.
    return (
       <div className="text-center p-8">
        <h2 className="text-xl font-bold text-gray-600">No Result</h2>
        <p className="text-gray-600 mt-2">No analysis data is available.</p>
        <button onClick={onDoneAction} className="mt-6 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
          Scan a Plant
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
          <img src={image} alt="Analyzed plant" className="rounded-xl w-full h-auto max-h-80 object-cover" />
        </div>
      )}
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
        <div className="flex justify-between items-start">
            <div>
                 <h2 className="text-3xl font-bold text-gray-800">{analysisResult.plantName}</h2>
                 <p className="text-gray-500">Confidence: { (analysisResult.confidence * 100).toFixed(0) }%</p>
            </div>
            <HealthStatusBadge status={analysisResult.healthStatus} />
        </div>
      </div>

      {analysisResult.potentialIssues && analysisResult.potentialIssues.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Potential Issues</h3>
          <div className="space-y-4">
            {analysisResult.potentialIssues.map((issue, index) => (
              <div key={index} className="bg-red-50/70 p-4 rounded-lg border border-red-200">
                <h4 className="font-bold text-red-800">{issue.issue}</h4>
                <p className="text-gray-700 mt-1">{issue.description}</p>
                 <div className="mt-3 bg-green-50 p-3 rounded-md border border-green-200">
                    <h5 className="font-semibold text-green-800">Recommended Remedy</h5>
                    <p className="text-gray-600 mt-1">{issue.remedy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysisResult.careRecommendations && analysisResult.careRecommendations.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Care Recommendations</h3>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            {analysisResult.careRecommendations.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onDoneAction}
        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors"
      >
        {onDoneLabel}
      </button>
    </div>
  );
};

export default AnalysisScreen;