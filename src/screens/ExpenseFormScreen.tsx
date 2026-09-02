import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { addExpenseToDB, updateExpenseInDB } from '../database/db';
import { ExpenseType } from '../types';
import { ThemeContext } from '../context/ThemeContext';

const TYPES: ExpenseType[] = [
  'заправка',
  'ремонт',
  'технічне обслуговування',
  'страхування',
  'інші витрати',
];

export const ExpenseFormScreen = ({ route, navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const editingExpense = route.params?.item;

  const [type, setType] = useState<ExpenseType>('заправка');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setType(editingExpense.type);
      setAmount(editingExpense.amount.toString());
      setDate(editingExpense.date);
      setMileage(editingExpense.mileage.toString());
      setDescription(editingExpense.description || '');
    }
  }, [editingExpense]);

  const handleSave = () => {
    if (!amount || !date || !mileage) {
      Alert.alert('Помилка', 'Заповніть суму, дату та пробіг');
      return;
    }

    const numericAmount = parseFloat(amount);
    const numericMileage = parseInt(mileage, 10);

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

    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.label, { color: theme.text }]}>Тип витрати:</Text>
      <View style={styles.typesContainer}>
        {TYPES.map(t => (
          <Button
            key={t}
            title={t}
            color={type === t ? '#007AFF' : '#888'}
            onPress={() => setType(t)}
          />
        ))}
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Сума (₴):</Text>
      <TextInput
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
      />

      <Text style={[styles.label, { color: theme.text }]}>
        Дата (YYYY-MM-DD):
      </Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
      />

      <Text style={[styles.label, { color: theme.text }]}>Пробіг (км):</Text>
      <TextInput
        keyboardType="numeric"
        value={mileage}
        onChangeText={setMileage}
        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
      />

      <Text style={[styles.label, { color: theme.text }]}>Опис:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.border, height: 80 },
        ]}
      />

      <View style={{ marginTop: 16 }}>
        <Button
          title={editingExpense ? 'Оновити' : 'Зберегти'}
          onPress={handleSave}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 8, padding: 8 },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
});
