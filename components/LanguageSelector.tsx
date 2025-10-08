import React, { useState, useEffect, useRef } from 'react';
import { GlobeAltIcon } from './icons';
import { SUPPORTED_LANGUAGES } from '../App';

interface LanguageSelectorProps {
    language: string;
    onLanguageChange: (lang: string) => void;
    isTranslating: boolean;
    className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange, isTranslating, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
        lang.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, wrapperRef]);

    const handleSelectLanguage = (lang: string) => {
        onLanguageChange(lang);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isTranslating}
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm w-full text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-wait"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <GlobeAltIcon className="w-5 h-5 text-gray-500 absolute left-3 pointer-events-none" />
                <span className="truncate">{language}</span>
                {isTranslating ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg className={`w-5 h-5 text-gray-400 transition-transform transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 flex flex-col">
                    <div className="p-2 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Search language..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            autoFocus
                        />
                    </div>
                    <ul className="overflow-y-auto" role="listbox">
                        {filteredLanguages.length > 0 ? (
                            filteredLanguages.map((lang) => (
                                <li
                                    key={lang}
                                    onClick={() => handleSelectLanguage(lang)}
                                    className="px-4 py-2 hover:bg-green-100 cursor-pointer text-gray-800"
                                    role="option"
                                    aria-selected={lang === language}
                                >
                                    {lang}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No results found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;