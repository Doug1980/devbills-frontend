import type { Category, CategorySummary } from "./category";

export const TransactionType = {
  EXPENSE: "expense",
  INCOME: "income",
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: string;
  date: string | Date;
  categoruId: string;
  category: Category;
  type: TransactionType;
  updatedAt: string | Date;
  createdAt: string | Date;
}

export interface TransactionFilter {
  month: number;
  year: number;
  categoryId?: string;
  type?: TransactionType;
}

export interface TransactionSummary {
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
  expensesByCategory: CategorySummary[];
}

export interface MonthlyItem {
  name: string;
  expenses: number;
  income: number;
}
