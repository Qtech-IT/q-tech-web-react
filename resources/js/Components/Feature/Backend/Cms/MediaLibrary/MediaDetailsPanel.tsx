import { Can } from '@/Components/Can';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Input } from '@/Components/UI/Input';
import { Label } from '@/Components/UI/Label';
import { ScrollArea } from '@/Components/UI/ScrollArea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/Components/UI/Sheet';
import { Textarea } from '@/Components/UI/Textarea';
import { useCmsResource } from '@/Hooks/useCmsResource';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsMedia, CmsMediaFolder, CmsMediaUsage, CmsOption } from '@/Types/cms';
import { AlertTriangle, Crosshair, Save, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { CmsError, CmsLoading } from '../Shared/CmsStateBlock';

interface MediaDetailsPanelProps {
  media: CmsMedia | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: CmsMediaFolder[];
  statuses: CmsOption[];
  onSaved: () => void;
  onDelete: (media: CmsMedia) => void;
}

/**
 * Edit one asset's editorial metadata.
 *
 * `MediaUpdateRequest` covers metadata only — never the file. A replacement is
 * a new upload, because rewriting bytes under a URL that browsers and CDNs
 * have already cached is how a "replaced" image stays stale for a week.
 */
export function MediaDetailsPanel({
  media,
  open,
  onOpenChange,
  folders,
  statuses,
  onSaved,
  onDelete,
}: MediaDetailsPanelProps) {
  const { t } = useTranslations();

  const { submit, loading, errors } = useInertiaForm();

  const [form, setForm] = useState({
    folder_id: '',
    alt_text: '',
    caption: '',
    title: '',
    description: '',
    credit: '',
    focal_x: 0.5,
    focal_y: 0.5,
    status: 'active',
  });

  useEffect(() => {
    if (!media) {
      return;
    }

    setForm({
      folder_id: media.folder_id === null ? '' : String(media.folder_id),
      alt_text: media.alt_text ?? '',
      caption: media.caption ?? '',
      title: media.title ?? '',
      description: media.description ?? '',
      credit: media.credit ?? '',
      focal_x: media.focal_x ?? 0.5,
      focal_y: media.focal_y ?? 0.5,
      status: media.status ?? 'active',
    });
  }, [media]);

  /* "Where is this used?" answers itself before an editor breaks a live page. */
  const usage = useCmsResource<CmsMediaUsage[]>(
    media && open ? route('backend.media.usage', { media: media.uuid }) : null,
    { enabled: Boolean(media) && open }
  );

  const serverErrors = errors as Record<string, string | undefined>;

  const handleSave = (): void => {
    if (!media) {
      return;
    }

    submit({
      method: 'POST',
      url: `${route('backend.media.update', { media: media.uuid })}?_method=PATCH`,
      data: {
        folder_id: form.folder_id === '' ? null : Number(form.folder_id),
        alt_text: form.alt_text || null,
        caption: form.caption || null,
        title: form.title || null,
        description: form.description || null,
        credit: form.credit || null,
        focal_x: form.focal_x,
        focal_y: form.focal_y,
        status: form.status,
      },
      onSuccess: onSaved,
    }).catch(() => undefined);
  };

  const isImage = media?.media_type === 'image';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
        <SheetHeader className="p-6 pb-4 border-b shrink-0">
          <SheetTitle className="truncate">
            {media?.original_name ?? t('Asset')}
          </SheetTitle>
          <SheetDescription>
            {media
              ? `${media.size_human} · ${media.extension.toUpperCase()}${media.width && media.height ? ` · ${media.width}×${media.height}` : ''
              }`
              : ''}
          </SheetDescription>
        </SheetHeader>

        {/* `min-h-0` is load-bearing: a flex item's default `min-height: auto`
            makes this column refuse to shrink below its content, which pushed
            the footer — and the only Save button — past the bottom of a short
            viewport. `overflow-y-auto` keeps the body scrollable even if the
            ScrollArea primitive fails to hydrate. */}
        <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6 space-y-5">
            {media && isImage ? (
              <FocalPointPicker
                media={media}
                x={form.focal_x}
                y={form.focal_y}
                onChange={(x, y) => setForm({ ...form, focal_x: x, focal_y: y })}
              />
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="media-alt">{t('Alt Text')}</Label>
              <Textarea
                id="media-alt"
                rows={2}
                value={form.alt_text}
                aria-invalid={serverErrors.alt_text ? true : undefined}
                onChange={(event) => setForm({ ...form, alt_text: event.target.value })}
              />
              {/* Empty alt is correct for a decorative image, so this is a
                  warning rather than a validation error. */}
              {isImage && !form.alt_text ? (
                <p className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
                  {t('Screen readers announce nothing for this image. Leave it empty only if the image is purely decorative.')}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="media-caption">{t('Caption')}</Label>
              <Textarea
                id="media-caption"
                rows={2}
                value={form.caption}
                onChange={(event) => setForm({ ...form, caption: event.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="media-title">{t('Title')}</Label>
                <Input
                  id="media-title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="media-credit">{t('Credit')}</Label>
                <Input
                  id="media-credit"
                  value={form.credit}
                  placeholder={t('e.g., Photo by …')}
                  onChange={(event) => setForm({ ...form, credit: event.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="media-folder">{t('Folder')}</Label>
                <Select
                  value={form.folder_id || 'root'}
                  onValueChange={(value) =>
                    setForm({ ...form, folder_id: value === 'root' ? '' : value })
                  }
                >
                  <SelectTrigger id="media-folder">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">{t('Library root')}</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={String(folder.id)}>
                        {folder.path || folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media-status">{t('Status')}</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger id="media-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((option) => (
                      <SelectItem key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-semibold">{t('Used on')}</h3>

              {usage.loading ? <CmsLoading rows={2} /> : null}

              {usage.error ? (
                <CmsError message={usage.error} onRetry={usage.reload} />
              ) : null}



              {!usage.loading && !usage.error ? (
                Object.keys(usage.data ?? {}).length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('Not attached to anything — safe to delete.')}
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {Object.entries(usage.data ?? {}).map(([type, count]) => (
                      <li
                        key={type}
                        className="flex items-center justify-between p-2 text-sm border rounded-lg border-border"
                      >
                        <Badge
                          variant="outline"
                          className="text-[10px] capitalize shrink-0"
                        >
                          {type.replace(/_/g, ' ')}
                        </Badge>

                        <span className="font-medium">
                          {count as any}
                        </span>
                      </li>
                    ))}
                  </ul>
                )
              ) : null}





            </section>
          </div>
        </ScrollArea>

        <SheetFooter className="sticky bottom-0 z-10 flex-row gap-2 p-6 pt-4 border-t shrink-0 bg-background">
          <Can permission="media.edit">
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading || !media}
              className="flex-1 sm:flex-none"
            >
              <ButtonLoader
                isSubmitting={loading}
                btnText={t('Save')}
                loaderText={`${t('Saving')}…`}
                icon={<Save className="w-4 h-4" />}
              />
            </Button>
          </Can>

          <Can permission="media.delete">
            <Button
              type="button"
              variant="outline"
              disabled={loading || !media}
              onClick={() => media && onDelete(media)}
            >
              <Trash2 className="w-4 h-4 mr-2 text-destructive" aria-hidden="true" />
              {t('Delete')}
            </Button>
          </Can>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface FocalPointPickerProps {
  media: CmsMedia;
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
}

/**
 * Focal point, normalised 0..1.
 *
 * Art-directed crops on the public site pivot around this point, so a portrait
 * hero keeps the subject's face in frame at every aspect ratio. Click or use
 * the arrow keys — the latter matters because a click-only control is
 * unreachable by keyboard.
 */
function FocalPointPicker({ media, x, y, onChange }: FocalPointPickerProps) {
  const { t } = useTranslations();

  const frameRef = useRef<HTMLDivElement>(null);

  const STEP = 0.05;

  const clamp = (value: number): number => Math.min(1, Math.max(0, value));

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const rect = frameRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    onChange(
      clamp((event.clientX - rect.left) / rect.width),
      clamp((event.clientY - rect.top) / rect.height)
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const moves: Record<string, [number, number]> = {
      ArrowUp: [0, -STEP],
      ArrowDown: [0, STEP],
      ArrowLeft: [-STEP, 0],
      ArrowRight: [STEP, 0],
    };

    const move = moves[event.key];

    if (!move) {
      return;
    }

    event.preventDefault();
    onChange(clamp(x + move[0]), clamp(y + move[1]));
  };

  return (
    <div className="space-y-2">
      <Label>{t('Focal Point')}</Label>

      <div
        ref={frameRef}
        role="application"
        tabIndex={0}
        aria-label={t('Focal point. Use arrow keys to move it.')}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="relative overflow-hidden cursor-crosshair rounded-xl bg-muted aspect-video focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <img
          src={media.url}
          alt={media.alt_text ?? media.original_name}
          width={media.width ?? undefined}
          height={media.height ?? undefined}
          className="object-cover w-full h-full pointer-events-none"
        />

        <span
          className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 border-2 rounded-full pointer-events-none size-8 border-primary bg-primary/20"
          style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
        >
          <Crosshair className="w-4 h-4 text-primary" aria-hidden="true" />
        </span>
      </div>

      <p className="text-xs tabular-nums text-muted-foreground">
        {t('x: :x · y: :y', { x: x.toFixed(2), y: y.toFixed(2) })}
      </p>
    </div>
  );
}

export default MediaDetailsPanel;
