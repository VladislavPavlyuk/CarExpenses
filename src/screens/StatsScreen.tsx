import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getExpensesFromDB } from '../database/db';
import { Expense } from '../types';
import { ThemeContext } from '../context/ThemeContext';

export const StatsScreen = ({ navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const [total, setTotal] = useState(0);
  const [byCategory, setByCategory] = useState<Record<string, number>>({});
  const [avgFuel, setAvgFuel] = useState(0);
  const [recent, setRecent] = useState<Expense[]>([]);

  const calculateStats = () => {
    const data = getExpensesFromDB();

    // 1. Загальна сума
    const totalSum = data.reduce((sum, item) => sum + item.amount, 0);

    // 2. Сума за категоріями
    const categoriesMap = data.reduce((acc: any, item) => {
      acc[item.type] = (acc[item.type] || 0) + item.amount;
      return acc;
    }, {});

    // 3. Середня вартість заправки
    const fuelOps = data.filter(item => item.type === 'заправка');
    const totalFuel = fuelOps.reduce((sum, item) => sum + item.amount, 0);
    const avgFuelCost = fuelOps.length > 0 ? totalFuel / fuelOps.length : 0;

    // 4. Останні 3 операції
    const recentOps = data.slice(0, 3);

    setTotal(totalSum);
    setByCategory(categoriesMap);
    setAvgFuel(avgFuelCost);
    setRecent(recentOps);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', calculateStats);
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.header, { color: theme.text }]}>
        Загальні витрати: {total.toFixed(2)} ₴
      </Text>
      <Text style={[styles.subHeader, { color: '#888' }]}>
        Середня вартість заправки: {avgFuel.toFixed(2)} ₴
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Витрати за категоріями:
      </Text>
      {Object.entries(byCategory).map(([cat, amt]) => (
        <View key={cat} style={styles.row}>
          <Text style={{ color: theme.text, textTransform: 'capitalize' }}>
            {cat}:
          </Text>
          <Text style={[styles.bold, { color: theme.text }]}>
            {amt.toFixed(2)} ₴
          </Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Останні операції:
      </Text>
      {recent.map(item => (
        <View
          key={item.id}
          style={[styles.recentCard, { backgroundColor: theme.card }]}
        >
          <Text style={{ color: theme.text }}>
            {item.date} — {item.type}
          </Text>
          <Text style={{ color: '#d32f2f', fontWeight: 'bold' }}>
            {item.amount} ₴
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold' },
  subHeader: { fontSize: 16, marginBottom: 16 },
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
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
});
