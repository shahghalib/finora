import Link from 'next/link';

// Header and footer shared by the public pages: the landing page and the
// Help, Privacy and Terms pages.

const navLink =
  'inline-flex h-9 items-center rounded px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-ubl-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ubl-blue';

export function SiteHeader() {
  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-ledger-line bg-surface px-4 md:px-10">
      <Link href="/" className="text-lg font-extrabold tracking-tight text-ubl-blue">
        Finora
      </Link>
      <nav aria-label="Main" className="-mr-3 flex items-center">
        <Link href="/help" className={navLink}>
          Help
        </Link>
        <Link href="/login" className={navLink}>
          Log in
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="w-full shrink-0 border-t border-ledger-line bg-surface px-4 py-2 md:px-10">
      <div className="flex flex-col items-center justify-between gap-x-6 text-xs font-bold uppercase tracking-wider text-muted-foreground md:flex-row">
        <p className="py-1.5">© {new Date().getFullYear()} Finora. All rights reserved.</p>
        <nav aria-label="Help and legal" className="flex flex-wrap justify-center gap-x-5">
          <Link href="/help" className="inline-flex h-8 items-center transition-colors hover:text-ubl-blue">
            Help
          </Link>
          <Link href="/privacy" className="inline-flex h-8 items-center transition-colors hover:text-ubl-blue">
            Privacy Policy
          </Link>
          <Link href="/terms" className="inline-flex h-8 items-center transition-colors hover:text-ubl-blue">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
