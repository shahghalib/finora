import apiClient from './api/client';
import type { Transaction, Account, Category, Budget, BudgetAlertRecord ,User} from './types';

export const api = {
  getTransactions: async () => (await apiClient.get<Transaction[]>('/transactions')).data,

  getAccounts: async () => (await apiClient.get<Account[]>('/accounts')).data,

  createAccount: async (data: { name: string; type: 'cash' | 'card' | 'bank' }) =>
    (await apiClient.post<Account>('/accounts', data)).data,

  getCategories: async () => (await apiClient.get<Category[]>('/categories')).data,

  getBudgets: async () => (await apiClient.get<Budget[]>('/budgets')).data,
  updateBudget: async (id: number, data: { limitAmount?: number; currency?: string }) =>
  (await apiClient.patch(`/budgets/${id}`, data)).data,

  getAlerts: async () => (await apiClient.get<BudgetAlertRecord[]>('/budgets/alerts/all')).data,

  markAlertRead: async (id: number) =>
    (await apiClient.patch<BudgetAlertRecord>(`/budgets/alerts/${id}/read`)).data,

  getMonthlySummary: async (month: string) =>
  (await apiClient.get<import('./types').MonthlySummary>(`/analytics/monthly-summary?month=${month}`)).data,

  getTrend: async (months: number = 6) =>
    (await apiClient.get<import('./types').TrendRow[]>(`/analytics/trend?months=${months}`)).data,

  getFlaggedCategories: async () =>
    (await apiClient.get<import('./types').FlaggedCategory[]>('/analytics/flagged-categories')).data,

  getMe: async () => (await apiClient.get<import('./types').User>('/users/me')).data,

  updateProfile: async (data: { username?: string; defaultCurrency?: string }) =>
    (await apiClient.patch<import('./types').User>('/users/me', data)).data,

  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<import('./types').User>('/users/me/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
  return response.data;
},
};