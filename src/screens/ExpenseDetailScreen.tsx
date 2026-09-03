import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { deleteExpenseFromDB } from '../database/db';
import { ThemeContext } from '../context/ThemeContext';
import { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'ExpenseDetail'>;

export const ExpenseDetailScreen = ({ route, navigation }: Props) => {
  const { theme } = useContext(ThemeContext);
  const { item } = route.params;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

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
    <View
      style={[
        styles.container,
        isLandscape && styles.landscape,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.type, { color: theme.text }]}>{item.type}</Text>
        <Text style={[styles.amount, { color: theme.danger }]}>
          {item.amount.toFixed(2)} ₴
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>Дата: {item.date}</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          Пробіг: {item.mileage} км
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          Опис: {item.description || '—'}
        </Text>
      </View>

      <View style={[styles.actions, isLandscape && styles.actionsCol]}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('ExpenseForm', { item })}
        >
          <Text style={styles.btnText}>Редагувати</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.danger }]}
          onPress={handleDelete}
        >
          <Text style={styles.btnText}>Видалити</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  landscape: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  info: { flex: 1, gap: 8 },
  type: { fontSize: 24, fontWeight: 'bold' },
  amount: { fontSize: 28, fontWeight: 'bold', marginVertical: 4 },
  text: { fontSize: 16 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  actionsCol: { flexDirection: 'column', marginTop: 0, minWidth: 180 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
