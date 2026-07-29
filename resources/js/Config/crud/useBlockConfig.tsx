import { Blocks, Lock } from 'lucide-react';

import { Badge } from '@/Components/UI/Badge';
import CmsSaveForm from '@/Components/Forms/Backend/Cms/CmsSaveForm';
import StatusBadge from '@/Components/UI/StatusBadge';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsBlock, CmsOption, CmsSectionType } from '@/Types/cms';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import { unwrapList } from '@/Utils/cms';
import z from 'zod';

/**
 * Global blocks — reusable section bodies mounted on many pages.
 *
 * A block's *content* is a `page_sections` row with `page_id` NULL, so this
 * screen owns only the block record. Editing the body opens the same section
 * editor the page builder uses, which is why there is no content field here.
 */
export function useBlockConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations();

  const modelProperty = props?.modelProperty;
  const routePrefix: string = modelProperty?.routePrefix ?? 'backend.blocks';

  const sectionTypes = unwrapList<CmsSectionType>(props?.sectionTypes);
  const publishStatuses: CmsOption[] = props?.publishStatuses ?? [];
  const statuses: CmsOption[] = props?.statuses ?? [];
  const advanceFilterOptions = props?.advanceFilterOptions ?? [];

  const sectionTypeOptions: CmsOption[] = sectionTypes.map((type) => ({
    value: type.key,
    label: `${type.group} · ${type.label}`,
  }));

  const baseBreadcrumbs = [
    { label: t('Dashboard'), href: route('backend.dashboard') },
    { label: t('Global Blocks'), href: route(`${routePrefix}.index`) },
  ];

  return {
    formComponent: CmsSaveForm,
    resource: 'block',
    resourcePlural: 'blocks',
    title: t('Global Blocks'),
    description: t('Reusable section bodies that many pages can embed at once'),
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

    /** Mirrors `BlockSaveRequest::rules()`. */
    formValidationRules: {
      key: z
        .string()
        .min(1, t('Key is required'))
        .max(100, t('Key must not exceed 100 characters'))
        .regex(/^[a-z0-9_-]+$/, t('Use lowercase letters, numbers, hyphens and underscores only')),

      name: z
        .string()
        .min(1, t('Name is required'))
        .max(191, t('Name must not exceed 191 characters')),

      description: z
        .string()
        .max(500, t('Description must not exceed 500 characters'))
        .optional()
        .default(''),

      section_type: z.string().min(1, t('Section type is required')),
      status: z.string().min(1, t('Status is required')),
      publish_status: z.string().min(1, t('Publish status is required')),
      published_at: z.any().optional(),
      expires_at: z.any().optional(),
      sort_order: z.any().optional(),
    },

    form: {
      fields: [
        {
          name: 'name',
          label: t('Name'),
          type: 'text',
          placeholder: t('e.g., Global Conversion Band'),
          description: t('Editor-facing name, shown in the block picker'),
          required: true,
          section: 'basic',
        },
        {
          name: 'key',
          label: t('Key'),
          type: 'text',
          placeholder: t('e.g., global-cta-band'),
          description: t('Stable identifier referenced in code and seeders. Must be unique.'),
          required: true,
          section: 'basic',
        },
        {
          name: 'description',
          label: t('Description'),
          type: 'textarea',
          placeholder: t('When should an editor reach for this block?'),
          required: false,
          section: 'basic',
        },
        {
          name: 'section_type',
          label: t('Section Type'),
          type: 'select',
          description: t('Determines which fields the block body exposes'),
          required: true,
          options: sectionTypeOptions,
          section: 'grid',
        },
        {
          name: 'sort_order',
          label: t('Order'),
          type: 'number',
          placeholder: '0',
          required: false,
          min: 0,
          section: 'grid',
        },
        {
          name: 'publish_status',
          label: t('Publish Status'),
          type: 'select',
          required: true,
          options: publishStatuses,
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
        {
          name: 'published_at',
          label: t('Publish At'),
          type: 'datetime-local',
          required: false,
          section: 'grid',
        },
        {
          name: 'expires_at',
          label: t('Expires At'),
          type: 'datetime-local',
          required: false,
          section: 'grid',
        },
      ],
    },

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Global Blocks'), href: null, active: true },
      ],
      create: [...baseBreadcrumbs, { label: t('Create'), href: null, active: true }],
      update: [...baseBreadcrumbs, { label: t('Update'), href: null, active: true }],
    },

    table: {
      selectable: false,
      searchable: true,
      serializable: true,
      searchPlaceholder: t('Search blocks by name or key'),
      sortable: false,
      defaultSort: 'sort_order',
      defaultSortDirection: 'asc',
      emptyMessage: t('No global blocks yet. Create one to reuse a section across pages.'),
      emptyMessageIcon: Blocks,

      columns: [
        {
          key: 'name',
          label: t('Name'),
          sortable: false,
          filterable: true,
          priority: 0,
          render: (row: CmsBlock) => (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium truncate text-foreground">{row.name}</span>
              {row.is_locked ? (
                <Lock
                  className="w-3.5 h-3.5 shrink-0 text-muted-foreground"
                  aria-label={t('Locked — required by a template')}
                />
              ) : null}
            </div>
          ),
        },
        {
          key: 'key',
          label: t('Key'),
          sortable: false,
          filterable: true,
          priority: 1,
          render: (row: CmsBlock) => (
            <code className="text-xs text-muted-foreground">{row.key}</code>
          ),
        },
        {
          key: 'type_label',
          label: t('Section Type'),
          sortable: false,
          priority: 2,
          render: (row: CmsBlock) => (
            <span className="text-sm text-muted-foreground">
              {row.type_label ?? row.section_type}
            </span>
          ),
        },
        {
          key: 'usages_count',
          label: t('Used On'),
          sortable: false,
          priority: 4,
          render: (row: CmsBlock) => (
            <span className="text-sm tabular-nums text-muted-foreground">
              {t(':count pages', { count: row.usages_count ?? 0 })}
            </span>
          ),
        },
        {
          key: 'publish_status',
          label: t('Publishing'),
          sortable: false,
          priority: 3,
          render: (row: CmsBlock) => (
            <Badge variant="outline" className="capitalize">
              {String(row.publish_status ?? '').replace(/_/g, ' ') || '—'}
            </Badge>
          ),
        },
        {
          key: 'status',
          label: t('Status'),
          sortable: false,
          priority: 5,
          render: (row: CmsBlock) => (
            <div className="mt-1.5">
              <StatusBadge status={row.status} />
            </div>
          ),
        },
      ],

    },

    filters: {
      searchFields: ['name', 'key'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        create: 'block.create',
        edit: 'block.edit',
        view: 'block.view',
        delete: 'block.delete',
        restore: 'block.restore',
        permanentDelete: 'block.force-delete',
      },
    },

    actionConstraints: {
      delete: [
        {
          field: 'is_deleteable',
          checkValue: false,
          message: t('Locked blocks are required by a template and cannot be deleted'),
        },
      ],
    },

    destroyDialogConfig: {
      title: t('Delete Global Block'),
      description: t('Are you sure you want to delete this block?'),
      itemName: { label: t('Name'), key: 'name', render: (name: string) => name },
      itemType: 'Block',
      /**
       * The FK is SET NULL, so deleting does not fail — it silently degrades
       * every embedding section into a local copy. Saying so is the whole
       * reason `usages_count` is on the resource.
       */
      warningMessage: t('Pages embedding this block keep their current copy of the content, but they stop tracking future edits.'),
      showWarningAlert: true,
      showItemDetails: true,
      itemDisplayFields: [
        { label: t('Name'), key: 'name', className: 'font-semibold' },
        { label: t('Key'), key: 'key', className: 'text-muted-foreground' },
        { label: t('Used On'), key: 'usages_count', className: 'text-muted-foreground' },
      ],
    },

    labels: { singular: 'Block', plural: 'Blocks' },

    saveAlertInfo: {
      title: t('Block Settings'),
      description: t('Name and classify the block here. Its content is edited with the same section editor the page builder uses.'),
    },
  };
}
