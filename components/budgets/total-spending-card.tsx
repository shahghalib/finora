"use client"

import { TrendingUp } from "lucide-react"

import { formatCurrency } from "@/lib/format"

interface TotalSpendingCardProps {
  totalSpent: number
  totalBudget: number
}

export function TotalSpendingCard({
  totalSpent,
  totalBudget,
}: TotalSpendingCardProps) {
  const pctUsed =
    totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

  return (
    <div className="flex h-full flex-col justify-between gap-5 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="eyebrow">Total Monthly Spending</h3>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
            <span className="text-2xl font-semibold tracking-tight text-[#1b1c19] tabular-nums">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-sm text-muted-foreground">of {formatCurrency(totalBudget)}</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f0fe] px-2.5 py-1 text-xs font-semibold text-[#113160]">
          <TrendingUp className="h-3.5 w-3.5" />
          {pctUsed}% used
        </span>
      </div>
      <div>
        <div
          role="progressbar"
          aria-valuenow={Math.min(100, pctUsed)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Total budget used"
          className="relative h-2 overflow-hidden rounded-full bg-[#E2E8F0]"
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-[#113160] transition-all"
            style={{ width: `${Math.min(100, pctUsed)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Rs 0</span>
          <span>{formatCurrency(totalBudget)} limit</span>
        </div>
      </div>
    </div>
  )
}
