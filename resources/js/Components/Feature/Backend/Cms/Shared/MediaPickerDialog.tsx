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
import { SafeImage } from '@/Components/UI/SafeImage';
import { ScrollArea } from '@/Components/UI/ScrollArea';
import { useCmsPageProps } from '@/Hooks/useCmsResource';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsMedia, CmsMediaFolder } from '@/Types/cms';
import { unwrapList } from '@/Utils/cms';
import { Check, FileText, Folder, ImageIcon, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { CmsEmpty, CmsError, CmsLoading } from './CmsStateBlock';

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the chosen asset, or null when the editor clears the slot. */
  onSelect: (media: CmsMedia | null) => void;
  title?: string;
  description?: string;
  /** Currently attached asset, highlighted so the editor can see what they are replacing. */
  selectedId?: number | null;
  /** Multi-select for gallery collections; single for a `media_id` column. */
  multiple?: boolean;
  onSelectMany?: ((media: CmsMedia[]) => void) | undefined;
}

interface MediaIndexProps {
  data?: unknown;
  folders?: unknown;
}

/**
 * The shared media chooser.
 *
 * Reads the library through `useCmsPageProps` rather than navigating, because
 * this dialog is opened from inside the section editor and the page builder
 * must not lose its unsaved state to a page transition.
 */
export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  title,
  description,
  selectedId = null,
  multiple = false,
  onSelectMany,
}: MediaPickerDialogProps) {
  const { t } = useTranslations();

  const [search, setSearch] = useState('');
  const [folderId, setFolderId] = useState<number | null>(null);
  const [checked, setChecked] = useState<number[]>([]);

  /* Only fetch once the dialog is actually open. */
  const { data, loading, error, reload } = useCmsPageProps<MediaIndexProps>(
    open ? route('backend.media.index') : null,
    { enabled: open, params: folderId === null ? {} : { folder_id: folderId } }
  );

  const media = useMemo(() => unwrapList<CmsMedia>(data?.data), [data]);
  const folders = useMemo(() => unwrapList<CmsMediaFolder>(data?.folders), [data]);

  /* Reset the transient selection whenever the dialog is reopened. */
  useEffect(() => {
    if (!open) {
      setChecked([]);
      setSearch('');
    }
  }, [open]);

  /**
   * Filtered client-side. The server already paginates; this narrows what is
   * on screen without a round trip per keystroke.
   */
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return media;
    }

    return media.filter((item) =>
      [item.original_name, item.title, item.alt_text, item.file_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [media, search]);

  const confirmMany = (): void => {
    onSelectMany?.(media.filter((item) => checked.includes(item.id)));
    onOpenChange(false);
  };

  const choose = (item: CmsMedia): void => {
    if (multiple) {
      setChecked((current) =>
        current.includes(item.id)
          ? current.filter((id) => id !== item.id)
          : [...current, item.id]
      );

      return;
    }

    onSelect(item);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title ?? t('Choose Media')}</DialogTitle>
          <DialogDescription>
            {description ?? t('Pick an existing asset from the library.')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 min-w-0">
            <Search
              className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('Search by file name or alt text')}
              aria-label={t('Search media')}
              className="pl-10"
            />
          </div>

          {folders.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto sm:max-w-sm">
              <Button
                type="button"
                size="sm"
                variant={folderId === null ? 'default' : 'outline'}
                onClick={() => setFolderId(null)}
                className="shrink-0"
              >
                {t('All')}
              </Button>
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  type="button"
                  size="sm"
                  variant={folderId === folder.id ? 'default' : 'outline'}
                  onClick={() => setFolderId(folder.id)}
                  className="shrink-0"
                >
                  <Folder className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  {folder.name}
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        <ScrollArea className="flex-1 -mx-2">
          <div className="px-2 py-1">
            {loading ? <CmsLoading rows={4} /> : null}

            {!loading && error ? <CmsError message={error} onRetry={reload} /> : null}

            {!loading && !error && visible.length === 0 ? (
              <CmsEmpty
                icon={ImageIcon}
                title={t('Nothing here yet')}
                description={
                  search
                    ? t('No asset matches that search.')
                    : t('Upload files in the media library, then attach them here.')
                }
              />
            ) : null}

            {!loading && !error && visible.length > 0 ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {visible.map((item) => {
                  const isChosen = multiple
                    ? checked.includes(item.id)
                    : selectedId === item.id;

                  const isImage = item.media_type === 'image';

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => choose(item)}
                        aria-pressed={isChosen}
                        className={`group relative w-full overflow-hidden text-left transition border rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          isChosen
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-center overflow-hidden aspect-video bg-muted">
                          {isImage ? (
                            <SafeImage
                              src={item.url}
                              alt={item.alt_text ?? item.original_name}
                              /* Reserving the intrinsic box is what keeps the
                                 grid from reflowing as thumbnails decode. */
                              width={item.width ?? undefined}
                              height={item.height ?? undefined}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <FileText
                              className="w-8 h-8 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        <div className="p-2 space-y-1">
                          <p className="text-xs font-medium truncate text-foreground">
                            {item.original_name}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="text-[10px] uppercase">
                              {item.extension}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {item.size_human}
                            </span>
                          </div>
                          {/* Missing alt text is an accessibility defect the
                              editor should see before they attach the file. */}
                          {isImage && !item.alt_text ? (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400">
                              {t('No alt text')}
                            </p>
                          ) : null}
                        </div>

                        {isChosen ? (
                          <span className="absolute flex items-center justify-center rounded-full top-2 right-2 size-6 bg-primary text-primary-foreground">
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
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

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('Cancel')}
            </Button>
            {multiple ? (
              <Button type="button" onClick={confirmMany} disabled={checked.length === 0}>
                {t('Attach :count', { count: checked.length })}
              </Button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MediaPickerDialog;
