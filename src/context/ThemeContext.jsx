import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProviderWrapper = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme_mode');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme_mode', isDarkMode ? 'dark' : 'light');
    
    // Inject dark mode classes if necessary
    const elements = [document.body, document.documentElement];
    if (isDarkMode) {
      elements.forEach(el => {
        el.classList.remove('light');
        el.classList.add('dark', 'dark-theme');
      });
    } else {
      elements.forEach(el => {
        el.classList.remove('dark', 'dark-theme');
        el.classList.add('light');
      });
    }
  }, [isDarkMode]);

  const toggleTheme = (val) => {
    setIsDarkMode(val);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
