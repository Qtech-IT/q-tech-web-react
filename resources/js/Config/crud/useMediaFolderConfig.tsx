import { Folder, FolderTree, Images } from 'lucide-react';

import CmsSaveForm from '@/Components/Forms/Backend/Cms/CmsSaveForm';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsMediaFolder, CmsOption } from '@/Types/cms';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import { unwrapList } from '@/Utils/cms';
import z from 'zod';

/**
 * The media library's folder tree.
 *
 * Display mode is `modal` deliberately: `MediaFolderController` exposes only
 * index/store/update/destroy. `Route::resources()` still generates the
 * `create` and `edit` URLs, but there are no controller methods behind them —
 * a page-mode form would navigate straight into a 500.
 *
 * Renaming or reparenting rewrites `path` and `depth` for the entire subtree
 * in one transaction, so the tree cannot end up half-migrated.
 */
export function useMediaFolderConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations();

  const modelProperty = props?.modelProperty;
  const routePrefix: string = modelProperty?.routePrefix ?? 'backend.media-folders';

  const folders = unwrapList<CmsMediaFolder>(props?.data);
  const advanceFilterOptions = props?.advanceFilterOptions ?? [];

  /**
   * Parent options, indented by depth so the hierarchy is legible in a flat
   * select. A folder may not be its own parent, but the *descendant* check
   * lives on the server — the client cannot see rows outside this page.
   */
  const parentOptions: CmsOption[] = [
    { value: '', label: t('— No parent (top level) —') },
    ...folders.map((folder) => ({
      value: folder.id,
      label: `${'— '.repeat(Math.max(0, folder.depth))}${folder.name}`,
    })),
  ];

  return {
    formComponent: CmsSaveForm,
    resource: 'media-folder',
    resourcePlural: 'media-folders',
    title: t('Media Folders'),
    description: t('Organise the media library into a tree'),
    fetchToggle: false,

    routes: {
      index: `${routePrefix}.index`,
      store: `${routePrefix}.store`,
      update: `${routePrefix}.update`,
      destroy: `${routePrefix}.destroy`,
    },

    formDisplayMode: 'modal',
    viewDisplayMode: 'modal',
    statusType: 'binary',

    /** Mirrors `FolderSaveRequest::rules()`. */
    formValidationRules: {
      name: z
        .string()
        .min(1, t('Name is required'))
        .max(191, t('Name must not exceed 191 characters')),

      slug: z
        .string()
        .max(191, t('Slug must not exceed 191 characters'))
        .optional()
        .nullable(),

      parent_id: z.any().optional().nullable(),
      sort_order: z.any().optional(),
    },

    form: {
      title: { create: t('Create Folder'), edit: t('Rename Folder') },
      description: {
        create: t('Folders group assets in the media library. They do not affect public URLs.'),
        edit: t('Renaming or moving a folder rewrites the path of everything beneath it.'),
      },
      submitButtonText: { create: t('Create Folder'), edit: t('Save Folder') },

      fields: [
        {
          name: 'name',
          label: t('Name'),
          type: 'text',
          placeholder: t('e.g., Case Study Imagery'),
          required: true,
          section: 'basic',
        },
        {
          name: 'slug',
          label: t('Slug'),
          type: 'text',
          placeholder: t('Leave blank to generate from the name'),
          required: false,
          section: 'grid',
        },
        {
          name: 'parent_id',
          label: t('Parent Folder'),
          type: 'select',
          description: t('Leave empty to place the folder at the top level'),
          required: false,
          options: parentOptions,
          isClearable: true,
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
      ],
    },

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Media Folders'), href: null, active: true },
      ],
    },

    table: {
      selectable: false,
      searchable: true,
      serializable: true,
      searchPlaceholder: t('Search folders by name'),
      sortable: false,
      defaultSort: 'path',
      defaultSortDirection: 'asc',
      emptyMessage: t('No folders yet. Everything currently lives at the library root.'),
      emptyMessageIcon: FolderTree,

      columns: [
        {
          key: 'name',
          label: t('Name'),
          sortable: false,
          filterable: true,
          priority: 0,
          render: (row: CmsMediaFolder) => (
            <div
              className="flex items-center gap-2 min-w-0"
              /* Indentation is the only cue that this flat table is a tree. */
              style={{ paddingInlineStart: `${Math.max(0, row.depth) * 1.25}rem` }}
            >
              <Folder className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium truncate text-foreground">{row.name}</span>
            </div>
          ),
        },
        {
          key: 'path',
          label: t('Path'),
          sortable: false,
          filterable: true,
          priority: 1,
          render: (row: CmsMediaFolder) => (
            <code className="text-xs break-all text-muted-foreground">{row.path || '/'}</code>
          ),
        },
        {
          key: 'media_count',
          label: t('Assets'),
          sortable: false,
          priority: 2,
          render: (row: CmsMediaFolder) => (
            <span className="text-sm tabular-nums text-muted-foreground">
              {row.media_count ?? 0}
            </span>
          ),
        },
        {
          key: 'created_at',
          label: t('Created'),
          sortable: false,
          priority: 4,
          renderType: 'date',
        },
      ],
    },

    filters: {
      searchFields: ['name', 'path'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        create: 'folder.create',
        edit: 'folder.edit',
        view: 'folder.view',
        delete: 'folder.delete',
        restore: 'folder.restore',
        permanentDelete: 'folder.force-delete',
      },
    },

    destroyDialogConfig: {
      title: t('Delete Folder'),
      description: t('Are you sure you want to delete this folder?'),
      itemName: { label: t('Name'), key: 'name', render: (name: string) => name },
      itemType: 'Folder',
      warningMessage: t('Assets inside are not deleted — they return to the library root.'),
      showWarningAlert: true,
      showItemDetails: true,
      itemDisplayFields: [
        { label: t('Name'), key: 'name', className: 'font-semibold' },
        { label: t('Path'), key: 'path', className: 'text-muted-foreground' },
        { label: t('Assets'), key: 'media_count', className: 'text-muted-foreground' },
      ],
    },

    labels: { singular: 'Folder', plural: 'Folders' },

    stats: [
      {
        key: 'total',
        title: t('Total Folders'),
        icon: FolderTree,
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100 dark:bg-blue-900',
        description: t('All folders'),
      },
      {
        key: 'assets',
        title: t('Assets'),
        icon: Images,
        iconColor: 'text-purple-600',
        iconBgColor: 'bg-purple-100 dark:bg-purple-900',
        description: t('Files in the library'),
      },
    ],
  };
}
