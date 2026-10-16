'use client';

import { useMemo } from 'react';
import {
  useCurrentAndPreviousMonth, useTrend, useFlaggedCategories,
} from '@/hooks/use-analytics-data';
import { useTransactions } from '@/hooks/use-transactions-data';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/page-shell';

function formatPKR(n: number) {
  return `Rs ${n.toLocaleString()}`;
}

function monthLabel(monthStr: string) {
  return new Date(monthStr).toLocaleDateString('en-US', { month: 'short' });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card shadow-lg px-4 py-3 min-w-40">
      <p className="text-sm font-semibold mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.dataKey}
            </span>
            <span className="font-medium">Rs {entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function AnalyticsPage() {
  const { current, previous } = useCurrentAndPreviousMonth();
  const { data: trend = [], isLoading: trendLoading } = useTrend(6);
  const { data: flagged = [] } = useFlaggedCategories();
  const { data: transactions = [] } = useTransactions();

  const chartData = useMemo(() => {
    const monthsSet = new Set(trend.map((t) => t.month));
    const months = Array.from(monthsSet).sort();
    return months.map((month) => {
      const row: Record<string, string | number> = { month: monthLabel(month) };
      trend
        .filter((t) => t.month === month)
        .forEach((t) => {
          row[t.category] = t.totalSpent;
        });
      return row;
    });
  }, [trend]);
  const budgetAdherence = useMemo(() => {
    if (!current.data || current.data.categories.length === 0) return null;
    const totalLimit = current.data.categories.reduce((sum, c) => sum + c.budgetLimit, 0);
    const totalSpent = current.data.categories.reduce((sum, c) => sum + c.spent, 0);
    if (totalLimit === 0) return null;
    const pct = Math.max(0, Math.min(100, (1 - totalSpent / totalLimit) * 100));
    return {
      pct: Math.round(pct),
      label: pct >= 30 ? 'Healthy' : pct >= 10 ? 'Tight' : 'At Risk',
      labelColor: pct >= 30 ? 'bg-emerald-500/20 text-emerald-100' : pct >= 10 ? 'bg-amber-500/20 text-amber-100' : 'bg-red-500/20 text-red-100',
    };
  }, [current.data]); 

  const categoryNames = useMemo(
    () => Array.from(new Set(trend.map((t) => t.category))),
    [trend]
  );

  const vsLastMonth = useMemo(() => {
    if (!current.data || !previous.data) return null;
    const diff = current.data.totalSpent - previous.data.totalSpent;
    const pct = previous.data.totalSpent > 0 ? (diff / previous.data.totalSpent) * 100 : 0;
    return { diff, pct, isUp: diff >= 0 };
  }, [current.data, previous.data]);

  const topMerchants = useMemo(() => {
    const totals = new Map<string, { total: number; count: number }>();
    transactions.forEach((t) => {
      const existing = totals.get(t.merchant) ?? { total: 0, count: 0 };
      totals.set(t.merchant, { total: existing.total + Number(t.amount), count: existing.count + 1 });
    });
    return Array.from(totals.entries())
      .map(([merchant, v]) => ({ merchant, ...v }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [transactions]);

  const CHART_COLORS = ['#081E3D', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <PageContainer>
      <div>
        <PageHeader
          title="Analytics"
          description="Deep dive into your financial metrics and trends."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="rounded-xl border border-border bg-card shadow-sm p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold">Spending Trend</h3>
              <p className="text-sm text-muted-foreground">Expenses by category over the last 6 months</p>
            </div>

            {trendLoading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      {categoryNames.map((cat, i) => (
                        <linearGradient key={cat} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#EEEDE8" />
                    <XAxis
                      dataKey="month"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    {categoryNames.map((cat, i) => (
                      <Area
                        key={cat}
                        type="monotone"
                        dataKey={cat}
                        stroke={CHART_COLORS[i % CHART_COLORS.length]}
                        strokeWidth={2.5}
                        fill={`url(#gradient-${i})`}
                        dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 5 }}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>

                {/* Custom legend — replaces Recharts' default Legend for a cleaner look */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 sm:gap-x-6">
                  {categoryNames.map((cat, i) => (
                    <span key={cat} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      {cat}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
  {/* vs Last Month — taller, more breathing room */}
  <div className="rounded-xl border border-border bg-card shadow-sm p-4 sm:p-6">
    <h3 className="text-base font-semibold mb-5">vs Last Month</h3>
    {vsLastMonth ? (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Spend</p>
          <p className="text-2xl font-bold mt-1 sm:text-3xl">{formatPKR(current.data!.totalSpent)}</p>
          <span
            className={`inline-flex items-center gap-1 mt-2 text-xs font-medium rounded-full px-2.5 py-1 ${
              vsLastMonth.isUp ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {vsLastMonth.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {vsLastMonth.isUp ? '+' : ''}{vsLastMonth.pct.toFixed(1)}%
          </span>
        </div>
        <div className="pt-5 border-t border-[#EEEDE8]">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Month</p>
          <p className="text-lg font-semibold text-muted-foreground mt-1">{formatPKR(previous.data!.totalSpent)}</p>
        </div>
      </div>
    ) : (
      <p className="text-muted-foreground text-sm">Loading...</p>
    )}
  </div>

  {/* Budget Adherence — real metric, replaces Savings Rate (no income data exists) */}
  <div className="rounded-xl bg-primary text-primary-foreground shadow-sm p-4 sm:p-6">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-base font-semibold">Budget Adherence</h3>
      <PiggyBank className="h-5 w-5 text-white/70" />
    </div>
    <p className="text-sm text-white/60 mb-4">This Month</p>
    {budgetAdherence ? (
      <>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold">{budgetAdherence.pct}%</span>
          <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${budgetAdherence.labelColor}`}>
            {budgetAdherence.label}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full rounded-full bg-white" style={{ width: `${budgetAdherence.pct}%` }} />
        </div>
      </>
    ) : (
      <p className="text-sm text-white/60">No budget data yet.</p>
    )}
  </div>
</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="rounded-xl border border-border bg-card shadow-sm p-4 sm:p-6">
            <h3 className="text-base font-semibold mb-5">Spending by Category</h3>
            <div className="space-y-4">
              {current.data?.categories.map((c) => {
                const pct = c.budgetLimit > 0 ? Math.min(100, (c.spent / c.budgetLimit) * 100) : 0;
                return (
                  <div key={c.category}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{c.category}</span>
                      <span className="text-muted-foreground">{formatPKR(c.spent)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#EEEDE8] overflow-hidden">
                      <div className="h-full rounded-full bg-[#081E3D]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {!current.data?.categories.length && (
                <p className="text-sm text-muted-foreground">No spending data for this month yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm p-4 sm:p-6">
            <h3 className="text-base font-semibold mb-5">Top Merchants</h3>
            <div className="space-y-4">
              {topMerchants.map((m) => (
                <div key={m.merchant} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-primary/5 flex items-center justify-center font-semibold text-sm text-[#081E3D]">
                      {m.merchant.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="truncate text-sm font-medium">{m.merchant}</p>
                      <p className="text-xs text-muted-foreground">{m.count} txn{m.count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">{formatPKR(m.total)}</p>
                </div>
              ))}
              {topMerchants.length === 0 && (
                <p className="text-sm text-muted-foreground">No transactions yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-5">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-semibold">Flagged Categories</h3>
            <span className="text-xs text-muted-foreground">— over budget in 2+ of the last 3 months</span>
          </div>
          {flagged.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories have been consistently over budget. Nice work.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {flagged.map((f) => (
                <div key={f.categoryId} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="font-semibold text-amber-900">{f.categoryName}</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Over budget in {f.exceededCount} of the last 3 months
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
