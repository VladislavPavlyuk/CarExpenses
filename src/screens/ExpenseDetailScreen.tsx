import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { deleteExpenseFromDB, getExpenseFromDBById } from '../database/db';
import { ThemeContext } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { useCurrency } from '../context/CurrencyContext';
import { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'ExpenseDetail'>;

const TYPE_LABEL_KEYS: Record<string, keyof ReturnType<typeof useI18n>['t']> = {
  'заправка':                 'typeFuel',
  'ремонт':                   'typeRepair',
  'технічне обслуговування':  'typeMaintenance',
  'страхування':              'typeInsurance',
  'інші витрати':             'typeOther',
};

export const ExpenseDetailScreen = ({ route, navigation }: Props) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useI18n();
  const { currency } = useCurrency();
  const { item } = route.params;
  const [expense, setExpense] = useState(item);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const fresh = getExpenseFromDBById(item.id);
      if (fresh) setExpense(fresh);
    });
    return unsubscribe;
  }, [navigation, item.id]);

  const handleDelete = () => {
    Alert.alert(t.deleteTitle, t.deleteConfirm, [
      { text: t.deleteCancel, style: 'cancel' },
      {
        text: t.detailDelete,
        style: 'destructive',
        onPress: () => {
          deleteExpenseFromDB(expense.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const typeLabel = (t[TYPE_LABEL_KEYS[expense.type]] as string) ?? expense.type;

  return (
    <View
      style={[
        styles.container,
        isLandscape && styles.landscape,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.type, { color: theme.text }]}>{typeLabel}</Text>
        <Text style={[styles.amount, { color: theme.danger }]}>
          {expense.amount.toFixed(2)} {currency.symbol}
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          {t.detailDate} {expense.date}
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          {t.detailMileage} {expense.mileage} {t.km}
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          {t.detailDesc} {expense.description || '—'}
        </Text>
      </View>

      <View style={[styles.actions, isLandscape && styles.actionsCol]}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('ExpenseForm', { item: expense })}
        >
          <Text style={styles.btnText}>{t.detailEdit}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.danger }]}
          onPress={handleDelete}
        >
          <Text style={styles.btnText}>{t.detailDelete}</Text>
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
  btn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
