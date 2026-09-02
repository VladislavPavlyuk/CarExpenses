import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: (value: boolean) => void;
  theme: {
    background: string;
    text: string;
    card: string;
    border: string;
  };
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: { background: '#FFF', text: '#000', card: '#F5F5F5', border: '#CCC' },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('APP_THEME').then(val => {
      if (val !== null) setIsDarkMode(JSON.parse(val));
    });
  }, []);

  const toggleTheme = async (value: boolean) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem('APP_THEME', JSON.stringify(value));
  };

  const theme = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    card: isDarkMode ? '#1E1E1E' : '#F8F9FA',
    border: isDarkMode ? '#333333' : '#E0E0E0',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
