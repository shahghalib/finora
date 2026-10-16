"use client"

import { useEffect, useState } from "react"

import { AuthRequiredCard } from "@/components/overview/auth-required-card"
import { BudgetControlsCard } from "@/components/overview/budget-controls-card"
import { ErrorCard } from "@/components/overview/error-card"
import { RecentActivityCard } from "@/components/overview/recent-activity-card"
import { RemainingBudgetCard } from "@/components/overview/remaining-budget-card"
import { TodaysSignalCard } from "@/components/overview/todays-signal-card"
import { LinkedAccountsCard } from "@/components/overview/linked-accounts-card"
import { PageContainer, PageHeader } from "@/components/page-shell"
import { getToken } from "@/lib/api-client"
import {
  useCategories,
  useLatestMonthWithData,
  useMonthlySummary,
  useTransactions,
} from "@/hooks/use-overview-data"

export function OverviewView() {
  const [hasToken, setHasToken] = useState<boolean | null>(null)

  useEffect(() => {
    // Checking auth status on mount is syncing with an external system
    // (localStorage), not a derived render value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasToken(Boolean(getToken()))
  }, [])

  const latestMonth = useLatestMonthWithData()
  const summary = useMonthlySummary(latestMonth.data)
  const transactions = useTransactions()
  const categories = useCategories()

  const firstError =
    latestMonth.error ??
    summary.error ??
    transactions.error ??
    categories.error

  return (
    <PageContainer>
      <PageHeader
        title="Overview"
        description="Your budget status and recent activity at a glance."
      />

      {hasToken === false ? (
        <AuthRequiredCard />
      ) : firstError ? (
        <ErrorCard error={firstError} />
      ) : (
        /*
          One grid for everything so the rows line up on desktop:
            row 1:  Remaining Budget + Today's Signal   |  Linked Accounts
            row 2:  Budget Controls                     |  Recent Activity
          Cards in the same row are the same height. On phones it's a single
          column in DOM order.
        */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 lg:col-start-1 lg:row-start-1">
            <RemainingBudgetCard
              summary={summary.data}
              isLoading={summary.isLoading}
            />
            <TodaysSignalCard
              summary={summary.data}
              isLoading={summary.isLoading}
            />
          </div>

          <BudgetControlsCard
            className="min-w-0 lg:col-start-1 lg:row-start-2"
            summary={summary.data}
            isLoading={summary.isLoading}
          />

          <div className="min-w-0 lg:col-start-2 lg:row-start-1">
            <LinkedAccountsCard />
          </div>

          <RecentActivityCard
            className="min-w-0 lg:col-start-2 lg:row-start-2"
            transactions={transactions.data}
            categories={categories.data}
            isLoading={transactions.isLoading || categories.isLoading}
            limit={5}
          />
        </div>
      )}
    </PageContainer>
  )
}
