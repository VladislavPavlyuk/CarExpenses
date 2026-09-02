import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { getExpensesFromDB } from '../database/db';
import { Expense, ExpenseType } from '../types';
import { ThemeContext } from '../context/ThemeContext';

const TYPES = [
  'Всі',
  'заправка',
  'ремонт',
  'технічне обслуговування',
  'страхування',
  'інші витрати',
];

export const ExpenseListScreen = ({ navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('Всі');
  const [dateFilter, setDateFilter] = useState(''); // Фільтр за датою (напр., YYYY-MM)
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const loadData = () => {
    const data = getExpensesFromDB();
    setExpenses(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const filteredExpenses = expenses
    .filter(item => {
      const matchesSearch =
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === 'Всі' || item.type === selectedType;
      const matchesDate = dateFilter ? item.date.startsWith(dateFilter) : true;
      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => {
      let result = 0;
      if (sortField === 'amount') {
        result = b.amount - a.amount;
      } else {
        result = new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return sortAsc ? -result : result;
    });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Панель фільтрів та пошуку */}
      <View style={[styles.filterPanel, isLandscape && styles.landscapePanel]}>
        <TextInput
          placeholder="Пошук..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.border },
          ]}
        />
        <TextInput
          placeholder="Фільтр дати (напр. 2026-09)..."
          placeholderTextColor="#888"
          value={dateFilter}
          onChangeText={setDateFilter}
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.border },
          ]}
        />
      </View>

      {/* Перемикачі типу */}
      <View style={styles.typesRow}>
        <FlatList
          horizontal
          data={TYPES}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedType(item)}
              style={[
                styles.typeChip,
                {
                  backgroundColor:
                    selectedType === item ? '#007AFF' : theme.card,
                },
              ]}
            >
              <Text
                style={{ color: selectedType === item ? '#FFF' : theme.text }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Кнопки сортування */}
      <View style={styles.sortRow}>
        <TouchableOpacity
          onPress={() => {
            if (sortField === 'date') setSortAsc(!sortAsc);
            else {
              setSortField('date');
              setSortAsc(false);
            }
          }}
        >
          <Text style={[styles.sortText, { color: theme.text }]}>
            Дата {sortField === 'date' ? (sortAsc ? '▲' : '▼') : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (sortField === 'amount') setSortAsc(!sortAsc);
            else {
              setSortField('amount');
              setSortAsc(false);
            }
          }}
        >
          <Text style={[styles.sortText, { color: theme.text }]}>
            Сума {sortField === 'amount' ? (sortAsc ? '▲' : '▼') : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Список FlatList */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => navigation.navigate('ExpenseDetail', { item })}
          >
            <View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {item.type}
              </Text>
              <Text style={{ color: theme.text }}>
                {item.date} | {item.mileage} км
              </Text>
              {item.description ? (
                <Text style={{ color: '#888' }}>{item.description}</Text>
              ) : null}
            </View>
            <Text style={styles.amount}>{item.amount.toFixed(2)} ₴</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  filterPanel: { flexDirection: 'column', gap: 8 },
  landscapePanel: { flexDirection: 'row', gap: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 8, flex: 1 },
  typesRow: { marginVertical: 8 },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  sortText: { fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' },
  amount: { fontSize: 16, fontWeight: 'bold', color: '#d32f2f' },
});
