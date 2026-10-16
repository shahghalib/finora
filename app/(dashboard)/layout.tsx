'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  Landmark,
  LayoutGrid,
  LogOut,
  Menu,
  Plus,
  Settings,
  Shapes,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useMe } from '@/hooks/use-settings-data';
import { useAlerts } from '@/hooks/use-alerts-data';
import { useAddTransactionStore } from '@/lib/store/add-transaction-store';
import { cn } from '@/lib/utils';
import { AddTransactionModal } from '@/components/add-transaction-modal';

const MAIN_NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { href: '/transactions', label: 'Transactions', icon: FileText },
  { href: '/budgets', label: 'Budgets', icon: CreditCard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const MANAGEMENT_NAV = [
  { href: '/categories', label: 'Categories', icon: Shapes },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: number;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none transition-colors short:h-9',
        'focus-visible:ring-2 focus-visible:ring-primary/40',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
      )}
    >
      {active && (
        <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
      )}
      <Icon
        className={cn(
          'h-[18px] w-[18px] shrink-0 transition-colors',
          active ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80'
        )}
      />
      <span className="flex-1 truncate">{label}</span>
      {!!badge && badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 text-xs font-semibold tracking-wider text-sidebar-foreground/45 uppercase">{label}</p>
      <div className="mt-2 space-y-0.5 short:mt-1.5">{children}</div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground shadow-sm">
        <Landmark className="h-[18px] w-[18px]" />
      </div>
      <div className="leading-tight">
        <p className="text-base font-bold tracking-tight text-sidebar-foreground">Finora</p>
        <p className="text-xs text-sidebar-foreground/60">Command Center</p>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { data: user } = useMe();
  const { data: alerts = [] } = useAlerts();
  const [menuOpen, setMenuOpen] = useState(false);

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;
  const openAddTransaction = useAddTransactionStore((state) => state.open);
  const queryClient = useQueryClient();

  const closeMenu = () => setMenuOpen(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    router.push('/login');
  };

  // While the mobile drawer is open: Escape closes it and the page behind it
  // doesn't scroll. If the window is widened to desktop, close it too.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const query = window.matchMedia('(min-width: 1024px)');
    const onResize = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    query.addEventListener('change', onResize);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      query.removeEventListener('change', onResize);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  return (
    <div className="min-h-dvh bg-background text-sm lg:flex">
      {/* Mobile / tablet top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="app-sidebar"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-lg hover:bg-sidebar-accent/70"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Landmark className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight">Finora</span>
        </Link>
        <button
          type="button"
          onClick={openAddTransaction}
          aria-label="Add transaction"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-5 w-5" />
        </button>
      </header>

      {/* Backdrop behind the drawer (mobile only) */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 lg:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      <aside
        id="app-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground transition-[transform,visibility] duration-200 ease-out [scrollbar-width:none] [&::-webkit-scrollbar]:hidden short:p-3',
          'lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:visible',
          menuOpen ? 'translate-x-0' : '-translate-x-full invisible'
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-1 py-1">
          <Brand />
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            closeMenu();
            openAddTransaction();
          }}
          className="mt-4 flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar active:scale-[0.99] short:mt-3"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>

        <nav className="mt-6 min-h-0 flex-1 space-y-5 overflow-y-auto [scrollbar-width:none] short:mt-4 short:space-y-3 [&::-webkit-scrollbar]:hidden">
          <NavGroup label="Main">
            {MAIN_NAV.map((item) => (
              <NavLink key={item.href} {...item} active={isActive(item.href)} onNavigate={closeMenu} />
            ))}
          </NavGroup>

          <NavGroup label="Management">
            {MANAGEMENT_NAV.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={isActive(item.href)}
                badge={item.href === '/alerts' ? unreadAlertsCount : undefined}
                onNavigate={closeMenu}
              />
            ))}
          </NavGroup>
        </nav>

        {/* Account: profile (links to Settings) + logout */}
        {user && (
          <div className="mt-3 flex shrink-0 items-center gap-1 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-1.5">
            <Link
              href="/settings"
              onClick={closeMenu}
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1.5 outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-sidebar-accent ring-1 ring-sidebar-border">
                {user.profilePictureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.profilePictureUrl} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-sidebar-foreground/70">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">{user.username}</p>
                <p className="truncate text-xs text-sidebar-foreground/60">{user.defaultCurrency} account</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>

      <main className="min-w-0 flex-1">{children}</main>

      <AddTransactionModal />
    </div>
  );
}
