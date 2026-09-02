import React, { useContext } from 'react';
import {
  View,
  Text,
  Switch,
  Button,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export const SettingsScreen = () => {
  const { isDarkMode, toggleTheme, theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>Темна тема</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <Button
        title="Вийти з додатка"
        color="#d32f2f"
        onPress={() => BackHandler.exitApp()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'space-between' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: 16 },
});
