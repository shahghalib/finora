"use client"

import { FolderKanban, Receipt, Wallet } from "lucide-react"
import type { CategoryRow } from "@/hooks/use-categories-data"

interface CategoriesSummaryCardProps {
  rows: CategoryRow[]
}

export function CategoriesSummaryCard({
  rows,
}: CategoriesSummaryCardProps) {
  const totalCategories = rows.length

  const budgetedCount = rows.filter(
    (row) => row.hasBudget
  ).length

  const totalTransactions = rows.reduce(
    (sum, row) => sum + row.transactionCount,
    0
  )

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-10">

      {/* Category Overview */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-8 md:col-span-7">
        <h3 className="text-xs font-semibold tracking-wide text-[#44474F] uppercase">
          Category Overview
        </h3>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* Total Categories */}
          <div className="flex flex-1 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#DDE5FF] bg-[#EEF2FF] text-[#4355B9]">
              <FolderKanban
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="text-3xl leading-none font-bold tracking-tight text-[#1B1C19]">
                {totalCategories}
              </p>

              <p className="mt-1.5 text-xs font-medium text-[#44474F]">
                Total Categories
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-6 hidden h-12 w-px flex-shrink-0 bg-border sm:block" />

          {/* Categories with Budgets */}
          <div className="flex flex-1 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#D7EEE7] bg-[#EFFAF6] text-[#16806A]">
              <Wallet
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="text-3xl leading-none font-bold tracking-tight text-[#1B1C19]">
                {budgetedCount}
              </p>

              <p className="mt-1.5 text-xs font-medium text-[#44474F]">
                Categories with Budgets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Activity */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-7 md:col-span-3">
        <h3 className="text-xs font-semibold tracking-wide text-[#44474F] uppercase">
          Transaction Activity
        </h3>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#F3E2C5] bg-[#FFF8EC] text-[#B7791F]">
            <Receipt
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </div>

          <div>
            <p className="text-3xl leading-none font-bold tracking-tight text-[#1B1C19]">
              {totalTransactions.toLocaleString("en-US")}
            </p>

            <p className="mt-1.5 text-xs font-medium text-[#44474F]">
              Total Transactions
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}