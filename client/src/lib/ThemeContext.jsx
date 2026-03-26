import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'ocean',
  setTheme: () => {},
  darkMode: false,
  setDarkMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('moodo_theme') || 'ocean');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('moodo_dark_mode') === 'true');

  useEffect(() => {
    localStorage.setItem('moodo_theme', theme);
    localStorage.setItem('moodo_dark_mode', darkMode);

    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest', 'theme-midnight');
    
    // Add active theme class (except for default ocean)
    if (theme !== 'ocean') {
      root.classList.add(`theme-${theme}`);
    }

    // Handle dark mode
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, darkMode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
