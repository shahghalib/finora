import { cn } from '@/lib/utils';

/**
 * Standard width + padding for every dashboard page, so content lines up
 * identically on Overview, Budgets, Alerts, Settings, etc.
 */
export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('page-container', className)}>{children}</div>;
}

/**
 * One page title style for the whole app. Title + description on the left,
 * optional actions on the right (they wrap under the title on mobile).
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:mb-8',
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description max-w-xl">{description}</p>}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3 sm:pt-1">
          {actions}
        </div>
      )}
    </header>
  );
}
