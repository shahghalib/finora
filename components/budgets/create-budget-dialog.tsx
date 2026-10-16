"use client"

import { useState, type FormEvent } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCategories } from "@/hooks/use-overview-data"
import { useCreateBudget } from "@/hooks/use-budgets-data"

interface CreateBudgetDialogProps {
  month: string
  onClose: () => void
}

const CURRENCIES = ["PKR", "USD", "SAR", "GBP"]

export function CreateBudgetDialog({ month, onClose }: CreateBudgetDialogProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const createBudget = useCreateBudget()

  const [categoryId, setCategoryId] = useState("")
  const [limitAmount, setLimitAmount] = useState("")
  const [currency, setCurrency] = useState("PKR")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!categoryId || !limitAmount) return

    try {
      await createBudget.mutateAsync({
        categoryId: Number(categoryId),
        month,
        limitAmount: Number(limitAmount),
        currency,
      })
      onClose()
    } catch {
      // error is surfaced below via createBudget.isError
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-background p-5 shadow-lg sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Create New Budget</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="" disabled>
                {categoriesLoading ? "Loading categories..." : "Select a category"}
              </option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Monthly Limit</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              required
              placeholder="e.g. 50000"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {createBudget.isError && (
            <p className="text-sm text-destructive">
              {(createBudget.error as Error)?.message ??
                "Failed to create budget."}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createBudget.isPending}>
              {createBudget.isPending ? "Creating..." : "Create Budget"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}