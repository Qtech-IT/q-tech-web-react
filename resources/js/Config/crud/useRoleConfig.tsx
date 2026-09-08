import {
  Copy,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  ShieldOff,
  User,
} from 'lucide-react';

import RoleSaveForm from '@/Components/Forms/Backend/Roles/RoleSaveForm';
import StatusBadge from '@/Components/UI/StatusBadge';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import React from 'react';
import z from 'zod';

export function useRoleConfig(props: CrudPageProps): CrudConfig {

  const { t } = useTranslations();

  const modelProperty = props?.modelProperty;
  const advanceFilterOptions = props?.advanceFilterOptions || [];
  const roleTypes = props?.roleTypes || [];
  const routePrefix = modelProperty?.routePrefix;

  const baseBreadcrumbs = [
    { label: t('Dashboard'), href: route('backend.dashboard') },
    { label: t('Roles'), href: route(`${routePrefix}.index`) },
  ];


  return {

    formComponent: RoleSaveForm,
    resource: 'role',
    resourcePlural: 'roles',
    title: t('Roles'),
    description: t('Manage user roles and permissions'),
    fetchToggle: false,

    routes: {
      index: `${routePrefix}.index`,
      create: `${routePrefix}.create`,
      edit: `${routePrefix}.edit`,
      store: `${routePrefix}.store`,
      update: `${routePrefix}.update`,
      destroy: `${routePrefix}.destroy`
    },


    formValidationRules: {
      name: z
        .string()
        .min(1, t('Role name is required'))
        .min(3, t('Role name must be at least 3 characters'))
        .max(191, t('Role name must not exceed 191 characters')),

      display_name: z
        .string()
        .min(1, t('Display name is required'))
        .min(2, t('Display name must be at least 2 characters'))
        .max(191, t('Display name must not exceed 191 characters')),

      description: z
        .string()
        .max(500, t('Description must not exceed 500 characters'))
        .optional()
        .default(''),

      status: z.string().min(1, 'Status is required'),

      order_index: z.any().optional()


    },


    formDisplayMode: 'page',
    viewDisplayMode: 'page',
    statusType: 'binary',


    form: {

      fields: [

        {
          name: 'name',
          label: t('Role Name'),
          type: 'text',
          placeholder: t('e.g., Editor, Manager...'),
          required: true,
          description: t('System name for the role'),
          section: 'basic',
        },

        {
          name: 'display_name',
          label: t('Display Name'),
          type: 'text',
          placeholder: t('e.g., Content Editor...'),
          description: t('Friendly name for the role'),
          required: true,
          section: 'basic',
        },

        {
          name: 'description',
          label: t('Description'),
          type: 'textarea',
          placeholder: t('Brief description of the role'),
          required: false,
          section: 'basic',
        },

        {
          name: 'order_index',
          label: t('Order'),
          type: 'number',
          placeholder: t('0'),
          description: t('Display order in lists'),
          required: false,
          min: 0,
          section: 'grid',
        },



        {
          name: 'status',
          label: 'Status',
          type: 'select',
          description: t('Role status'),
          required: true,
          options: [
            {
              value: "active",
              label: t("Active")
            },
            {
              value: "inactive",
              label: t("Inctive")
            },
          ],
          section: 'grid',
        },
      ],

    },


    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Roles'), href: null, active: true },
      ],
      create: [
        ...baseBreadcrumbs,
        { label: t('Create'), href: null, active: true },
      ],
      update: [
        ...baseBreadcrumbs,
        { label: t('Update'), href: null, active: true },
      ],
    },

    table: {
      selectable: false,
      searchable: true,
      serializable: true,
      searchPlaceholder: t('Search by name or display name'),
      sortable: false,
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No roles available. Create your first role to get started.'),
      emptyMessageIcon: Shield,

      columns: [
        {
          key: 'name',
          label: 'Name',
          sortable: false,
          filterable: true,
          priority: 0,
        },
        {
          key: 'display_name',
          label: 'Display Name',
          sortable: false,
          filterable: true,
          priority: 1,
        },
        {
          key: 'guard_name',
          label: t('Guard'),
          sortable: false,
          priority: 2,
        },

        {
          key: 'status',
          label: 'Status',
          sortable: false,
          filterable: false,
          priority: 3,
          render: (row: any) => {
            return (
              <div className="mt-1.5">
                <StatusBadge status={row.status} />
              </div>
            );
          },
        },
        {
          key: 'created_at',
          label: 'Created At',
          sortable: false,
          priority: 5,
          renderType: 'date',
        },
      ],


      customActionSubmenus: [
        {
          key: 'role_actions',
          title: 'Role Actions',
          icon: MoreHorizontal,
          type: 'route',
          permission: 'role.clone',
          actions: [
            {
              key: 'clone_role',
              label: t('Clone Role'),
              icon: Copy,
              iconColor: 'text-emerald-600',
              permission: 'role.clone',
              route: `${routePrefix}.clone`,
              routeParams: (item: any) => ({ id: item.id }),
            },
          ],
        },
      ]

    },

    stats: [
      {
        key: 'total',
        title: 'Total Roles',
        icon: Shield,
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100 dark:bg-blue-900',
        description: 'All roles in system'
      },
      {
        key: 'active',
        title: 'Active',
        icon: ShieldCheck,
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100 dark:bg-green-900',
        description: 'Active roles'
      },
      {
        key: 'inactive',
        title: 'Inactive',
        icon: ShieldOff,
        iconColor: 'text-red-600',
        iconBgColor: 'bg-red-100 dark:bg-red-900',
        description: 'Inactive roles'
      },

      {
        key: 'assigned',
        title: 'Assignd roles',
        icon: User,
        iconColor: 'text-red-600',
        iconBgColor: 'bg-red-100 dark:bg-red-900',
        description: 'Role with users'
      },
    ],

    filters: {
      searchFields: ['name', 'display_name'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        create: 'role.create',
        edit: 'role.edit',
        delete: 'role.delete'
      },
    },

    destroyDialogConfig: {
      title: t('Delete Role'),
      description: t('Are you sure you want to delete this role? This action cannot be undone.'),
      itemName: {
        label: t('Role Name'),
        key: 'name',
        render: (name: string) => name
      },
      itemType: 'Role',
      warningMessage: t('Deleting this role will remove it from all users and cannot be recovered.'),
      showWarningAlert: true,
      showItemDetails: true,
      itemDisplayFields: [
        {
          label: t('Role Name'),
          key: 'name',
          className: 'font-semibold text-gray-900 dark:text-gray-100'
        },
        {
          label: t('Display Name'),
          key: 'display_name',
          className: 'text-gray-600 dark:text-gray-400'
        },
        {
          label: t('Guard'),
          key: 'guard_name',
          className: 'text-gray-600 dark:text-gray-400'
        },
        {
          label: t('Permissions'),
          key: 'total_permissions',
          className: 'text-gray-600 dark:text-gray-400'
        },
        {
          label: t('Status'),
          key: 'status',
          render: (status: string) => React.createElement(
            'span',
            {
              className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`
            },
            status
          )
        },
        {
          label: t('Created'),
          key: 'created_at',
          className: 'text-gray-600 dark:text-gray-400'
        }
      ]
    },

    labels: {
      singular: 'Role',
      plural: 'Roles',
    },

    saveAlertInfo: {
      title: t('Role Configuration'),
      description: t('Fill in the details below to save the role. All fields marked as required must be completed.'),
    }
  }
}