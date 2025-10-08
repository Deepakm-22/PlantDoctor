import React from 'react';
import { AnalysisHistoryItem } from '../types';
import { ClockIcon } from './icons';
import { HealthStatusBadge } from './AnalysisScreen';

interface HistoryScreenProps {
  history: AnalysisHistoryItem[];
  onViewItem: (item: AnalysisHistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onViewItem, onClearHistory }) => {
  return (
    <div className="space-y-6 animate-fade-in pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <ClockIcon className="w-8 h-8 text-green-600" />
            <span>Analysis History</span>
        </h2>
        {history.length > 0 && (
            <button
                onClick={onClearHistory}
                className="text-sm font-semibold text-red-500 hover:text-red-700 bg-red-100 px-3 py-1 rounded-md"
            >
                Clear History
            </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200/80 mt-6">
          <h3 className="text-xl font-bold text-gray-700">No Analyses Yet</h3>
          <p className="text-gray-500 mt-2">Your past plant analyses will be stored here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(item => (
            <button 
                key={item.id} 
                onClick={() => onViewItem(item)}
                className="w-full flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80 hover:border-green-400 hover:shadow-md transition-all text-left"
            >
              <img src={item.image} alt={item.analysis.plantName} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0 bg-gray-100" />
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-800">{item.analysis.plantName}</h3>
                <div className="my-2">
                    <HealthStatusBadge status={item.analysis.healthStatus} />
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;