'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Sparkles, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useCategories, useLatestMonthWithData, useMonthlySummary } from '@/hooks/use-overview-data';
import { useAccounts, useCreateTransaction } from '@/hooks/use-transactions-data';
import { ApiError } from '@/lib/api-client';
import { formatCurrency } from '@/lib/format';
import { useAddTransactionStore } from '@/lib/store/add-transaction-store';
import { useAuthStore } from '@/lib/store/authStore';
import { getBudgetStatusBarClass, getBudgetUsagePercent } from '@/lib/utils';

const CURRENCIES = ['PKR', 'USD', 'SAR', 'GBP'];

const MERCHANT_CATEGORY_MAP: { keywords: string[]; categoryName: string }[] = [
  {
    keywords: ['kfc', 'mcdonald', 'hardees', 'subway', 'pizza', 'foodpanda', 'dominos'],
    categoryName: 'Food',
  },
  { keywords: ['uber', 'careem', 'bykea', 'petrol', 'shell', 'total parco'], categoryName: 'Transport' },
  { keywords: ['netflix', 'spotify', 'cinema', 'cinepax'], categoryName: 'Entertainment' },
  { keywords: ['rent', 'landlord'], categoryName: 'Rent' },
];

function guessCategoryFromMerchant(merchant: string): string | null {
  const lower = merchant.toLowerCase().trim();
  if (!lower) return null;
  for (const entry of MERCHANT_CATEGORY_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.categoryName;
  }
  return null;
}

function todayDateInputValue(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function AddTransactionModal() {
  const isOpen = useAddTransactionStore((state) => state.isOpen);
  const close = useAddTransactionStore((state) => state.close);

  if (!isOpen) return null;

  return <AddTransactionModalContent onClose={close} />;
}

function AddTransactionModalContent({ onClose }: { onClose: () => void }) {
  const defaultCurrency = useAuthStore((state) => state.user?.defaultCurrency) ?? 'PKR';

  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const latestMonth = useLatestMonthWithData();
  const summary = useMonthlySummary(latestMonth.data);
  const createTransaction = useCreateTransaction();

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(todayDateInputValue());
  const [accountId, setAccountId] = useState('');
  const [categoryMode, setCategoryMode] = useState<'auto' | 'manual'>('auto');
  const [manualCategoryId, setManualCategoryId] = useState('');
  const [error, setError] = useState('');

  const effectiveAccountId = accountId || (accounts && accounts.length > 0 ? String(accounts[0].id) : '');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const suggestedCategoryName = useMemo(() => guessCategoryFromMerchant(merchant), [merchant]);

  const showSuggestion = categoryMode === 'auto' && Boolean(suggestedCategoryName);
  const showNoMatch = categoryMode === 'auto' && merchant.trim().length > 0 && !suggestedCategoryName;

  const selectedCategoryName =
    categoryMode === 'manual'
      ? categories?.find((c) => String(c.id) === manualCategoryId)?.name
      : (suggestedCategoryName ?? undefined);

  const budgetRow = summary.data?.categories.find((c) => c.category === selectedCategoryName);

  const amountNum = Number(amount);
  const isAmountValid = Number.isFinite(amountNum) && amountNum > 0;
  const canSubmit =
    isAmountValid &&
    merchant.trim().length > 0 &&
    Boolean(effectiveAccountId) &&
    Boolean(date) &&
    (categoryMode === 'auto' || Boolean(manualCategoryId));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError('');

    try {
      await createTransaction.mutateAsync({
        accountId: Number(effectiveAccountId),
        amount: amountNum,
        currency,
        merchant: merchant.trim(),
        transactionDate: date,
        ...(categoryMode === 'manual' ? { categoryId: Number(manualCategoryId) } : {}),
      });
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to save transaction. Please try again.';
      setError(message);
    }
  };

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex justify-end bg-black/40 duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add Transaction"
        onClick={(e) => e.stopPropagation()}
        className="animate-in slide-in-from-right flex h-dvh w-full max-w-md flex-col overflow-hidden bg-card shadow-xl duration-200 ease-out"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="text-lg font-bold text-foreground">Add Transaction</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-11 bg-background"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-11 w-28 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="merchant">Merchant</Label>
              <Input
                id="merchant"
                placeholder="e.g. KFC Saddar"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="h-11 bg-background"
                required
              />
            </div>

            {showSuggestion && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Category Suggestion
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">{suggestedCategoryName}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button type="button" size="sm" onClick={() => setCategoryMode('auto')}>
                      Accept
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setCategoryMode('manual')}>
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showNoMatch && (
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                  We couldn&apos;t auto-detect a category for this merchant.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => setCategoryMode('manual')}
                >
                  Choose category
                </Button>
              </div>
            )}

            {categoryMode === 'manual' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="category">Category</Label>
                  {suggestedCategoryName && (
                    <button
                      type="button"
                      onClick={() => setCategoryMode('auto')}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Use suggested category
                    </button>
                  )}
                </div>
                <select
                  id="category"
                  value={manualCategoryId}
                  onChange={(e) => setManualCategoryId(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base sm:text-sm"
                >
                  <option value="" disabled>
                    {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                  </option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 bg-background"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="account">Account</Label>
                <select
                  id="account"
                  value={effectiveAccountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base sm:text-sm"
                >
                  <option value="" disabled>
                    {accountsLoading ? 'Loading accounts...' : 'Select an account'}
                  </option>
                  {accounts?.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCategoryName && (
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Budget Impact Preview
                </p>
                {budgetRow ? (
                  <>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground">{selectedCategoryName}</span>
                      <span className="text-muted-foreground">
                        Limit: {formatCurrency(budgetRow.budgetLimit)}
                      </span>
                    </div>
                    <Progress
                      value={getBudgetUsagePercent(budgetRow.spent, budgetRow.budgetLimit)}
                      indicatorClassName={getBudgetStatusBarClass(budgetRow.spent, budgetRow.budgetLimit)}
                      className="mt-2"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Current: {formatCurrency(budgetRow.spent)}</span>
                      {isAmountValid && <span>+{formatCurrency(amountNum)}</span>}
                    </div>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No budget set for {selectedCategoryName} yet.
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || createTransaction.isPending}>
              {createTransaction.isPending ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
