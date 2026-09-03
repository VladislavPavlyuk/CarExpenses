import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { getExpensesFromDB } from '../database/db';
import { Expense, EXPENSE_TYPES } from '../types';
import { ThemeContext } from '../context/ThemeContext';

export const StatsScreen = ({ navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [total, setTotal] = useState(0);
  const [byCategory, setByCategory] = useState<Record<string, number>>({});
  const [avgFuel, setAvgFuel] = useState(0);
  const [recent, setRecent] = useState<Expense[]>([]);

  const calculateStats = () => {
    const data = getExpensesFromDB();
    const totalSum = data.reduce((sum, item) => sum + item.amount, 0);

    const categoriesMap: Record<string, number> = {};
    EXPENSE_TYPES.forEach(t => {
      categoriesMap[t] = 0;
    });
    data.forEach(item => {
      categoriesMap[item.type] = (categoriesMap[item.type] || 0) + item.amount;
    });

    const fuelOps = data.filter(item => item.type === 'заправка');
    const totalFuel = fuelOps.reduce((sum, item) => sum + item.amount, 0);
    const avgFuelCost = fuelOps.length > 0 ? totalFuel / fuelOps.length : 0;

    setTotal(totalSum);
    setByCategory(categoriesMap);
    setAvgFuel(avgFuelCost);
    setRecent(data.slice(0, 5));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', calculateStats);
    return unsubscribe;
  }, [navigation]);

  const categoryRows = Object.entries(byCategory);

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.background }]}
      data={recent}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={
        <View>
          <View style={isLandscape ? styles.topLandscape : undefined}>
            <View style={isLandscape ? styles.col : undefined}>
              <Text style={[styles.header, { color: theme.text }]}>
                Загальні витрати
              </Text>
              <Text style={[styles.total, { color: theme.danger }]}>
                {total.toFixed(2)} ₴
              </Text>
              <Text style={[styles.subHeader, { color: theme.muted }]}>
                Середня вартість заправки: {avgFuel.toFixed(2)} ₴
              </Text>
            </View>

            <View style={isLandscape ? styles.col : undefined}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Витрати за категоріями
              </Text>
              {categoryRows.map(([cat, amt]) => (
                <View key={cat} style={styles.row}>
                  <Text style={{ color: theme.text }}>{cat}</Text>
                  <Text style={[styles.bold, { color: theme.text }]}>
                    {amt.toFixed(2)} ₴
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Останні операції
          </Text>
          {recent.length === 0 ? (
            <Text style={{ color: theme.muted, marginBottom: 8 }}>
              Поки немає записів
            </Text>
          ) : null}
        </View>
      }
      renderItem={({ item }) => (
        <View style={[styles.recentCard, { backgroundColor: theme.card }]}>
          <View>
            <Text style={{ color: theme.text, fontWeight: '600' }}>
              {item.type}
            </Text>
            <Text style={{ color: theme.muted }}>{item.date}</Text>
          </View>
          <Text style={{ color: theme.danger, fontWeight: 'bold' }}>
            {item.amount.toFixed(2)} ₴
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  topLandscape: { flexDirection: 'row', gap: 24 },
  col: { flex: 1 },
  header: { fontSize: 18, fontWeight: '600' },
  total: { fontSize: 28, fontWeight: 'bold', marginVertical: 4 },
  subHeader: { fontSize: 15, marginBottom: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  bold: { fontWeight: 'bold' },
  recentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
});
