import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'APP_THEME';

export interface AppTheme {
  background: string;
  text: string;
  card: string;
  border: string;
  primary: string;
  muted: string;
  danger: string;
}

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: (value: boolean) => void;
  theme: AppTheme;
}

const lightTheme: AppTheme = {
  background: '#FFFFFF',
  text: '#111111',
  card: '#F8F9FA',
  border: '#E0E0E0',
  primary: '#007AFF',
  muted: '#888888',
  danger: '#d32f2f',
};

const darkTheme: AppTheme = {
  background: '#121212',
  text: '#FFFFFF',
  card: '#1E1E1E',
  border: '#333333',
  primary: '#4DA3FF',
  muted: '#AAAAAA',
  danger: '#ef5350',
};

export const ThemeContext = createContext<ThemeContextProps>({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(val => {
      if (val !== null) {
        setIsDarkMode(JSON.parse(val));
      }
    });
  }, []);

  const toggleTheme = async (value: boolean) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(value));
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        theme: isDarkMode ? darkTheme : lightTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
