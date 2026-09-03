import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import { I18nProvider } from './src/context/I18nContext';
import { CurrencyProvider } from './src/context/CurrencyContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initDB } from './src/database/db';

function ThemedApp() {
  const { isDarkMode, theme } = useContext(ThemeContext);
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    try {
      initDB();
      setIsDbReady(true);
    } catch (error: any) {
      console.error('Database init error:', error);
      setDbError(error?.message || 'Невідома помилка БД');
    }
  }, []);

  const navTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
    },
  };

  if (dbError) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={styles.errorTitle}>Помилка ініціалізації БД:</Text>
        <Text style={[styles.errorText, { color: theme.text }]}>{dbError}</Text>
      </View>
    );
  }

  if (!isDbReady) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <NavigationContainer theme={navTheme}>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <I18nProvider>
          <CurrencyProvider>
            <ThemeProvider>
              <ThemedApp />
            </ThemeProvider>
          </CurrencyProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: { textAlign: 'center' },
});
