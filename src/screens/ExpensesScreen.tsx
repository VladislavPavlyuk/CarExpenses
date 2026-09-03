import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { ExpenseModal } from './ExpenseModal';
import { addExpense, updateExpense, Expense } from '../services/expenseService.ts';

export const ExpensesScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const handleOpenAdd = () => {
    setSelectedExpense(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setModalVisible(true);
  };

  const handleSubmit = (data: Omit<Expense, 'id'> | Expense) => {
    if ('id' in data) {
      updateExpense(data as Expense);
    } else {
      addExpense(data);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Додати витрату" onPress={handleOpenAdd} />

      <ExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialData={selectedExpense}
      />
    </View>
  );
};