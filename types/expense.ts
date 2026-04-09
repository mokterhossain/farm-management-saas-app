export type Expense = {
  id?: string;
  amount: number;
  description?: string;
  expenseDate: string;
  categoryId?: string;
  projectId?: string;
  category?: { name: string };
  project?: { name: string };
};

export type ExpenseInput = {
  id?: string;
  amount: number;
  description?: string;
  categoryId: string;
  projectId: string;
  expenseDate: string;
};