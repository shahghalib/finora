import { Landmark, RefreshCw, ShieldCheck } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-dvh overflow-hidden lg:grid-cols-2">
      {/* Left panel — brand */}
      <div className="relative hidden h-full overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(8,30,61,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(8,30,61,0.07) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        {/* Optional hero photo — drop an image at public/auth-hero.jpg to match
            the mockup's blurred office photo exactly. Safe to leave out. */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: "url('/auth-hero.jpg')" }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold text-sidebar-foreground">Finora</p>
            <p className="text-xs font-semibold tracking-[0.15em] text-sidebar-foreground/60">
              COMMAND CENTER
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl leading-[1.15] font-bold text-sidebar-foreground">
            Start your journey to financial clarity.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-sidebar-foreground/70">
            Experience institutional-grade tools designed for precision control and strategic
            overview of your assets.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-xs font-semibold tracking-wide text-sidebar-foreground/60">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            BANK-GRADE SECURITY
          </span>
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            REAL-TIME SYNC
          </span>
        </div>
      </div>

      {/* Right panel — form. Scrolls on its own if content ever overflows a
          short window, instead of dragging the whole page (and the brand
          panel) along with it. */}
      <div className="h-full overflow-y-auto bg-background">
        <div className="flex min-h-full items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Landmark className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-primary">Finora</span>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
