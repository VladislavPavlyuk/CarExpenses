import { open } from '@op-engineering/op-sqlite';
import { Expense } from '../types';

export const db = open({ name: 'car_expenses.sqlite' });

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
  const result = db.executeSync('SELECT * FROM expenses ORDER BY date DESC');

  return (result.rows || []) as unknown as Expense[];
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
