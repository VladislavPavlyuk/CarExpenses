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
import { useI18n } from '../context/I18nContext';
import { useCurrency, CURRENCIES, Currency } from '../context/CurrencyContext';

export const SettingsScreen = () => {
  const { isDarkMode, toggleTheme, theme } = useContext(ThemeContext);
  const { lang, setLang, t } = useI18n();
  const { currency, setCurrency } = useCurrency();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const handleExit = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
      return;
    }
    Alert.alert(t.exitTitle, t.exitIosNote);
  };

  return (
    <View
      style={[
        styles.container,
        isLandscape && styles.landscape,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.rows}>
        {/* Темна тема */}
        <View style={[styles.row, { borderBottomColor: theme.border }]}>
          <View>
            <Text style={[styles.label, { color: theme.text }]}>{t.settingsDarkTheme}</Text>
            <Text style={{ color: theme.muted, marginTop: 4 }}>{t.settingsStorageNote}</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#ccc', true: theme.primary }}
          />
        </View>

        {/* Мова */}
        <View style={[styles.row, { borderBottomColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>{t.settingsLanguage}</Text>
          <View style={styles.langRow}>
            {(['uk', 'en'] as const).map(code => (
              <TouchableOpacity
                key={code}
                onPress={() => setLang(code)}
                style={[
                  styles.optBtn,
                  { backgroundColor: lang === code ? theme.primary : theme.card,
                    borderColor: theme.border },
                ]}
              >
                <Text style={{ color: lang === code ? '#fff' : theme.text, fontWeight: '600' }}>
                  {code === 'uk' ? 'УКР' : 'ENG'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Валюта */}
        <View style={[styles.row, { borderBottomColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>{t.settingsCurrency}</Text>
          <View style={styles.langRow}>
            {CURRENCIES.map(c => (
              <TouchableOpacity
                key={c.code}
                onPress={() => setCurrency(c.code as Currency)}
                style={[
                  styles.optBtn,
                  { backgroundColor: currency.code === c.code ? theme.primary : theme.card,
                    borderColor: theme.border },
                ]}
              >
                <Text style={{ color: currency.code === c.code ? '#fff' : theme.text, fontWeight: '600' }}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.exitBtn, { backgroundColor: theme.danger }]}
        onPress={handleExit}
      >
        <Text style={styles.exitText}>{t.settingsExit}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'space-between' },
  landscape: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  rows: { flex: 1, gap: 0 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  label: { fontSize: 18, fontWeight: '600' },
  langRow: { flexDirection: 'row', gap: 8 },
  optBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  exitBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  exitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
