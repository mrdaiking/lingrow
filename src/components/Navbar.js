'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';

export default function Navbar() {
  const pathname = usePathname();
  const { translations } = useLanguage();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Effect to handle scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
              {translations.navbar?.practice || 'Practice'}
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className={`font-medium transition-colors duration-200 ${
                    pathname === '/dashboard' 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {translations.navbar?.dashboard || 'Dashboard'}
                </Link>
                <Link 
                  href="/history" 
                  className={`font-medium transition-colors duration-200 ${
                    pathname === '/history' 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {translations.navbar?.history || 'History'}
                </Link>
              </>
            )}
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
          
          {/* User menu or Login/Register buttons */}
          {user ? (
            <div className="relative z-20 user-menu">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)} 
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <span className="sr-only">{translations.navbar?.userMenu || 'User menu'}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {translations.navbar?.dashboard || 'Dashboard'}
                    </Link>
                    <Link 
                      href="/history" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {translations.navbar?.history || 'History'}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {translations.navbar?.signOut || 'Sign Out'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link 
                href="/login" 
                className="px-4 py-1.5 text-sm font-medium rounded-md bg-transparent border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                {translations.navbar?.signIn || 'Sign In'}
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {translations.navbar?.register || 'Register'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}