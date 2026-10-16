'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { apiFetch } from '@/lib/api-client';
import type { Transaction } from '@/lib/types';

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: api.getTransactions,
  });
}

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: api.getAccounts,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export interface CreateTransactionInput {
  accountId: number;
  amount: number;
  currency: string;
  merchant: string;
  transactionDate: string; // YYYY-MM-DD
  categoryId?: number;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      apiFetch<Transaction>('/transactions', {
        method: 'POST',
        body: JSON.stringify(input),
      }),

    onSuccess: () => {
      // Invalidate right away instead of waiting on the socket's
      // 'budgetAlert' event (providers/socket-provider.tsx) — that only
      // fires once a budget crosses the 80%/100% threshold, not on every
      // save, so it isn't a reliable "did my transaction land" signal.
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
