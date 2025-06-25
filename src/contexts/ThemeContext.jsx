import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Update document class for global styles
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Background colors
      bg: {
        primary: isDarkMode ? 'bg-gray-900' : 'bg-green-50',
        secondary: isDarkMode ? 'bg-gray-800' : 'bg-white',
        tertiary: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
        card: isDarkMode ? 'bg-gray-800' : 'bg-white',
        hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
        gradient: isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
          : 'bg-gradient-to-r from-green-600 to-green-700'
      },
      // Text colors
      text: {
        primary: isDarkMode ? 'text-white' : 'text-gray-900',
        secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
        accent: isDarkMode ? 'text-green-400' : 'text-green-600',
        muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
        inverse: isDarkMode ? 'text-gray-900' : 'text-white'
      },
      // Border colors
      border: {
        primary: isDarkMode ? 'border-gray-700' : 'border-gray-200',
        secondary: isDarkMode ? 'border-gray-600' : 'border-gray-300',
        accent: isDarkMode ? 'border-green-400' : 'border-green-500'
      },
      // Button colors
      button: {
        primary: isDarkMode 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-green-600 hover:bg-green-700 text-white',
        secondary: isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
        ghost: isDarkMode 
          ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
