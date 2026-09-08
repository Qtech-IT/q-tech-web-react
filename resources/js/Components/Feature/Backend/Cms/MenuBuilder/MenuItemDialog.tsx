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
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsMedia, CmsMenu, CmsMenuItem, CmsOption } from '@/Types/cms';
import { ImageIcon, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import MediaPickerDialog from '../Shared/MediaPickerDialog';

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: CmsMenu;
  /** Null creates a new top-level item. */
  item: CmsMenuItem | null;
  linkTypes: CmsOption[];
  visibilities: CmsOption[];
  statuses: CmsOption[];
  onSaved: () => void;
}

type SettingsBag = Record<string, unknown>;

interface ItemFormState {
  label: string;
  aria_label: string;
  description: string;
  icon: string;
  link_type: string;
  url: string;
  route_name: string;
  page_id: string;
  target_type: string;
  target_id: string;
  opens_in_new_tab: boolean;
  rel: string;
  badge_label: string;
  badge_variant: string;
  visibility: string;
  status: string;

  /* ---- settings, top-level items (depth 0) ---- */
  display: string;
  region: string;
  panel_title: string;
  panel_intro: string;
  panel_intro_label: string;
  panel_intro_href: string;
  panel_footer_label: string;
  panel_footer_href: string;
  featured_client: string;
  featured_result: string;
  featured_link_label: string;
  featured_link_href: string;
  is_cta: boolean;
  variant: string;

  /* ---- settings, children of a top-level item (depth 1) ---- */
  slot: string;
  columns: string;
}

/**
 * Keys this dialog OWNS inside `settings`, per depth.
 *
 * Everything not listed here is an unknown key some other feature (or a future
 * one) wrote, and is copied through untouched on save — the bag is an open
 * extension point, so this form may only ever rewrite its own slice of it.
 */
const TOP_LEVEL_KEYS = ['display', 'slot', 'panel', 'featured', 'is_cta', 'variant'] as const;
const CHILD_KEYS = ['slot', 'columns'] as const;

/**
 * `settings.mega = { enabled, columns, width }` was an earlier authoring shape
 * that nothing on the public site ever read. It is deleted at every depth so a
 * saved item stops carrying a blob that cannot affect rendering.
 */
const DEAD_KEYS = ['mega'] as const;

const DISPLAY_OPTIONS = [
  { value: 'link', label: 'Link — no panel' },
  { value: 'dropdown', label: 'Dropdown — simple list' },
  { value: 'mega', label: 'Mega panel — rail + grid' },
] as const;

const REGION_OPTIONS = [
  { value: 'nav', label: 'Main navigation' },
  { value: 'utility', label: 'Utility strip (above the bar)' },
  { value: 'search', label: 'Search affordance' },
] as const;

const SLOT_OPTIONS = [
  { value: 'rail', label: 'Left rail link' },
  { value: 'grid', label: 'Grid group (column heading)' },
] as const;

const VARIANT_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
] as const;

/* -------------------------------------------------------------------------- */
/* Reading `settings`                                                         */
/* -------------------------------------------------------------------------- */

function bag(value: unknown): SettingsBag {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as SettingsBag)
    : {};
}

function str(source: SettingsBag, key: string): string {
  const value = source[key];

  return typeof value === 'string' ? value : '';
}

/* -------------------------------------------------------------------------- */
/* Writing `settings`                                                         */
/* -------------------------------------------------------------------------- */

/** A label + href pair, or null — a half-authored link is not stored at all. */
function linkRef(label: string, href: string): SettingsBag | null {
  const trimmedLabel = label.trim();
  const trimmedHref = href.trim();

  return trimmedLabel && trimmedHref
    ? { label: trimmedLabel, href: trimmedHref }
    : null;
}

/** Drop empty members; return null when nothing survived. */
function compact(source: SettingsBag): SettingsBag | null {
  const next: SettingsBag = {};

  for (const [key, value] of Object.entries(source)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    next[key] = value;
  }

  return Object.keys(next).length > 0 ? next : null;
}

/**
 * Merge the form's slice of `settings` into whatever the item already carried.
 *
 * Unknown keys survive because the base is a copy of the stored bag and only
 * the keys this form renders are removed before being rewritten.
 */
function buildSettings(depth: number, form: ItemFormState, existing: SettingsBag): SettingsBag {
  const next: SettingsBag = { ...existing };

  for (const key of DEAD_KEYS) {
    delete next[key];
  }

  if (depth === 0) {
    for (const key of TOP_LEVEL_KEYS) {
      delete next[key];
    }

    next.display = form.display;

    // 'nav' is the renderer's fallback, so storing it would be noise.
    if (form.region && form.region !== 'nav') {
      next.slot = form.region;
    }

    const panel = compact({
      title: form.panel_title.trim(),
      intro: form.panel_intro.trim(),
      intro_link: linkRef(form.panel_intro_label, form.panel_intro_href),
      footer: linkRef(form.panel_footer_label, form.panel_footer_href),
    });

    if (panel) {
      next.panel = panel;
    }

    const featured = compact({
      client: form.featured_client.trim(),
      result: form.featured_result.trim(),
      link: linkRef(form.featured_link_label, form.featured_link_href),
    });

    if (featured) {
      next.featured = featured;
    }

    if (form.is_cta) {
      next.is_cta = true;

      if (form.variant) {
        next.variant = form.variant;
      }
    }

    return next;
  }

  if (depth === 1) {
    for (const key of CHILD_KEYS) {
      delete next[key];
    }

    if (form.slot) {
      next.slot = form.slot;
    }

    if (form.slot === 'grid') {
      next.columns = Math.min(Math.max(Number(form.columns) || 1, 1), 3);
    }

    return next;
  }

  /* Depth 2+ is a plain link inside a group. It owns no panel settings, so its
     bag is passed through exactly as stored. */
  return next;
}

/**
 * Create or edit one menu item.
 *
 * The destination fields are conditional on `link_type`, matching
 * `MenuItemSaveRequest` exactly. `heading` and `separator` are *structural*:
 * the request marks `url` prohibited for them, because they exist precisely so
 * a menu never has to fake a section break with `href="#"` — which is
 * focusable, announced as a link, and goes nowhere.
 *
 * The panel fields are conditional on the item's DEPTH, because the public
 * header reads a different part of `settings` at every level (see
 * `resources/js/Components/Public/navSlots.ts`, which is the contract this
 * form edits). Showing a rail/grid selector on a third-level link, or a
 * featured card on a group heading, would offer an editor inputs that cannot
 * change anything on the site.
 */
export function MenuItemDialog({
  open,
  onOpenChange,
  menu,
  item,
  linkTypes,
  visibilities,
  statuses,
  onSaved,
}: MenuItemDialogProps) {
  const { t } = useTranslations();

  const { submit, loading, errors } = useInertiaForm();

  const [form, setForm] = useState<ItemFormState>(blankState(visibilities, statuses));
  const [media, setMedia] = useState<CmsMedia | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  /* New items are created at the root by the builder; nesting happens by drag,
     so an existing item's server-side depth is authoritative. */
  const depth = item?.depth ?? 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!item) {
      setForm(blankState(visibilities, statuses));
      setMedia(null);

      return;
    }

    const settings = bag(item.settings);
    const panel = bag(settings.panel);
    const featured = bag(settings.featured);
    const introLink = bag(panel.intro_link);
    const footerLink = bag(panel.footer);
    const featuredLink = bag(featured.link);

    setForm({
      label: item.label ?? '',
      aria_label: item.aria_label ?? '',
      description: item.description ?? '',
      icon: item.icon ?? '',
      link_type: item.link_type ?? 'url',
      url: item.url ?? '',
      route_name: item.route_name ?? '',
      page_id: item.page_id === null ? '' : String(item.page_id),
      target_type: item.target_type ?? '',
      target_id: item.target_id === null ? '' : String(item.target_id),
      opens_in_new_tab: item.opens_in_new_tab ?? false,
      rel: item.rel ?? '',
      badge_label: item.badge_label ?? '',
      badge_variant: item.badge_variant ?? '',
      visibility: item.visibility ?? 'always',
      status: item.status ?? 'active',

      display: str(settings, 'display') || 'link',
      region: str(settings, 'slot') || 'nav',
      panel_title: str(panel, 'title'),
      panel_intro: str(panel, 'intro'),
      panel_intro_label: str(introLink, 'label'),
      panel_intro_href: str(introLink, 'href'),
      panel_footer_label: str(footerLink, 'label'),
      panel_footer_href: str(footerLink, 'href'),
      featured_client: str(featured, 'client'),
      featured_result: str(featured, 'result'),
      featured_link_label: str(featuredLink, 'label'),
      featured_link_href: str(featuredLink, 'href'),
      is_cta: settings.is_cta === true,
      variant: str(settings, 'variant'),

      /* A child with children can only be a group and a bare child can only be
         a rail entry — the same inference the renderer makes, so a menu
         authored before this convention opens pre-filled instead of blank. */
      slot:
        str(settings, 'slot') ||
        ((item.children?.length ?? 0) > 0 || item.link_type === 'heading'
          ? 'grid'
          : 'rail'),
      columns: settings.columns === undefined ? '1' : String(settings.columns),
    });

    setMedia(item.media ?? null);
  }, [open, item, visibilities, statuses]);

  const set = <K extends keyof ItemFormState>(key: K, value: ItemFormState[K]): void =>
    setForm((current) => ({ ...current, [key]: value }));

  /** `heading` and `separator` carry no destination at all. */
  const isStructural = useMemo(
    () => ['heading', 'separator'].includes(form.link_type),
    [form.link_type]
  );

  const needsUrl = ['url', 'anchor'].includes(form.link_type);
  const needsRoute = form.link_type === 'route';
  const needsPage = form.link_type === 'page';
  const needsEntity = form.link_type === 'entity';

  const showPanelTab = depth <= 1;
  const hasPanelCopy = depth === 0 && form.display !== 'link';
  const isMega = depth === 0 && form.display === 'mega';

  const serverErrors = errors as Record<string, string | undefined>;

  const handleSave = (): void => {
    const isUpdate = item !== null;

    const payload = {
      menu_id: menu.id,
      parent_id: item?.parent_id ?? null,
      label: form.label,
      aria_label: form.aria_label || null,
      description: form.description || null,
      icon: form.icon || null,
      media_id: media?.id ?? null,
      link_type: form.link_type,
      /* Null, not '': the request prohibits a URL on structural items, and an
         empty string is still a value that trips `prohibited`. */
      url: isStructural || !(needsUrl || form.url) ? null : form.url,
      route_name: needsRoute ? form.route_name : null,
      page_id: needsPage && form.page_id ? Number(form.page_id) : null,
      target_type: needsEntity ? form.target_type || null : null,
      target_id: needsEntity && form.target_id ? Number(form.target_id) : null,
      opens_in_new_tab: form.opens_in_new_tab,
      rel: form.rel || null,
      badge_label: form.badge_label || null,
      badge_variant: form.badge_variant || null,
      visibility: form.visibility,
      status: form.status,
      settings: buildSettings(depth, form, bag(item?.settings)),
      sort_order: item?.sort_order ?? 0,
    };

    submit({
      method: 'POST',
      url: isUpdate
        ? `${route('backend.menu-items.update', { menu_item: item.uuid })}?_method=PATCH`
        : route('backend.menu-items.store'),
      data: payload,
      onSuccess: () => {
        onSaved();
        onOpenChange(false);
      },
    }).catch(() => undefined);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Three bands: a fixed header, ONE scrolling body, a fixed footer.
            The shell owns the height cap and `overflow-hidden`; nothing inside
            it may grow the dialog, so the actions can never be pushed over a
            field the way they were.

            `sm:max-w-3xl` — this is a four-tab form with two-up field rows, not
            a confirm prompt. `max-h-[85vh]` keeps the footer on screen at a
            700px-tall viewport and the body absorbs the remainder. Padding
            moves off the shell and onto each band so the scrollbar runs the
            full height instead of floating inside a padded box. */}
        <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-2 pe-14">
          <DialogTitle>{item ? t('Edit Menu Item') : t('Add Menu Item')}</DialogTitle>
          <DialogDescription>
            {depth === 0
              ? t('A top-level item. Its panel content — title, intro, featured card — is on the Panel tab.')
              : depth === 1
                ? t('A child of a top-level item. It is either a left-rail link or a heading for a column of links.')
                : t('A link inside a column group. It needs a label and a destination — nothing else.')}
          </DialogDescription>
        </DialogHeader>

        {/* The one scrolling region. `min-h-0` is load-bearing: a flex child's
            default `min-height: auto` refuses to shrink below its content, so
            without it the body pushes the footer straight off the shell. */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
            <Tabs defaultValue={showPanelTab ? 'panel' : 'link'}>
              {/* Pinned to the top of the scroller — a long tab's fields must
                  not put the tab strip out of reach. The wrapper carries the
                  opaque surface and bleeds to the scroller's edges so nothing
                  shows through beside the strip's rounded corners. */}
              <div className="sticky top-0 z-10 -mx-6 bg-background px-6 pt-4 pb-2">
                <TabsList className="flex-wrap w-full h-auto">
                  <TabsTrigger value="link">{t('Link')}</TabsTrigger>
                  {showPanelTab ? (
                    <TabsTrigger value="panel">
                      {depth === 0 ? t('Panel') : t('Placement')}
                    </TabsTrigger>
                  ) : null}
                  <TabsTrigger value="appearance">{t('Appearance')}</TabsTrigger>
                  <TabsTrigger value="advanced">{t('Advanced')}</TabsTrigger>
                </TabsList>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Link                                                       */}
              {/* ---------------------------------------------------------- */}
              <TabsContent value="link" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mi-label">
                    {t('Label')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="mi-label"
                    value={form.label}
                    required
                    aria-invalid={serverErrors.label ? true : undefined}
                    aria-describedby={depth === 1 ? 'mi-label-help' : undefined}
                    onChange={(event) => set('label', event.target.value)}
                  />
                  {depth === 1 && form.slot === 'grid' ? (
                    <p id="mi-label-help" className="text-xs text-muted-foreground">
                      {t('This label is the column heading on the public site. Leave it empty for a group with no visible heading.')}
                    </p>
                  ) : null}
                  {serverErrors.label ? (
                    <p className="text-xs text-destructive">{serverErrors.label}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mi-link-type">{t('Item Type')}</Label>
                  <Select
                    value={form.link_type}
                    onValueChange={(value) => set('link_type', value)}
                  >
                    <SelectTrigger id="mi-link-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {linkTypes.map((option) => (
                        <SelectItem key={String(option.value)} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isStructural ? (
                  <p className="p-3 text-xs border border-dashed rounded-xl text-muted-foreground border-border">
                    {t('Headings and separators are structural — they carry no destination and are not focusable on the public site.')}
                  </p>
                ) : null}

                {needsUrl ? (
                  <div className="space-y-2">
                    <Label htmlFor="mi-url">
                      {form.link_type === 'anchor' ? t('Anchor') : t('URL')}
                    </Label>
                    <Input
                      id="mi-url"
                      value={form.url}
                      placeholder={form.link_type === 'anchor' ? '#pricing' : 'https://…'}
                      aria-invalid={serverErrors.url ? true : undefined}
                      onChange={(event) => set('url', event.target.value)}
                    />
                    {serverErrors.url ? (
                      <p className="text-xs text-destructive">{serverErrors.url}</p>
                    ) : null}
                  </div>
                ) : null}

                {needsRoute ? (
                  <div className="space-y-2">
                    <Label htmlFor="mi-route">{t('Route Name')}</Label>
                    <Input
                      id="mi-route"
                      value={form.route_name}
                      placeholder="contact.index"
                      onChange={(event) => set('route_name', event.target.value)}
                    />
                  </div>
                ) : null}

                {needsPage ? (
                  <div className="space-y-2">
                    <Label htmlFor="mi-page">{t('Page Id')}</Label>
                    <Input
                      id="mi-page"
                      type="number"
                      value={form.page_id}
                      onChange={(event) => set('page_id', event.target.value)}
                    />
                    {item?.page ? (
                      <p className="text-xs text-muted-foreground">
                        {t('Currently')}: {item.page.title} ({item.page.path})
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {needsEntity ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mi-target-type">{t('Entity Type')}</Label>
                      <Input
                        id="mi-target-type"
                        value={form.target_type}
                        placeholder="page"
                        onChange={(event) => set('target_type', event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mi-target-id">{t('Entity Id')}</Label>
                      <Input
                        id="mi-target-id"
                        type="number"
                        value={form.target_id}
                        onChange={(event) => set('target_id', event.target.value)}
                      />
                    </div>
                  </div>
                ) : null}

                {!isStructural ? (
                  <div className="flex items-center justify-between gap-3 p-3 border rounded-xl border-border">
                    <div>
                      <Label htmlFor="mi-new-tab" className="font-normal">
                        {t('Open in a new tab')}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {t('rel="noopener" is always added and cannot be removed.')}
                      </p>
                    </div>
                    <Switch
                      id="mi-new-tab"
                      checked={form.opens_in_new_tab}
                      onCheckedChange={(checked) => set('opens_in_new_tab', checked)}
                    />
                  </div>
                ) : null}
              </TabsContent>

              {/* ---------------------------------------------------------- */}
              {/* Panel (depth 0) / Placement (depth 1)                      */}
              {/* ---------------------------------------------------------- */}
              {showPanelTab ? (
                <TabsContent value="panel" className="pt-4 space-y-6">
                  {depth === 0 ? (
                    <>
                      <section className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="mi-display">{t('Opens as')}</Label>
                          <Select
                            value={form.display}
                            onValueChange={(value) => set('display', value)}
                          >
                            <SelectTrigger id="mi-display">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DISPLAY_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {t(option.label)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {t('An item with no children always renders as a plain link, whatever is selected here.')}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mi-region">{t('Header region')}</Label>
                          <Select
                            value={form.region}
                            onValueChange={(value) => set('region', value)}
                          >
                            <SelectTrigger id="mi-region">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {REGION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {t(option.label)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </section>

                      {hasPanelCopy ? (
                        <section className="p-4 space-y-4 border rounded-xl border-border">
                          <div>
                            <h3 className="text-sm font-semibold">{t('Panel content')}</h3>
                            <p className="text-xs text-muted-foreground">
                              {t('The editorial header of the open panel.')}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mi-panel-title">{t('Panel title')}</Label>
                            <Input
                              id="mi-panel-title"
                              value={form.panel_title}
                              onChange={(event) => set('panel_title', event.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              {t('Falls back to the item label. Do not type a full stop — the accent one is added for you.')}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mi-panel-intro">{t('Panel intro')}</Label>
                            <Textarea
                              id="mi-panel-intro"
                              rows={3}
                              value={form.panel_intro}
                              onChange={(event) => set('panel_intro', event.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="mi-intro-label">{t('Intro link text')}</Label>
                              <Input
                                id="mi-intro-label"
                                value={form.panel_intro_label}
                                onChange={(event) =>
                                  set('panel_intro_label', event.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mi-intro-href">{t('Intro link URL')}</Label>
                              <Input
                                id="mi-intro-href"
                                value={form.panel_intro_href}
                                placeholder="/services"
                                onChange={(event) =>
                                  set('panel_intro_href', event.target.value)
                                }
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t('The intro link text must appear word-for-word inside the intro — that phrase becomes the link. If it does not match, the intro renders as plain text.')}
                          </p>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="mi-footer-label">{t('Footer link text')}</Label>
                              <Input
                                id="mi-footer-label"
                                value={form.panel_footer_label}
                                placeholder={t('All Services')}
                                onChange={(event) =>
                                  set('panel_footer_label', event.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mi-footer-href">{t('Footer link URL')}</Label>
                              <Input
                                id="mi-footer-href"
                                value={form.panel_footer_href}
                                placeholder="/services"
                                onChange={(event) =>
                                  set('panel_footer_href', event.target.value)
                                }
                              />
                            </div>
                          </div>
                        </section>
                      ) : null}

                      {isMega ? (
                        <section className="p-4 space-y-4 border rounded-xl border-border">
                          <div>
                            <h3 className="text-sm font-semibold">{t('Featured card')}</h3>
                            <p className="text-xs text-muted-foreground">
                              {t('One piece of proof at the foot of the panel rail. Leave it empty and the card is not rendered.')}
                            </p>
                          </div>

                          {/* The picker writes `media_id`, so without this the
                              editor chose a file and the dialog looked
                              identical — there was no way to tell what was
                              attached, or that anything was. The box is a fixed
                              64px square whatever the asset's own ratio is, so
                              choosing an image cannot reflow the form. */}
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center overflow-hidden border rounded-lg size-16 shrink-0 border-border bg-muted">
                              {media?.url ? (
                                <SafeImage
                                  src={media.url}
                                  alt={media.alt_text ?? media.original_name}
                                  width={media.width ?? 64}
                                  height={media.height ?? 64}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <ImageIcon
                                  className="w-5 h-5 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              )}
                            </div>

                            <div className="min-w-0 space-y-2">
                              <p className="text-sm font-medium">{t('Card image')}</p>

                              {media ? (
                                <p className="text-xs truncate text-muted-foreground">
                                  {media.original_name}
                                  {media.size_human ? ` · ${media.size_human}` : ''}
                                </p>
                              ) : (
                                /* An explicit empty state, not blank space: the
                                   difference between "nothing attached" and
                                   "the preview failed" must be visible. */
                                <p className="text-xs text-muted-foreground">
                                  {t('No image selected')}
                                </p>
                              )}

                              <p className="text-xs text-muted-foreground">
                                {t('Shown as a small thumbnail beside the text. Without one the client name is used instead.')}
                              </p>

                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setPickerOpen(true)}
                                >
                                  {media ? t('Replace') : t('Choose image')}
                                </Button>
                                {media ? (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setMedia(null)}
                                  >
                                    {t('Remove')}
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mi-featured-client">{t('Client name')}</Label>
                            <Input
                              id="mi-featured-client"
                              value={form.featured_client}
                              onChange={(event) =>
                                set('featured_client', event.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mi-featured-result">{t('Result')}</Label>
                            <Textarea
                              id="mi-featured-result"
                              rows={2}
                              value={form.featured_result}
                              onChange={(event) =>
                                set('featured_result', event.target.value)
                              }
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="mi-featured-link-label">
                                {t('Card link text')}
                              </Label>
                              <Input
                                id="mi-featured-link-label"
                                value={form.featured_link_label}
                                placeholder={t('Read case study.')}
                                onChange={(event) =>
                                  set('featured_link_label', event.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mi-featured-link-href">
                                {t('Card link URL')}
                              </Label>
                              <Input
                                id="mi-featured-link-href"
                                value={form.featured_link_href}
                                placeholder="/case-studies/…"
                                onChange={(event) =>
                                  set('featured_link_href', event.target.value)
                                }
                              />
                            </div>
                          </div>
                        </section>
                      ) : null}

                      <section className="p-4 space-y-4 border rounded-xl border-border">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <Label htmlFor="mi-is-cta" className="font-normal">
                              {t('Render as the header button')}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {t('Moves this item out of the nav list and into the bar as a call-to-action button.')}
                            </p>
                          </div>
                          <Switch
                            id="mi-is-cta"
                            checked={form.is_cta}
                            onCheckedChange={(checked) => set('is_cta', checked)}
                          />
                        </div>

                        {form.is_cta ? (
                          <div className="space-y-2">
                            <Label htmlFor="mi-variant">{t('Button style')}</Label>
                            <Select
                              value={form.variant || 'solid'}
                              onValueChange={(value) => set('variant', value)}
                            >
                              <SelectTrigger id="mi-variant">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {VARIANT_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {t(option.label)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : null}
                      </section>
                    </>
                  ) : (
                    <section className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mi-slot">{t('Position in the panel')}</Label>
                        <Select value={form.slot} onValueChange={(value) => set('slot', value)}>
                          <SelectTrigger id="mi-slot">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SLOT_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {t(option.label)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {form.slot === 'grid'
                            ? t('A grid group holds the links nested underneath it. Set its Item Type to Heading so it is never a link itself.')
                            : t('A rail link sits in the tinted left column of the panel and needs its own destination.')}
                        </p>
                      </div>

                      {form.slot === 'grid' ? (
                        <div className="space-y-2">
                          <Label htmlFor="mi-columns">{t('Columns')}</Label>
                          <Select
                            value={form.columns || '1'}
                            onValueChange={(value) => set('columns', value)}
                          >
                            <SelectTrigger id="mi-columns" className="sm:w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['1', '2', '3'].map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {t('How many columns of the panel grid this group spans, and how many columns its own links flow into.')}
                          </p>
                        </div>
                      ) : null}
                    </section>
                  )}
                </TabsContent>
              ) : null}

              {/* ---------------------------------------------------------- */}
              {/* Appearance                                                 */}
              {/* ---------------------------------------------------------- */}
              <TabsContent value="appearance" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mi-aria">{t('Accessible Label')}</Label>
                  <Input
                    id="mi-aria"
                    value={form.aria_label}
                    onChange={(event) => set('aria_label', event.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('Read instead of the label by screen readers. Set it when the visible text repeats elsewhere.')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mi-description">{t('Description')}</Label>
                  <Textarea
                    id="mi-description"
                    rows={2}
                    value={form.description}
                    onChange={(event) => set('description', event.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="mi-icon">{t('Icon')}</Label>
                    <Input
                      id="mi-icon"
                      value={form.icon}
                      placeholder="shield-check"
                      onChange={(event) => set('icon', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mi-badge">{t('Badge')}</Label>
                    <Input
                      id="mi-badge"
                      value={form.badge_label}
                      placeholder={t('e.g., New')}
                      onChange={(event) => set('badge_label', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mi-badge-variant">{t('Badge Style')}</Label>
                    <Input
                      id="mi-badge-variant"
                      value={form.badge_variant}
                      placeholder="secondary"
                      onChange={(event) => set('badge_variant', event.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ---------------------------------------------------------- */}
              {/* Advanced                                                   */}
              {/* ---------------------------------------------------------- */}
              <TabsContent value="advanced" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mi-visibility">{t('Visibility')}</Label>
                  <Select
                    value={form.visibility}
                    onValueChange={(value) => set('visibility', value)}
                  >
                    <SelectTrigger id="mi-visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {visibilities.map((option) => (
                        <SelectItem key={String(option.value)} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {t('Controls who sees this item — everyone, guests only, or authenticated visitors only.')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mi-status">{t('Status')}</Label>
                  <Select value={form.status} onValueChange={(value) => set('status', value)}>
                    <SelectTrigger id="mi-status">
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

                {!isStructural ? (
                  <div className="space-y-2">
                    <Label htmlFor="mi-rel">{t('Rel Tokens')}</Label>
                    <Input
                      id="mi-rel"
                      value={form.rel}
                      placeholder="nofollow"
                      onChange={(event) => set('rel', event.target.value)}
                    />
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
        </div>

        {/* Outside the scroller and never over it: its own surface and a top
            border so the boundary is visible the moment the body overflows. */}
        <DialogFooter className="shrink-0 gap-2 border-t border-border bg-background px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('Cancel')}
          </Button>
          <Button type="button" onClick={handleSave} disabled={loading || !form.label}>
            <ButtonLoader
              isSubmitting={loading}
              btnText={item ? t('Save item') : t('Add item')}
              loaderText={`${t('Saving')}…`}
              icon={<Save className="w-4 h-4" />}
            />
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sibling of the item dialog, not a child of it: a Radix dialog nested
          inside another dialog's content traps focus in the wrong layer. */}
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={setMedia}
        selectedId={media?.id ?? null}
        title={t('Featured card image')}
        description={t('Pick the client mark or photo shown beside the card text.')}
      />
    </>
  );
}

/** A fresh item, defaulted from the option lists the backend shipped. */
function blankState(visibilities: CmsOption[], statuses: CmsOption[]): ItemFormState {
  return {
    label: '',
    aria_label: '',
    description: '',
    icon: '',
    link_type: 'url',
    url: '',
    route_name: '',
    page_id: '',
    target_type: '',
    target_id: '',
    opens_in_new_tab: false,
    rel: '',
    badge_label: '',
    badge_variant: '',
    visibility: String(visibilities[0]?.value ?? 'always'),
    status: String(statuses[0]?.value ?? 'active'),

    display: 'link',
    region: 'nav',
    panel_title: '',
    panel_intro: '',
    panel_intro_label: '',
    panel_intro_href: '',
    panel_footer_label: '',
    panel_footer_href: '',
    featured_client: '',
    featured_result: '',
    featured_link_label: '',
    featured_link_href: '',
    is_cta: false,
    variant: '',

    slot: 'rail',
    columns: '1',
  };
}

export default MenuItemDialog;
