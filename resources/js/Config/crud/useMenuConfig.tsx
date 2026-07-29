import { ListTree, Lock, Menu as MenuIcon, Network } from 'lucide-react';

import CmsSaveForm from '@/Components/Forms/Backend/Cms/CmsSaveForm';
import StatusBadge from '@/Components/UI/StatusBadge';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsMenu, CmsOption } from '@/Types/cms';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import z from 'zod';

/**
 * The menu record. Its items — and the nested drag-and-drop tree — live in the
 * bespoke menu builder behind the "Edit Items" action.
 */
export function useMenuConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations();

  const modelProperty = props?.modelProperty;
  const routePrefix: string = modelProperty?.routePrefix ?? 'backend.menus';

  const statuses: CmsOption[] = props?.statuses ?? [];
  const advanceFilterOptions = props?.advanceFilterOptions ?? [];

  const baseBreadcrumbs = [
    { label: t('Dashboard'), href: route('backend.dashboard') },
    { label: t('Menus'), href: route(`${routePrefix}.index`) },
  ];

  return {
    formComponent: CmsSaveForm,
    resource: 'menu',
    resourcePlural: 'menus',
    title: t('Menus'),
    description: t('Navigation menus and where they render'),
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

    /** Mirrors `MenuSaveRequest::rules()`. */
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

      location: z
        .string()
        .max(100, t('Location must not exceed 100 characters'))
        .optional()
        .nullable(),

      max_depth: z.coerce
        .number({ message: t('Maximum depth is required') })
        .int()
        .min(1, t('Menus must allow at least one level'))
        .max(5, t('Menus may not nest deeper than five levels')),

      status: z.string().min(1, t('Status is required')),
    },

    form: {
      fields: [
        {
          name: 'name',
          label: t('Name'),
          type: 'text',
          placeholder: t('e.g., Primary Navigation'),
          required: true,
          section: 'basic',
        },
        {
          name: 'key',
          label: t('Key'),
          type: 'text',
          placeholder: t('e.g., header'),
          description: t('Referenced by the layout that renders this menu. Must be unique.'),
          required: true,
          section: 'basic',
        },
        {
          name: 'location',
          label: t('Location'),
          type: 'text',
          placeholder: t('e.g., header-primary'),
          description: t('Optional theme slot this menu occupies'),
          required: false,
          section: 'grid',
        },
        {
          name: 'max_depth',
          label: t('Maximum Depth'),
          type: 'number',
          description: t('How many levels the builder will let editors nest'),
          required: true,
          defaultValue: 3,
          min: 1,
          max: 5,
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
        { label: t('Menus'), href: null, active: true },
      ],
      create: [...baseBreadcrumbs, { label: t('Create'), href: null, active: true }],
      update: [...baseBreadcrumbs, { label: t('Update'), href: null, active: true }],
    },

    table: {
      selectable: false,
      searchable: true,
      serializable: true,
      searchPlaceholder: t('Search menus by name or key'),
      sortable: false,
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No menus yet. Create one to start building navigation.'),
      emptyMessageIcon: MenuIcon,

      columns: [
        {
          key: 'name',
          label: t('Name'),
          sortable: false,
          filterable: true,
          priority: 0,
          render: (row: CmsMenu) => (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium truncate text-foreground">{row.name}</span>
              {row.is_locked ? (
                <Lock
                  className="w-3.5 h-3.5 shrink-0 text-muted-foreground"
                  aria-label={t('Locked — a deleted core menu is a broken site')}
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
          render: (row: CmsMenu) => (
            <code className="text-xs text-muted-foreground">{row.key}</code>
          ),
        },
        {
          key: 'location',
          label: t('Location'),
          sortable: false,
          priority: 4,
          render: (row: CmsMenu) => (
            <span className="text-xs text-muted-foreground">{row.location || '—'}</span>
          ),
        },
        {
          key: 'items_count',
          label: t('Items'),
          sortable: false,
          priority: 2,
          render: (row: CmsMenu) => (
            <span className="text-sm tabular-nums text-muted-foreground">
              {row.items_count ?? 0}
            </span>
          ),
        },
        {
          key: 'max_depth',
          label: t('Max Depth'),
          sortable: false,
          priority: 5,
          render: (row: CmsMenu) => (
            <span className="text-sm tabular-nums text-muted-foreground">{row.max_depth}</span>
          ),
        },
        {
          key: 'status',
          label: t('Status'),
          sortable: false,
          priority: 3,
          render: (row: CmsMenu) => (
            <div className="mt-1.5">
              <StatusBadge status={row.status} />
            </div>
          ),
        },
      ],

      customActionSubmenus: [
        {
          key: 'menu_items',
          title: t('Navigation'),
          icon: ListTree,
          type: 'route',
          permission: 'menu.view',
          actions: [
            {
              key: 'edit_items',
              label: t('Edit Menu Items'),
              icon: Network,
              iconColor: 'text-indigo-600',
              permission: 'menu.view',
              route: `${routePrefix}.items`,
              routeParams: (item: CmsMenu) => ({ menu: item.uuid }),
            },
          ],
        },
      ],
    },

    filters: {
      searchFields: ['name', 'key', 'location'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        create: 'menu.create',
        edit: 'menu.edit',
        view: 'menu.view',
        delete: 'menu.delete',
        restore: 'menu.restore',
        permanentDelete: 'menu.force-delete',
      },
    },

    actionConstraints: {
      delete: [
        {
          field: 'is_deleteable',
          checkValue: false,
          message: t('Core menus cannot be deleted'),
        },
      ],
    },

    destroyDialogConfig: {
      title: t('Delete Menu'),
      description: t('Are you sure you want to delete this menu? All of its items go with it.'),
      itemName: { label: t('Name'), key: 'name', render: (name: string) => name },
      itemType: 'Menu',
      warningMessage: t('Any layout rendering this menu key will fall back to nothing.'),
      showWarningAlert: true,
      showItemDetails: true,
      itemDisplayFields: [
        { label: t('Name'), key: 'name', className: 'font-semibold' },
        { label: t('Key'), key: 'key', className: 'text-muted-foreground' },
        { label: t('Items'), key: 'items_count', className: 'text-muted-foreground' },
      ],
    },

    labels: { singular: 'Menu', plural: 'Menus' },

    saveAlertInfo: {
      title: t('Menu Settings'),
      description: t('These are the menu’s own attributes. Its items are arranged in the menu builder.'),
    },
  };
}
