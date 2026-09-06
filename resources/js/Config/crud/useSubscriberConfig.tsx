import { MailX, Users, UserCheck, UserMinus } from 'lucide-react';

import { Badge } from '@/Components/UI/Badge';
import { ViewSubscriberDetails } from '@/Components/Feature/Backend/Marketing/ViewSubscriberDetails';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';

const CONSENT_STYLES: Record<string, string> = {
  subscribed:
    'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
  pending:
    'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  unsubscribed:
    'bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  bounced:
    'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
}

export function useSubscriberConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations()

  const modelProperty = props?.modelProperty
  const advanceFilterOptions = props?.advanceFilterOptions || []
  const routePrefix = modelProperty?.routePrefix

  return {
    resource: 'subscriber',
    resourcePlural: 'subscribers',
    title: t('Newsletter Subscribers'),
    description: t('People who opted in to the newsletter'),

    routes: {
      index: `${routePrefix}.index`,
      update: `${routePrefix}.update`,
      destroy: `${routePrefix}.destroy`,
      bulkAction: `${routePrefix}.bulk.action`,
    },

    viewDisplayMode: 'modal',
    viewDialogConfig: {
      size: 'lg',
      showStats: false,
      title: t('Subscriber'),
      description: t('Subscriber details and consent record'),
      viewComponent: ViewSubscriberDetails,
    },

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Newsletter Subscribers'), href: null, active: true },
      ],
    },

    table: {
      selectable: true,
      searchable: true,
      sortable: true,
      serializable: false,
      searchPlaceholder: t('Search by email, source…'),
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No subscribers yet.'),
      emptyMessageIcon: Users,

      bulkActions: [
        { key: 'active', permission: 'subscriber.edit' },
        { key: 'inactive', permission: 'subscriber.edit' },
        { key: 'delete', permission: 'subscriber.delete' },
      ],

      columns: [
        {
          key: 'email',
          label: t('Email'),
          sortable: false,
          priority: 1,
          render: (row: any) => (
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.email}</span>
          ),
        },
        {
          key: 'subscription_status',
          label: t('Consent'),
          sortable: false,
          filterable: true,
          priority: 1,
          render: (row: any) => (
            <Badge
              variant="outline"
              className={`text-xs ${CONSENT_STYLES[row.subscription_status] ?? CONSENT_STYLES.pending}`}
            >
              {row.subscription_status_label ?? row.subscription_status}
            </Badge>
          ),
        },
        {
          key: 'source',
          label: t('Source'),
          sortable: false,
          priority: 3,
          render: (row: any) => (
            <span className="text-sm text-gray-600 dark:text-gray-400">{row.source || '—'}</span>
          ),
        },
        {
          key: 'consent_at',
          label: t('Opted In'),
          sortable: false,
          priority: 2,
          renderType: 'date',
        },
      ],
    },

    stats: [
      {
        key: 'total',
        title: t('Total'),
        icon: Users,
        iconColor: 'text-purple-600',
        iconBgColor: 'bg-purple-100 dark:bg-purple-900',
        description: t('All records'),
      },
      {
        key: 'subscribed',
        title: t('Subscribed'),
        icon: UserCheck,
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100 dark:bg-green-900',
        description: t('Currently opted in'),
      },
      {
        key: 'unsubscribed',
        title: t('Unsubscribed'),
        icon: UserMinus,
        iconColor: 'text-slate-600',
        iconBgColor: 'bg-slate-100 dark:bg-slate-800',
        description: t('Opted out'),
      },
      {
        key: 'this_month',
        title: t('This Month'),
        icon: MailX,
        iconColor: 'text-amber-600',
        iconBgColor: 'bg-amber-100 dark:bg-amber-900',
        description: t('New this month'),
      },
    ],

    filters: {
      searchFields: ['email', 'source'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        view: 'subscriber.view',
        delete: 'subscriber.delete',
      },
    },

    labels: {
      singular: 'Subscriber',
      plural: 'Subscribers',
      key: 'subscriber',
    },
  }
}
