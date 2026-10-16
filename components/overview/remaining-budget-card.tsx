"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { monthNameOnly } from "@/lib/format"
import type { MonthlySummary } from "@/lib/types"

interface RemainingBudgetCardProps {
  summary?: MonthlySummary
  isLoading: boolean
}

export function RemainingBudgetCard({
  summary,
  isLoading,
}: RemainingBudgetCardProps) {
  if (isLoading || !summary) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full flex-col">
          <Skeleton className="h-4 w-28" />

          <div className="mt-5">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-2 h-5 w-full" />
          </div>

          <div className="mt-auto pt-6">
            <Skeleton className="h-3 w-full rounded-full" />

            <div className="mt-3 flex justify-between">
              <div>
                <Skeleton className="h-5 w-16" />
                <Skeleton className="mt-1 h-3 w-10" />
              </div>

              <div>
                <Skeleton className="ml-auto h-5 w-16" />
                <Skeleton className="mt-1 ml-auto h-3 w-12" />
              </div>
            </div>

            <Skeleton className="mt-4 h-3 w-40" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalSpent = Number(summary.totalSpent ?? 0)

  const totalBudget =
    summary.categories?.reduce(
      (sum, category) => sum + Number(category.budgetLimit ?? 0),
      0,
    ) ?? 0

  const remaining = Math.max(totalBudget - totalSpent, 0)

  const spentPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const progressValue = Math.min(Math.max(spentPercentage, 0), 100)

  let message =
    "You're in a great place. Plenty of room left this month."

  if (totalBudget === 0) {
    message = "Set a budget to start tracking your spending."
  } else if (spentPercentage > 100) {
    message = "You've gone over budget. Time to slow things down."
  } else if (spentPercentage >= 90) {
    message = "Your spending room is getting very tight."
  } else if (spentPercentage >= 80) {
    message = "You're getting close to your budget limit."
  } else if (spentPercentage >= 70) {
    message = "You're using more of your room. Keep it steady."
  } else if (spentPercentage >= 50) {
    message = "You're on track. Keep your spending steady."
  }

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col">
        <h2 className="text-foreground text-xs font-semibold uppercase tracking-wide">
          Spending Room
        </h2>

        <div className="mt-5">
          <p className="text-foreground text-2xl leading-[32px] font-bold tracking-tight">
            <span className="mr-1 text-sm font-semibold">Rs</span>
            {Math.round(remaining).toLocaleString("en-US")}
          </p>

          <p className="text-muted-foreground mt-2 text-sm leading-[20px]">
            {message}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">
              Budget usage
            </span>

            <span
              className={
                "text-xs font-bold " +
                (spentPercentage >= 80
                  ? "text-warning"
                  : "text-success")
              }
            >
              {Math.round(spentPercentage)}%
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={
                "h-full rounded-full transition-all duration-500 " +
                (spentPercentage > 100
                  ? "bg-destructive"
                  : spentPercentage >= 80
                    ? "bg-warning"
                    : "bg-[#0B2A4A]")
              }
              style={{ width: `${progressValue}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-foreground text-sm font-semibold">
                {Math.round(totalSpent).toLocaleString("en-US")}
              </p>
              <p className="text-muted-foreground text-xs">
                Spent
              </p>
            </div>

            <div className="text-right">
              <p className="text-foreground text-sm font-semibold">
                {Math.round(totalBudget).toLocaleString("en-US")}
              </p>
              <p className="text-muted-foreground text-xs">
                Budget
              </p>
            </div>
          </div>

          <p className="text-muted-foreground mt-4 text-xs">
            Based on your {monthNameOnly(summary.month)} budget
          </p>
        </div>
      </CardContent>
    </Card>
  )
}