import { ArrowRightLeft, Bot, Signpost } from 'lucide-react';

import CmsSaveForm from '@/Components/Forms/Backend/Cms/CmsSaveForm';
import { Badge } from '@/Components/UI/Badge';
import StatusBadge from '@/Components/UI/StatusBadge';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsOption, CmsRedirect } from '@/Types/cms';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import z from 'zod';

/**
 * Redirects.
 *
 * Most rows here were created automatically by `PageService` when a live
 * page's slug changed. This screen exists so an editor can add the manual ones
 * and retire the dead ones — which is what `hits` and `last_hit_at` are for.
 */
export function useRedirectConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations();

  const modelProperty = props?.modelProperty;
  const routePrefix: string = modelProperty?.routePrefix ?? 'backend.redirects';

  const sources: CmsOption[] = props?.sources ?? [];
  const statuses: CmsOption[] = props?.statuses ?? [];
  const advanceFilterOptions = props?.advanceFilterOptions ?? [];

  /** `Redirect::STATUS_CODES` — shipped as a bare int array. */
  const statusCodeOptions: CmsOption[] = (
    (props?.statusCodes as number[] | undefined) ?? []
  ).map((code) => ({ value: code, label: String(code) }));

  const baseBreadcrumbs = [
    { label: t('Dashboard'), href: route('backend.dashboard') },
    { label: t('Redirects'), href: route(`${routePrefix}.index`) },
  ];

  return {
    formComponent: CmsSaveForm,
    resource: 'redirect',
    resourcePlural: 'redirects',
    title: t('Redirects'),
    description: t('Keep old URLs working after a slug change, and retire the ones nothing hits'),
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

    /** Mirrors `RedirectSaveRequest::rules()`. */
    formValidationRules: {
      from_path: z
        .string()
        .min(1, t('Source path is required'))
        .max(500, t('Source path must not exceed 500 characters')),

      to_path: z
        .string()
        .min(1, t('Destination path is required'))
        .max(500, t('Destination path must not exceed 500 characters')),

      status_code: z.coerce
        .number({ message: t('Status code is required') })
        .int(),

      is_regex: z.any().optional(),
      preserve_query: z.any().optional(),
      source: z.string().min(1, t('Source is required')),
      status: z.string().min(1, t('Status is required')),
    },

    form: {
      fields: [
        {
          name: 'from_path',
          label: t('From Path'),
          type: 'text',
          placeholder: '/old-services/cloud',
          description: t('The path visitors still request. Leading slash included.'),
          required: true,
          section: 'basic',
        },
        {
          name: 'to_path',
          label: t('To Path'),
          type: 'text',
          placeholder: '/services/cloud-engineering',
          description: t('Where they should land instead'),
          required: true,
          section: 'basic',
        },
        {
          name: 'status_code',
          label: t('Status Code'),
          type: 'select',
          description: t('301 is permanent and cached by browsers; 302 is temporary'),
          required: true,
          options: statusCodeOptions,
          section: 'grid',
        },
        {
          name: 'source',
          label: t('Source'),
          type: 'select',
          description: t('How this redirect came to exist'),
          required: true,
          options: sources,
          section: 'grid',
        },
        {
          name: 'is_regex',
          label: t('Regular Expression'),
          type: 'switch',
          description: t('Treat the source path as a pattern rather than a literal'),
          required: false,
          section: 'grid',
        },
        {
          name: 'preserve_query',
          label: t('Preserve Query String'),
          type: 'switch',
          description: t('Carry ?utm_source and friends across to the destination'),
          required: false,
          defaultValue: true,
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
        { label: t('Redirects'), href: null, active: true },
      ],
      create: [...baseBreadcrumbs, { label: t('Create'), href: null, active: true }],
      update: [...baseBreadcrumbs, { label: t('Update'), href: null, active: true }],
    },

    table: {
      selectable: false,
      searchable: true,
      serializable: true,
      searchPlaceholder: t('Search redirects by source or destination path'),
      sortable: false,
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No redirects yet. One is created for you whenever a live page changes its slug.'),
      emptyMessageIcon: Signpost,

      columns: [
        {
          key: 'from_path',
          label: t('From'),
          sortable: false,
          filterable: true,
          priority: 0,
          render: (row: CmsRedirect) => (
            <div className="flex items-center gap-2 min-w-0">
              <code className="text-xs break-all text-foreground">{row.from_path}</code>
              {row.is_regex ? (
                <Badge variant="outline" className="shrink-0">
                  {t('regex')}
                </Badge>
              ) : null}
            </div>
          ),
        },
        {
          key: 'to_path',
          label: t('To'),
          sortable: false,
          filterable: true,
          priority: 1,
          render: (row: CmsRedirect) => (
            <code className="text-xs break-all text-muted-foreground">{row.to_path}</code>
          ),
        },
        {
          key: 'status_code',
          label: t('Code'),
          sortable: false,
          priority: 2,
          render: (row: CmsRedirect) => (
            <Badge variant={row.status_code === 301 ? 'default' : 'outline'}>
              {row.status_code}
            </Badge>
          ),
        },
        {
          key: 'source',
          label: t('Source'),
          sortable: false,
          priority: 4,
          render: (row: CmsRedirect) => (
            <span className="inline-flex items-center gap-1 text-xs capitalize text-muted-foreground">
              {row.is_automatic ? (
                <Bot className="w-3 h-3" aria-label={t('Created automatically')} />
              ) : null}
              {String(row.source ?? '').replace(/_/g, ' ')}
            </span>
          ),
        },
        {
          key: 'hits',
          label: t('Hits'),
          sortable: false,
          priority: 5,
          render: (row: CmsRedirect) => (
            <div className="text-xs tabular-nums text-muted-foreground">
              <div>{row.hits ?? 0}</div>
              {/* No last hit on an old redirect is the signal it can go. */}
              {row.last_hit_at ? <div className="opacity-70">{row.last_hit_at}</div> : null}
            </div>
          ),
        },
        {
          key: 'status',
          label: t('Status'),
          sortable: false,
          priority: 3,
          render: (row: CmsRedirect) => (
            <div className="mt-1.5">
              <StatusBadge status={row.status} />
            </div>
          ),
        },
      ],
    },

    filters: {
      searchFields: ['from_path', 'to_path'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        create: 'redirect.create',
        edit: 'redirect.edit',
        view: 'redirect.view',
        delete: 'redirect.delete',
        restore: 'redirect.restore',
        permanentDelete: 'redirect.force-delete',
      },
    },

    destroyDialogConfig: {
      title: t('Delete Redirect'),
      description: t('Are you sure you want to delete this redirect?'),
      itemName: { label: t('From Path'), key: 'from_path', render: (path: string) => path },
      itemType: 'Redirect',
      warningMessage: t('Anyone still following the old URL will get a 404 instead.'),
      showWarningAlert: true,
      showItemDetails: true,
      itemDisplayFields: [
        { label: t('From'), key: 'from_path', className: 'font-semibold' },
        { label: t('To'), key: 'to_path', className: 'text-muted-foreground' },
        { label: t('Hits'), key: 'hits', className: 'text-muted-foreground' },
        { label: t('Last Hit'), key: 'last_hit_at', className: 'text-muted-foreground' },
      ],
    },

    labels: { singular: 'Redirect', plural: 'Redirects' },

    saveAlertInfo: {
      title: t('Redirect'),
      description: t('Use 301 when the move is permanent — browsers cache it aggressively, so a mistaken 301 is hard to undo.'),
    },

    stats: [
      {
        key: 'total',
        title: t('Total Redirects'),
        icon: Signpost,
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100 dark:bg-blue-900',
        description: t('All redirects'),
      },
      {
        key: 'automatic',
        title: t('Automatic'),
        icon: Bot,
        iconColor: 'text-purple-600',
        iconBgColor: 'bg-purple-100 dark:bg-purple-900',
        description: t('Created by a slug change'),
      },
      {
        key: 'unused',
        title: t('Never Hit'),
        icon: ArrowRightLeft,
        iconColor: 'text-amber-600',
        iconBgColor: 'bg-amber-100 dark:bg-amber-900',
        description: t('Candidates for cleanup'),
      },
    ],
  };
}
