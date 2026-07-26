import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  Mail,
  Send
} from 'lucide-react';

import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import { useTranslations } from '@/Hooks/useTranslations';
import { Badge } from '@/Components/UI/Badge';
import { formatNumber, limitText } from '@/Utils/helpers';
import { ViewNotificationLogDetails } from '@/Components/Feature/Backend/NotificationLog/ViewNotificationLogDetails';

export function useNotificationLogConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations();

  const modelProperty        = props?.modelProperty;
  const advanceFilterOptions = props?.advanceFilterOptions || [];
  const routePrefix          = modelProperty?.routePrefix;

  const baseBreadcrumbs = [
    { label: t('Dashboard'), href: route('backend.dashboard') },
    { label: t('Notification Logs'), href: route(`${routePrefix}.index`) },
  ];

  return {
    resource: 'notification-log',
    resourcePlural: 'notification-logs',
    title: t('Notification Logs'),
    description: t('View and manage notification history and logs'),

    routes: {
      index: `${routePrefix}.index`,
      show: `${routePrefix}.show`,
      destroy: `${routePrefix}.destroy`,
    },

    viewDisplayMode: 'modal',
    viewDialogConfig: {
      size: 'xl',
      showStats: true,
      title: t('View'),
      description: t('Notification details and status'),
      viewComponent: ViewNotificationLogDetails,
    },

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Notification Logs'), href: null, active: true },
      ],
    },

    table: {
      selectable: false,
      searchable: true,
      sortable: true,
      serializable: false,
      searchPlaceholder: t('Search by module, message...'),
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No notification logs available.'),
      emptyMessageIcon: Bell,

      columns: [
       
        {
          key: 'receiver',
          label: t('Receiver'),
          sortable: false,
          filterable: false,
          priority: 1,
          render: (row: any) => (
            <div className="text-sm text-gray-900 dark:text-gray-100">
             
              
              {row.receiver?.email ? (
                row.receiver.email
              ): '--'}
            </div>
          ),
        },
        {
          key: 'subject',
          label: t('Subject'),
          sortable: false,
          filterable: false,
          priority: 2,
          render: (row: any) => (
            <div className="max-w-xs">
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {limitText(row.subject, 15)}
              </p>
            </div>
          ),
        },
        {
          key: 'message',
          label: t('Message'),
          sortable: false,
          filterable: false,
          priority: 2,
          render: (row: any) => (
            <div className="max-w-xs">
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {limitText(row.message, 30)}
              </p>
            </div>
          ),
        },
        {
          key: 'channel',
          label: t('Channel'),
          sortable: false,
          filterable: false,
          priority: 2,
          render: (row: any) => (
            <div className="flex items-center gap-2">
              {row.channel === 'email' ? (
                <Mail className="w-4 h-4 text-blue-600" />
              ) : (
                <Send className="w-4 h-4 text-green-600" />
              )}
              <span className="text-sm capitalize">{row.channel}</span>
            </div>
          ),
        },
        {
          key: 'status',
          label: t('Status'),
          sortable: false,
          filterable: true,
          priority: 1,
          render: (row: any) => {
            const statusVariants: Record<string, any> = {
              processing: {
                variant: 'default',
                className: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
                icon: Loader,
              },
              success: {
                variant: 'default',
                className: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
                icon: CheckCircle,
              },
              failed: {
                variant: 'destructive',
                className: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
                icon: AlertCircle,
              },
            };

            const status = statusVariants[row.status] || statusVariants.failed;
            const Icon   = status.icon;

            return (
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <Badge variant={status.variant} className={`text-xs ${status.className}`}>
                  {row.status.toUpperCase()}
                </Badge>
              </div>
            );
          },
        },
        {
          key: 'created_at',
          label: t('Sent At'),
          sortable: false,
          priority: 3,
          renderType: 'date',
        },
      ],
    },

    stats: [
      {
        key: 'total',
        title: t('Total Notifications'),
        icon: Bell,
        iconColor: 'text-purple-600',
        iconBgColor: 'bg-purple-100 dark:bg-purple-900',
        description: t('All notification records'),
      },
      {
        key: 'processing',
        title: t('Processing'),
        icon: Loader,
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100 dark:bg-blue-900',
        description: t('Currently processing'),
      },
      {
        key: 'success',
        title: t('Success'),
        icon: CheckCircle,
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100 dark:bg-green-900',
        description: t('Successfully sent'),
      },
      {
        key: 'failed',
        title: t('Failed'),
        icon: AlertCircle,
        iconColor: 'text-red-600',
        iconBgColor: 'bg-red-100 dark:bg-red-900',
        description: t('Failed notifications'),
      },
    ],

    filters: {
      searchFields: ['message'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        view: 'notification-log.view',
        delete: 'notification-log.delete',
      },
    },

    labels: {
      singular: 'Notification Log',
      plural: 'Notification Logs',
      key: 'notification-log',
    },
  };
}