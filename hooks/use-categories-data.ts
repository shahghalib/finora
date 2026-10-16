"use client"

import { useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api-client"
import type { Category } from "@/lib/types"
import {
  useCategories,
  useLatestMonthWithData,
  useMonthlySummary,
  useTransactions,
} from "@/hooks/use-overview-data"
import { getAutoRuleCount } from "@/components/categories/category-visuals"

export interface CategoryRow {
  id: number
  name: string
  transactionCount: number
  hasBudget: boolean
  spent: number
  limit: number
  autoRuleCount: number
}

export function useCategoriesPageData() {
  const categoriesQuery = useCategories()
  const transactionsQuery = useTransactions()
  const latestMonth = useLatestMonthWithData()
  const month = latestMonth.data
  const summaryQuery = useMonthlySummary(month)

  const transactionCountByCategory = useMemo(() => {
    const map = new Map<number, number>()

    for (const t of transactionsQuery.data ?? []) {
      map.set(
        t.categoryId,
        (map.get(t.categoryId) ?? 0) + 1
      )
    }

    return map
  }, [transactionsQuery.data])

  const budgetByCategoryName = useMemo(() => {
    const map = new Map<string, { spent: number; limit: number }>()

    for (const c of summaryQuery.data?.categories ?? []) {
      map.set(c.category, {
        spent: c.spent,
        limit: c.budgetLimit,
      })
    }

    return map
  }, [summaryQuery.data])

  const rows: CategoryRow[] = (categoriesQuery.data ?? []).map((c) => {
    const budget = budgetByCategoryName.get(c.name)

    return {
      id: c.id,
      name: c.name,
      transactionCount:
        transactionCountByCategory.get(c.id) ?? 0,
      hasBudget: Boolean(budget),
      spent: budget?.spent ?? 0,
      limit: budget?.limit ?? 0,
      autoRuleCount: getAutoRuleCount(c.name),
    }
  })

  return {
    month,
    rows,
    loading:
      categoriesQuery.isLoading ||
      transactionsQuery.isLoading ||
      latestMonth.isLoading ||
      summaryQuery.isLoading,
    error:
      categoriesQuery.error?.message ??
      transactionsQuery.error?.message ??
      summaryQuery.error?.message ??
      null,
  }
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) =>
      apiFetch<Category>("/categories", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      })
    },
  })
}

export function useRenameCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      apiFetch<Category>(`/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/categories/${id}`, {
        method: "DELETE",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      })

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      })

      queryClient.invalidateQueries({
        queryKey: ["analytics"],
      })

      queryClient.invalidateQueries({ 
        queryKey: ["budgets"] ,
      })
    },
  })
}