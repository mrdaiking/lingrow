'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export const themes = {
  light: 'light',
  dark: 'dark',
  system: 'system'
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize with system theme as default
  const [theme, setTheme] = useState(themes.system);
  const [resolvedTheme, setResolvedTheme] = useState(themes.light);
  
  // Function to handle theme changes
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === themes.system) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
      document.documentElement.setAttribute('data-theme', systemPrefersDark ? themes.dark : themes.light);
      setResolvedTheme(systemPrefersDark ? themes.dark : themes.light);
    } else {
      document.documentElement.classList.toggle('dark', newTheme === themes.dark);
      document.documentElement.setAttribute('data-theme', newTheme);
      setResolvedTheme(newTheme);
    }
  };
  
  // Listen for system theme change
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === themes.system) {
        const systemPrefersDark = mediaQuery.matches;
        document.documentElement.classList.toggle('dark', systemPrefersDark);
        document.documentElement.setAttribute('data-theme', systemPrefersDark ? themes.dark : themes.light);
        setResolvedTheme(systemPrefersDark ? themes.dark : themes.light);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || themes.system;
    changeTheme(savedTheme);
    
    // Remove server-rendered styles (for Next.js)
    const classList = document.documentElement.classList;
    if (classList.contains('light') || classList.contains('dark')) {
      document.documentElement.classList.remove('light', 'dark');
      changeTheme(savedTheme);
    }
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, themes, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};