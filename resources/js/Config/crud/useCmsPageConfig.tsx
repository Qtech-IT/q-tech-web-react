import {
  Blocks,
  FileText,
  Files,
  Home,
  LayoutList,
  Radio,
} from 'lucide-react';

import CmsSaveForm from '@/Components/Forms/Backend/Cms/CmsSaveForm';
import StatusBadge from '@/Components/UI/StatusBadge';
import { Badge } from '@/Components/UI/Badge';
import { useCmsLocales } from '@/Hooks/useCmsLocales';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsOption, CmsPage } from '@/Types/cms';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import { limitText } from '@/Utils/helpers';
import z from 'zod';

/**
 * The real Pages config.
 *
 * Replaces the stale `usePageConfig` that modelled a page as
 * `{title, content, status}` — a shape that no longer exists anywhere in the
 * schema. A CMS page is a node in a tree with a locale, a template, a publish
 * state of its own, and a builder screen behind it.
 *
 * Publishing and homepage promotion are deliberately NOT table actions: both
 * are POSTs to `{page}`-parameterised routes, and both deserve the
 * confirmation context the builder header gives them.
 */
export function useCmsPageConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations();
  const { localeOptions, defaultLocale } = useCmsLocales();

  const modelProperty = props?.modelProperty;
  const routePrefix: string = modelProperty?.routePrefix ?? 'backend.pages';

  const pageTypes: CmsOption[] = props?.pageTypes ?? [];
  const publishStatuses: CmsOption[] = props?.publishStatuses ?? [];
  const statuses: CmsOption[] = props?.statuses ?? [];
  const advanceFilterOptions = props?.advanceFilterOptions ?? [];

  const baseBreadcrumbs = [
    { label: t('Dashboard'), href: route('backend.dashboard') },
    { label: t('Pages'), href: route(`${routePrefix}.index`) },
  ];

  return {
    formComponent: CmsSaveForm,
    resource: 'page',
    resourcePlural: 'pages',
    title: t('Pages'),
    description: t('Every page on the public site, its template, and its publishing state'),
    fetchToggle: false,

    routes: {
      index: `${routePrefix}.index`,
      create: `${routePrefix}.create`,
      edit: `${routePrefix}.edit`,
      store: `${routePrefix}.store`,
      update: `${routePrefix}.update`,
      destroy: `${routePrefix}.destroy`,
      updateStatus: `${routePrefix}.update.status`,
      restore: `${routePrefix}.restore`,
      forceDestroy: `${routePrefix}.force.destroy`,
    },

    formDisplayMode: 'page',
    viewDisplayMode: 'page',
    statusType: 'binary',

    /**
     * Mirrors `PageSaveRequest::rules()`. Where the two disagree the server
     * wins, so the only job here is to stop a round trip that was always
     * going to fail.
     */
    formValidationRules: {
      title: z
        .string()
        .min(1, t('Title is required'))
        .max(191, t('Title must not exceed 191 characters')),

      slug: z
        .string()
        .max(191, t('Slug must not exceed 191 characters'))
        .optional()
        .default(''),

      locale: z.string().min(1, t('Locale is required')),
      parent_id: z.any().optional(),
      page_type: z.string().min(1, t('Page type is required')),

      template: z
        .string()
        .min(1, t('Template is required'))
        .max(100, t('Template must not exceed 100 characters')),

      is_homepage: z.any().optional(),
      is_indexable: z.any().optional(),

      status: z.string().min(1, t('Status is required')),
      publish_status: z.string().min(1, t('Publish status is required')),
      published_at: z.any().optional(),
      expires_at: z.any().optional(),
      sort_order: z.any().optional(),
    },

    form: {
      fields: [
        {
          name: 'title',
          label: t('Title'),
          type: 'text',
          placeholder: t('e.g., Enterprise Software Development'),
          description: t('Shown in navigation, breadcrumbs and the browser tab'),
          required: true,
          section: 'basic',
        },
        {
          name: 'slug',
          label: t('Slug'),
          type: 'text',
          placeholder: t('Leave blank to generate from the title'),
          description: t('Changing a slug of a live page creates a redirect automatically'),
          required: false,
          section: 'basic',
        },
        {
          name: 'page_type',
          label: t('Page Type'),
          type: 'select',
          description: t('System pages cannot be deleted'),
          required: true,
          options: pageTypes,
          section: 'grid',
        },
        {
          name: 'template',
          label: t('Template'),
          type: 'text',
          placeholder: t('default'),
          description: t('React template key used to render this page'),
          required: true,
          defaultValue: 'default',
          section: 'grid',
        },
        {
          name: 'locale',
          label: t('Locale'),
          type: 'select',
          description: t('Language this page is authored in'),
          required: true,
          options: localeOptions,
          defaultValue: defaultLocale,
          section: 'grid',
        },
        {
          name: 'sort_order',
          label: t('Order'),
          type: 'number',
          placeholder: '0',
          description: t('Position among its siblings'),
          required: false,
          min: 0,
          section: 'grid',
        },
        {
          name: 'publish_status',
          label: t('Publish Status'),
          type: 'select',
          description: t('Editorial state — separate from the status kill switch'),
          required: true,
          options: publishStatuses,
          section: 'grid',
        },
        {
          name: 'status',
          label: t('Status'),
          type: 'select',
          description: t('Disables the page everywhere without deleting it'),
          required: true,
          options: statuses,
          section: 'grid',
        },
        {
          name: 'published_at',
          label: t('Publish At'),
          type: 'datetime-local',
          description: t('Required when the publish status is scheduled'),
          required: false,
          section: 'grid',
        },
        {
          name: 'expires_at',
          label: t('Expires At'),
          type: 'datetime-local',
          description: t('The page stops rendering publicly after this moment'),
          required: false,
          section: 'grid',
        },
        {
          name: 'is_indexable',
          label: t('Allow Search Engines'),
          type: 'switch',
          description: t('Turn off to emit a noindex robots directive'),
          required: false,
          defaultValue: true,
          section: 'grid',
        },
      ],
    },

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Pages'), href: null, active: true },
      ],
      create: [...baseBreadcrumbs, { label: t('Create'), href: null, active: true }],
      update: [...baseBreadcrumbs, { label: t('Update'), href: null, active: true }],
    },

    table: {
      selectable: false,
      searchable: true,
      serializable: true,
      searchPlaceholder: t('Search pages by title or path'),
      sortable: false,
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No pages yet. Create your first page to start building the site.'),
      emptyMessageIcon: Files,

      columns: [
        {
          key: 'title',
          label: t('Title'),
          sortable: false,
          filterable: true,
          priority: 0,
          render: (row: CmsPage) => (
            <div className="flex items-center gap-2 min-w-0">
              {row.is_homepage ? (
                <Home
                  className="w-4 h-4 shrink-0 text-amber-500"
                  aria-label={t('Homepage')}
                />
              ) : null}
              <span className="text-sm font-medium truncate text-foreground">
                {limitText(row.title ?? '', 40, '…')}
              </span>
            </div>
          ),
        },
        {
          key: 'path',
          label: t('Path'),
          sortable: false,
          filterable: true,
          priority: 1,
          render: (row: CmsPage) => (
            <code className="text-xs text-muted-foreground">{row.path || '—'}</code>
          ),
        },
        {
          key: 'sections_count',
          label: t('Sections'),
          sortable: false,
          priority: 3,
          render: (row: CmsPage) => (
            <span className="text-sm tabular-nums text-muted-foreground">
              {row.sections_count ?? 0}
            </span>
          ),
        },
        {
          key: 'publish_status',
          label: t('Publishing'),
          sortable: false,
          priority: 2,
          render: (row: CmsPage) => (
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant={row.is_live ? 'default' : 'outline'} className="capitalize">
                {String(row.publish_status ?? '').replace(/_/g, ' ') || '—'}
              </Badge>
              {row.is_live ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <Radio className="w-3 h-3" aria-hidden="true" />
                  {t('Live')}
                </span>
              ) : null}
            </div>
          ),
        },
        {
          key: 'locale',
          label: t('Locale'),
          sortable: false,
          priority: 4,
          render: (row: CmsPage) => (
            <span className="text-xs uppercase text-muted-foreground">{row.locale}</span>
          ),
        },
        {
          key: 'status',
          label: t('Status'),
          sortable: false,
          priority: 5,
          render: (row: CmsPage) => (
            <div className="mt-1.5">
              <StatusBadge status={row.status} />
            </div>
          ),
        },
        {
          key: 'updated_at',
          label: t('Updated'),
          sortable: false,
          priority: 6,
          renderType: 'date',
        },
      ],

      customActionSubmenus: [
        {
          key: 'page_builder',
          title: t('Content'),
          icon: LayoutList,
          type: 'route',
          permission: 'section.view',
          actions: [
            {
              key: 'open_builder',
              label: t('Open Page Builder'),
              icon: Blocks,
              iconColor: 'text-indigo-600',
              permission: 'section.view',
              route: `${routePrefix}.sections`,
              routeParams: (item: CmsPage) => ({ page: item.uuid }),
            },
          ],
        },
      ],
    },

    filters: {
      searchFields: ['title', 'path', 'slug'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        create: 'page.create',
        edit: 'page.edit',
        view: 'page.view',
        delete: 'page.delete',
        restore: 'page.restore',
        permanentDelete: 'page.force-delete',
        updateStatus: 'page.edit',
      },
    },

    /**
     * The server refuses to delete system and home pages outright; surfacing
     * `is_deleteable` here disables the control instead of letting an editor
     * discover the rule through a failed request.
     */
    actionConstraints: {
      delete: [
        {
          field: 'is_deleteable',
          checkValue: false,
          message: t('System and homepage pages cannot be deleted'),
        },
      ],
    },

    destroyDialogConfig: {
      title: t('Delete Page'),
      description: t('Are you sure you want to delete this page? Its sections are deleted with it.'),
      itemName: {
        label: t('Title'),
        key: 'title',
        render: (title: string) => title,
      },
      itemType: 'Page',
      warningMessage: t('Any menu item or CTA pointing at this page will lose its destination.'),
      showWarningAlert: true,
      showItemDetails: true,
      itemDisplayFields: [
        { label: t('Title'), key: 'title', className: 'font-semibold' },
        { label: t('Path'), key: 'path', className: 'text-muted-foreground' },
        { label: t('Sections'), key: 'sections_count', className: 'text-muted-foreground' },
        { label: t('Locale'), key: 'locale', className: 'text-muted-foreground' },
      ],
    },

    labels: { singular: 'Page', plural: 'Pages' },

    saveAlertInfo: {
      title: t('Page Settings'),
      description: t('These are the page’s own attributes. Its content is edited in the page builder, and its SEO fields in the SEO panel there.'),
    },

    stats: [
      { key: 'total', title: t('Total Pages'), icon: Files, iconColor: 'text-blue-600', iconBgColor: 'bg-blue-100 dark:bg-blue-900', description: t('All pages') },
      { key: 'published', title: t('Published'), icon: Radio, iconColor: 'text-emerald-600', iconBgColor: 'bg-emerald-100 dark:bg-emerald-900', description: t('Live on the site') },
      { key: 'draft', title: t('Drafts'), icon: FileText, iconColor: 'text-amber-600', iconBgColor: 'bg-amber-100 dark:bg-amber-900', description: t('Not yet published') },
    ],
  };
}
