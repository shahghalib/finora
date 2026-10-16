import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shared budget-usage thresholds.
 *
 * Both the Dashboard's Budget Controls card and the Budgets page render a
 * progress bar for "amount spent" vs "budget limit" and need to agree on
 * when that bar is green/amber/red. This is the one place that decides it:
 *
 *   healthy : spent / limit  <  80%
 *   warning : spent / limit  80–99%
 *   over    : spent / limit  >= 100%
 */
export type BudgetStatus = "healthy" | "warning" | "over"

export const BUDGET_STATUS_THRESHOLDS = {
  warning: 80,
  over: 100,
} as const

export function getBudgetUsagePercent(spent: number, limit: number): number {
  if (!(limit > 0)) return 0
  return (spent / limit) * 100
}

export function getBudgetStatus(spent: number, limit: number): BudgetStatus {
  const pct = getBudgetUsagePercent(spent, limit)
  if (pct >= BUDGET_STATUS_THRESHOLDS.over) return "over"
  if (pct >= BUDGET_STATUS_THRESHOLDS.warning) return "warning"
  return "healthy"
}

const STATUS_BAR_CLASS: Record<BudgetStatus, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  over: "bg-destructive",
}

const STATUS_TEXT_CLASS: Record<BudgetStatus, string> = {
  healthy: "text-success",
  warning: "text-warning",
  over: "text-destructive",
}

const STATUS_BADGE_CLASS: Record<BudgetStatus, string> = {
  healthy: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  over: "bg-destructive/10 text-destructive",
}

export function getBudgetStatusBarClass(spent: number, limit: number): string {
  return STATUS_BAR_CLASS[getBudgetStatus(spent, limit)]
}

export function getBudgetStatusTextClass(spent: number, limit: number): string {
  return STATUS_TEXT_CLASS[getBudgetStatus(spent, limit)]
}

export function getBudgetStatusBadgeClass(spent: number, limit: number): string {
  return STATUS_BADGE_CLASS[getBudgetStatus(spent, limit)]
}
