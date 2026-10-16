'use client';

import { useMemo, useState } from 'react';
import { useAlerts, useBudgets, useMarkAlertRead } from '@/hooks/use-alerts-data';
import { useCategories } from '@/hooks/use-transactions-data';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCheck, TriangleAlert, SlidersHorizontal } from 'lucide-react';
import type { BudgetAlertRecord } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { PageContainer, PageHeader } from '@/components/page-shell';




type TabKey = 'all' | 'critical' | 'financial' | 'security';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'financial', label: 'Financial' },
  { key: 'security', label: 'Security' },
];

function alertCategories(a: BudgetAlertRecord): TabKey[] {
  return a.thresholdType === '100pct' ? ['financial', 'critical'] : ['financial'];
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function AlertsPage() {
  const router = useRouter()
  const { data: alerts = [], isLoading } = useAlerts();
  const { data: budgets = [] } = useBudgets();
  const { data: categories = [] } = useCategories();
  const markRead = useMarkAlertRead();

  const [tab, setTab] = useState<TabKey>('all');
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const budgetMap = useMemo(() => new Map(budgets.map((b) => [b.id, b])), [budgets]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (tab !== 'all' && !alertCategories(a).includes(tab)) return false;
      if (highPriorityOnly && a.thresholdType !== '100pct') return false;
      if (unreadOnly && a.isRead) return false;
      return true;
    });
  }, [alerts, tab, highPriorityOnly, unreadOnly]);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <PageContainer>
      <PageHeader
        title="Alerts & Notifications"
        description="Stay updated with your latest financial activities, security alerts, and system notifications."
        actions={
          <>
            <button
              className="flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
              disabled={unreadCount === 0}
              onClick={() => {
                alerts.filter((a) => !a.isRead).forEach((a) => markRead.mutate(a.id));
              }}
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
            <Button
              variant="outline"
              className="h-9 gap-2 px-4"
              onClick={() => router.push('/settings')}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Settings
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
        {/* Filters: shown first on mobile, as a side panel on desktop */}
        <aside className="order-first space-y-4 lg:order-last">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <h3 className="card-title mb-3">Quick Filters</h3>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Priority</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col lg:gap-y-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <Checkbox checked={highPriorityOnly} onCheckedChange={(v) => setHighPriorityOnly(!!v)} />
                High Priority Only
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <Checkbox checked={unreadOnly} onCheckedChange={(v) => setUnreadOnly(!!v)} />
                Unread Only
              </label>
            </div>
            <div className="mt-5 hidden border-t pt-4 lg:block">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Categories</p>
              <div className="flex flex-wrap gap-2">
                {['Budgets', 'Transactions', 'Security', 'System'].map((c) => (
                  <span key={c} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div
            role="tablist"
            className="-mx-4 mb-5 flex gap-6 overflow-x-auto border-b px-4 sm:mx-0 sm:gap-8 sm:px-0"
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`-mb-px shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}

            {!isLoading && filtered.length === 0 && (
              <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
                No notifications {tab !== 'all' ? 'in this category' : 'yet'}.
              </div>
            )}

            {filtered.map((alert) => {
              const budget = budgetMap.get(alert.budgetId);
              const category = budget ? categoryMap.get(budget.categoryId) : undefined;
              const isCritical = alert.thresholdType === '100pct';

              return (
                <article
                  key={alert.id}
                  className={`overflow-hidden rounded-xl border border-l-4 border-border bg-card p-4 shadow-sm ${
                    isCritical ? 'border-l-red-600' : 'border-l-amber-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isCritical ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <TriangleAlert className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <h3 className="flex items-center gap-2 text-base font-semibold">
                          <span className="min-w-0">
                            {isCritical ? 'Budget Exceeded' : 'Budget Warning'}
                            {category && `: ${category.name}`}
                          </span>
                          {!alert.isRead && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-label="Unread" />
                          )}
                        </h3>
                        <span className="text-xs whitespace-nowrap text-muted-foreground">
                          {timeAgo(alert.triggeredAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {category ? `Your ${category.name} budget` : 'Your budget'} has{' '}
                        {isCritical ? 'exceeded the set limit' : 'crossed 80% of its limit'}
                        {budget ? ` of PKR ${Number(budget.limitAmount).toLocaleString()}` : ''}.
                        {isCritical ? ' Immediate review is recommended.' : ' Keep an eye on your spending.'}
                      </p>
                      {!alert.isRead && (
                        <Button
                          variant={isCritical ? 'default' : 'outline'}
                          className="mt-3 h-8 px-3"
                          onClick={() => markRead.mutate(alert.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
