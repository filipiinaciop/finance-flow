// FinanceMaster - Tipos e Interfaces

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  tag?: string;
  tripId?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  currentAmount: number;
}

export interface Trip {
  id: string;
  destination: string;
  budget: number;
  expenses: Transaction[];
  startDate: string;
  endDate: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color?: string;
}

export interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  trips: Trip[];
  goals: Goal[];
}

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Viagem',
  'Outros'
] as const;

export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Vendas',
  'Outros'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
