import { Can } from '@/Components/Can';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Input } from '@/Components/UI/Input';
import { Label } from '@/Components/UI/Label';
import { Progress } from '@/Components/UI/Progress';
import { SafeImage } from '@/Components/UI/SafeImage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select';
import { Switch } from '@/Components/UI/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/UI/Tabs';
import { Textarea } from '@/Components/UI/Textarea';
import { useCmsLocales } from '@/Hooks/useCmsLocales';
import { useCmsResource } from '@/Hooks/useCmsResource';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsMedia, CmsMorphOwner, CmsSeoMeta } from '@/Types/cms';
import { unwrapItem } from '@/Utils/cms';
import { ImageIcon, Save, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import MediaPickerDialog from '../Shared/MediaPickerDialog';
import { CmsError, CmsLoading } from '../Shared/CmsStateBlock';

interface SeoPanelProps {
  /** Morph alias + id. Never a SeoMeta id — there may not be a row yet. */
  owner: CmsMorphOwner;
  /** Falls back to the page's own locale. */
  locale?: string;
  /** Shown in the search-result preview when no meta title is set. */
  fallbackTitle?: string;
  fallbackPath?: string;
}

/** Field lengths mirror the columns exactly, so the counters mean something. */
const LIMITS = {
  meta_title: 255,
  meta_description: 500,
  og_title: 255,
  og_description: 500,
  twitter_title: 255,
  twitter_description: 500,
} as const;

/** What Google actually renders before truncating. */
const DISPLAY_LIMITS = { title: 60, description: 160 } as const;

interface SeoFormState {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  robots_advanced: string;
  og_title: string;
  og_description: string;
  og_type: string;
  og_media_id: number | null;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_media_id: number | null;
  schema_type: string;
  focus_keyword: string;
}

const EMPTY_STATE: SeoFormState = {
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  canonical_url: '',
  robots_index: true,
  robots_follow: true,
  robots_advanced: '',
  og_title: '',
  og_description: '',
  og_type: 'website',
  og_media_id: null,
  twitter_card: 'summary_large_image',
  twitter_title: '',
  twitter_description: '',
  twitter_media_id: null,
  schema_type: '',
  focus_keyword: '',
};

/**
 * The shared SEO panel.
 *
 * `seo_meta` is a polymorphic side table with one row per (owner, locale), so
 * this panel is addressed by `seoable_type` + `seoable_id` + `locale` and
 * never by a SeoMeta id — there may be no row at all yet, and
 * `SeoMetaController::store()` upserts on that triple rather than exposing a
 * separate update.
 *
 * `manage-seo` is its own permission because the person writing meta
 * descriptions is frequently not the person writing the page.
 */
export function SeoPanel({
  owner,
  locale,
  fallbackTitle,
  fallbackPath,
}: SeoPanelProps) {
  const { t } = useTranslations();
  const { localeOptions, defaultLocale } = useCmsLocales();

  const [activeLocale, setActiveLocale] = useState(locale ?? defaultLocale);
  const [form, setForm] = useState<SeoFormState>(EMPTY_STATE);
  const [ogMedia, setOgMedia] = useState<CmsMedia | null>(null);
  const [twitterMedia, setTwitterMedia] = useState<CmsMedia | null>(null);
  const [picker, setPicker] = useState<'og' | 'twitter' | null>(null);

  const { submit, loading: saving, errors } = useInertiaForm();

  const { data, loading, error, reload } = useCmsResource<{ data?: CmsSeoMeta } | CmsSeoMeta>(
    route('backend.seo-meta.show'),
    {
      params: {
        seoable_type: owner.type,
        seoable_id: owner.id,
        locale: activeLocale,
      },
    }
  );

  /* Null is a legitimate answer — the owner has never been customised. */
  useEffect(() => {
    const seo = unwrapItem<CmsSeoMeta>(data);

    if (!seo || !seo.seoable_type) {
      setForm(EMPTY_STATE);
      setOgMedia(null);
      setTwitterMedia(null);

      return;
    }

    setForm({
      meta_title: seo.meta_title ?? '',
      meta_description: seo.meta_description ?? '',
      meta_keywords: seo.meta_keywords ?? '',
      canonical_url: seo.canonical_url ?? '',
      robots_index: seo.robots_index ?? true,
      robots_follow: seo.robots_follow ?? true,
      robots_advanced: seo.robots_advanced ?? '',
      og_title: seo.og_title ?? '',
      og_description: seo.og_description ?? '',
      og_type: seo.og_type ?? 'website',
      og_media_id: seo.og_media?.id ?? null,
      twitter_card: seo.twitter_card ?? 'summary_large_image',
      twitter_title: seo.twitter_title ?? '',
      twitter_description: seo.twitter_description ?? '',
      twitter_media_id: seo.twitter_media?.id ?? null,
      schema_type: seo.schema_type ?? '',
      focus_keyword: seo.focus_keyword ?? '',
    });

    setOgMedia(seo.og_media ?? null);
    setTwitterMedia(seo.twitter_media ?? null);
  }, [data]);

  const set = <K extends keyof SeoFormState>(key: K, value: SeoFormState[K]): void =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSave = (): void => {
    submit({
      method: 'POST',
      url: route('backend.seo-meta.store'),
      data: {
        seoable_type: owner.type,
        seoable_id: owner.id,
        locale: activeLocale,
        ...form,
      },
      onSuccess: reload,
    }).catch(() => undefined);
  };

  const serverErrors = errors as Record<string, string | undefined>;

  if (loading) {
    return <CmsLoading rows={5} />;
  }

  if (error) {
    return <CmsError message={error} onRetry={reload} />;
  }

  const previewTitle = form.meta_title || fallbackTitle || t('Untitled page');
  const previewDescription =
    form.meta_description || t('No meta description set — search engines will invent one.');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <Label htmlFor="seo-locale">{t('Locale')}</Label>
          <Select value={activeLocale} onValueChange={setActiveLocale}>
            <SelectTrigger id="seo-locale" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {localeOptions.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t('SEO fields are stored per locale, one row each.')}
          </p>
        </div>

        <Can permission="seo-meta.manage-seo">
          <Button type="button" onClick={handleSave} disabled={saving}>
            <ButtonLoader
              isSubmitting={saving}
              btnText={t('Save SEO')}
              loaderText={`${t('Saving')}…`}
              icon={<Save className="w-4 h-4" />}
            />
          </Button>
        </Can>
      </div>

      {/* A live SERP preview is the fastest way to see that a 240-character
          meta description will be cut in half. */}
      <div className="p-4 space-y-1 border rounded-xl border-border bg-muted/40">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Search className="w-3 h-3" aria-hidden="true" />
          {t('Search result preview')}
        </p>
        <p className="text-xs text-emerald-700 dark:text-emerald-400">
          {fallbackPath || '/'}
        </p>
        <p className="text-base text-blue-700 truncate dark:text-blue-400">
          {previewTitle.slice(0, DISPLAY_LIMITS.title)}
          {previewTitle.length > DISPLAY_LIMITS.title ? '…' : ''}
        </p>
        <p className="text-sm text-muted-foreground">
          {previewDescription.slice(0, DISPLAY_LIMITS.description)}
          {previewDescription.length > DISPLAY_LIMITS.description ? '…' : ''}
        </p>
      </div>

      <Tabs defaultValue="basics">
        <TabsList className="flex-wrap w-full h-auto">
          <TabsTrigger value="basics">{t('Basics')}</TabsTrigger>
          <TabsTrigger value="social">{t('Social')}</TabsTrigger>
          <TabsTrigger value="advanced">{t('Advanced')}</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="pt-4 space-y-5">
          <CountedField
            id="meta_title"
            label={t('Meta Title')}
            value={form.meta_title}
            onChange={(value) => set('meta_title', value)}
            limit={LIMITS.meta_title}
            displayLimit={DISPLAY_LIMITS.title}
            error={serverErrors.meta_title}
            help={t('Falls back to the page title when empty.')}
          />

          <CountedField
            id="meta_description"
            label={t('Meta Description')}
            value={form.meta_description}
            onChange={(value) => set('meta_description', value)}
            limit={LIMITS.meta_description}
            displayLimit={DISPLAY_LIMITS.description}
            error={serverErrors.meta_description}
            multiline
          />

          <div className="space-y-2">
            <Label htmlFor="focus_keyword">{t('Focus Keyword')}</Label>
            <Input
              id="focus_keyword"
              value={form.focus_keyword}
              onChange={(event) => set('focus_keyword', event.target.value)}
              placeholder={t('e.g., enterprise cloud migration')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonical_url">{t('Canonical URL')}</Label>
            <Input
              id="canonical_url"
              value={form.canonical_url}
              onChange={(event) => set('canonical_url', event.target.value)}
              placeholder={t('Leave empty to use this page’s own URL')}
              aria-invalid={serverErrors.canonical_url ? true : undefined}
            />
            {serverErrors.canonical_url ? (
              <p className="text-xs text-destructive">{serverErrors.canonical_url}</p>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="social" className="pt-4 space-y-5">
          <CountedField
            id="og_title"
            label={t('Open Graph Title')}
            value={form.og_title}
            onChange={(value) => set('og_title', value)}
            limit={LIMITS.og_title}
            error={serverErrors.og_title}
          />

          <CountedField
            id="og_description"
            label={t('Open Graph Description')}
            value={form.og_description}
            onChange={(value) => set('og_description', value)}
            limit={LIMITS.og_description}
            error={serverErrors.og_description}
            multiline
          />

          <SocialImageField
            label={t('Open Graph Image')}
            media={ogMedia}
            onPick={() => setPicker('og')}
            onClear={() => {
              setOgMedia(null);
              set('og_media_id', null);
            }}
          />

          <CountedField
            id="twitter_title"
            label={t('Twitter Title')}
            value={form.twitter_title}
            onChange={(value) => set('twitter_title', value)}
            limit={LIMITS.twitter_title}
            error={serverErrors.twitter_title}
          />

          <CountedField
            id="twitter_description"
            label={t('Twitter Description')}
            value={form.twitter_description}
            onChange={(value) => set('twitter_description', value)}
            limit={LIMITS.twitter_description}
            error={serverErrors.twitter_description}
            multiline
          />

          <SocialImageField
            label={t('Twitter Image')}
            media={twitterMedia}
            onPick={() => setPicker('twitter')}
            onClear={() => {
              setTwitterMedia(null);
              set('twitter_media_id', null);
            }}
          />
        </TabsContent>

        <TabsContent value="advanced" className="pt-4 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-3 p-3 border rounded-xl border-border">
              <Label htmlFor="robots_index" className="font-normal">
                {t('Allow indexing')}
              </Label>
              <Switch
                id="robots_index"
                checked={form.robots_index}
                onCheckedChange={(checked) => set('robots_index', checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 p-3 border rounded-xl border-border">
              <Label htmlFor="robots_follow" className="font-normal">
                {t('Follow links')}
              </Label>
              <Switch
                id="robots_follow"
                checked={form.robots_follow}
                onCheckedChange={(checked) => set('robots_follow', checked)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="robots_advanced">{t('Advanced Robots Directives')}</Label>
            <Input
              id="robots_advanced"
              value={form.robots_advanced}
              onChange={(event) => set('robots_advanced', event.target.value)}
              placeholder="max-snippet:-1, max-image-preview:large"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schema_type">{t('Schema Type')}</Label>
            <Input
              id="schema_type"
              value={form.schema_type}
              onChange={(event) => set('schema_type', event.target.value)}
              placeholder="WebPage"
            />
            <p className="text-xs text-muted-foreground">
              {t('Drives the JSON-LD block emitted on the public page.')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_keywords">{t('Meta Keywords')}</Label>
            <Input
              id="meta_keywords"
              value={form.meta_keywords}
              onChange={(event) => set('meta_keywords', event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t('Ignored by every major search engine. Kept for internal tooling only.')}
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <MediaPickerDialog
        open={picker !== null}
        onOpenChange={(open) => setPicker(open ? picker : null)}
        title={picker === 'twitter' ? t('Twitter Image') : t('Open Graph Image')}
        selectedId={
          picker === 'twitter' ? form.twitter_media_id : form.og_media_id
        }
        onSelect={(picked) => {
          if (picker === 'twitter') {
            setTwitterMedia(picked);
            set('twitter_media_id', picked?.id ?? null);

            return;
          }

          setOgMedia(picked);
          set('og_media_id', picked?.id ?? null);
        }}
      />
    </div>
  );
}

interface CountedFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Hard column width — the server rejects past this. */
  limit: number;
  /** Soft width — what search engines actually display. */
  displayLimit?: number;
  error?: string | undefined;
  help?: string;
  multiline?: boolean;
}

/**
 * A text field with both counters.
 *
 * The hard limit is a validation boundary; the display limit is an editorial
 * one. Conflating them is why so many CMS meta descriptions are 400 characters
 * long and get truncated in every result.
 */
function CountedField({
  id,
  label,
  value,
  onChange,
  limit,
  displayLimit,
  error,
  help,
  multiline = false,
}: CountedFieldProps) {
  const { t } = useTranslations();

  const overDisplay = displayLimit !== undefined && value.length > displayLimit;
  const percent = displayLimit
    ? Math.min(100, (value.length / displayLimit) * 100)
    : Math.min(100, (value.length / limit) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        <span
          className={`text-xs tabular-nums ${
            overDisplay ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
          }`}
        >
          {displayLimit
            ? t(':used / :max shown', { used: value.length, max: displayLimit })
            : `${value.length} / ${limit}`}
        </span>
      </div>

      {multiline ? (
        <Textarea
          id={id}
          value={value}
          rows={3}
          maxLength={limit}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <Input
          id={id}
          value={value}
          maxLength={limit}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      <Progress value={percent} className="h-1" />

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : overDisplay ? (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {t('Longer than search engines display — the rest will be truncated.')}
        </p>
      ) : help ? (
        <p className="text-xs text-muted-foreground">{help}</p>
      ) : null}
    </div>
  );
}

interface SocialImageFieldProps {
  label: string;
  media: CmsMedia | null;
  onPick: () => void;
  onClear: () => void;
}

/** Social share image slot, with the same missing-image fallback as elsewhere. */
function SocialImageField({ label, media, onPick, onClear }: SocialImageFieldProps) {
  const { t } = useTranslations();

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3 p-3 border rounded-xl border-border">
        {media ? (
          <div className="w-24 overflow-hidden rounded-lg aspect-video bg-muted shrink-0">
            <SafeImage
              src={media.url}
              alt={media.alt_text ?? media.original_name}
              width={media.width ?? undefined}
              height={media.height ?? undefined}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <span className="flex items-center justify-center w-24 rounded-lg aspect-video bg-muted shrink-0">
            <ImageIcon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          </span>
        )}

        <p className="flex-1 min-w-0 text-sm truncate text-muted-foreground">
          {media?.original_name ?? t('No image set — the site default is used.')}
        </p>

        <div className="flex gap-1 shrink-0">
          <Button type="button" size="sm" variant="outline" onClick={onPick}>
            {media ? t('Replace') : t('Choose')}
          </Button>
          {media ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={t('Remove image')}
              onClick={onClear}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SeoPanel;
