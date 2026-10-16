"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { getCategoryStyle } from "@/components/overview/category-style"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/format"
import {
  cn,
  getBudgetStatusBarClass,
  getBudgetStatusTextClass,
  getBudgetUsagePercent,
} from "@/lib/utils"
import type { MonthlySummary } from "@/lib/types"

interface BudgetControlsCardProps {
  summary?: MonthlySummary
  isLoading: boolean
  className?: string
}

// Dashboard real estate is limited, so this card only ever shows the
// categories the user is spending the most in, largest first. The full
// breakdown lives on the Budgets page ("View Details" above).
const TOP_N = 5

export function BudgetControlsCard({ summary, isLoading, className }: BudgetControlsCardProps) {
  const topCategories = summary
    ? [...summary.categories].sort((a, b) => b.spent - a.spent).slice(0, TOP_N)
    : []

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="border-border border-b">
        <CardTitle className="text-base font-semibold text-foreground">
          Budget Controls
        </CardTitle>
        <Link
          href="/budgets"
          className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm leading-[20px] font-bold transition-colors"
        >
          View Details
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-3">
        {isLoading || !summary ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 sm:gap-5 sm:p-3">
                <Skeleton className="size-10 shrink-0 rounded-xl sm:size-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : topCategories.length === 0 ? (
          <p className="text-muted-foreground text-sm leading-[20px] font-bold">
            No budgets set for this month yet.
          </p>
        ) : (
          topCategories.map((category) => {
            const style = getCategoryStyle(category.category)
            const Icon = style.icon
            const pct = getBudgetUsagePercent(category.spent, category.budgetLimit)
            const barClass = getBudgetStatusBarClass(category.spent, category.budgetLimit)
            const textClass = getBudgetStatusTextClass(category.spent, category.budgetLimit)
            const limitDisplay = formatCurrency(category.budgetLimit).replace("Rs ", "")

            return (
              <div
                key={category.category}
                className="hover:bg-background flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border sm:gap-5 sm:p-3"
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-12 ${style.bg} ${style.fg}`}
                >
                  <Icon className="size-5 sm:size-6" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                    <span className="text-foreground text-base leading-[24px] font-semibold">
                      {category.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm leading-[20px] font-bold">
                        {formatCurrency(category.spent)} /{" "}
                        <span className="text-foreground">{limitDisplay}</span>
                      </span>
                      <span className={`text-xs font-bold ${textClass}`}>
                        {Math.round(pct)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={pct} indicatorClassName={barClass} />
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
