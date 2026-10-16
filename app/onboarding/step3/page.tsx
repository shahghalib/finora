'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ApiError, apiFetch } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/authStore';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 4;
const CURRENT_STEP = 3;

// Same 4 currencies as auth/dto/signup.schema.ts's defaultCurrency enum on
// the backend and the CURRENCIES list used elsewhere in the app (e.g. the
// Add Transaction modal) — keep these in sync if that list ever changes.
const CURRENCY_OPTIONS = [
  { code: 'PKR', symbol: 'Rs', label: 'Pakistani Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'SAR', symbol: '﷼', label: 'Saudi Riyal' },
] as const;

interface UpdateUserResponse {
  id: number;
  username: string;
  email: string;
  defaultCurrency: string;
  createdAt: string;
}

export default function OnboardingStep3() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [currency, setCurrency] = useState(user?.defaultCurrency ?? 'PKR');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const updated = await apiFetch<UpdateUserResponse>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ defaultCurrency: currency }),
      });

      // setAuth() takes (token, user) together — reuse the current token
      // since it's unchanged, this call is only refreshing the persisted
      // user's defaultCurrency so the rest of onboarding (Step 4's budget
      // amounts) and the app at large picks it up immediately.
      if (token && user) {
        setAuth(token, { ...user, defaultCurrency: updated.defaultCurrency });
      }

      router.push('/onboarding/step4');
    } catch (err: unknown) {
      console.error('Currency update error:', err);
      const message =
        err instanceof ApiError ? err.message : 'Failed to save currency. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Primary Currency</h1>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Select the default currency for reporting and main ledger entries. You can add
            secondary currencies later.
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
            <div className="grid gap-3 sm:grid-cols-2">
              {CURRENCY_OPTIONS.map(({ code, symbol, label }) => {
                const isSelected = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl border p-4 text-left transition-colors',
                      isSelected ? 'border-primary bg-accent' : 'border-border hover:bg-muted/50'
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-primary">
                      {symbol}
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{code}</p>
                      <p className="text-sm text-muted-foreground">{label}</p>
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

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border px-6 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => router.push('/onboarding/step2')}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Back
            </button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              className="h-11 gap-2 px-6 font-semibold"
            >
              {isLoading ? 'Saving...' : 'Continue'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
