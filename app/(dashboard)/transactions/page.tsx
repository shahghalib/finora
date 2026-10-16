'use client';

import { useMemo, useState } from 'react';
import { useTransactions, useAccounts, useCategories } from '@/hooks/use-transactions-data';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getCategoryPreset } from '@/components/categories/category-visuals';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/page-shell';

const PAGE_SIZE = 4;
const DATE_RANGES = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'All Time', days: null },
];

function StatusBadge({ isAutoCategorized }: { isAutoCategorized: boolean }) {
  const config = isAutoCategorized
    ? { label: 'Auto-tagged', className: 'bg-blue-50 text-blue-700 border-blue-200' }
    : { label: 'Manually Verified', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };

  return (
    <Badge variant="outline" className={`${config.className} h-6 px-2.5 text-xs font-medium`}>
      <span className="mr-1.5">●</span>
      {config.label}
    </Badge>
  );
}

// Simple colored-circle avatar as a stand-in for merchant logos/icons —
// no real merchant icon data exists in the backend.
function CategoryIcon({ categoryName }: { categoryName: string | undefined }) {
  const preset = getCategoryPreset(categoryName ?? '');
  const Icon = preset.icon;
  return (
    <div
      className="shrink-0 h-11 w-11 rounded-xl flex items-center justify-center border"
      style={{
        color: preset.color,
        backgroundColor: preset.background,
        borderColor: preset.background,
      }}
    >
      <Icon className="h-5 w-5" strokeWidth={1.8} />
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Show at most 5 page buttons around the current page so pagination never
// overflows a phone screen when there are many pages.
function pageWindow(current: number, total: number): number[] {
  const size = Math.min(5, total);
  let start = Math.max(1, current - Math.floor(size / 2));
  if (start + size - 1 > total) start = total - size + 1;
  return Array.from({ length: size }, (_, i) => start + i);
}

export default function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();

  const [search, setSearch] = useState('');
  const [dateRangeDays, setDateRangeDays] = useState<number | null>(30);
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [accountFilter, setAccountFilter] = useState<string>('All Accounts');
  const [page, setPage] = useState(1);

  const accountMap = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  // TODO: this filtering runs client-side because /transactions has no
  // query params yet. Fine for demo-scale data; move server-side if the
  // dataset grows or pagination needs to be real.
  const filtered = useMemo(() => {
    // Date.now() here is intentionally time-relative for a "last N days"
    // filter; sub-render-cycle drift is harmless (worst case a boundary
    // transaction shifts by milliseconds between renders).
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    return transactions.filter((t) => {
      if (dateRangeDays) {
        const txTime = new Date(t.transactionDate).getTime();
        if (now - txTime > dateRangeDays * 24 * 60 * 60 * 1000) return false;
      }
      if (categoryFilter !== 'All Categories' && String(t.categoryId) !== categoryFilter) return false;
      if (accountFilter !== 'All Accounts' && String(t.accountId) !== accountFilter) return false;
      if (search) {
        const category = categoryMap.get(t.categoryId)?.name ?? '';
        const haystack = `${t.merchant} ${category}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [transactions, dateRangeDays, categoryFilter, accountFilter, search, categoryMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        description="Review and manage your financial activity."
      />

      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search merchants, categories..."
              className="h-10 bg-card pl-10"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              items={DATE_RANGES.map((r) => ({ value: String(r.days), label: r.label }))}
              value={String(dateRangeDays)}
              onValueChange={(v) => {
                if (v) { setDateRangeDays(v === 'null' ? null : Number(v)); setPage(1); }
              }}
            >
              <SelectTrigger className="h-10 w-full bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DATE_RANGES.map((r) => (
                  <SelectItem key={r.label} value={String(r.days)}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              items={[
                { value: 'All Categories', label: 'All Categories' },
                ...categories.map((c) => ({ value: String(c.id), label: c.name })),
              ]}
              value={categoryFilter}
              onValueChange={(v) => {
                if (v) { setCategoryFilter(v); setPage(1); }
              }}
            >
              <SelectTrigger className="h-10 w-full bg-card"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              items={[
                { value: 'All Accounts', label: 'All Accounts' },
                ...accounts.map((a) => ({ value: String(a.id), label: a.name })),
              ]}
              value={accountFilter}
              onValueChange={(v) => {
                if (v) { setAccountFilter(v); setPage(1); }
              }}
            >
              <SelectTrigger className="h-10 w-full bg-card"><SelectValue placeholder="All Accounts" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Accounts">All Accounts</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Phones: one card per transaction */}
        <div className="space-y-3 md:hidden">
          {isLoading && (
            <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">Loading...</div>
          )}
          {!isLoading && pageItems.length === 0 && (
            <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">No transactions found.</div>
          )}
          {pageItems.map((t) => {
            const account = accountMap.get(t.accountId);
            const category = categoryMap.get(t.categoryId);
            return (
              <div key={t.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <CategoryIcon categoryName={category?.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate font-medium">{t.merchant}</p>
                      <p className="shrink-0 font-semibold">
                        {t.currency} {Number(t.amount).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {[category?.name, account?.name, formatDate(t.transactionDate)].filter(Boolean).join(' • ')}
                    </p>
                    <div className="mt-2">
                      <StatusBadge isAutoCategorized={t.isAutoCategorized} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tablet / desktop: table, scrolls sideways instead of squashing */}
        <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-sm md:block">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-muted text-xs tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-3 text-left font-semibold lg:px-6">Merchant</th>
                <th className="px-4 py-3 text-left font-semibold lg:px-6">Category</th>
                <th className="px-4 py-3 text-left font-semibold lg:px-6">Account</th>
                <th className="px-4 py-3 text-left font-semibold lg:px-6">Date</th>
                <th className="px-4 py-3 text-right font-semibold lg:px-6">Amount</th>
                <th className="px-4 py-3 text-left font-semibold lg:px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading...</td></tr>
              )}
              {!isLoading && pageItems.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No transactions found.</td></tr>
              )}
              {pageItems.map((t) => {
                const account = accountMap.get(t.accountId);
                const category = categoryMap.get(t.categoryId);
                return (
                  <tr key={t.id} className="border-t border-border transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3.5 lg:px-6">
                      <div className="flex items-center gap-3">
                        <CategoryIcon categoryName={category?.name} />
                        <span className="font-medium">{t.merchant}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground lg:px-6">{category?.name ?? '—'}</td>
                    <td className="px-4 py-3.5 text-muted-foreground lg:px-6">{account?.name ?? '—'}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground lg:px-6">
                      {formatDate(t.transactionDate)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold whitespace-nowrap lg:px-6">
                      {t.currency} {Number(t.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 lg:px-6"><StatusBadge isAutoCategorized={t.isAutoCategorized} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {pageItems.length ? (page - 1) * PAGE_SIZE + 1 : 0} to{' '}
            {(page - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} results
          </span>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" className="size-9" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {pageWindow(page, totalPages).map((p) => (
              <Button key={p} variant={p === page ? 'default' : 'outline'} size="icon" className="size-9" aria-current={p === page ? 'page' : undefined} onClick={() => setPage(p)}>
                {p}
              </Button>
            ))}
            <Button variant="outline" size="icon" className="size-9" aria-label="Next page" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
