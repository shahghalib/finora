"use client"

import { monthLabel as formatMonthLabel } from "@/lib/format"
import { useBudgetsPageData, useDeleteBudget, useUpdateBudget } from "@/hooks/use-budgets-data"

import { AiInsightsPanel } from "./ai-insights-panel"
import { BudgetsHeader } from "./budgets-header"
import { CategoryBudgetCard } from "./category-budget-card"
import { SavingsGoalCard } from "./savings-goal-card"
import { TotalSpendingCard } from "./total-spending-card"
import { PageContainer } from "@/components/page-shell"
import { toast } from '@/components/ui/toast'

export function BudgetsView() {
  const {
    month,
    categoryRows,
    totalSpent,
    totalBudget,
    projectedSavings,
    insights,
    loading,
    error,
  } = useBudgetsPageData()

  const deleteBudget = useDeleteBudget()
  const updateBudget = useUpdateBudget()

  const handleDelete = (budgetId: number, category: string) => {
    deleteBudget.mutate(budgetId, {
      onSuccess: () => {
        toast.add({ title: `${category} budget deleted`, type: "success" })
      },
      onError: () => {
        toast.add({ title: `Failed to delete ${category} budget`, type: "error" })
      },
    })
  }

  const handleEdit = async (budgetId: number, category: string, newLimit: number) => {
    try {
      await updateBudget.mutateAsync({ id: budgetId, limitAmount: newLimit })
      toast.add({ title: `${category} budget updated`, type: "success" })
    } catch (err) {
      toast.add({ title: `Failed to update ${category} budget`, type: "error" })
      throw err
    }
  }

  if (loading || !month) {
    return (
      <PageContainer>
        <div className="mb-8 h-12 w-56 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-10">
          <div className="h-40 animate-pulse rounded-xl bg-muted md:col-span-7" />
          <div className="h-40 animate-pulse rounded-xl bg-muted md:col-span-3" />
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <BudgetsHeader monthLabel={formatMonthLabel(month)} month={month} currency="PKR" />
        <p className="text-sm text-destructive">Couldn&apos;t load budgets: {error}</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <BudgetsHeader monthLabel={formatMonthLabel(month)} month={month} currency="PKR" />

      <div className="space-y-4 sm:space-y-5">
        <section className="grid grid-cols-1 items-stretch gap-4 sm:gap-5 md:grid-cols-3">
          <div className="md:col-span-2">
            <TotalSpendingCard totalSpent={totalSpent} totalBudget={totalBudget} />
          </div>
          <SavingsGoalCard projectedSavings={projectedSavings} />
        </section>

        <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            {categoryRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No budgets set for this month yet. Create one to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 2xl:grid-cols-3">
                {categoryRows.map((row) => (
                  <CategoryBudgetCard
                    key={row.budgetId}
                    category={row.category}
                    spent={row.spent}
                    limit={row.limit}
                    onDelete={() => handleDelete(row.budgetId, row.category)}
                    onEdit={(newLimit) => handleEdit(row.budgetId, row.category, newLimit)}
                    isDeleting={deleteBudget.isPending && deleteBudget.variables === row.budgetId}
                    isEditing={updateBudget.isPending && updateBudget.variables?.id === row.budgetId}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="min-w-0">
            <AiInsightsPanel insights={insights} />
          </aside>
        </div>
      </div>
    </PageContainer>
  )
}
