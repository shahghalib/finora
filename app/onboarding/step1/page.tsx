'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, BellRing, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  { icon: TrendingUp, label: 'Smart Budget Monitoring' },
  { icon: BellRing, label: 'Real-time Spending Alerts' },
  { icon: Sparkles, label: 'Personal Financial Insights' },
];

export default function OnboardingStep1() {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh items-center justify-center overflow-y-auto bg-background p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-lg">
        <div className="border-b border-border px-6 pt-6 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">Finora</span>
            <span className="text-xs font-semibold tracking-wide text-muted-foreground">
              STEP 1 OF 4
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/4 rounded-full bg-primary" />
          </div>
        </div>

        <div className="px-6 py-6">
          <h2 className="text-2xl font-bold text-primary">Welcome to Finora.</h2>
          <p className="mt-2 text-muted-foreground">
            Take control of your spending with real-time budgets, smart insights, and financial
            analytics.
          </p>

          <div className="mt-6 space-y-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-semibold text-primary">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border p-5">
          <Button
            onClick={() => router.push('/onboarding/step2')}
            className="h-11 w-full gap-2 text-base font-semibold"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
