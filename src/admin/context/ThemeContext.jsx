import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const DEFAULT_ACCENTS = [
  { id: 'blue', name: 'Blue', color: '#3b82f6' },
  { id: 'purple', name: 'Purple', color: '#8b5cf6' },
  { id: 'green', name: 'Green', color: '#10b981' },
  { id: 'orange', name: 'Orange', color: '#f59e0b' },
];

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('admin-theme-mode') || 'light');
  const [accent, setAccent] = useState(localStorage.getItem('admin-theme-accent') || 'blue');
  const [accentList, setAccentList] = useState(() => {
    const saved = localStorage.getItem('admin-theme-accent-list');
    return saved ? JSON.parse(saved) : DEFAULT_ACCENTS;
  });

  useEffect(() => {
    localStorage.setItem('admin-theme-mode', mode);
    document.documentElement.setAttribute('data-theme-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('admin-theme-accent', accent);
    document.documentElement.setAttribute('data-theme-accent', accent);
    
    // Apply the active accent colors to CSS variables for full customization
    const activeColor = accentList.find(a => a.id === accent) || DEFAULT_ACCENTS.find(a => a.id === accent);
    if (activeColor) {
      const root = document.documentElement;
      root.style.setProperty('--accent-base', activeColor.color);
      // Generate soft and border versions (simplified logic)
      root.style.setProperty('--accent-soft', `${activeColor.color}14`); // ~0.08 alpha
      root.style.setProperty('--accent-border', `${activeColor.color}33`); // ~0.2 alpha
    }
  }, [accent, accentList]);

  useEffect(() => {
    localStorage.setItem('admin-theme-accent-list', JSON.stringify(accentList));
  }, [accentList]);

  const toggleMode = () => setMode(prev => prev === 'light' ? 'dark' : 'light');
  
  const updateAccentColor = (id, newColor) => {
    setAccentList(prev => prev.map(a => a.id === id ? { ...a, color: newColor } : a));
  };

  const reorderAccents = (newList) => {
    setAccentList(newList);
  };

  return (
    <ThemeContext.Provider value={{ 
      mode, setMode, toggleMode, 
      accent, setAccent, 
      accentList, reorderAccents, updateAccentColor 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
