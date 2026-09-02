import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { deleteExpenseFromDB } from '../database/db';
import { ThemeContext } from '../context/ThemeContext';

export const ExpenseDetailScreen = ({ route, navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const { item } = route.params;

  const handleDelete = () => {
    Alert.alert('Видалення', 'Ви впевнені, що хочете видалити цей запис?', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: () => {
          deleteExpenseFromDB(item.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.type, { color: theme.text }]}>{item.type}</Text>
      <Text style={[styles.amount, { color: '#d32f2f' }]}>{item.amount} ₴</Text>

      <View style={styles.infoGroup}>
        <Text style={[styles.text, { color: theme.text }]}>
          Дата: {item.date}
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          Пробіг: {item.mileage} км
        </Text>
        {item.description ? (
          <Text style={[styles.text, { color: theme.text }]}>
            Опис: {item.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button
          title="Редагувати"
          onPress={() => navigation.navigate('ExpenseForm', { item })}
        />
        <Button title="Видалити" color="#d32f2f" onPress={handleDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  type: { fontSize: 24, fontWeight: 'bold', textTransform: 'capitalize' },
  amount: { fontSize: 28, fontWeight: 'bold', marginVertical: 8 },
  infoGroup: { marginVertical: 16, gap: 8 },
  text: { fontSize: 16 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
