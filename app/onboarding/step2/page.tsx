'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BadgeDollarSign,
  Check,
  CreditCard,
  Landmark,
  Wallet,
} from 'lucide-react';
import apiClient from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 4;
const CURRENT_STEP = 2;

// UI-facing source types. `apiType` is what actually gets sent to the
// backend today — the mockup adds "Credit Card" as its own option, but the
// backend's /accounts endpoint currently only knows about ['cash','bank',
// 'card'], so Credit Card maps to the same 'card' type as Debit Card until
// the backend is updated to tell them apart.
//
// The mockup's fifth option, "Other Manual Source" (custom assets/loans),
// is intentionally not offered here: it doesn't map cleanly onto any of
// the three types the backend accepts — 'cash' would misrepresent a loan
// as a liquid asset, 'card' would misrepresent a one-off asset as a
// liability — and previously sent a literal `type: 'other'`, which the
// backend's zod schema (z.enum(['cash','card','bank'])) rejects with a
// 400. Hiding it here until the backend adds a real 'other' type avoids
// shipping a button that either 400s or silently mis-tags the account.
const SOURCE_TYPES = [
  { id: 'cash', apiType: 'cash', label: 'Cash Wallet', desc: 'e.g., Physical Cash, Petty Cash', icon: Wallet },
  { id: 'bank', apiType: 'bank', label: 'Bank Account', desc: 'e.g., UBL Account, HBL Account', icon: Landmark },
  { id: 'debit', apiType: 'card', label: 'Debit Card', desc: 'Linked to checking accounts', icon: CreditCard },
  { id: 'credit', apiType: 'card', label: 'Credit Card', desc: 'Track liabilities and usage', icon: BadgeDollarSign },
] as const;

type SourceTypeId = (typeof SOURCE_TYPES)[number]['id'];

export default function OnboardingStep2() {
  const router = useRouter();
  const [sourceId, setSourceId] = useState<SourceTypeId>('bank');
  const [sourceName, setSourceName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const selected = SOURCE_TYPES.find((s) => s.id === sourceId) ?? SOURCE_TYPES[1];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Note: initialBalance isn't sent yet — the backend's /accounts
      // endpoint doesn't have a field for it today. Add it to this payload
      // once that's in place.
      await apiClient.post('/accounts', {
        name: sourceName,
        type: selected.apiType,
      });
      // Step 3 (Primary Currency) now has a real PATCH /users/me endpoint
      // to persist it, so it's back in the flow.
      router.push('/onboarding/step3');
    } catch (err: unknown) {
      console.error('Account creation error:', err);
      let message = 'Failed to create account. Please try again.';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = err.response as { data?: { message?: string } };
        if (response.data?.message) {
          message = response.data.message;
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Top app bar */}
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
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Add Financial Sources</h1>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Connect your manual sources to track spending and gain a comprehensive view of your
            finances.
          </p>
        </div>

        {/* Dot progress */}
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

        <form
          onSubmit={onSubmit}
          className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {SOURCE_TYPES.map(({ id, label, desc, icon: Icon }) => {
                const isSelected = sourceId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSourceId(id)}
                    className={cn(
                      'relative flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                      isSelected ? 'border-primary bg-accent' : 'border-border hover:bg-muted/50'
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{label}</p>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                    {isSelected && (
                      <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="my-5 h-px bg-border" />

            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Configure Selected Source
            </p>
            <div className="mt-3 space-y-3 rounded-xl bg-muted/40 p-4">
              <div className="space-y-1.5">
                <Label htmlFor="sourceName">Source Name</Label>
                <Input
                  id="sourceName"
                  placeholder="e.g., UBL Account, Cash Wallet"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="h-11 bg-background"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="initialBalance">Initial Balance</Label>
                <div className="relative">
                  <Input
                    id="initialBalance"
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    className="h-11 bg-background"
                  />
                </div>
              </div>
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
              onClick={() => router.push('/onboarding/step1')}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Back
            </button>
            <Button type="submit" disabled={isLoading} className="h-11 gap-2 px-6 font-semibold">
              {isLoading ? 'Adding...' : 'Continue'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
