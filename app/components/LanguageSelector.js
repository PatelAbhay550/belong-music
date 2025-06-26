"use client";

import { useState } from "react";

export default function LanguageSelector({ selectedLanguage, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { value: "hindi", label: "Hindi", flag: "🇮🇳" },
    { value: "english", label: "English", flag: "🇺🇸" },
    { value: "punjabi", label: "Punjabi", flag: "🇮🇳" },
    { value: "gujarati", label: "Gujarati", flag: "🇮🇳" },
    { value: "rajasthani", label: "Rajasthani", flag: "🇮🇳" },
  ];

  const currentLanguage = languages.find(lang => lang.value === selectedLanguage);

  const handleLanguageSelect = (language) => {
    onLanguageChange(language.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
      >
        <span>{currentLanguage?.flag}</span>
        <span className="capitalize text-gray-700">{currentLanguage?.label}</span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[150px]">
          {languages.map((language) => (
            <button
              key={language.value}
              onClick={() => handleLanguageSelect(language)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md flex items-center space-x-2 ${
                selectedLanguage === language.value ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.label}</span>
              {selectedLanguage === language.value && (
                <svg className="w-4 h-4 text-green-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
