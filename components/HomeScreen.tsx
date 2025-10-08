import React from 'react';
import { CameraIcon, BookOpenIcon, ClockIcon, MagnifyingGlassIcon } from './icons';

interface HomeScreenProps {
  onNavigateToScan: () => void;
  onNavigateToCareTips: () => void;
  onNavigateToHistory: () => void;
  onNavigateToSoilScan: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToScan, onNavigateToCareTips, onNavigateToHistory, onNavigateToSoilScan }) => {
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome! 🌱</h2>
        <p className="text-gray-600 mt-2">
          Keep your plants thriving with AI-powered health analysis and expert care tips
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onNavigateToScan}
          className="w-full bg-green-600 text-white p-6 rounded-2xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors flex items-center space-x-4 text-left"
        >
          <div className="bg-white/20 rounded-full p-3">
              <CameraIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Scan Plant</h3>
            <p>Detect diseases & get instant help</p>
          </div>
        </button>

         <button
          onClick={onNavigateToSoilScan}
          className="w-full bg-yellow-600 text-white p-6 rounded-2xl shadow-lg shadow-yellow-600/20 hover:bg-yellow-700 transition-colors flex items-center space-x-4 text-left"
        >
          <div className="bg-white/20 rounded-full p-3">
              <MagnifyingGlassIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Analyze Soil</h3>
            <p>Discover the best plants to grow</p>
          </div>
        </button>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={onNavigateToCareTips}
          className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 hover:border-gray-300 transition-colors flex items-center space-x-4 text-left"
        >
          <div className="bg-gray-100 rounded-full p-3">
              <BookOpenIcon className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Plant Care Tips</h3>
            <p className="text-gray-600 text-sm">Learn care practices</p>
          </div>
        </button>
         <button 
          onClick={onNavigateToHistory}
          className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 hover:border-gray-300 transition-colors flex items-center space-x-4 text-left"
        >
          <div className="bg-gray-100 rounded-full p-3">
              <ClockIcon className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Analysis History</h3>
            <p className="text-gray-600 text-sm">Review past scans</p>
          </div>
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <p className="text-sm text-blue-800">
          <span className="font-bold">Note:</span> This app uses AI analysis for demonstration. For critical plant health issues, consult a professional botanist.
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
