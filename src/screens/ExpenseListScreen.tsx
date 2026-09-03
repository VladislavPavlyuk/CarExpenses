import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getExpensesFromDB } from '../database/db';
import { Expense, EXPENSE_TYPES } from '../types';
import { ThemeContext } from '../context/ThemeContext';
import { HomeStackParamList } from '../navigation/types';
import { AppTextInput } from '../components/AppTextInput';

const TYPE_FILTERS = ['Всі', ...EXPENSE_TYPES];

type Props = NativeStackScreenProps<HomeStackParamList, 'ExpenseList'>;

export const ExpenseListScreen = ({ navigation }: Props) => {
  const { theme } = useContext(ThemeContext);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const numColumns = isLandscape ? 2 : 1;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('Всі');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const loadData = () => {
    setExpenses(getExpensesFromDB());
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(item => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          item.type.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.date.includes(q) ||
          String(item.amount).includes(q);
        const matchesType = selectedType === 'Всі' || item.type === selectedType;
        const from = dateFrom.trim();
        const to = dateTo.trim();
        const matchesDate =
          (!from && !to) ||
          (from && item.date >= from && (!to || item.date <= to)) ||
          (!from && to && item.date <= to);
        return matchesSearch && matchesType && matchesDate;
      })
      .sort((a, b) => {
        let result = 0;
        if (sortField === 'amount') {
          result = a.amount - b.amount;
        } else {
          result = a.date.localeCompare(b.date) || a.id - b.id;
        }
        return sortAsc ? result : -result;
      });
  }, [expenses, search, selectedType, dateFrom, dateTo, sortField, sortAsc]);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortAsc(prev => !prev);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.filterPanel, isLandscape && styles.landscapePanel]}>
        <AppTextInput
          placeholder="Пошук (тип, опис, дата, сума)..."
          placeholderTextColor={theme.muted}
          value={search}
          onChangeText={setSearch}
          style={[
            styles.input,
            styles.searchInput,
            { color: theme.text, borderColor: theme.border, backgroundColor: theme.card },
          ]}
        />
        <View style={styles.dateRangeRow}>
          <AppTextInput
            placeholder="Початок (YYYY-MM-DD)"
            placeholderTextColor={theme.muted}
            value={dateFrom}
            onChangeText={setDateFrom}
            keyboardType="numeric"
            inputMode="numeric"
            maxLength={10}
            style={[
              styles.input,
              styles.dateInput,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.card },
            ]}
          />
          <AppTextInput
            placeholder="Кінець (YYYY-MM-DD)"
            placeholderTextColor={theme.muted}
            value={dateTo}
            onChangeText={setDateTo}
            keyboardType="numeric"
            inputMode="numeric"
            maxLength={10}
            style={[
              styles.input,
              styles.dateInput,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.card },
            ]}
          />
        </View>
      </View>

      <View style={styles.typesRow}>
        {TYPE_FILTERS.map(item => {
          const active = selectedType === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => setSelectedType(item)}
              style={[
                styles.typeChip,
                { backgroundColor: active ? theme.primary : theme.card },
              ]}
            >
              <Text style={{ color: active ? '#FFF' : theme.text }}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.sortRow}>
        <TouchableOpacity onPress={() => toggleSort('date')}>
          <Text
            style={[
              styles.sortText,
              { color: sortField === 'date' ? theme.primary : theme.text },
            ]}
          >
            Дата {sortField === 'date' ? (sortAsc ? '▲' : '▼') : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleSort('amount')}>
          <Text
            style={[
              styles.sortText,
              { color: sortField === 'amount' ? theme.primary : theme.text },
            ]}
          >
            Сума {sortField === 'amount' ? (sortAsc ? '▲' : '▼') : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        key={numColumns}
        data={filteredExpenses}
        numColumns={numColumns}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={
          filteredExpenses.length === 0 ? styles.emptyList : undefined
        }
        columnWrapperStyle={numColumns > 1 ? styles.columnWrap : undefined}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>
            Витрат не знайдено. Додайте першу операцію.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              numColumns > 1 && styles.cardLandscape,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => navigation.navigate('ExpenseDetail', { item })}
          >
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {item.type}
              </Text>
              <Text style={{ color: theme.muted }}>
                {item.date} · {item.mileage} км
              </Text>
              {item.description ? (
                <Text numberOfLines={1} style={{ color: theme.muted }}>
                  {item.description}
                </Text>
              ) : null}
            </View>
            <Text style={[styles.amount, { color: theme.danger }]}>
              {item.amount.toFixed(2)} ₴
            </Text>
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
  input: { borderWidth: 1, borderRadius: 8, padding: 10, flex: 1 },
  searchInput: { minHeight: 40, paddingVertical: 10 },
  dateRangeRow: { flexDirection: 'row', gap: 8 },
  dateInput: { minHeight: 40 },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 0,
    marginBottom: 8,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  sortText: { fontWeight: 'bold', fontSize: 15 },
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardLandscape: { marginHorizontal: 4 },
  cardBody: { flex: 1, marginRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  columnWrap: { gap: 0 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  empty: { textAlign: 'center', padding: 24, fontSize: 15 },
});
