import { Expense } from '../types';

export type RootDrawerParamList = {
  Home: undefined;
  AddExpense: undefined;
  Statistics: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  ExpenseList: undefined;
  ExpenseDetail: { item: Expense };
  ExpenseForm: { item?: Expense } | undefined;
};
