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
import { ScrollArea } from '@/Components/UI/ScrollArea';
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
import type { CmsMenu, CmsMenuItem, CmsOption } from '@/Types/cms';
import { Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
  /** Mega-menu configuration, stored in the item's `settings` bag. */
  mega_enabled: boolean;
  mega_columns: string;
  mega_width: string;
}

/**
 * Create or edit one menu item.
 *
 * The destination fields are conditional on `link_type`, matching
 * `MenuItemSaveRequest` exactly. `heading` and `separator` are *structural*:
 * the request marks `url` prohibited for them, because they exist precisely so
 * a menu never has to fake a section break with `href="#"` — which is
 * focusable, announced as a link, and goes nowhere.
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

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!item) {
      setForm(blankState(visibilities, statuses));

      return;
    }

    const settings = (item.settings ?? {}) as Record<string, unknown>;
    const mega = (settings.mega ?? {}) as Record<string, unknown>;

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
      mega_enabled: Boolean(mega.enabled),
      mega_columns: mega.columns === undefined ? '' : String(mega.columns),
      mega_width: typeof mega.width === 'string' ? mega.width : '',
    });
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
      settings: {
        ...(item?.settings ?? {}),
        mega: {
          enabled: form.mega_enabled,
          columns: form.mega_columns ? Number(form.mega_columns) : null,
          width: form.mega_width || null,
        },
      },
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{item ? t('Edit Menu Item') : t('Add Menu Item')}</DialogTitle>
          <DialogDescription>
            {t('Items are nested by dragging them in the tree — this dialog covers everything else.')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-2">
          <div className="px-2">
            <Tabs defaultValue="link">
              <TabsList className="flex-wrap w-full h-auto">
                <TabsTrigger value="link">{t('Link')}</TabsTrigger>
                <TabsTrigger value="appearance">{t('Appearance')}</TabsTrigger>
                <TabsTrigger value="advanced">{t('Advanced')}</TabsTrigger>
              </TabsList>

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
                    onChange={(event) => set('label', event.target.value)}
                  />
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

                <div className="p-3 space-y-3 border rounded-xl border-border">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="mi-mega" className="font-normal">
                      {t('Render as a mega menu')}
                    </Label>
                    <Switch
                      id="mi-mega"
                      checked={form.mega_enabled}
                      onCheckedChange={(checked) => set('mega_enabled', checked)}
                    />
                  </div>

                  {form.mega_enabled ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="mi-mega-columns">{t('Columns')}</Label>
                        <Input
                          id="mi-mega-columns"
                          type="number"
                          min={1}
                          max={6}
                          value={form.mega_columns}
                          onChange={(event) => set('mega_columns', event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mi-mega-width">{t('Panel Width')}</Label>
                        <Input
                          id="mi-mega-width"
                          value={form.mega_width}
                          placeholder="full"
                          onChange={(event) => set('mega_width', event.target.value)}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </TabsContent>

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
        </ScrollArea>

        <DialogFooter className="gap-2">
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
    mega_enabled: false,
    mega_columns: '',
    mega_width: '',
  };
}

export default MenuItemDialog;
