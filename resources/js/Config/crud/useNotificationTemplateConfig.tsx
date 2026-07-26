import { 
  Mail,
  Bell,
  Smartphone,
  MessageSquare,
} from 'lucide-react';

import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import { useTranslations } from '@/Hooks/useTranslations';
import z from 'zod';
import { Badge } from '@/Components/UI/Badge';
import React from 'react';
import NotificationTemplateSaveForm from '@/Components/Forms/Backend/NotificationTemplate/NotificationTemplateSaveForm';
import { limitText } from '@/Utils/helpers';

export function useNotificationTemplateConfig(props: CrudPageProps): CrudConfig {

  const { t } = useTranslations();

  const modelProperty = props?.modelProperty;
  const routePrefix   = modelProperty?.routePrefix;

  const advanceFilterOptions = props?.advanceFilterOptions || [];


  return {
    formComponent: NotificationTemplateSaveForm,
    fetchToggle: false,

    form: {
      title: {
        create: t('Create Notification Template'),
        edit: t('Edit Notification Template'),
      },
      description: {
        create: t('Create a new notification template'),
        edit: t('Update notification template configuration'),
      },
      submitButtonText: {
        create: t('Create Template'),
        edit: t('Update Template'),
      },

      fields: [
        {
          name: 'subject',
          label: t('Email Subject'),
          type: 'text',
          placeholder: t('Enter email subject...'),
          required: false,
          section: 'email',
          gridColumn: 'span 3',
          description: t('The subject line that recipients will see in their inbox'),
          conditional: (formData: any) => formData._isEmailEnabled !== false,
        },
        {
          name: 'mail_body',
          label: t('Email Body'),
          type: 'richtext',
          placeholder: t('Enter email body content...'),
          required: false,
          section: 'email',
          gridColumn: 'span 3',
          description: t('Use the rich text editor and template keys from the sidebar to create your email content'),
          height: '300px',
          conditional: (formData: any) => formData._isEmailEnabled !== false,
        },
       
        {
          name: 'push_notification_body',
          label: t('Push Notification Message'),
          type: 'textarea',
          placeholder: t('Enter push notification message...'),
          required: false,
          section: 'realtime',
          gridColumn: 'span 3',
          rows: 4,
          description: t('The message content for push notifications. Keep it concise and engaging.'),
          conditional: (formData: any) => formData._isRealtimeEnabled !== false,
        },
        {
          name: 'push_notification',
          label: t('Push Notifications'),
          type: 'switch',
          required: false,
          section: 'realtime',
          gridColumn: 'span 1',
          description: t('Enable or disable push notifications'),
          conditional: (formData: any) => formData._isRealtimeEnabled !== false,
        },
        {
          name: 'site_notificaton',
          label: t('Site Notifications'),
          type: 'switch',
          required: false,
          section: 'realtime',
          gridColumn: 'span 1',
          description: t('Enable or disable in-app site notifications'),
          conditional: (formData: any) => formData._isRealtimeEnabled !== false,
        },
      ],
    },

    formValidationRules: {
      subject: z.string().max(200, t('Subject must not exceed 200 characters')).optional(),
      mail_body: z.string().optional(),
      push_notification_body: z.string().optional(),
      email_notification: z.any().optional(),
      push_notification: z.any().optional(),
      site_notificaton: z.any().optional(),
    },

    resource: 'notification_template',
    resourcePlural: 'notification_templates',
    title: t('Notification Templates'),
    description: t('Manage notification templates for emails, push notifications, and site notifications'),

    routes: {
      index: `${routePrefix}.index`,
      edit: `${routePrefix}.edit`,
      update: `${routePrefix}.update`,
    },

    formDisplayMode: 'page',
    viewDisplayMode: 'page',

    breadcrumbs: {
      index: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Notification Templates'), href: null },
      ],
      create: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Notification Templates'), href: route(`${routePrefix}.index`) },
        { label: t('Create'), href: null, active: true },
      ],
      update: [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Notification Templates'), href: route(`${routePrefix}.index`) },
        { label: t('Edit'), href: null, active: true },
      ],
    },

    table: {
      selectable: false,
      searchable: true,
      serializable: true,
      searchPlaceholder: t('Search templates by name or subject...'),
      sortable: true,
      defaultSort: 'created_at',
      defaultSortDirection: 'desc',
      emptyMessage: t('No notification templates available.'),
      emptyMessageIcon: Mail,

      columns: [
        {
          key: 'name',
          label: t('Name'),
          sortable: false,
          filterable: true,
          priority: 0,
          render: (row: any) => (
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.name}</div>
            </div>
          ),
        },
        {
          key: 'subject',
          label: t('Subject'),
          sortable: false,
          filterable: true,
          priority: 1,
          render: (row: any) => (
            <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
              {limitText(row.subject,20) || '-'}
            </div>
          ),
        },
        {
          key: 'notifications',
          label: t('Enabled Channels'),
          sortable: false,
          filterable: false,
          priority: 2,
          render: (row: any) => (
            <div className="flex gap-1.5">
              {row.email_notification === 'active' && (
                <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                  <Mail className="w-3 h-3 mr-1" />
                  {t('Email')}
                </Badge>
              )}
              {row.push_notification === 'active' && (
                <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                  <Smartphone className="w-3 h-3 mr-1" />
                  {t('Push')}
                </Badge>
              )}
              {row.site_notificaton === 'active' && (
                <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                  <Bell className="w-3 h-3 mr-1" />
                  {t('Site')}
                </Badge>
              )}
            </div>
          ),
        },
        {
          key: 'created_at',
          label: t('Created'),
          sortable: false,
          priority: 4,
          renderType: 'date',
        },
      ]
    },

    stats: [
      { key: 'total', title: t('Total Templates'), icon: Mail, iconColor: 'text-blue-600', iconBgColor: 'bg-blue-100 dark:bg-blue-900', description: t('All notification templates') },
      { key: 'incoming', title: t('Incoming'), icon: MessageSquare, iconColor: 'text-green-600', iconBgColor: 'bg-green-100 dark:bg-green-900', description: t('Incoming templates') },
      { key: 'outgoing', title: t('Outgoing'), icon: Bell, iconColor: 'text-purple-600', iconBgColor: 'bg-purple-100 dark:bg-purple-900', description: t('Outgoing templates') },
      { key: 'both', title: t('Both'), icon: Smartphone, iconColor: 'text-amber-600', iconBgColor: 'bg-amber-100 dark:bg-amber-900', description: t('Both directions') },
    ],

    filters: {
      searchFields: ['name', 'subject'],
      filterFields: advanceFilterOptions,
    },

    permissions: {
      actions: {
        edit: 'notification-template.edit',
      },
    },

    labels: {
      singular: t('Notification Template'),
      plural: t('Notification Templates'),
    },

    saveAlertInfo: {
      title: t('Notification Template Configuration'),
      description: t('Configure your notification template content for email, push notifications, and in-app notifications.'),
    },
  };
}
