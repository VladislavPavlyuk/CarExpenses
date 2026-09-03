import React, { useContext } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export const SettingsScreen = () => {
  const { isDarkMode, toggleTheme, theme } = useContext(ThemeContext);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const handleExit = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
      return;
    }
    Alert.alert('Вихід', 'На iOS закрийте додаток системною жестом / кнопкою.');
  };

  return (
    <View
      style={[
        styles.container,
        isLandscape && styles.landscape,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.row}>
        <View>
          <Text style={[styles.label, { color: theme.text }]}>Темна тема</Text>
          <Text style={{ color: theme.muted, marginTop: 4 }}>
            Зберігається в AsyncStorage
          </Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#ccc', true: theme.primary }}
        />
      </View>

      <TouchableOpacity
        style={[styles.exitBtn, { backgroundColor: theme.danger }]}
        onPress={handleExit}
      >
        <Text style={styles.exitText}>Вийти з додатка</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'space-between' },
  landscape: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: 18, fontWeight: '600' },
  exitBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  exitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
