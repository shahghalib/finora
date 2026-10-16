"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Pencil,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react"

import { getCategoryPreset } from "./category-visuals"
import type { CategoryRow } from "@/hooks/use-categories-data"
import {
  useDeleteCategory,
  useRenameCategory,
} from "@/hooks/use-categories-data"

interface CategoryCardProps {
  row: CategoryRow
}

export function CategoryCard({
  row,
}: CategoryCardProps) {
  const preset = getCategoryPreset(row.name)
  const Icon = preset?.icon ?? null

  const [renaming, setRenaming] = useState(false)
  const [nameDraft, setNameDraft] = useState(row.name)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const renameCategory = useRenameCategory()
  const deleteCategory = useDeleteCategory()

  const handleRenameSubmit = async () => {
    const trimmed = nameDraft.trim()

    if (!trimmed || trimmed === row.name) {
      setRenaming(false)
      setNameDraft(row.name)
      return
    }

    try {
      await renameCategory.mutateAsync({
        id: row.id,
        name: trimmed,
      })
    } finally {
      setRenaming(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCategory.mutateAsync(row.id)
      setDeleteDialogOpen(false)
    } catch {
      // Keep the dialog open if deletion fails.
    }
  }

  return (
    <>
      <div className="relative flex min-h-[260px] flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-sm transition-all sm:p-6 hover:-translate-y-0.5 hover:shadow-md">

        {/* Top: icon, name, status, delete */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">

            {/* Category icon */}
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border"
              style={{
                color: preset?.color ?? "#94A3B8",
                backgroundColor:
                  preset?.background ?? "#F8FAFC",
                borderColor:
                  preset?.background ?? "#E2E8F0",
              }}
            >
              {Icon ? (
                <Icon
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" />
              )}
            </div>

            <div>
              {renaming ? (
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={(e) =>
                    setNameDraft(e.target.value)
                  }
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSubmit()
                    }

                    if (e.key === "Escape") {
                      setRenaming(false)
                      setNameDraft(row.name)
                    }
                  }}
                  className="w-36 rounded-md border border-border px-2 py-1 text-base font-bold text-[#14213D] outline-none focus:border-[#113160]"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setRenaming(true)}
                  className="group text-left"
                >
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base leading-tight font-bold tracking-tight text-[#14213D]">
                      {row.name}
                    </h3>

                    <Pencil className="h-3 w-3 text-transparent transition-colors group-hover:text-[#94A3B8]" />
                  </div>
                </button>
              )}

              <div className="mt-1">
                <span className="text-xs font-medium text-[#64748B]">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Delete */}
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label={`Delete ${row.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#FFF4F3] hover:text-[#C85C5C]"
          >
            <Trash2
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* Middle: transaction count */}
        <div className="my-auto py-5">
          <span className="block text-3xl leading-none font-bold tracking-tight text-[#14213D]">
            {row.transactionCount}
          </span>

          <span className="mt-1.5 block text-xs font-medium text-[#64748B]">
            {row.transactionCount === 1
              ? "Transaction"
              : "Transactions"}
          </span>
        </div>

        {/* Monthly Plan */}
        <div className="mb-5 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#64748B]">
              Monthly Plan
            </span>

            {row.hasBudget ? (
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#16806A]" />

                <span className="text-sm font-semibold text-[#14213D]">
                  Active
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-[#94A3B8]">
                Not started
              </span>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between border-t border-border pt-4">

          {/* Transactions */}
          {row.transactionCount > 0 ? (
            <Link
              href={`/transactions?category=${encodeURIComponent(
                row.name
              )}`}
              className="rounded-md text-sm font-semibold text-[#4A927F] transition-colors hover:text-[#377766]"
            >
              Transactions
            </Link>
          ) : (
            <span className="text-sm font-medium text-[#94A3B8]">
              No Transactions
            </span>
          )}

          {/* Budget */}
          <Link
            href="/budgets"
            className="rounded-md text-sm font-bold text-[#5148A3] transition-colors hover:text-[#40388A]"
          >
            {row.hasBudget ? "Budget" : "Set Budget"}
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14213D]/40 p-4 backdrop-blur-[3px]">
          <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_70px_rgba(20,33,61,0.18)]">

            {/* Modal Content */}
            <div className="relative px-7 pb-6 pt-7">

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteCategory.isPending}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </button>

              {/* Warning Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F1D8D5] bg-[#FFF6F5] text-[#C85C5C]">
                <AlertTriangle
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </div>

              {/* Title */}
              <div className="mt-5">
                <h3 className="text-lg font-bold tracking-tight text-[#14213D]">
                  Delete category?
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  You&apos;re about to permanently remove{" "}
                  <span className="font-semibold text-[#14213D]">
                    {row.name}
                  </span>{" "}
                  from your categories.
                </p>
              </div>

              {/* Warning */}
             {/* Warning */}
<div className="mt-5 rounded-xl border border-[#F1E2DF] bg-[#FCF8F7] px-4 py-3.5">
  <div className="flex items-start gap-3">
    <Trash2
      className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B96A62]"
      strokeWidth={1.8}
    />

    <p className="text-xs leading-5 text-[#765F5B]">
      {row.transactionCount > 0 || row.hasBudget ? (
        <>
          This will also permanently delete{" "}
          {row.transactionCount > 0 && (
            <span className="font-semibold text-[#765F5B]">
              {row.transactionCount}{" "}
              {row.transactionCount === 1 ? "transaction" : "transactions"}
            </span>
          )}
          {row.transactionCount > 0 && row.hasBudget && " and "}
          {row.hasBudget && (
            <span className="font-semibold text-[#765F5B]">
              its budget
            </span>
          )}{" "}
          linked to this category. This action cannot be undone.
        </>
      ) : (
        "This action cannot be undone. Make sure you no longer need this category before continuing."
      )}
    </p>
  </div>
</div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border bg-[#FCFCFB] px-7 py-4">

              {/* Cancel */}
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteCategory.isPending}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteCategory.isPending}
                className="rounded-lg bg-[#C85C5C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#B24F4F] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteCategory.isPending
                  ? "Deleting..."
                  : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}