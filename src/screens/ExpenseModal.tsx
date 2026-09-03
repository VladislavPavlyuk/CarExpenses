import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Expense } from '../services/expenseService.ts';

interface ExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'id'> | Expense) => void;
  initialData?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  // Заповнення полів при редагуванні або скидання при додаванні
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('');
    }
  }, [initialData, visible]);

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }

    const payload = {
      ...(initialData ? { id: initialData.id } : {}),
      title,
      amount: numericAmount,
      category,
      date: initialData ? initialData.date : new Date().toISOString().split('T')[0],
    };

    onSubmit(payload as Expense);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>
              {initialData ? 'Редагувати витрату' : 'Нова витрата'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Назва (напр. Заправка)"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={styles.input}
              placeholder="Сума (грн)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Категорія (напр. Паливо)"
              value={category}
              onChangeText={setCategory}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.btnText}>Скасувати</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.submitBtn]} onPress={handleSubmit}>
                <Text style={styles.btnText}>Зберегти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 0.48,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: { backgroundColor: '#888' },
  submitBtn: { backgroundColor: '#007AFF' },
  btnText: { color: '#fff', fontWeight: '600' },
});