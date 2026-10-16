"use client"

import { useQuery } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api-client"
import { monthParam } from "@/lib/format"
import type { Category, MonthlySummary, Transaction, TrendPoint } from "@/lib/types"

/**
 * The demo seed data lives in past months, so "the current calendar month"
 * often has nothing in it. We ask /analytics/trend for the single most
 * recent month that actually has records and use that as the active month,
 * falling back to the real current month if the account has no data at all.
 */
export function useLatestMonthWithData() {
  return useQuery({
    queryKey: ["analytics", "latest-month"],
    queryFn: async () => {
      const trend = await apiFetch<TrendPoint[]>("/analytics/trend?months=1")
      if (trend.length === 0) return monthParam(new Date())
      return trend.reduce((latest, point) => (point.month > latest ? point.month : latest), trend[0].month)
    },
    staleTime: 5 * 60_000,
  })
}

export function useMonthlySummary(month: string | undefined) {
  return useQuery({
    queryKey: ["analytics", "monthly-summary", month],
    queryFn: () => apiFetch<MonthlySummary>(`/analytics/monthly-summary?month=${month}`),
    enabled: Boolean(month),
  })
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiFetch<Transaction[]>("/transactions"),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<Category[]>("/categories"),
    staleTime: 5 * 60_000,
  })
}