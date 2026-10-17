"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeftRight, TrendingUp, HelpCircle } from "lucide-react";
import { DashboardMockup } from "@/components/landing/dashboard-mockup";

const features = [
  {
    icon: Shield,
    filled: true,
    title: "Secure Infrastructure",
    description:
      "Zero-trust architecture and continuous cryptographic validation across every layer.",
  },
  {
    icon: ArrowLeftRight,
    filled: false,
    title: "Real-time Settlement",
    description:
      "Cross-border transactions with immediate finality — settlement in milliseconds, not days.",
  },
  {
    icon: TrendingUp,
    filled: true,
    title: "Intelligent Analytics",
    description:
      "Predictive models and customizable reporting so you keep complete oversight.",
  },
];

export function LandingPage() {
  return (
    <div className="grid-bg flex min-h-dvh flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-ledger-line bg-surface px-4 md:px-10">
        <div className="flex items-center gap-4">
          <span className="text-lg font-extrabold tracking-tight text-ubl-blue">
            Finora
          </span>
          <span className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground md:block">
            Onboarding Wizard
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-ubl-blue"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Help Center</span>
          <span className="sm:hidden">Help</span>
        </Button>
      </header>

      {/* Main Content — fills remaining height; scrolls if the screen is short */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-6 px-4 py-6 md:px-10">
        {/* Hero */}
        <section className="flex flex-1 flex-col items-center gap-6 md:flex-row md:gap-10">
          <div className="hero-fade-in flex-1 space-y-4">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
              Welcome to Finora
            </h1>
            <p className="max-w-md text-sm leading-6 text-muted-foreground md:text-base">
              Institutional-grade financial infrastructure designed for
              precision, security, and scale. Begin your setup to access the
              full toolkit.
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
          {features.map(({ icon: Icon, filled, title, description }) => (
            <div
              key={title}
              className="rounded border border-ledger-line bg-surface p-4 transition-colors duration-200 hover:bg-surface-container-low"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded bg-primary-fixed text-ubl-blue">
                <Icon
                  className="h-[18px] w-[18px]"
                  strokeWidth={filled ? 2.5 : 2}
                  fill={filled ? "currentColor" : "none"}
                />
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

      {/* Footer */}
      <footer className="w-full shrink-0 border-t border-ledger-line bg-surface px-4 py-2.5 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Finora Institutional. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="#" className="transition-colors hover:text-ubl-blue">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-ubl-blue">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-ubl-blue">
              Security Disclosure
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}