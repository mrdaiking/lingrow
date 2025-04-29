'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import en from '../languages/en';
import es from '../languages/es';
import zh from '../languages/zh';
import ja from '../languages/ja';
import ko from '../languages/ko';
import vi from '../languages/vi';

// Available languages
export const languages = {
  en: { name: 'English', translations: en },
  es: { name: 'Español', translations: es },
  zh: { name: '中文', translations: zh },
  ja: { name: '日本語', translations: ja },
  ko: { name: '한국어', translations: ko },
  vi: { name: 'Tiếng Việt', translations: vi }
};

// Create the language context
const LanguageContext = createContext();

// Create a provider component for the language context
export function LanguageProvider({ children }) {
  // Try to get the previously selected language from localStorage, default to English
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState(languages.en.translations);
  
  // On first load, try to get language from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      setLanguage(savedLanguage);
      setTranslations(languages[savedLanguage]?.translations || languages.en.translations);
    }
  }, []);

  // Function to change the language
  const changeLanguage = (langCode) => {
    if (languages[langCode]) {
      setLanguage(langCode);
      setTranslations(languages[langCode].translations);
      localStorage.setItem('selectedLanguage', langCode);
    }
  };

  // Value to be provided by the context
  const value = {
    language,
    languages,
    translations,
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export const useLanguage = () => {
  return useContext(LanguageContext);
};