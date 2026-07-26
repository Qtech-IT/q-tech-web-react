import { 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Trash2,
  Calendar,
  MoreVertical
} from 'lucide-react';

import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import { useTranslations } from '@/Hooks/useTranslations';
import { Badge } from '@/Components/UI/Badge';
import { formatNumber, limitText } from '@/Utils/helpers';
import { ViewFailedJobDetails } from '@/Components/Feature/Backend/FailedJob/ViewFailedJobDetails';

export function useFailedJobConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations();

  const modelProperty        = props?.modelProperty;
  const advanceFilterOptions = props?.advanceFilterOptions || [];
  const routePrefix          = modelProperty?.routePrefix;

  return {
    resource: 'failed-job',
    resourcePlural: 'failed-jobs',
    title: t('Failed Jobs'),
    description: t('Monitor and retry failed jobs'),

    routes: {
      index: `${routePrefix}.index`,
      show: `${routePrefix}.show`,
      destroy: `${routePrefix}.destroy`,
    },

    viewDisplayMode: 'modal',
    viewDialogConfig: {
      size: 'xl',
      title: t('View Failed Job'),
      description: t('Failed job details and exception'),
      viewComponent: ViewFailedJobDetails,
    },

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Failed Jobs'), href: null, active: true },
      ],
    },

    table: {
      selectable: false,
      searchable: true,
      sortable: true,
      serializable: true,
      searchPlaceholder: t('Search by queue, exception...'),
      defaultSort: 'failed_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No failed jobs found.'),
      emptyMessageIcon: XCircle,

      columns: [
        {
          key: 'command_name',
          label: t('Job Name'),
          sortable: false,
          filterable: false,
          priority: 0,
          render: (row: any) => (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div>
                <div className="font-medium text-sm">{row.command_name}</div>
                <div className="text-xs text-gray-500">UUID: {limitText(row.uuid, 20)}</div>
              </div>
            </div>
          ),
        },
        {
          key: 'queue',
          label: t('Queue'),
          sortable: false,
          filterable: true,
          priority: 1,
          render: (row: any) => (
            <Badge variant="outline" className="capitalize">
              {row.queue}
            </Badge>
          ),
        },
        {
          key: 'connection',
          label: t('Connection'),
          sortable: false,
          filterable: true,
          priority: 2,
          render: (row: any) => (
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {row.connection}
            </span>
          ),
        },
        {
          key: 'exception_message',
          label: t('Error'),
          sortable: false,
          filterable: false,
          priority: 1,
          render: (row: any) => (
            <div className="max-w-md">
              <p className="text-sm text-red-600 dark:text-red-400 line-clamp-2">
                {limitText(row.exception_message, 60)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {row.exception_class}
              </p>
            </div>
          ),
        },
        {
          key: 'failed_at',
          label: t('Failed At'),
          sortable: false,
          priority: 3,
          renderType: 'date',
        },
      ],

      customActionSubmenus: [
          {
            key: 'job_action',
            title: 'Job Actions',
            icon: MoreVertical,
            type: 'route',
            permission:'job.run',
            actions: [
              {
                key: 'retry_job',
                label: t('Retry'),
                icon: RefreshCw,
                iconColor: 'text-blue-600',
                permission:'job.retry',
                route:  `${routePrefix}.retry`,
                routeParams: (item: any) => ({ failedJob: item.id}),
                target: '_self', 
              },
             
            ],
          },

      ],   
    },

    stats: [
      {
        key: 'total',
        title: t('Total Failed'),
        icon: XCircle,
        iconColor: 'text-red-600',
        iconBgColor: 'bg-red-100 dark:bg-red-900',
        description: t('All failed jobs'),
      },
      {
        key: 'today',
        title: t('Today'),
        icon: Calendar,
        iconColor: 'text-orange-600',
        iconBgColor: 'bg-orange-100 dark:bg-orange-900',
        description: t('Failed today'),
      },
      {
        key: 'this_week',
        title: t('This Week'),
        icon: Calendar,
        iconColor: 'text-yellow-600',
        iconBgColor: 'bg-yellow-100 dark:bg-yellow-900',
        description: t('Failed this week'),
      },
      {
        key: 'this_month',
        title: t('This Month'),
        icon: Calendar,
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100 dark:bg-blue-900',
        description: t('Failed this month'),
      },
    ],

    filters: {
      searchFields: ['queue', 'exception', 'payload'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        view: 'job.view',
        delete: 'job.delete',
      },
    },

    labels: {
      singular: 'Failed Job',
      plural: 'Failed Jobs',
      key: 'failed-job',
    },
  };
}