import { SiteFooter, SiteHeader } from '@/components/site-chrome';

// Public pages (Help, Privacy, Terms): reachable without signing in, so they
// don't use the dashboard sidebar.
export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
