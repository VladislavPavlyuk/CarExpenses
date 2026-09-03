import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { addExpenseToDB, updateExpenseInDB } from '../database/db';
import { ExpenseType, EXPENSE_TYPES } from '../types';
import { ThemeContext } from '../context/ThemeContext';
import { AppTextInput } from '../components/AppTextInput';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const ExpenseFormScreen = ({ route, navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const editingExpense = route.params?.item;

  const [type, setType] = useState<ExpenseType>('заправка');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState('');
  const [description, setDescription] = useState('');

  const fillForm = (item?: typeof editingExpense) => {
    if (item) {
      setType(item.type);
      setAmount(String(item.amount));
      setDate(item.date);
      setMileage(String(item.mileage));
      setDescription(item.description || '');
    } else {
      setType('заправка');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setMileage('');
      setDescription('');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fillForm(route.params?.item);
    });
    return unsubscribe;
  }, [navigation, route.params?.item]);

  const handleSave = () => {
    const numericAmount = parseFloat(amount.replace(',', '.'));
    const numericMileage = parseInt(mileage, 10);

    if (!amount || !date || !mileage) {
      Alert.alert('Помилка', 'Заповніть суму, дату та пробіг');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Помилка', 'Сума має бути додатним числом');
      return;
    }
    if (!DATE_RE.test(date)) {
      Alert.alert('Помилка', 'Дата у форматі YYYY-MM-DD');
      return;
    }
    if (isNaN(numericMileage) || numericMileage < 0) {
      Alert.alert('Помилка', 'Пробіг має бути невід’ємним числом');
      return;
    }

    if (editingExpense) {
      updateExpenseInDB(
        editingExpense.id,
        type,
        numericAmount,
        date,
        numericMileage,
        description,
      );
    } else {
      addExpenseToDB(type, numericAmount, date, numericMileage, description);
    }

    if (route.name === 'AddExpense') {
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.label, { color: theme.text }]}>Тип витрати:</Text>
        <View style={styles.typesContainer}>
          {EXPENSE_TYPES.map(t => {
            const active = type === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setType(t)}
                style={[
                  styles.typeChip,
                  { backgroundColor: active ? theme.primary : theme.card },
                ]}
              >
                <Text style={{ color: active ? '#FFF' : theme.text }}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={isLandscape ? styles.row : undefined}>
          <View style={isLandscape ? styles.col : undefined}>
            <Text style={[styles.label, { color: theme.text }]}>Сума (₴):</Text>
            <AppTextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={theme.muted}
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                },
              ]}
            />
          </View>
          <View style={isLandscape ? styles.col : undefined}>
            <Text style={[styles.label, { color: theme.text }]}>
              Дата (YYYY-MM-DD):
            </Text>
            <AppTextInput
              value={date}
              onChangeText={setDate}
              placeholder="2026-09-03"
              placeholderTextColor={theme.muted}
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                },
              ]}
            />
          </View>
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Пробіг (км):</Text>
        <AppTextInput
          value={mileage}
          onChangeText={setMileage}
          placeholder="0"
          placeholderTextColor={theme.muted}
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.card,
            },
          ]}
        />

        <Text style={[styles.label, { color: theme.text }]}>Опис:</Text>
        <AppTextInput
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          blurOnSubmit={false}
          autoCapitalize="sentences"
          placeholder="Необов’язково"
          placeholderTextColor={theme.muted}
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.card,
              height: 80,
              textAlignVertical: 'top',
            },
          ]}
        />

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>
            {editingExpense ? 'Оновити' : 'Зберегти'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10 },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  saveBtn: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
