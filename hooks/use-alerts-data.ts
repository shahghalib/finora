'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: api.getAlerts,
  });
}

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: api.getBudgets,
  });
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.markAlertRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}