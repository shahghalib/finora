"use client"

import { useState } from "react"
import { Trash2, Pencil, AlertTriangle, X, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getCategoryVisual } from "./category-visuals"

interface CategoryBudgetCardProps {
  category: string
  spent: number
  limit: number
  onDelete?: () => void
  onEdit?: (newLimit: number) => void | Promise<void>
  isDeleting?: boolean
  isEditing?: boolean
}

export function CategoryBudgetCard({
  category,
  spent,
  limit,
  onDelete,
  onEdit,
  isDeleting = false,
  isEditing = false,
}: CategoryBudgetCardProps) {
  const visual = getCategoryVisual(category)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [limitDraft, setLimitDraft] = useState(String(Math.round(limit)))
  const [editError, setEditError] = useState("")

  const pctUsed = limit > 0 ? Math.round((spent / limit) * 100) : 0
  const isOverBudget = spent > limit
  const remaining = Math.max(limit - spent, 0)
  const overAmount = Math.max(spent - limit, 0)

  let statusLabel = "Healthy"
  let statusClassName = "bg-[#E7F3EC] text-[#39735A]"

  if (isOverBudget) {
    statusLabel = "Over Budget"
    statusClassName = "bg-[#FCE8E6] text-[#B42318]"
  } else if (pctUsed <= 20) {
    statusLabel = "Healthy"
    statusClassName = "bg-[#E7F3EC] text-[#39735A]"
  } else if (pctUsed <= 40) {
    statusLabel = "On Track"
    statusClassName = "bg-[#E9EEF5] text-[#4F6687]"
  } else if (pctUsed <= 60) {
    statusLabel = "Moderate"
    statusClassName = "bg-[#F0EFEB] text-[#5F625F]"
  } else if (pctUsed <= 80) {
    statusLabel = "High"
    statusClassName = "bg-[#F7EEDB] text-[#9A6A20]"
  } else {
    statusLabel = "Near Limit"
    statusClassName = "bg-[#F9E9DF] text-[#A45A36]"
  }

  const progressWidth = Math.min(Math.max(pctUsed, 0), 100)

  const handleConfirmDelete = () => {
    onDelete?.()
    setDeleteDialogOpen(false)
  }

  const openEditDialog = () => {
    setLimitDraft(String(Math.round(limit)))
    setEditError("")
    setEditDialogOpen(true)
  }

  const handleConfirmEdit = async () => {
    const parsed = Number(limitDraft)

    if (!limitDraft.trim() || Number.isNaN(parsed) || parsed <= 0) {
      setEditError("Enter a valid amount greater than 0.")
      return
    }

    try {
      setEditError("")
      await onEdit?.(parsed)
      setEditDialogOpen(false)
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Could not update budget. Please try again."
      )
    }
  }

  return (
    <>
      <div
        className={cn(
          "flex w-full flex-col rounded-xl border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5",
          isOverBudget ? "border-[#E7B8B2]" : "border-border"
        )}
      >
        {/* Header: icon + name, edit / delete */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${visual.iconBg} ${visual.iconColor}`}
            >
              <visual.icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <p className="truncate text-sm font-semibold text-[#1B1C19]">{category}</p>
          </div>

          <div className="-mr-1.5 flex shrink-0 items-center">
            <button
              type="button"
              onClick={openEditDialog}
              disabled={isEditing}
              aria-label={`Edit ${category} budget`}
              title="Edit budget"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#747780] transition-colors hover:bg-[#EEF2FF] hover:text-[#4355B9] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleting}
              aria-label={`Delete ${category} budget`}
              title="Delete budget"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#747780] transition-colors hover:bg-[#FCE8E6] hover:text-[#B42318] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className={`h-4 w-4 ${isDeleting ? "animate-pulse" : ""}`} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Amount + percent */}
        <div className="mt-4 flex items-baseline justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-1">
            <span className="text-xs font-medium text-[#747780]">Rs</span>
            <span
              className={`text-xl font-semibold tracking-tight tabular-nums ${
                isOverBudget ? "text-[#B42318]" : "text-[#1B1C19]"
              }`}
            >
              {Math.round(spent).toLocaleString("en-US")}
            </span>
            <span className="truncate text-sm text-[#747780] tabular-nums">
              / {Math.round(limit).toLocaleString("en-US")}
            </span>
          </div>
          <span className={`text-sm font-semibold tabular-nums ${isOverBudget ? "text-[#B42318]" : "text-[#44474F]"}`}>
            {pctUsed}%
          </span>
        </div>

        {/* Progress */}
        <div
          role="progressbar"
          aria-valuenow={Math.min(pctUsed, 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${category} budget used`}
          className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E8E7E2]"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget ? "bg-[#B42318]" : visual.barColor
            }`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        {/* Status */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <Badge className={`h-6 rounded-full px-2.5 text-xs font-semibold shadow-none ${statusClassName}`}>
            {statusLabel}
          </Badge>
          <span className={`text-xs font-medium ${isOverBudget ? "text-[#B42318]" : "text-[#44474F]"}`}>
            {isOverBudget
              ? `Rs ${Math.round(overAmount).toLocaleString("en-US")} over`
              : `Rs ${Math.round(remaining).toLocaleString("en-US")} left`}
          </span>
        </div>
      </div>

      {/* Edit Dialog */}
      {editDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1C19]/40 p-4 backdrop-blur-[3px]">
          <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_70px_rgba(27,28,25,0.18)]">
            <div className="relative px-7 pb-6 pt-7">
              <button
                type="button"
                onClick={() => setEditDialogOpen(false)}
                disabled={isEditing}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-[#747780] transition-colors hover:bg-[#F1F5F9] hover:text-[#1B1C19] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${visual.iconBg} ${visual.iconColor}`}
              >
                <visual.icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </div>

              <div className="mt-5">
                <h3 className="text-lg font-bold tracking-tight text-[#1B1C19]">
                  Edit {category} budget
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#747780]">
                  Update the monthly limit for this category.
                </p>
              </div>

              <div className="mt-5">
                <label htmlFor="budget-limit" className="mb-2 block text-sm font-semibold text-[#1B1C19]">
                  Monthly Limit
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#747780]">
                    Rs
                  </span>
                  <input
                    id="budget-limit"
                    type="number"
                    min="1"
                    value={limitDraft}
                    onChange={(e) => {
                      setLimitDraft(e.target.value)
                      setEditError("")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleConfirmEdit()
                      }
                    }}
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3.5 text-sm text-[#1B1C19] outline-none transition-all focus:ring-2 ${
                      editError
                        ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/10"
                        : "border-[#DCE3EC] focus:border-[#4355B9] focus:ring-[#4355B9]/10"
                    }`}
                  />
                </div>
                {editError && (
                  <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{editError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border bg-[#FCFCFB] px-7 py-4">
              <button
                type="button"
                onClick={() => setEditDialogOpen(false)}
                disabled={isEditing}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#747780] transition-colors hover:bg-[#F1F5F9] hover:text-[#1B1C19] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEdit}
                disabled={isEditing}
                className="flex items-center gap-2 rounded-lg bg-[#113160] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#001c42] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isEditing && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1C19]/40 p-4 backdrop-blur-[3px]">
          <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_70px_rgba(27,28,25,0.18)]">
            <div className="relative px-7 pb-6 pt-7">
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-[#747780] transition-colors hover:bg-[#F1F5F9] hover:text-[#1B1C19] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F1D8D5] bg-[#FCE8E6] text-[#B42318]">
                <AlertTriangle className="h-5 w-5" strokeWidth={1.8} />
              </div>

              <div className="mt-5">
                <h3 className="text-lg font-bold tracking-tight text-[#1B1C19]">Delete budget?</h3>
                <p className="mt-2 text-sm leading-6 text-[#747780]">
                  You&apos;re about to remove the{" "}
                  <span className="font-semibold text-[#1B1C19]">{category}</span> budget.
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-[#F1E2DF] bg-[#FCF8F7] px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <Trash2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B42318]" strokeWidth={1.8} />
                  <p className="text-xs leading-5 text-[#765F5B]">
                    This will also delete any alert history tied to this budget. Your transactions in
                    this category are not affected. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border bg-[#FCFCFB] px-7 py-4">
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#747780] transition-colors hover:bg-[#F1F5F9] hover:text-[#1B1C19] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-[#B42318] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#9A1E14] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Budget"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}