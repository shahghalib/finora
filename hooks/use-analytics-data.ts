'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

function currentMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function previousMonthStr() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

export function useMonthlySummary(month: string) {
  return useQuery({
    queryKey: ['analytics', 'monthly-summary', month],
    queryFn: () => api.getMonthlySummary(month),
  });
}

export function useCurrentAndPreviousMonth() {
  const current = useMonthlySummary(currentMonthStr());
  const previous = useMonthlySummary(previousMonthStr());
  return { current, previous };
}

export function useTrend(months: number = 6) {
  return useQuery({
    queryKey: ['analytics', 'trend', months],
    queryFn: () => api.getTrend(months),
  });
}

export function useFlaggedCategories() {
  return useQuery({
    queryKey: ['analytics', 'flagged-categories'],
    queryFn: api.getFlaggedCategories,
  });
}