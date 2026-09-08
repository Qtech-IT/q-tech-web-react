import { Archive, Inbox, Mail, MailCheck, MailOpen, ShieldAlert } from 'lucide-react';

import { Badge } from '@/Components/UI/Badge';
import { ViewContactSubmissionDetails } from '@/Components/Feature/Backend/Marketing/ViewContactSubmissionDetails';
import { useTranslations } from '@/Hooks/useTranslations';
import { limitText } from '@/Utils/helpers';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';

type StatusStyle = { className: string; icon: typeof Mail }

const STATUS_STYLES: Record<string, StatusStyle> = {
  new: {
    className:
      'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    icon: Inbox,
  },
  read: {
    className:
      'bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    icon: MailOpen,
  },
  replied: {
    className:
      'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
    icon: MailCheck,
  },
  archived: {
    className:
      'bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    icon: Archive,
  },
  spam: {
    className:
      'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
    icon: ShieldAlert,
  },
}

export function useContactSubmissionConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations()

  const modelProperty = props?.modelProperty
  const advanceFilterOptions = props?.advanceFilterOptions || []
  const routePrefix = modelProperty?.routePrefix

  return {
    resource: 'contact-submission',
    resourcePlural: 'contact-submissions',
    title: t('Contact Enquiries'),
    description: t('Enquiries submitted from the contact page'),

    routes: {
      index: `${routePrefix}.index`,
      update: `${routePrefix}.update`,
      destroy: `${routePrefix}.destroy`,
      bulkAction: `${routePrefix}.bulk.action`,
    },

    viewDisplayMode: 'modal',
    viewDialogConfig: {
      size: 'xl',
      showStats: false,
      title: t('Enquiry'),
      description: t('Contact enquiry details'),
      viewComponent: ViewContactSubmissionDetails,
    },

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Contact Enquiries'), href: null, active: true },
      ],
    },

    table: {
      selectable: true,
      searchable: true,
      sortable: true,
      serializable: false,
      searchPlaceholder: t('Search by name, email, company…'),
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No enquiries yet.'),
      emptyMessageIcon: Inbox,

      bulkActions: [{ key: 'delete', permission: 'contact-submission.delete' }],

      columns: [
        {
          key: 'name',
          label: t('From'),
          sortable: false,
          priority: 1,
          render: (row: any) => (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {row.name}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
            </div>
          ),
        },
        {
          key: 'company',
          label: t('Company'),
          sortable: false,
          priority: 3,
          render: (row: any) => (
            <span className="text-sm text-gray-700 dark:text-gray-300">{row.company || '—'}</span>
          ),
        },
        {
          key: 'message',
          label: t('Message'),
          sortable: false,
          priority: 2,
          render: (row: any) => (
            <p className="max-w-sm text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
              {limitText(row.message, 90)}
            </p>
          ),
        },
        {
          key: 'handling_status',
          label: t('Status'),
          sortable: false,
          filterable: true,
          priority: 1,
          render: (row: any) => {
            const style: StatusStyle = STATUS_STYLES[row.handling_status] ?? {
              className: STATUS_STYLES.new!.className,
              icon: Inbox,
            }
            const Icon = style.icon

            return (
              <Badge variant="outline" className={`gap-1.5 text-xs ${style.className}`}>
                <Icon className="h-3.5 w-3.5" />
                {row.handling_status_label ?? row.handling_status}
              </Badge>
            )
          },
        },
        {
          key: 'created_at',
          label: t('Received'),
          sortable: false,
          priority: 3,
          renderType: 'date',
        },
      ],
    },

    stats: [
      {
        key: 'total',
        title: t('Total'),
        icon: Mail,
        iconColor: 'text-purple-600',
        iconBgColor: 'bg-purple-100 dark:bg-purple-900',
        description: t('All enquiries'),
      },
      {
        key: 'new',
        title: t('New'),
        icon: Inbox,
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100 dark:bg-blue-900',
        description: t('Not yet opened'),
      },
      {
        key: 'replied',
        title: t('Replied'),
        icon: MailCheck,
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100 dark:bg-green-900',
        description: t('Marked replied'),
      },
      {
        key: 'this_week',
        title: t('This Week'),
        icon: MailOpen,
        iconColor: 'text-amber-600',
        iconBgColor: 'bg-amber-100 dark:bg-amber-900',
        description: t('Last 7 days'),
      },
    ],

    filters: {
      searchFields: ['name', 'email', 'company', 'message'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        view: 'contact-submission.view',
        delete: 'contact-submission.delete',
      },
    },

    labels: {
      singular: 'Enquiry',
      plural: 'Enquiries',
      key: 'contact-submission',
    },
  }
}
