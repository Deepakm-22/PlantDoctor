
import React from 'react';
import { PlantIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8">
       <div className="max-w-2xl mx-auto flex items-center space-x-3">
        <div className="bg-green-600 rounded-full p-2">
            <PlantIcon className="w-6 h-6 text-white" />
        </div>
        
        <div>
            <h1 className="text-lg font-bold text-gray-800">Curix</h1>
            <p className="text-sm text-gray-500">Smart Plant Health Assistant</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
