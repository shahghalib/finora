"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { monthNameOnly } from "@/lib/format"
import type { MonthlySummary } from "@/lib/types"

interface TodaysSignalCardProps {
  summary?: MonthlySummary
  isLoading: boolean
}

export function TodaysSignalCard({
  summary,
  isLoading,
}: TodaysSignalCardProps) {
  if (isLoading || !summary) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full flex-col gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-full rounded-full" />
        </CardContent>
      </Card>
    )
  }

  const totalBudget = summary.categories.reduce(
    (sum, category) => sum + Number(category.budgetLimit),
    0,
  )

  const totalSpent = Number(summary.totalSpent)

  const [year, month] = summary.month.split("-").map(Number)

  const daysInMonth = new Date(year, month, 0).getDate()

  const today = new Date()

  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month

  const dayOfMonth = isCurrentMonth ? today.getDate() : daysInMonth

  const expectedSpend =
    totalBudget > 0
      ? totalBudget * (dayOfMonth / daysInMonth)
      : 0

  const difference =
    expectedSpend > 0
      ? ((totalSpent - expectedSpend) / expectedSpend) * 100
      : 0

  const differencePct = Math.round(Math.abs(difference))

  const healthy =
    totalBudget === 0 || totalSpent <= expectedSpend

  const paceTitle =
    totalBudget === 0
      ? "No budget set"
      : healthy
        ? "Healthy pace"
        : "Watch your pace"

  const paceMessage =
    totalBudget === 0
      ? "Set a monthly budget to start tracking your spending pace."
      : healthy
        ? `You're spending ${differencePct}% below your expected pace.`
        : `You're spending ${differencePct}% above your expected pace.`

  const dailyBudget =
    totalBudget > 0
      ? totalBudget / daysInMonth
      : 0

  const dailySpend =
    dayOfMonth > 0
      ? totalSpent / dayOfMonth
      : 0

  const pacePercentage =
    dailyBudget > 0
      ? Math.round((dailySpend / dailyBudget) * 100)
      : 0

  const progressValue = Math.min(
    Math.max(pacePercentage, 0),
    100,
  )

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col">

        {/* Title */}
        <h2 className="text-foreground text-xs font-semibold uppercase tracking-wide">
          Spending Pace
        </h2>

        {/* Main signal */}
        <div className="mt-5">
          <p className="text-foreground text-2xl leading-[32px] font-bold tracking-tight">
            {paceTitle}
          </p>

          <p className="text-muted-foreground mt-2 text-sm leading-[20px]">
            {paceMessage}
          </p>
        </div>

        {/* Spending pace */}
        {totalBudget > 0 && (
          <div className="mt-auto pt-6">

            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">
                Spending pace
              </span>

              <span
                className={
                  "text-xs font-bold " +
                  (healthy
                    ? "text-success"
                    : "text-warning")
                }
              >
                {pacePercentage}%
              </span>
            </div>

            {/* Navy progress bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={
                  "h-full rounded-full transition-all duration-500 " +
                  (healthy
                    ? "bg-[#0B2A4A]"
                    : "bg-warning")
                }
                style={{
                  width: `${progressValue}%`,
                }}
              />
            </div>

            {/* Daily values */}
            <div className="mt-3 flex items-center justify-between">

              <div>
                <p className="text-foreground text-sm font-semibold">
                  {Math.round(dailySpend).toLocaleString("en-US")}
                </p>

                <p className="text-muted-foreground text-xs">
                  Daily pace
                </p>
              </div>

              <div className="text-right">
                <p className="text-foreground text-sm font-semibold">
                  {Math.round(dailyBudget).toLocaleString("en-US")}
                </p>

                <p className="text-muted-foreground text-xs">
                  Daily target
                </p>
              </div>

            </div>

            <p className="text-muted-foreground mt-4 text-xs">
              Based on your {monthNameOnly(summary.month)} budget
            </p>

          </div>
        )}

        {/* No budget */}
        {totalBudget === 0 && (
          <div className="bg-background border-muted mt-auto rounded-lg border p-3">
            <p className="text-muted-foreground text-xs leading-[18px]">
              Create a budget to see your daily spending pace.
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  )
}