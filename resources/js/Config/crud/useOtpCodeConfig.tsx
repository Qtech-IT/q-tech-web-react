import { Badge } from '@/Components/UI/Badge';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import { Check, Copy, KeyRound, User } from 'lucide-react';
import { useState } from 'react';

export function useOtpConfig(props: CrudPageProps): CrudConfig {
  const { t } = useTranslations();

  const modelProperty = props?.modelProperty;
  const routePrefix = modelProperty?.routePrefix;

  const baseBreadcrumbs = [
    { label: t('Dashboard'), href: route('backend.dashboard') },
    { label: t('OTP Codes'), href: route(`${routePrefix}.index`) },
  ];

  return {
    fetchToggle: false,

    resource: 'otp-code',
    resourcePlural: 'otp-codes',

    title: t('OTP Codes'),
    description: t('Manage verification codes'),

    routes: {
      index: `${routePrefix}.index`,
      destroy: `${routePrefix}.destroy`,
    },

    formDisplayMode: 'modal',
    viewDisplayMode: 'modal',

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('OTP Codes'), href: null, active: true },
      ],
      create: [...baseBreadcrumbs],
      update: [...baseBreadcrumbs],
    },

    table: {
      selectable: false,
      searchable: true,
      serializable: true,
      sortable: false,
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      searchPlaceholder: t('Search by type'),
      emptyMessage: t('No OTP codes available'),
      emptyMessageIcon: KeyRound,

      bulkActions: [
        { key: 'delete', permission: 'otp.delete' },
      ],

      columns: [
        {
          key: 'otp',
          label: t('OTP'),
          sortable: false,
          priority: 0,
          render: (row: any) => {
            const [copied, setCopied] = useState(false);

            const handleCopy = async () => {
              if (!row?.otp) return;

              try {
                await navigator.clipboard.writeText(row.otp);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch (e) {
                console.error('OTP copy failed', e);
              }
            };

            return (
              <div className="flex items-center gap-2">
                <span className=" text-sm tracking-widest select-all">
                  {row?.otp ?? '••••'}
                </span>

                {row?.otp && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    title={copied ? t('Copied') : t('Copy OTP')}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                )}
              </div>
            );
          },
        },

        {
          key: 'type',
          label: t('Type'),
          sortable: false,
          priority: 1,
          render: (row: any) => (
            <Badge variant="secondary" className="capitalize">
              {row?.type?.replaceAll('_', ' ')}
            </Badge>
          ),
        },

        {
          key: 'receiver',
          label: t('Receiver'),
          sortable: false,
          priority: 2,
          render: (row: any) => {
            if (!row?.receiver) return '--';

            return (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <div className="text-sm">
                  <div className="font-medium">
                    {row.receiver.name ||
                      row.receiver.email ||
                      row.receiver.phone}
                  </div>
                </div>
              </div>
            );
          },
        },

        {
          key: 'expired_at',
          label: t('Expired At'),
          sortable: false,
          priority: 3,
          render: (row: any) => {
            const expired =
              row?.expired_at &&
              new Date(row.expired_at).getTime() < Date.now();

            return (
              <>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {row?.expired_at}

                </div>
              </>
            );
          },
        },

        {
          key: 'created_at',
          label: t('Created'),
          renderType: 'date',
          priority: 4,
        },
      ],

      customActionSubmenus: [],
    },

    filters: {
      searchFields: ['type', 'otp'],
      filterFields: props?.advanceFilterOptions || [],
    },


    permissions: {
      actions: {
        view: 'otp.view',
        delete: 'otp.delete',
      },
    },

    destroyDialogConfig: {
      title: t('Delete OTP Code'),
      description: t('Are you sure you want to delete this OTP code?'),
      itemType: 'OTP Code',
      warningMessage: t('This OTP will be permanently deleted.'),
      showWarningAlert: true,
      showItemDetails: true,

      itemDisplayFields: [
        {
          label: t('OTP'),
          key: 'otp',
          className: ' tracking-widest',
        },
        {
          label: t('Type'),
          key: 'type',
        },
        {
          label: t('Receiver'),
          key: 'receiver',
          render: (receiver: any) =>
            receiver
              ? receiver.name || receiver.email || receiver.phone
              : '--',
        },
        {
          label: t('Created'),
          key: 'created_at',
        },
      ],
    },

    labels: {
      singular: 'OTP Code',
      plural: 'OTP Codes',
    },
  };
}
