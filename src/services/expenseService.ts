import { open } from '@op-engineering/op-sqlite';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
}

export const db = open({ name: 'CarExpenses.db' });

// Ініціалізація бази даних
export const initDatabase = () => {
  db.executeSync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT
    );
  `);
};

// 1. Додавання витрати (Create)
export const addExpense = (expense: Omit<Expense, 'id'>) => {
  return db.executeSync(
    'INSERT INTO expenses (title, amount, date, category) VALUES (?, ?, ?, ?);',
    [expense.title, expense.amount, expense.date, expense.category || ''],
  );
};

// 2. Перегляд витрат (Read)
export const getExpenses = (): Expense[] => {
  const result = db.executeSync('SELECT * FROM expenses ORDER BY id DESC;');
  return (result.rows as unknown as Expense[]) || [];};

// 3. Редагування витрати (Update)
export const updateExpense = (expense: Expense) => {
  return db.executeSync(
    'UPDATE expenses SET title = ?, amount = ?, date = ?, category = ? WHERE id = ?;',
    [
      expense.title,
      expense.amount,
      expense.date,
      expense.category || '',
      expense.id,
    ],
  );
};

// 4. Видалення витрати (Delete)
export const deleteExpense = (id: number) => {
  return db.executeSync('DELETE FROM expenses WHERE id = ?;', [id]);
};
