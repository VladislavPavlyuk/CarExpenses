export type ExpenseType =
  | 'заправка'
  | 'ремонт'
  | 'технічне обслуговування'
  | 'страхування'
  | 'інші витрати';

export const EXPENSE_TYPES: ExpenseType[] = [
  'заправка',
  'ремонт',
  'технічне обслуговування',
  'страхування',
  'інші витрати',
];

export interface Expense {
  id: number;
  type: ExpenseType;
  amount: number;
  date: string; // YYYY-MM-DD
  mileage: number;
  description: string;
}
