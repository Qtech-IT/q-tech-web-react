import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog';
import { Input } from '@/Components/UI/Input';
import { Label } from '@/Components/UI/Label';
import { RadioGroup, RadioGroupItem } from '@/Components/UI/RadioGroup';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsOption } from '@/Types/cms';
import { Radio } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  publishStatuses: CmsOption[];
  value: {
    publish_status: string;
    published_at: string | null;
    expires_at: string | null;
  };
  onSubmit: (next: {
    publish_status: string;
    published_at: string | null;
    expires_at: string | null;
  }) => void;
  busy?: boolean;
  error?: string | undefined;
}

/**
 * Publish / draft / schedule, for a page or a section.
 *
 * The date inputs appear only for `scheduled`, because that is the one value
 * for which `PagePublishRequest` makes `published_at` required. Showing them
 * always invites an editor to set a date on a draft and wonder why nothing
 * happened.
 */
export function PublishDialog({
  open,
  onOpenChange,
  title,
  description,
  publishStatuses,
  value,
  onSubmit,
  busy = false,
  error,
}: PublishDialogProps) {
  const { t } = useTranslations();

  const groupId = useId();

  const [status, setStatus] = useState(value.publish_status);
  const [publishedAt, setPublishedAt] = useState(value.published_at ?? '');
  const [expiresAt, setExpiresAt] = useState(value.expires_at ?? '');

  /* Re-seed on open so a cancelled edit does not leak into the next one. */
  useEffect(() => {
    if (open) {
      setStatus(value.publish_status);
      setPublishedAt(value.published_at ?? '');
      setExpiresAt(value.expires_at ?? '');
    }
  }, [open, value]);

  const isScheduled = status === 'scheduled';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" aria-hidden="true" />
            {title}
          </DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="space-y-4">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium sr-only">
              {t('Publishing state')}
            </legend>

            <RadioGroup value={status} onValueChange={setStatus} className="gap-3">
              {publishStatuses.map((option) => (
                <div key={String(option.value)} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={String(option.value)}
                    id={`${groupId}-${option.value}`}
                  />
                  <Label
                    htmlFor={`${groupId}-${option.value}`}
                    className="font-normal capitalize cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>

          {isScheduled ? (
            <div className="space-y-2">
              <Label htmlFor={`${groupId}-published-at`}>{t('Publish at')}</Label>
              <Input
                id={`${groupId}-published-at`}
                type="datetime-local"
                value={publishedAt}
                required
                onChange={(event) => setPublishedAt(event.target.value)}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor={`${groupId}-expires-at`}>{t('Expires at')}</Label>
            <Input
              id={`${groupId}-expires-at`}
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t('Optional. Must be after the publish date.')}
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('Cancel')}
          </Button>
          <Button
            type="button"
            disabled={busy || (isScheduled && !publishedAt)}
            onClick={() =>
              onSubmit({
                publish_status: status,
                published_at: publishedAt || null,
                expires_at: expiresAt || null,
              })
            }
          >
            <ButtonLoader
              isSubmitting={busy}
              btnText={t('Apply')}
              loaderText={`${t('Applying')}…`}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PublishDialog;
