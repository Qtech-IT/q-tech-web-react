import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog';
import { Input } from '@/Components/UI/Input';
import { ScrollArea } from '@/Components/UI/ScrollArea';
import { useCmsPageProps } from '@/Hooks/useCmsResource';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsCta } from '@/Types/cms';
import { unwrapList } from '@/Utils/cms';
import { Check, MousePointerClick, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CmsEmpty, CmsError, CmsLoading } from './CmsStateBlock';

interface CtaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (cta: CmsCta | null) => void;
  selectedId?: number | null;
  title?: string;
}

interface CtaIndexProps {
  data?: unknown;
}

/**
 * Choose a reusable CTA for a section's `cta_id` / `secondary_cta_id`.
 *
 * Sections reference a CTA rather than embedding a label and URL, so a
 * campaign destination changes in one record instead of forty sections. This
 * dialog is therefore a *reference* picker — it never creates a CTA, and
 * points at the CTA screen when the library is empty.
 */
export function CtaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  selectedId = null,
  title,
}: CtaPickerDialogProps) {
  const { t } = useTranslations();

  const [search, setSearch] = useState('');

  const { data, loading, error, reload } = useCmsPageProps<CtaIndexProps>(
    open ? route('backend.ctas.index') : null,
    { enabled: open }
  );

  const ctas = useMemo(() => unwrapList<CmsCta>(data?.data), [data]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return ctas;
    }

    return ctas.filter((cta) =>
      [cta.label, cta.href, cta.tracking_id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [ctas, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title ?? t('Choose Call To Action')}</DialogTitle>
          <DialogDescription>
            {t('Sections reference a shared CTA, so changing its destination updates every section using it.')}
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search
            className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('Search call to actions')}
            aria-label={t('Search call to actions')}
            className="pl-10"
          />
        </div>

        <ScrollArea className="flex-1 -mx-2">
          <div className="px-2 py-1 space-y-2">
            {loading ? <CmsLoading rows={4} /> : null}

            {!loading && error ? <CmsError message={error} onRetry={reload} /> : null}

            {!loading && !error && visible.length === 0 ? (
              <CmsEmpty
                icon={MousePointerClick}
                title={t('No call to actions')}
                description={t('Create one on the Call To Actions screen, then attach it here.')}
                action={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(route('backend.ctas.create'), '_blank')}
                  >
                    {t('Create a call to action')}
                  </Button>
                }
              />
            ) : null}

            {visible.map((cta) => {
              const isChosen = selectedId === cta.id;

              return (
                <button
                  key={cta.id}
                  type="button"
                  aria-pressed={isChosen}
                  onClick={() => {
                    onSelect(cta);
                    onOpenChange(false);
                  }}
                  className={`flex items-center w-full gap-3 p-3 text-left transition border rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isChosen
                      ? 'border-primary ring-2 ring-primary/40'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium truncate text-foreground">{cta.label}</p>
                    {cta.href ? (
                      <code className="block text-xs truncate text-muted-foreground">
                        {cta.href}
                      </code>
                    ) : (
                      <span className="text-xs text-amber-600 dark:text-amber-400">
                        {t('Destination does not resolve')}
                      </span>
                    )}
                  </div>

                  <Badge variant="outline" className="capitalize shrink-0">
                    {String(cta.link_type ?? '').replace(/_/g, ' ')}
                  </Badge>

                  {isChosen ? (
                    <Check className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onSelect(null);
              onOpenChange(false);
            }}
          >
            {t('Clear selection')}
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('Cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CtaPickerDialog;
