import { Button } from '@/Components/UI/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog';
import { Input } from '@/Components/UI/Input';
import { ScrollArea } from '@/Components/UI/ScrollArea';
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
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
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

        <ScrollArea className="flex-1 -mx-2">
          <div className="px-2 py-1 space-y-6">
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
                    <Button
                      key={type.key}
                      type="button"
                      variant="outline"
                      disabled={busy}
                      onClick={() => {
                        onSelect(type.key);
                        onOpenChange(false);
                      }}
                      className="items-start justify-start h-auto p-4 text-left whitespace-normal"
                    >
                      <span className="space-y-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {type.label}
                        </span>
                        <span className="block text-xs font-normal text-muted-foreground">
                          {type.description}
                        </span>
                      </span>
                    </Button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default SectionTypePickerDialog;
