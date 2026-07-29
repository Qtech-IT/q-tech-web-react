import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Label } from '@/Components/UI/Label';
import { SafeImage } from '@/Components/UI/SafeImage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select';
import { Switch } from '@/Components/UI/Switch';
import { Textarea } from '@/Components/UI/Textarea';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsCta, CmsMedia, CmsSectionField } from '@/Types/cms';
import { fieldOptions } from '@/Utils/cms';
import { ImageIcon, Languages, MousePointerClick, Pencil, X } from 'lucide-react';
import { useId, useState } from 'react';
import type { ReactElement } from 'react';

import CtaPickerDialog from './CtaPickerDialog';
import MediaPickerDialog from './MediaPickerDialog';

interface CmsDynamicFieldProps {
  field: CmsSectionField;
  value: unknown;
  onChange: (value: unknown) => void;
  /** Server-side error for this field, keyed as the request reports it. */
  error?: string | undefined;
  disabled?: boolean;
  /** Resolved relations, so a media/cta field can show what it points at. */
  media?: CmsMedia | null;
  cta?: CmsCta | null;
  onMediaChange?: ((media: CmsMedia | null) => void) | undefined;
  onCtaChange?: ((cta: CmsCta | null) => void) | undefined;
}

/**
 * One field, rendered entirely from its registry descriptor.
 *
 * This is what makes "a new section type works with zero frontend changes"
 * true. `SectionTypeContract::fields()` declares `name`, `label`, `type`,
 * `store`, `required`, `options`, `help` and `conditional`; this component
 * consumes all of them and nothing else. There is no per-section-type branch
 * anywhere in the builder, and adding `FieldType::VIDEO` tomorrow means adding
 * one `case` here — not a new form.
 *
 * `type` intentionally reuses `InputEnum` values, so most cases map onto the
 * same primitives the existing CRUD renderer already uses. The CMS-only types
 * — `media`, `cta`, `icon`, `color` — are the ones that need real components.
 */
export function CmsDynamicField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  media = null,
  cta = null,
  onMediaChange,
  onCtaChange,
}: CmsDynamicFieldProps) {
  const { t } = useTranslations();

  const inputId = useId();
  const describedBy = `${inputId}-help`;

  const [mediaOpen, setMediaOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);

  const options = fieldOptions(field);

  /** Every control is labelled and error-linked identically, so do it once. */
  const aria = {
    id: inputId,
    'aria-describedby': field.help || error ? describedBy : undefined,
    'aria-invalid': error ? true : undefined,
    'aria-required': field.required || undefined,
    disabled,
  } as const;

  const asString = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  const asBool = value === true || value === 1 || value === '1';

  const control = ((): ReactElement => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...aria}
            value={asString}
            rows={4}
            onChange={(event) => onChange(event.target.value)}
          />
        );

      /**
       * `html_text` is rich text. It renders as a plain textarea here on
       * purpose: the project ships three rich-text editors and is standardising
       * on Lexical, so wiring Quill in now would be work that gets deleted.
       * The stored value is HTML either way.
       */
      case 'html_text':
        return (
          <Textarea
            {...aria}
            value={asString}
            rows={8}
            className="font-mono text-xs"
            onChange={(event) => onChange(event.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            {...aria}
            type="number"
            value={asString}
            onChange={(event) =>
              onChange(event.target.value === '' ? null : Number(event.target.value))
            }
          />
        );

      case 'switch':
      case 'boolean':
        return (
          <div className="flex items-center gap-3">
            <Switch
              id={inputId}
              checked={asBool}
              disabled={disabled}
              aria-describedby={field.help ? describedBy : undefined}
              onCheckedChange={(checked) => onChange(checked)}
            />
            <span className="text-sm text-muted-foreground">
              {asBool ? t('Enabled') : t('Disabled')}
            </span>
          </div>
        );

      case 'select':
        return (
          <Select
            value={asString}
            disabled={disabled}
            onValueChange={(next) => onChange(next)}
          >
            <SelectTrigger
              id={inputId}
              aria-describedby={field.help || error ? describedBy : undefined}
              aria-invalid={error ? true : undefined}
            >
              <SelectValue placeholder={t('Select an option')} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi-select': {
        const selected = Array.isArray(value) ? (value as unknown[]).map(String) : [];

        return (
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby={inputId}>
            {options.map((option) => {
              const isOn = selected.includes(String(option.value));

              return (
                <Button
                  key={String(option.value)}
                  type="button"
                  size="sm"
                  variant={isOn ? 'default' : 'outline'}
                  disabled={disabled}
                  aria-pressed={isOn}
                  onClick={() =>
                    onChange(
                      isOn
                        ? selected.filter((item) => item !== String(option.value))
                        : [...selected, String(option.value)]
                    )
                  }
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        );
      }

      case 'date':
        return (
          <Input
            {...aria}
            type="date"
            value={asString.slice(0, 10)}
            onChange={(event) => onChange(event.target.value || null)}
          />
        );

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <Input
              id={inputId}
              type="color"
              disabled={disabled}
              value={asString || '#000000'}
              onChange={(event) => onChange(event.target.value)}
              className="w-16 h-10 p-1 cursor-pointer"
              aria-label={field.label}
            />
            <Input
              value={asString}
              disabled={disabled}
              placeholder="#0f172a"
              onChange={(event) => onChange(event.target.value)}
              aria-label={t(':label hex value', { label: field.label })}
            />
          </div>
        );

      /**
       * A free-text lucide key rather than a visual grid: the icon set is
       * resolved by name at render time on the public site, and a picker that
       * enumerated 1,500 icons would be the heaviest thing in the admin.
       */
      case 'icon':
        return (
          <Input
            {...aria}
            value={asString}
            placeholder={t('e.g., shield-check')}
            onChange={(event) => onChange(event.target.value || null)}
          />
        );

      case 'media':
        return (
          <>
            <div className="flex items-center gap-3 p-3 border rounded-xl border-border">
              {media ? (
                <>
                  <div className="overflow-hidden rounded-lg size-14 bg-muted shrink-0">
                    <SafeImage
                      src={media.url}
                      alt={media.alt_text ?? media.original_name}
                      width={media.width ?? undefined}
                      height={media.height ?? undefined}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">
                      {media.original_name}
                    </p>
                    {media.media_type === 'image' && !media.alt_text ? (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        {t('No alt text — set one in the media library')}
                      </p>
                    ) : (
                      <p className="text-xs truncate text-muted-foreground">
                        {media.alt_text || media.size_human}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center flex-1 gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center justify-center rounded-lg size-14 bg-muted">
                    <ImageIcon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  {t('No file attached')}
                </div>
              )}

              <div className="flex gap-1 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={disabled}
                  onClick={() => setMediaOpen(true)}
                >
                  <Pencil className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  {media ? t('Replace') : t('Choose')}
                </Button>
                {media ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={disabled}
                    aria-label={t('Remove attached file')}
                    onClick={() => {
                      onChange(null);
                      onMediaChange?.(null);
                    }}
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </Button>
                ) : null}
              </div>
            </div>

            <MediaPickerDialog
              open={mediaOpen}
              onOpenChange={setMediaOpen}
              selectedId={media?.id ?? null}
              title={field.label}
              onSelect={(picked) => {
                onChange(picked?.id ?? null);
                onMediaChange?.(picked);
              }}
            />
          </>
        );

      case 'cta':
        return (
          <>
            <div className="flex items-center gap-3 p-3 border rounded-xl border-border">
              <span className="flex items-center justify-center rounded-lg size-10 bg-muted shrink-0">
                <MousePointerClick className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </span>

              <div className="flex-1 min-w-0">
                {cta ? (
                  <>
                    <p className="text-sm font-medium truncate text-foreground">{cta.label}</p>
                    <code className="block text-xs truncate text-muted-foreground">
                      {cta.href ?? t('Destination does not resolve')}
                    </code>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('No call to action')}</p>
                )}
              </div>

              <div className="flex gap-1 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={disabled}
                  onClick={() => setCtaOpen(true)}
                >
                  {cta ? t('Replace') : t('Choose')}
                </Button>
                {cta ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={disabled}
                    aria-label={t('Remove call to action')}
                    onClick={() => {
                      onChange(null);
                      onCtaChange?.(null);
                    }}
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </Button>
                ) : null}
              </div>
            </div>

            <CtaPickerDialog
              open={ctaOpen}
              onOpenChange={setCtaOpen}
              selectedId={cta?.id ?? null}
              title={field.label}
              onSelect={(picked) => {
                onChange(picked?.id ?? null);
                onCtaChange?.(picked);
              }}
            />
          </>
        );

      /**
       * `relation` has no `content_relations` table in phase 1 — the contract
       * reserves the shape and `relations()` returns `[]`. Rendering a clear
       * notice beats rendering a text box that silently writes nothing.
       */
      case 'relation':
        return (
          <p className="p-3 text-sm border border-dashed rounded-xl text-muted-foreground border-border">
            {t('Content relations are not available yet.')}
          </p>
        );

      case 'email':
      case 'url':
      case 'password':
      case 'text':
      default:
        return (
          <Input
            {...aria}
            type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
            value={asString}
            onChange={(event) => onChange(event.target.value)}
          />
        );
    }
  })();

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Label htmlFor={inputId} className="text-sm font-medium">
          {field.label}
          {field.required ? (
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>

        {/* Translators only ever see fields flagged translatable, so showing
            the flag here tells an editor which copy will be sent out. */}
        {field.translatable ? (
          <Badge variant="outline" className="gap-1 text-[10px]">
            <Languages className="w-3 h-3" aria-hidden="true" />
            {t('Translatable')}
          </Badge>
        ) : null}
      </div>

      {control}

      {field.help || error ? (
        <p
          id={describedBy}
          className={error ? 'text-xs text-destructive' : 'text-xs text-muted-foreground'}
        >
          {error ?? field.help}
        </p>
      ) : null}
    </div>
  );
}

export default CmsDynamicField;
