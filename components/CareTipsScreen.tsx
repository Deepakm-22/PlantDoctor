import React from 'react';
import { CareTip } from '../types';
import { BookOpenIcon, PlantIcon } from './icons';
import LanguageSelector from './LanguageSelector';

interface CareTipsScreenProps {
  tips: CareTip[] | null;
  isLoading: boolean;
  error: string | null;
  language: string;
  onLanguageChange: (lang: string) => void;
  isTranslating: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
        ))}
    </div>
);


const CareTipsScreen: React.FC<CareTipsScreenProps> = ({ tips, isLoading, error, language, onLanguageChange, isTranslating }) => {

  return (
    <div className="space-y-6 animate-fade-in pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <BookOpenIcon className="w-8 h-8 text-green-600" />
                <span>General Plant Care Tips</span>
            </h2>
             {!isLoading && !error && tips && (
                <LanguageSelector 
                    language={language}
                    onLanguageChange={onLanguageChange}
                    isTranslating={isTranslating}
                    className="sm:max-w-xs"
                />
             )}
        </div>

      {isLoading && <LoadingSkeleton />}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && tips && (
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 border-t-4 border-t-green-300">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center space-x-3">
                <PlantIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span>{tip.title}</span>
              </h3>
              <p className="text-gray-600 whitespace-pre-line pl-9">{tip.content}</p>
              
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg ml-9">
                <p className="text-sm font-semibold text-yellow-800">Key Takeaway:</p>
                <p className="text-sm text-yellow-900 mt-1">{tip.keyTakeaway}</p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareTipsScreen;