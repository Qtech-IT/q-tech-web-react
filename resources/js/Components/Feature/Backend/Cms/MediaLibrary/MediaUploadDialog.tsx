import { Button } from '@/Components/UI/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog';
import { Label } from '@/Components/UI/Label';
import { Progress } from '@/Components/UI/Progress';
import { ScrollArea } from '@/Components/UI/ScrollArea';
import { useTranslations } from '@/Hooks/useTranslations';
import { router } from '@inertiajs/react';
import { CheckCircle2, CircleAlert, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Destination folder; null uploads to the library root. */
  folderId: number | null;
  onUploaded: () => void;
}

type QueueState = 'pending' | 'uploading' | 'done' | 'failed';

interface QueueEntry {
  id: string;
  file: File;
  state: QueueState;
  progress: number;
  error?: string;
}

/**
 * Upload files into the library.
 *
 * `media.store` takes one file per request, so the queue uploads serially. A
 * parallel burst of twenty multipart POSTs is how a large drop takes down the
 * PHP worker pool it is being uploaded through.
 *
 * Dimensions, MIME and checksum are read server-side. Nothing this component
 * sends about the file is trusted.
 */
export function MediaUploadDialog({
  open,
  onOpenChange,
  folderId,
  onUploaded,
}: MediaUploadDialogProps) {
  const { t } = useTranslations();

  const inputRef = useRef<HTMLInputElement>(null);

  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const addFiles = (files: FileList | null): void => {
    if (!files) {
      return;
    }

    setQueue((current) => [
      ...current,
      ...Array.from(files).map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        state: 'pending' as QueueState,
        progress: 0,
      })),
    ]);
  };

  const patch = (id: string, changes: Partial<QueueEntry>): void =>
    setQueue((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, ...changes } : entry))
    );

  const uploadAll = async (): Promise<void> => {
    setBusy(true);

    for (const entry of queue) {
      if (entry.state === 'done') {
        continue;
      }

      patch(entry.id, { state: 'uploading', progress: 0 });

      /* Awaited one at a time on purpose — see the class comment. */
      // eslint-disable-next-line no-await-in-loop
      await new Promise<void>((resolve) => {
        router.post(
          route('backend.media.store'),
          {
            file: entry.file,
            folder_id: folderId,
          },
          {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onProgress: (event) => {
              patch(entry.id, { progress: event?.percentage ?? 0 });
            },
            onSuccess: () => {
              patch(entry.id, { state: 'done', progress: 100 });
              resolve();
            },
            onError: (formErrors) => {
              patch(entry.id, {
                state: 'failed',
                error:
                  (formErrors as Record<string, string>).file ??
                  t('Upload failed'),
              });
              resolve();
            },
          }
        );
      });
    }

    setBusy(false);
    onUploaded();
  };

  const close = (): void => {
    setQueue([]);
    onOpenChange(false);
  };

  const pendingCount = queue.filter((entry) => entry.state !== 'done').length;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('Upload Files')}</DialogTitle>
          <DialogDescription>
            {folderId === null
              ? t('Files land at the library root.')
              : t('Files land in the selected folder.')}
          </DialogDescription>
        </DialogHeader>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            addFiles(event.dataTransfer.files);
          }}
          className={`flex flex-col items-center gap-3 px-6 py-10 text-center border border-dashed rounded-2xl transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <Upload className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {t('Drag files here, or choose them from your device.')}
          </p>

          <Label htmlFor="media-upload-input" className="sr-only">
            {t('Choose files to upload')}
          </Label>
          {/* A plain input, not the `Input` primitive: that one is not a
              forwardRef component, and this control needs a ref so the
              styled button can open the file dialog. */}
          <input
            id="media-upload-input"
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => addFiles(event.target.files)}
          />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            {t('Choose files')}
          </Button>
        </div>

        {queue.length > 0 ? (
          <ScrollArea className="max-h-56">
            <ul className="space-y-2">
              {queue.map((entry) => (
                <li
                  key={entry.id}
                  className="p-3 space-y-2 border rounded-xl border-border"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex-1 min-w-0 text-sm truncate text-foreground">
                      {entry.file.name}
                    </span>

                    {entry.state === 'done' ? (
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-600"
                        aria-label={t('Uploaded')}
                      />
                    ) : null}

                    {entry.state === 'failed' ? (
                      <CircleAlert
                        className="w-4 h-4 text-destructive"
                        aria-label={t('Failed')}
                      />
                    ) : null}

                    {entry.state === 'pending' ? (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={t('Remove :name from the queue', {
                          name: entry.file.name,
                        })}
                        onClick={() =>
                          setQueue((current) =>
                            current.filter((item) => item.id !== entry.id)
                          )
                        }
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    ) : null}
                  </div>

                  {entry.state === 'uploading' ? (
                    <Progress value={entry.progress} className="h-1" />
                  ) : null}

                  {entry.error ? (
                    <p className="text-xs text-destructive">{entry.error}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : null}

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={close}>
            {t('Close')}
          </Button>
          <Button
            type="button"
            disabled={busy || pendingCount === 0}
            onClick={() => {
              void uploadAll();
            }}
          >
            <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
            {busy
              ? `${t('Uploading')}…`
              : t('Upload :count files', { count: pendingCount })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MediaUploadDialog;
