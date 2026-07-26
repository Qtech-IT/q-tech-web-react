import { 
  Layers, 
  Clock, 
  RefreshCw,
  Loader,
  Activity,
  WifiSyncIcon,
  RouteIcon,
  Play,
  MoreVertical
} from 'lucide-react';

import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import { useTranslations } from '@/Hooks/useTranslations';
import { Badge } from '@/Components/UI/Badge';
import { ViewJobDetails } from '@/Components/Feature/Backend/Job/ViewJobDetails';

export function useJobConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations();

  const modelProperty        = props?.modelProperty;
  const advanceFilterOptions = props?.advanceFilterOptions || [];
  const routePrefix          = modelProperty?.routePrefix;

  return {
    resource: 'job',
    resourcePlural: 'jobs',
    title: t('Jobs'),
    description: t('Monitor and manage queued jobs'),

    routes: {
      index: `${routePrefix}.index`,
      show: `${routePrefix}.show`,
      destroy: `${routePrefix}.destroy`,
    },

    viewDisplayMode: 'modal',
    viewDialogConfig: {
      size: 'xl',
      title: t('View Job'),
      description: t('Job details and payload'),
      viewComponent: ViewJobDetails,
    },

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Jobs'), href: null, active: true },
      ],
    },

    table: {
      selectable: false,
      searchable: true,
      sortable: true,
      serializable: false,
      searchPlaceholder: t('Search by queue, job name...'),
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No jobs in queue.'),
      emptyMessageIcon: Layers,

      columns: [
        {
          key: 'command_name',
          label: t('Job Name'),
          sortable: false,
          filterable: false,
          priority: 0,
          render: (row: any) => (
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium text-sm">{row.command_name}</div>
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
          key: 'attempts',
          label: t('Attempts'),
          sortable: false,
          filterable: false,
          priority: 2,
          render: (row: any) => (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 text-gray-500" />
              <span className="text-sm">{row.attempts}</span>
            </div>
          ),
        },
        {
          key: 'reserved_at',
          label: t('Reserved At'),
          sortable: false,
          priority: 3,
          render: (row: any) => (
            <div className="text-sm">
              {row.reserved_at ? (
                <span className="text-yellow-600 dark:text-yellow-400">
                  {row.reserved_at}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
          ),
        },
        {
          key: 'available_at',
          label: t('Available At'),
          sortable: false,
          priority: 3,
          renderType: 'date',
        },
        {
          key: 'created_at',
          label: t('Created At'),
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
                key: 'run_job',
                label: t('Run'),
                icon: Play,
                iconColor: 'text-blue-600',
                permission:'job.run',
                route:  `${routePrefix}.run`,
                visible: (item: any) => !item.reserved_at,
                routeParams: (item: any) => ({ job: item.id}),
                target: '_self', 
              },
             
            ],
          },

      ],

     


    },

    stats: [
      {
        key: 'total',
        title: t('Total Jobs'),
        icon: Layers,
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100 dark:bg-blue-900',
        description: t('All queued jobs'),
      },
      {
        key: 'default',
        title: t('Default Queue'),
        icon: Activity,
        iconColor: 'text-purple-600',
        iconBgColor: 'bg-purple-100 dark:bg-purple-900',
        description: t('Jobs in default queue'),
      },
      {
        key: 'high',
        title: t('High Priority'),
        icon: Clock,
        iconColor: 'text-orange-600',
        iconBgColor: 'bg-orange-100 dark:bg-orange-900',
        description: t('High priority queue'),
      },
      {
        key: 'low',
        title: t('Low Priority'),
        icon: Loader,
        iconColor: 'text-gray-600',
        iconBgColor: 'bg-gray-100 dark:bg-gray-900',
        description: t('Low priority queue'),
      },
    ],

    filters: {
      searchFields: ['queue', 'payload'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        view: 'job.view',
        delete: 'job.delete',
      },
    },

    labels: {
      singular: 'Job',
      plural: 'Jobs',
      key: 'job',
    },
  };
}