'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Car, Check, Clapperboard, Home, Utensils } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateBudget } from '@/hooks/use-budgets-data';
import { ApiError, apiFetch } from '@/lib/api-client';
import { monthParam } from '@/lib/format';
import { useAuthStore } from '@/lib/store/authStore';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 4;
const CURRENT_STEP = 4;

const CATEGORY_ALLOCATIONS = [
  { name: 'Rent', pct: 40, icon: Home },
  { name: 'Food', pct: 25, icon: Utensils },
  { name: 'Transport', pct: 20, icon: Car },
  { name: 'Entertainment', pct: 15, icon: Clapperboard },
] as const;

function splitTotal(total: number): Record<string, number> {
  const result: Record<string, number> = {};
  let allocated = 0;

  for (const c of CATEGORY_ALLOCATIONS.slice(0, -1)) {
    const amount = Math.round((total * c.pct) / 100);
    result[c.name] = amount;
    allocated += amount;
  }

  const last = CATEGORY_ALLOCATIONS[CATEGORY_ALLOCATIONS.length - 1];
  result[last.name] = Math.max(total - allocated, 0);

  return result;
}

export default function OnboardingStep4() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createBudget = useCreateBudget();
  const currency = useAuthStore((state) => state.user?.defaultCurrency) ?? 'PKR';

  const [totalBudget, setTotalBudget] = useState('');
  const [amounts, setAmounts] = useState<Record<string, string>>(() =>
    Object.fromEntries(CATEGORY_ALLOCATIONS.map((c) => [c.name, '']))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleTotalChange = (value: string) => {
    setTotalBudget(value);
    const total = Number(value);
    if (Number.isFinite(total) && total > 0) {
      const split = splitTotal(Math.round(total));
      setAmounts(Object.fromEntries(CATEGORY_ALLOCATIONS.map((c) => [c.name, String(split[c.name])])));
    }
  };

  const handleAmountChange = (name: string, value: string) => {
    setAmounts((prev) => ({ ...prev, [name]: value }));
  };

  const allocatedTotal = CATEGORY_ALLOCATIONS.reduce(
    (sum, c) => sum + (Number(amounts[c.name]) || 0),
    0
  );

  const totalNum = Number(totalBudget);
  const isValidTotal = Number.isFinite(totalNum) && totalNum > 0;
  const isFullyAllocated = isValidTotal && allocatedTotal === totalNum;

  const onFinish = async () => {
    if (!isFullyAllocated || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const existingCategories = await apiFetch<Category[]>('/categories');
      const existingByName = new Map(existingCategories.map((c) => [c.name, c]));
      const month = monthParam(new Date());

      for (const alloc of CATEGORY_ALLOCATIONS) {
        let category = existingByName.get(alloc.name);

        if (!category) {
          category = await apiFetch<Category>('/categories', {
            method: 'POST',
            body: JSON.stringify({ name: alloc.name }),
          });
        }

        const limitAmount = Number(amounts[alloc.name]);
        if (!Number.isFinite(limitAmount) || limitAmount <= 0) continue;

        try {
          await createBudget.mutateAsync({
            categoryId: category.id,
            month,
            limitAmount,
            currency,
          });
        } catch (err) {
          if (!(err instanceof ApiError && err.status === 409)) {
            throw err;
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['categories'] });
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Budget setup error:', err);
      const message =
        err instanceof ApiError ? err.message : 'Failed to set up your budgets. Please try again.';
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="border-b border-border bg-card px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-lg font-bold text-primary">Finora</span>
          <span className="text-xs font-semibold tracking-wide text-muted-foreground">
            STEP {CURRENT_STEP} OF {TOTAL_STEPS}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 sm:px-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Initial Budget Setup</h1>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Set a monthly budget and we&apos;ll split it across your core spending categories.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
            <span
              key={step}
              className={cn(
                'h-1.5 w-8 rounded-full transition-colors',
                step === CURRENT_STEP ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-5 sm:p-6">
            <Label htmlFor="totalBudget">Set Monthly Budget</Label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-muted-foreground">
                {currency}
              </span>
              <Input
                id="totalBudget"
                type="number"
                min="0"
                step="1"
                inputMode="decimal"
                placeholder="0"
                value={totalBudget}
                onChange={(e) => handleTotalChange(e.target.value)}
                className="h-12 bg-background pl-14 text-lg font-semibold"
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This represents your total expected spend for the month.
            </p>

            <div className="my-5 h-px bg-border" />

            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Allocation Breakdown
              </p>
              <p className="text-xs text-muted-foreground">Based on standard recommendations</p>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {CATEGORY_ALLOCATIONS.map(({ name, pct, icon: Icon }) => (
                <div key={name} className="rounded-xl bg-muted/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-semibold text-primary">
                      <Icon className="h-4 w-4" />
                      {name}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                      {pct}%
                    </span>
                  </div>
                  <div className="relative mt-3">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                      {currency}
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={amounts[name]}
                      onChange={(e) => handleAmountChange(name, e.target.value)}
                      className="h-11 bg-background pl-14"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              className={cn(
                'mt-5 flex items-center justify-between rounded-xl border p-4',
                isFullyAllocated ? 'border-success/30 bg-success/10' : 'border-border bg-muted/40'
              )}
            >
              <span className="font-semibold text-primary">Allocated Total</span>
              <span className="flex items-center gap-2 text-xl font-bold text-primary">
                {currency} {allocatedTotal.toLocaleString('en-US')}
                {isFullyAllocated && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-success text-success-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </span>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border px-6 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => router.push('/onboarding/step3')}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Back
            </button>
            <Button
              type="button"
              onClick={onFinish}
              disabled={!isFullyAllocated || isSubmitting}
              className="h-11 gap-2 px-6 font-semibold"
            >
              {isSubmitting ? 'Setting up...' : 'Finish Setup'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
