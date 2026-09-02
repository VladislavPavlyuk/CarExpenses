import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { initDB } from './src/database/db';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    initDB(); // Ініціалізація SQLite БД
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
