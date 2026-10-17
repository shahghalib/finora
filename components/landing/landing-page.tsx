"use client";

import Link from "next/link";
import { BellRing, Target, TrendingUp } from "lucide-react";
import { DashboardMockup } from "@/components/landing/dashboard-mockup";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

// Each card describes something the app actually does today.
const features = [
  {
    icon: Target,
    title: "Budgets by category",
    description:
      "Set a monthly limit for food, transport, rent and more, and see what is left at a glance.",
  },
  {
    icon: BellRing,
    title: "Alerts as you spend",
    description:
      "Get a real-time alert when a category reaches 80% of its budget, and again at 100%.",
  },
  {
    icon: TrendingUp,
    title: "Clear analytics",
    description:
      "Six-month trends, your top merchants, and the categories that keep running over budget.",
  },
];

export function LandingPage() {
  return (
    <div className="grid-bg flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />

      {/* Main Content — fills remaining height; scrolls if the screen is short */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-6 px-4 py-6 md:px-10">
        {/* Hero */}
        <section className="flex flex-1 flex-col items-center gap-6 md:flex-row md:gap-10">
          <div className="hero-fade-in flex-1 space-y-4">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
              Welcome to Finora
            </h1>
            <p className="max-w-md text-sm leading-6 text-muted-foreground md:text-base">
              Track what you spend, set a monthly budget for each category, and
              get an alert when you&apos;re close to a limit.
            </p>
            <div className="pt-2">
              {/* Plain <Link> instead of <Button asChild> — this project's
                  Button forwards `asChild` straight onto the DOM <button>
                  instead of using Radix Slot, which throws a React error.
                  A real anchor navigation is also more reliable than a
                  JS onClick handler for something as simple as "go to
                  /login". */}
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded bg-ubl-blue px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-ubl-blue/90"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="hero-fade-in delay-2 relative h-[220px] w-full flex-1 overflow-hidden sm:h-[42vh] sm:max-h-[280px] rounded border border-ledger-line bg-surface-container-low">
            <DashboardMockup />
          </div>
        </section>

        {/* Value Proposition Cards */}
        <section className="grid shrink-0 grid-cols-1 gap-3 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded border border-ledger-line bg-surface p-4 transition-colors duration-200 hover:bg-surface-container-low"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded bg-primary-fixed text-ubl-blue">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-base font-bold tracking-tight">
                {title}
              </h3>
              <p className="text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
