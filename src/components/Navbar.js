'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';

export default function Navbar() {
  const pathname = usePathname();
  const { translations } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to handle scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
      isScrolled ? 'bg-white dark:bg-gray-900 shadow-md py-2' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          LingGrow
        </Link>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-6">
            <Link 
              href="/practice" 
              className={`font-medium transition-colors duration-200 ${
                pathname === '/practice' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Practice
            </Link>
            {/* Add more nav links here as needed */}
          </div>
          
          {/* Theme selector */}
          <div className="relative z-20">
            <ThemeSelector />
          </div>
          
          {/* Language selector */}
          <div className="relative z-20">
            <LanguageSelector />
          </div>
          
          {/* Login/Register buttons or User menu would go here */}
        </div>
      </div>
    </nav>
  );
}