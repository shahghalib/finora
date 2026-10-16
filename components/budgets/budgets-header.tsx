"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { PageHeader } from "@/components/page-shell"
import { CreateBudgetDialog } from "./create-budget-dialog"

interface BudgetsHeaderProps {
  monthLabel: string
  month: string
  currency: string
}

export function BudgetsHeader({
  monthLabel,
  month,
  currency,
}: BudgetsHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <PageHeader
        title="Budgets"
        description={`Manage your spending limits for ${monthLabel}.`}
        actions={
          <>
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <span>Currency:</span>
              <span className="font-semibold text-foreground">{currency}</span>
            </div>

            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" />
              Create Budget
            </button>
          </>
        }
      />

      {dialogOpen && (
        <CreateBudgetDialog
          month={month}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  )
}
