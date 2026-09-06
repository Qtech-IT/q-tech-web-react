import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog';
import { Input } from '@/Components/UI/Input';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsSectionTypeGroups } from '@/Types/cms';
import { Layers, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CmsEmpty } from '../Shared/CmsStateBlock';

interface SectionTypePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `SectionTypeRegistry::grouped()` — already grouped for this picker. */
  groups: CmsSectionTypeGroups;
  onSelect: (key: string) => void;
  busy?: boolean;
}

/**
 * The "add section" picker.
 *
 * Driven entirely by `sectionTypeGroups`, which the registry produces from
 * each type's `group()`. Registering a new type in PHP makes it appear here
 * with its own icon and description and no frontend edit.
 */
export function SectionTypePickerDialog({
  open,
  onOpenChange,
  groups,
  onSelect,
  busy = false,
}: SectionTypePickerDialogProps) {
  const { t } = useTranslations();

  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return groups;
    }

    const next: CmsSectionTypeGroups = {};

    for (const [group, types] of Object.entries(groups)) {
      const matches = types.filter((type) =>
        `${type.label} ${type.description} ${type.key}`.toLowerCase().includes(term)
      );

      if (matches.length > 0) {
        next[group] = matches;
      }
    }

    return next;
  }, [groups, search]);

  const isEmpty = Object.keys(filtered).length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl gap-0 overflow-hidden p-0 grid-rows-[auto_minmax(0,1fr)] max-h-[min(85vh,44rem)]"
      >
        <div className="px-6 pt-6 pb-4 space-y-4 border-b border-border">
          <DialogHeader>
            <DialogTitle>{t('Add a section')}</DialogTitle>
            <DialogDescription>
              {t('Pick the kind of section to add. It lands at the bottom of the page as a draft.')}
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
              placeholder={t('Search section types')}
              aria-label={t('Search section types')}
              className="pl-10"
            />
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto px-6 py-5 space-y-8">
          {isEmpty ? (
            <CmsEmpty
              icon={Layers}
              title={t('No section types')}
              description={
                search
                  ? t('Nothing matches that search.')
                  : t('No section types are registered yet.')
              }
            />
          ) : null}

          {Object.entries(filtered).map(([group, types]) => (
            <section key={group} className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                {group}
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {types.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      onSelect(type.key);
                      onOpenChange(false);
                    }}
                    className="flex flex-col gap-1.5 h-full p-4 text-left border rounded-lg border-border bg-card transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {type.label}
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {type.description}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SectionTypePickerDialog;
