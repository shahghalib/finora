// Shapes mirror the finora-backend responses exactly (see analytics/, transactions/, categories/ modules).

export interface CategorySummary {
  category: string;
  spent: number;
  budgetLimit: number;
  remaining: number;
}
export interface User {
  id: number;
  username: string;
  email: string;
  defaultCurrency: string;
  profilePictureUrl: string | null;
  createdAt: string;
}
export interface MonthlySummary {
  month: string; // YYYY-MM-01
  totalSpent: number;
  categories: CategorySummary[];
}

export interface TrendPoint {
  category: string;
  month: string; // YYYY-MM-01
  totalSpent: number;
}

export interface Transaction {
  id: number;
  userId: number;
  accountId: number;
  categoryId: number;
  amount: string; // drizzle returns numeric/decimal columns as strings
  currency: string;
  merchant: string;
  transactionDate: string; // YYYY-MM-DD
  isAutoCategorized: boolean;
  createdAt: string; // ISO timestamp
}

export interface Account {
  id: number;
  name: string;
  type: string;
}

export interface Category {
  id: number;
  name: string;
  userId?: number;
  createdAt?: string;
}

export interface BudgetAlert {
  id: number;
  budgetId: number;
  thresholdType: '80pct' | '100pct';
  triggeredAt: string;
  isRead: boolean;
  categoryId: number;
  pctUsed: number;
  totalSpent: number;
  limitAmount: number;
}

export interface BudgetAlertRecord {
  id: number;
  budgetId: number;
  thresholdType: '80pct' | '100pct';
  triggeredAt: string;
  isRead: boolean;
}

export interface Budget {
  id: number;
  userId: number;
  categoryId: number;
  month: string; // YYYY-MM-01
  limitAmount: string; // decimal column comes back as a string
  currency: string;
}

export interface FlaggedCategory {
  categoryId: number;
  categoryName: string;
  months: string[];
  exceededCount: number;
}

export interface MonthlySummary {
  month: string;
  totalSpent: number;
  categories: {
    category: string;
    spent: number;
    budgetLimit: number;
    remaining: number;
  }[];
}

export interface TrendRow {
  category: string;
  month: string;
  totalSpent: number;
}

