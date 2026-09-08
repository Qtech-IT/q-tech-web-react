import type { SidebarGroup } from '@/Types/User';
import {
  Bell,
  Blocks,
  Clock,
  Cog,
  DatabaseBackup,
  Files,
  FolderTree,
  HardDrive,
  Images,
  Info,
  Languages,
  LayoutDashboard,
  ListChecks,
  ListTree,
  Inbox,
  MousePointerClick,
  Network,
  Send,
  Signpost,
  Users,
  LucideMailCheck,
  Settings,
  Shield,
  User,
  UserCog,
  Zap
} from 'lucide-react';
import { route } from 'ziggy-js';

export interface SidebarData {
  navGroups: SidebarGroup[];
}

export const sidebarData: SidebarData = {
  navGroups: [

    // 1. Dashboard
    {
      title: 'Dashboard',
      permissionsAny: ['dashboard.view'],
      items: [
        {
          title: 'Overview',
          url: route('backend.dashboard'),
          icon: LayoutDashboard,
          permission: 'dashboard.view'
        },
      ],
    },


    // 3. Admin & Access Control
    {
      title: 'Admin & Access',
      permissionsAny: ['user.view', 'role.view', 'otp.view'],
      items: [
        {
          title: 'Admin Users',
          url: route('backend.admin-users.index'),
          icon: UserCog,
          permission: 'user.view'
        },
        {
          title: 'Roles & Permissions',
          url: route('backend.roles.index'),
          icon: Shield,
          permission: 'role.view'
        },
        {
          title: 'OTP Codes',
          url: route('backend.otp-codes.index'),
          icon: Shield,
          permission: 'otp.view'
        },
      ],
    },


    // 4. Content
    {
      title: 'Content',
      permissionsAny: [
        'page.view',
        'block.view',
        'cta.view',
        'menu.view',
        'media.view',
        'folder.view',
        'redirect.view',
      ],
      items: [
        {
          title: 'Pages',
          url: route('backend.pages.index'),
          icon: Files,
          permission: 'page.view',
        },
        {
          /* The same rows as Pages, nested by parent — the only screen that
             shows a page's place in the hierarchy and can reparent it. */
          title: 'Page Tree',
          url: route('backend.pages.tree'),
          icon: Network,
          permission: 'page.view',
        },
        {
          title: 'Global Blocks',
          url: route('backend.blocks.index'),
          icon: Blocks,
          permission: 'block.view',
        },
        {
          title: 'Call To Actions',
          url: route('backend.ctas.index'),
          icon: MousePointerClick,
          permission: 'cta.view',
        },
        {
          title: 'Menus',
          url: route('backend.menus.index'),
          icon: ListTree,
          permission: 'menu.view',
        },
        {
          title: 'Media',
          icon: Images,
          items: [
            {
              title: 'Media Library',
              url: route('backend.media.index'),
              icon: Images,
              permission: 'media.view',
            },
            {
              title: 'Folders',
              url: route('backend.media-folders.index'),
              icon: FolderTree,
              permission: 'folder.view',
            },
          ],
        },
        {
          title: 'Redirects',
          url: route('backend.redirects.index'),
          icon: Signpost,
          permission: 'redirect.view',
        },
      ],
    },

    // 6. Notifications
    {
      title: 'Notifications',
      permissionsAny: ['notification-template.view', 'notification-log.view'],
      items: [
        {
          title: 'Templates',
          url: route('backend.notification-templates.index'),
          icon: Bell,
          permission: 'notification-template.view'
        },
        {
          title: 'Global Templates',
          url: route('backend.notification-templates.global'),
          icon: Bell,
          permission: 'notification-template.view'
        },
        {
          title: 'Notification Logs',
          url: route('backend.notification-logs.index'),
          icon: Bell,
          permission: 'notification-log.view'
        },
      ],
    },

    // 6b. Marketing
    {
      title: 'Marketing',
      permissionsAny: [
        'contact-submission.view',
        'subscriber.view',
        'contact-submission.reply',
        'subscriber.mail'
      ],
      items: [
        {
          title: 'Contact Enquiries',
          url: route('backend.contact-submissions.index'),
          icon: Inbox,
          permission: 'contact-submission.view'
        },
        {
          title: 'Newsletter Subscribers',
          url: route('backend.subscribers.index'),
          icon: Users,
          permission: 'subscriber.view'
        },
        {
          title: 'Send Campaign',
          url: route('backend.marketing.bulk-mail.index'),
          icon: Send,
          permissionsAny: ['contact-submission.reply', 'subscriber.mail']
        },
      ],
    },

    // 7. System & Operations
    {
      title: 'System & Operations',
      permissionsAny: [
        'cache.view',
        'automation.view',
        'job.view',
        'backup.view',
        'system-info.view',
        'setting.view',
        'language.view'
      ],
      items: [
        {
          title: 'Performance',
          icon: Zap,
          items: [
            {
              title: 'Cache',
              url: route('backend.cache.index'),
              icon: Zap,
              permission: 'cache.view'
            },
            {
              title: 'Cron Jobs',
              url: route('backend.automation.index'),
              icon: Clock,
              permission: 'automation.view'
            },
          ],
        },
        {
          title: 'Queue Jobs',
          icon: ListChecks,
          items: [
            {
              title: 'Jobs',
              url: route('backend.jobs.index'),
              icon: Zap,
              permission: 'job.view'
            },
            {
              title: 'Failed Jobs',
              url: route('backend.failed-jobs.index'),
              icon: Clock,
              permission: 'job.view'
            },
          ],
        },
        {
          title: 'Localization',
          icon: Languages,
          items: [
            {
              title: 'Languages',
              url: route('backend.languages.index'),
              icon: Languages,
              permission: 'language.view'
            },
          ],
        },
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'General',
              url: route('backend.settings.index'),
              icon: Cog,
              permission: 'setting.view'
            },
            {
              title: 'Storage',
              url: route('backend.settings.storage'),
              icon: HardDrive,
              permission: 'setting.view'
            },
          ],
        },
        {
          title: 'Mail Configuration',
          url: route('backend.mail.configuration.index'),
          icon: LucideMailCheck,
          permission: 'mail-configuration.view',
        },
        {
          title: 'Database Backup',
          url: route('backend.backups.index'),
          icon: DatabaseBackup,
          permission: 'backup.view'
        },
        {
          title: 'System Info',
          url: route('backend.system.information'),
          icon: Info,
          permission: 'system-info.view'
        },
      ],
    },

    // 8. Account
    {
      title: 'Account',
      items: [
        {
          title: 'Profile',
          url: route('backend.profile.index'),
          icon: User
        },
        {
          title: 'Security & Password',
          url: route('backend.profile.password.index'),
          icon: Shield,
          permission: 'setting.view'
        },
      ],
    }
  ]
};
