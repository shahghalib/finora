"use client"

import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api-client"
import type { Budget, Category } from "@/lib/types"

import {
  useCategories,
  useLatestMonthWithData,
  useMonthlySummary,
} from "@/hooks/use-overview-data"

import type { Insight } from "@/components/budgets/insight-card"

export interface CreateBudgetInput {
  categoryId: number
  month: string
  limitAmount: number
  currency: string
}

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBudgetInput) =>
      apiFetch<Budget>("/budgets", {
        method: "POST",
        body: JSON.stringify(input),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
      queryClient.invalidateQueries({ queryKey: ["analytics"] })
    },
  })
}

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => apiFetch<Budget[]>("/budgets"),
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (budgetId: number) =>
      apiFetch<Budget>(`/budgets/${budgetId}`, {
        method: "DELETE",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
      queryClient.invalidateQueries({ queryKey: ["analytics"] })
    },
  })
}
export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, limitAmount }: { id: number; limitAmount: number }) =>
      apiFetch<Budget>(`/budgets/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ limitAmount }),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
      queryClient.invalidateQueries({ queryKey: ["analytics"] })
    },
  })
}

export interface CategoryBudgetRow {
  budgetId: number
  category: string
  spent: number
  limit: number
}

export function useBudgetsPageData() {
  const latestMonth = useLatestMonthWithData()
  const month = latestMonth.data

  const summary = useMonthlySummary(month)
  const budgets = useBudgets()
  const categories = useCategories()

  const categoryRows: CategoryBudgetRow[] = useMemo(() => {
    if (!summary.data?.categories || !budgets.data || !categories.data || !month) {
      return []
    }

    const categoryNameById = new Map<number, string>(
      categories.data.map((c: Category) => [c.id, c.name])
    )
    const summaryByName = new Map(
      summary.data.categories.map((c) => [c.category, c])
    )

    return budgets.data
      .filter((b) => b.month === month)
      .map((budget) => {
        const categoryName = categoryNameById.get(budget.categoryId)
        const summaryRow = categoryName ? summaryByName.get(categoryName) : undefined

        return {
          budgetId: budget.id,
          category: categoryName ?? 'Unknown',
          spent: Number(summaryRow?.spent ?? 0),
          limit: Number(budget.limitAmount),
        }
      })
  }, [summary.data, budgets.data, categories.data, month])

  const totalSpent = Number(summary.data?.totalSpent ?? 0)

  const totalBudget = categoryRows.reduce(
    (sum, category) => sum + category.limit,
    0
  )

  const projectedSavings = totalBudget - totalSpent

  const insights: Insight[] = useMemo(() => {
    const results: Insight[] = []

    for (const row of categoryRows) {
      const percentage =
        row.limit > 0 ? (row.spent / row.limit) * 100 : 0

      if (percentage > 100) {
        results.push({
          type: "exceeded",
          title: `${row.category} budget exceeded`,
          message: `You've spent Rs ${Math.round(
            row.spent - row.limit
          ).toLocaleString("en-US")} over your ${row.category} budget.`,
        })
      } else if (percentage >= 80) {
        results.push({
          type: "alert",
          title: `${row.category} is near its limit`,
          message: `You've used ${Math.round(
            percentage
          )}% of your ${row.category} budget.`,
        })
      }
    }

    if (projectedSavings > 0 && categoryRows.length > 0) {
      results.push({
        type: "savings",
        title: "You're within your budget",
        message: `You currently have approximately Rs ${Math.round(
          projectedSavings
        ).toLocaleString("en-US")} remaining across your budgets.`,
      })
    }

    // Only render a maximum of 3 insights
    return results.slice(0, 3)
  }, [categoryRows, projectedSavings])

  return {
    month,
    categoryRows,
    totalSpent,
    totalBudget,
    projectedSavings,
    insights,

    loading:
      latestMonth.isLoading ||
      summary.isLoading ||
      budgets.isLoading ||
      categories.isLoading,

    error:
      latestMonth.error?.message ??
      summary.error?.message ??
      budgets.error?.message ??
      categories.error?.message ??
      null,
  }
}
