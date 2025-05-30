
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Verifica se há uma preferência salva ou usa a preferência do sistema
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Adiciona uma pequena transição antes de aplicar o tema
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    // Pequeno delay para transição suave
    const timer = setTimeout(applyTheme, 50);
    
    // Salva a preferência
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    return () => clearTimeout(timer);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'system') {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPreference);
    } else {
      setIsDarkMode(theme === 'dark');
    }
  };

  return { isDarkMode, toggleTheme, setTheme };
};
