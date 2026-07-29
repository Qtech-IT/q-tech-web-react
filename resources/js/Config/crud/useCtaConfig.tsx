import { ExternalLink, MousePointerClick, SquareArrowOutUpRight } from 'lucide-react';

import CmsSaveForm from '@/Components/Forms/Backend/Cms/CmsSaveForm';
import { Badge } from '@/Components/UI/Badge';
import StatusBadge from '@/Components/UI/StatusBadge';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsCta, CmsOption } from '@/Types/cms';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import z from 'zod';

/**
 * Reusable call-to-action records.
 *
 * Sections and repeater items reference a CTA rather than duplicating its
 * label and destination, so a campaign URL changes in one place.
 *
 * The destination fields are conditional on `link_type`, exactly as
 * `CtaSaveRequest` requires them — `CmsSaveForm` hides the irrelevant ones and
 * nulls them on submit, so switching type never submits a stale destination.
 */
export function useCtaConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations();

  const modelProperty = props?.modelProperty;
  const routePrefix: string = modelProperty?.routePrefix ?? 'backend.ctas';

  const linkTypes: CmsOption[] = props?.linkTypes ?? [];
  const iconPositions: CmsOption[] = props?.iconPositions ?? [];
  const statuses: CmsOption[] = props?.statuses ?? [];
  const advanceFilterOptions = props?.advanceFilterOptions ?? [];

  const baseBreadcrumbs = [
    { label: t('Dashboard'), href: route('backend.dashboard') },
    { label: t('Call To Actions'), href: route(`${routePrefix}.index`) },
  ];

  /** Values `CtaSaveRequest` treats as demanding a raw `url`. */
  const urlLinkTypes = ['url', 'anchor'];

  return {
    formComponent: CmsSaveForm,
    resource: 'cta',
    resourcePlural: 'ctas',
    title: t('Call To Actions'),
    description: t('Buttons and links reused across sections, with one destination each'),
    fetchToggle: false,

    routes: {
      index: `${routePrefix}.index`,
      create: `${routePrefix}.create`,
      edit: `${routePrefix}.edit`,
      store: `${routePrefix}.store`,
      update: `${routePrefix}.update`,
      destroy: `${routePrefix}.destroy`,
    },

    formDisplayMode: 'page',
    viewDisplayMode: 'page',
    statusType: 'binary',

    /** Mirrors `CtaSaveRequest::rules()`. */
    formValidationRules: {
      label: z
        .string()
        .min(1, t('Label is required'))
        .max(191, t('Label must not exceed 191 characters')),

      /**
       * Not decoration: with eight "Learn more" buttons on a page, the
       * accessible name is the only thing distinguishing them for a screen
       * reader.
       */
      aria_label: z
        .string()
        .max(191, t('Accessible label must not exceed 191 characters'))
        .optional()
        .nullable(),

      link_type: z.string().min(1, t('Link type is required')),
      url: z.string().max(500, t('URL must not exceed 500 characters')).optional().nullable(),
      route_name: z.string().max(191).optional().nullable(),
      page_id: z.any().optional().nullable(),
      target_type: z.any().optional().nullable(),
      target_id: z.any().optional().nullable(),

      variant: z.string().min(1, t('Variant is required')).max(50),
      size: z.string().min(1, t('Size is required')).max(20),
      icon: z.string().max(100).optional().nullable(),
      icon_position: z.string().min(1, t('Icon position is required')),

      opens_in_new_tab: z.any().optional(),
      is_download: z.any().optional(),
      rel: z.string().max(100).optional().nullable(),
      tracking_id: z.string().max(100).optional().nullable(),
      status: z.string().min(1, t('Status is required')),
    },

    form: {
      fields: [
        {
          name: 'label',
          label: t('Label'),
          type: 'text',
          placeholder: t('e.g., Book a Discovery Call'),
          description: t('The visible button text'),
          required: true,
          section: 'basic',
        },
        {
          name: 'aria_label',
          label: t('Accessible Label'),
          type: 'text',
          placeholder: t('e.g., Book a discovery call about cloud migration'),
          description: t('Read by screen readers instead of the label. Set this whenever the visible text repeats elsewhere on the page.'),
          required: false,
          section: 'basic',
        },
        {
          name: 'link_type',
          label: t('Link Type'),
          type: 'select',
          description: t('Determines which destination field applies'),
          required: true,
          options: linkTypes,
          section: 'grid',
        },
        {
          name: 'url',
          label: t('URL'),
          type: 'text',
          placeholder: t('https://example.com or #section-anchor'),
          required: true,
          section: 'grid',
          dependsOn: 'link_type',
          showWhen: (value: unknown) => urlLinkTypes.includes(String(value)),
        },
        {
          name: 'route_name',
          label: t('Route Name'),
          type: 'text',
          placeholder: t('e.g., contact.index'),
          description: t('A named application route'),
          required: true,
          section: 'grid',
          dependsOn: 'link_type',
          showWhen: (value: unknown) => String(value) === 'route',
        },
        {
          name: 'page_id',
          label: t('Page'),
          type: 'number',
          description: t('Numeric id of the destination page'),
          required: true,
          section: 'grid',
          dependsOn: 'link_type',
          showWhen: (value: unknown) => String(value) === 'page',
        },
        {
          name: 'target_type',
          label: t('Entity Type'),
          type: 'text',
          description: t('Morph alias of the destination entity'),
          required: true,
          section: 'grid',
          dependsOn: 'link_type',
          showWhen: (value: unknown) => String(value) === 'entity',
        },
        {
          name: 'target_id',
          label: t('Entity Id'),
          type: 'number',
          required: true,
          section: 'grid',
          dependsOn: 'link_type',
          showWhen: (value: unknown) => String(value) === 'entity',
        },
        {
          name: 'variant',
          label: t('Variant'),
          type: 'text',
          placeholder: 'default',
          description: t('Button style key the frontend maps to a design token'),
          required: true,
          defaultValue: 'default',
          section: 'grid',
        },
        {
          name: 'size',
          label: t('Size'),
          type: 'text',
          placeholder: 'default',
          required: true,
          defaultValue: 'default',
          section: 'grid',
        },
        {
          name: 'icon',
          label: t('Icon'),
          type: 'text',
          placeholder: t('e.g., arrow-right'),
          description: t('Lucide icon name'),
          required: false,
          section: 'grid',
        },
        {
          name: 'icon_position',
          label: t('Icon Position'),
          type: 'select',
          required: true,
          options: iconPositions,
          section: 'grid',
        },
        {
          name: 'opens_in_new_tab',
          label: t('Open In New Tab'),
          type: 'switch',
          description: t('rel="noopener" is always added for you and cannot be removed'),
          required: false,
          section: 'grid',
        },
        {
          name: 'is_download',
          label: t('Download Link'),
          type: 'switch',
          required: false,
          section: 'grid',
        },
        {
          name: 'rel',
          label: t('Rel Tokens'),
          type: 'text',
          placeholder: t('e.g., nofollow sponsored'),
          required: false,
          section: 'grid',
        },
        {
          name: 'tracking_id',
          label: t('Tracking Id'),
          type: 'text',
          placeholder: t('e.g., hero-primary-cta'),
          description: t('Analytics identifier emitted on the rendered element'),
          required: false,
          section: 'grid',
        },
        {
          name: 'status',
          label: t('Status'),
          type: 'select',
          required: true,
          options: statuses,
          section: 'grid',
        },
      ],
    },

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Call To Actions'), href: null, active: true },
      ],
      create: [...baseBreadcrumbs, { label: t('Create'), href: null, active: true }],
      update: [...baseBreadcrumbs, { label: t('Update'), href: null, active: true }],
    },

    table: {
      selectable: false,
      searchable: true,
      serializable: true,
      searchPlaceholder: t('Search call to actions by label'),
      sortable: false,
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No call to actions yet. Create one so sections can share a destination.'),
      emptyMessageIcon: MousePointerClick,

      columns: [
        {
          key: 'label',
          label: t('Label'),
          sortable: false,
          filterable: true,
          priority: 0,
          render: (row: CmsCta) => (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium truncate text-foreground">{row.label}</span>
              {row.opens_in_new_tab ? (
                <SquareArrowOutUpRight
                  className="w-3.5 h-3.5 shrink-0 text-muted-foreground"
                  aria-label={t('Opens in a new tab')}
                />
              ) : null}
            </div>
          ),
        },
        {
          key: 'href',
          label: t('Destination'),
          sortable: false,
          priority: 1,
          render: (row: CmsCta) =>
            row.href ? (
              <code className="text-xs break-all text-muted-foreground">{row.href}</code>
            ) : (
              /* Null href means the destination no longer resolves — a
                 removed page or a route that stopped existing. */
              <span className="text-xs text-amber-600 dark:text-amber-400">
                {t('Unresolved')}
              </span>
            ),
        },
        {
          key: 'link_type',
          label: t('Type'),
          sortable: false,
          priority: 2,
          render: (row: CmsCta) => (
            <Badge variant="outline" className="capitalize">
              {String(row.link_type ?? '').replace(/_/g, ' ')}
            </Badge>
          ),
        },
        {
          key: 'variant',
          label: t('Variant'),
          sortable: false,
          priority: 4,
          render: (row: CmsCta) => (
            <span className="text-xs text-muted-foreground">{row.variant}</span>
          ),
        },
        {
          key: 'status',
          label: t('Status'),
          sortable: false,
          priority: 3,
          render: (row: CmsCta) => (
            <div className="mt-1.5">
              <StatusBadge status={row.status} />
            </div>
          ),
        },
      ],
    },

    filters: {
      searchFields: ['label', 'url'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        create: 'cta.create',
        edit: 'cta.edit',
        view: 'cta.view',
        delete: 'cta.delete',
        restore: 'cta.restore',
        permanentDelete: 'cta.force-delete',
      },
    },

    destroyDialogConfig: {
      title: t('Delete Call To Action'),
      description: t('Are you sure you want to delete this call to action?'),
      itemName: { label: t('Label'), key: 'label', render: (label: string) => label },
      itemType: 'Cta',
      warningMessage: t('Sections and repeater items pointing at this CTA lose their button.'),
      showWarningAlert: true,
      showItemDetails: true,
      itemDisplayFields: [
        { label: t('Label'), key: 'label', className: 'font-semibold' },
        { label: t('Destination'), key: 'href', className: 'text-muted-foreground' },
        { label: t('Type'), key: 'link_type', className: 'text-muted-foreground' },
      ],
    },

    labels: { singular: 'Cta', plural: 'Ctas' },

    saveAlertInfo: {
      title: t('Call To Action'),
      description: t('Only the destination fields for the selected link type are shown — the others are cleared on save so a stale URL never survives a type change.'),
    },

    stats: [
      {
        key: 'total',
        title: t('Total CTAs'),
        icon: MousePointerClick,
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100 dark:bg-blue-900',
        description: t('All call to actions'),
      },
      {
        key: 'external',
        title: t('External'),
        icon: ExternalLink,
        iconColor: 'text-purple-600',
        iconBgColor: 'bg-purple-100 dark:bg-purple-900',
        description: t('Pointing off-site'),
      },
    ],
  };
}
