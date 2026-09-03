import { open } from '@op-engineering/op-sqlite';
import { Expense, ExpenseType } from '../types';

export const db = open({ name: 'car_expenses.sqlite' });

const mapRow = (row: Record<string, unknown>): Expense => ({
  id: Number(row.id),
  type: row.type as ExpenseType,
  amount: Number(row.amount),
  date: String(row.date),
  mileage: Number(row.mileage),
  description: row.description == null ? '' : String(row.description),
});

export const initDB = () => {
  db.executeSync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      mileage INTEGER NOT NULL,
      description TEXT
    );
  `);
};

export const getExpensesFromDB = (): Expense[] => {
  const result = db.executeSync(
    'SELECT * FROM expenses ORDER BY date DESC, id DESC',
  );
  return ((result.rows || []) as Record<string, unknown>[]).map(mapRow);
};

export const getExpenseFromDBById = (id: number): Expense | null => {
  const result = db.executeSync(
    'SELECT * FROM expenses WHERE id=? LIMIT 1;',
    [id],
  );
  const row = (result.rows || []) as Record<string, unknown>[];
  return row.length > 0 ? mapRow(row[0]) : null;
};

export const addExpenseToDB = (
  type: string,
  amount: number,
  date: string,
  mileage: number,
  description: string,
) => {
  db.executeSync(
    'INSERT INTO expenses (type, amount, date, mileage, description) VALUES (?, ?, ?, ?, ?);',
    [type, amount, date, mileage, description],
  );
};

export const updateExpenseInDB = (
  id: number,
  type: string,
  amount: number,
  date: string,
  mileage: number,
  description: string,
) => {
  db.executeSync(
    'UPDATE expenses SET type=?, amount=?, date=?, mileage=?, description=? WHERE id=?;',
    [type, amount, date, mileage, description, id],
  );
};

export const deleteExpenseFromDB = (id: number) => {
  db.executeSync('DELETE FROM expenses WHERE id=?;', [id]);
};
