"use client"

import { CheckCircle2 } from "lucide-react"

import { formatCurrency } from "@/lib/format"

interface SavingsGoalCardProps {
  /**
   * NOTE: the backend has no real "savings goal" concept (no goal endpoint,
   * no income field). This is (totalBudget - totalSpent) — the same number
   * as "remaining budget" — relabeled as a projection. Swap this out once
   * there's a real goal-setting feature on the backend.
   */
  projectedSavings: number
}

export function SavingsGoalCard({ projectedSavings }: SavingsGoalCardProps) {
  const onTrack = projectedSavings >= 0

  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div>
        <h3 className="eyebrow">Savings Goal</h3>
        <div
          className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums"
          style={{ color: onTrack ? "#1b1c19" : "#EF4444" }}
        >
          {formatCurrency(projectedSavings)}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">Projected end-of-month savings.</p>
      </div>
      <div
        className="flex items-center gap-2 border-t border-border pt-3 text-sm font-medium"
        style={{ color: onTrack ? "#10B981" : "#EF4444" }}
      >
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{onTrack ? "On track to hit goal" : "Off track — spending exceeds budget"}</span>
      </div>
    </div>
  )
}
