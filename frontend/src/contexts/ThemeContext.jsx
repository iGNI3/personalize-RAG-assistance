import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const themes = [
  {
    id: 'violet',
    name: 'Cosmic Violet',
    description: 'Meng To signature Deep Purple Aurora & electric liquid glass',
    preview: ['#0c0a20', '#8b5cf6', '#ec4899'],
    isDark: true
  },
  {
    id: 'dark',
    name: 'Cyber Obsidian',
    description: 'Futuristic deep obsidian dark mode with glowing neon cyan',
    preview: ['#06080f', '#1e293b', '#22d3ee'],
    isDark: true
  },
  {
    id: 'sunset',
    name: 'Sunset Magenta',
    description: 'Deep wine twilight aurora with fiery coral and pink rose glow',
    preview: ['#18081c', '#f43f5e', '#fb7185'],
    isDark: true
  },
  {
    id: 'emerald',
    name: 'Abyssal Teal',
    description: 'Deep teal space canvas illuminated by crystalline aqua emerald',
    preview: ['#041514', '#10b981', '#34d399'],
    isDark: true
  }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('app_theme');
    return saved || 'violet';
  });

  useEffect(() => {
    // Remove all existing theme classes
    document.documentElement.classList.remove('theme-violet', 'theme-dark', 'theme-sunset', 'theme-emerald');
    // Add active theme class
    document.documentElement.classList.add(`theme-${theme}`);
    // Also save in localStorage
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const setTheme = (newThemeId) => {
    if (themes.some(t => t.id === newThemeId)) {
      setThemeState(newThemeId);
    }
  };

  const currentThemeObj = themes.find(t => t.id === theme) || themes[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme: currentThemeObj, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
