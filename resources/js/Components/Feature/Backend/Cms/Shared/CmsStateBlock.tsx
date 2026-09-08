import { Alert, AlertDescription, AlertTitle } from '@/Components/UI/Alert';
import { Button } from '@/Components/UI/Button';
import { Skeleton } from '@/Components/UI/Skeleton';
import { useTranslations } from '@/Hooks/useTranslations';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface CmsLoadingProps {
  /** How many placeholder rows to reserve. Matching the real count avoids a jump. */
  rows?: number;
  className?: string;
}

/**
 * Loading placeholder.
 *
 * Fixed-height rows, not a spinner: the list that replaces them occupies the
 * same box, so nothing below it moves when the data lands.
 */
export function CmsLoading({ rows = 3, className = '' }: CmsLoadingProps) {
  const { t } = useTranslations();

  return (
    <div
      className={`space-y-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{t('Loading…')}</span>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="w-full h-16 rounded-xl" />
      ))}
    </div>
  );
}

interface CmsErrorProps {
  message?: string | null;
  onRetry?: (() => void) | undefined;
}

/** Error state. Always offers a retry — a dead end is not an error state. */
export function CmsError({ message, onRetry }: CmsErrorProps) {
  const { t } = useTranslations();

  return (
    <Alert variant="destructive" role="alert">
      <AlertTriangle className="w-4 h-4" aria-hidden="true" />
      <AlertTitle>{t('Something went wrong')}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{message || t('The content could not be loaded.')}</p>
        {onRetry ? (
          <Button type="button" size="sm" variant="outline" onClick={onRetry}>
            <RefreshCw className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
            {t('Try again')}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

interface CmsEmptyProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

/** Empty state. Says what is missing and offers the one action that fixes it. */
export function CmsEmpty({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className = '',
}: CmsEmptyProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 px-6 py-14 text-center border border-dashed rounded-2xl border-border ${className}`}
    >
      <span className="flex items-center justify-center rounded-full size-12 bg-muted">
        <Icon className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
