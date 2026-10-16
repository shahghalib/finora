"use client"

import { Minus, Plus } from "lucide-react"
import Link from "next/link"

import { isIncomeCategory } from "@/components/overview/category-style"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  formatCurrency,
  relativeDayLabel,
  timeLabel,
} from "@/lib/format"
import type { Category, Transaction } from "@/lib/types"

interface RecentActivityCardProps {
  transactions?: Transaction[]
  categories?: Category[]
  isLoading: boolean
  limit?: number
  className?: string
}

export function RecentActivityCard({
  transactions,
  categories,
  isLoading,
  limit = 5,
  className,
}: RecentActivityCardProps) {
  const categoryNameById = new Map(
    (categories ?? []).map((category) => [
      category.id,
      category.name,
    ])
  )

  const rows = (transactions ?? [])
    .slice()
    .sort((a, b) => {
      const dateDiff = b.transactionDate.localeCompare(
        a.transactionDate
      )

      if (dateDiff !== 0) {
        return dateDiff
      }

      return b.createdAt.localeCompare(a.createdAt)
    })
    .slice(0, limit)

  return (
    <Card
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm ${
        className ?? ""
      }`}
    >
      {/* HEADER */}
      <CardHeader className="shrink-0 border-b border-border bg-white px-5 py-4">
        <CardTitle className="text-base font-semibold whitespace-nowrap text-foreground">
          Recent Activity
        </CardTitle>

        <p className="mt-0.5 text-xs font-semibold leading-[18px] text-[#44474F]">
          What changed recently
        </p>
      </CardHeader>

      {/* ACTIVITY SECTION */}
      <CardContent className="min-h-0 flex-1 overflow-hidden bg-[#FAF9F4] p-0">
        {isLoading ? (
          <div className="flex h-full flex-col px-5 py-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-start gap-3.5 border-b border-border/70 py-3 last:border-b-0"
              >
                <Skeleton className="size-11 shrink-0 rounded-full" />

                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3 w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex h-full items-center justify-center px-5">
            <p className="text-sm font-medium leading-[20px] text-[#44474F]">
              No transactions yet.
            </p>
          </div>
        ) : (
          <div className="relative h-full overflow-hidden px-5">
            {/* Vertical timeline */}
            <span
              aria-hidden="true"
              className="absolute bottom-5 left-[45px] top-5 w-px bg-[#E2E8F0]"
            />

            {/* Activities */}
            <div className="relative">
              {rows.map((transaction, index) => {
                const categoryName =
                  categoryNameById.get(
                    transaction.categoryId
                  ) ?? "Uncategorized"

                const isCredit =
                  isIncomeCategory(categoryName)

                const amount = Math.abs(
                  Number(transaction.amount)
                )

                const isLast = index === rows.length - 1

                return (
                  <div
                    key={transaction.id}
                    className={`relative z-10 flex items-start gap-3.5 py-3 ${
                      !isLast
                        ? "border-b border-border/70"
                        : ""
                    }`}
                  >
                    {/* Activity Icon */}
                    <div
                      className={
                        "flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-white " +
                        (isCredit
                          ? "text-[#10B981]"
                          : "text-[#EF4444]")
                      }
                    >
                      {isCredit ? (
                        <Plus
                          className="size-3.5"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Minus
                          className="size-3.5"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>

                    {/* Activity Details */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="min-w-0">
                          {/* Merchant */}
                          <span className="block truncate text-sm font-semibold leading-[20px] text-[#1B1C19]">
                            {transaction.merchant}
                          </span>

                          {/* Metadata */}
                          <span className="mt-0.5 block truncate text-xs font-bold uppercase leading-[15px] tracking-[0.05em] text-[#44474F]">
                            {relativeDayLabel(
                              transaction.transactionDate
                            )}
                            ,{" "}
                            {timeLabel(
                              transaction.createdAt
                            )}
                            {" • "}
                            {categoryName}
                          </span>
                        </div>

                        {/* Amount */}
                        <span
                          className={
                            "shrink-0 text-sm font-bold leading-[20px] " +
                            (isCredit
                              ? "text-[#10B981]"
                              : "text-[#EF4444]")
                          }
                        >
                          {isCredit ? "+" : "-"}{" "}
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="shrink-0 border-t border-border bg-white px-5 py-5">
        <Link
          href="/transactions"
          className="flex h-11 w-full items-center justify-center rounded-[5px] border border-border bg-[#FAF9F4] px-5 text-sm font-medium leading-[20px] text-[#1B1C19] transition-colors duration-200 hover:bg-[#F0EFEA] active:bg-[#F0EFEA]"
        >
          View Full Ledger
        </Link>
      </CardFooter>
    </Card>
  )
}