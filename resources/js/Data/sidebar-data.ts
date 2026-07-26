import type { SidebarGroup } from '@/Types/User';
import {
  Bell,
  Clock,
  Cog,
  Coins,
  DatabaseBackup,
  HardDrive,
  Info,
  Languages,
  LayoutDashboard,
  ListChecks,
  LucideMailCheck,
  LucideTrendingUpDown,
  Settings,
  Shield,
  User,
  UserCog,
  Users,
  Wallet,
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

    // 2. User Management (Merged all user-related stuff)
    {
      title: 'User Management',
      permissionsAny: [
        'system-user.view',
        'wallet.view',
        'wallet.transaction.view',
        'form.view',
        'kyc-log.view',
        'deposit.view',
        'loan-product.view',
        'loan-request.view'
      ],
      items: [
        {
          title: 'Users',
          url: route('backend.users.index'),
          icon: Users,
          permission: 'system-user.view'
        },
        {
          title: 'Wallets',
          url: route('backend.user-wallet.index'),
          icon: Coins,
          permission: 'wallet.view'
        },
        {
          title: 'Wallet Transactions',
          url: route('backend.user-wallet.transaction'),
          icon: ListChecks,
          permission: 'wallet.transaction.view'
        },
        {
          title: 'KYC Management',
          icon: Shield,
          items: [
            {
              title: 'KYC Forms',
              url: route('backend.forms.index'),
              icon: UserCog,
              permission: 'form.view'
            },
            {
              title: 'KYC Logs',
              url: route('backend.kyc-logs.index'),
              icon: UserCog,
              permission: 'kyc-log.view'
            },
          ],
        },
        {
          title: 'Loan Management',
          icon: LucideTrendingUpDown,
          items: [
            {
              title: 'Loan Products',
              url: route('backend.loan-products.index'),
              icon: UserCog,
              permission: 'loan-product.view'
            },
            {
              title: 'Requests',
              url: route('backend.loan-requests.index'),
              icon: UserCog,
              permission: 'loan-request.view'
            },
          ],
        },

        {
          title: 'Deposits',
          url: route('backend.deposit.index'),
          icon: Wallet,
          permission: 'deposit.view'
        },
        {
          title: 'Withdrawals',
          url: route('backend.withdrawal.index'),
          icon: Wallet,
          permission: 'withdraw.view'
        }

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

    // 4. Crypto / Trading (Core business)
    {
      title: 'Crypto & Trading',
      permissionsAny: [
        'crypto.view',
        'crypto-wallet-address.view',
        'trade-setting.view',
        'trade.view'
      ],
      items: [
        {
          title: 'Crypto Currencies',
          url: route('backend.crypto-currencies.index'),
          icon: Coins,
          permission: 'crypto.view'
        },
        {
          title: 'Wallet Addresses',
          url: route('backend.crypto-wallets-addresses.index'),
          icon: Coins,
          permission: 'crypto-wallet-address.view'
        },
        {
          title: 'Trade Settings',
          url: route('backend.trade-settings.index'),
          icon: Settings,
          permission: 'trade-setting.view'
        },
        {
          title: 'Trades',
          url: route('backend.trades.index'),
          icon: ListChecks,
          permission: 'trade.view'
        }
      ],
    },

    // 5. Frontend / CMS
    {
      title: 'Frontend CMS',
      permissionsAny: ['faq.view', 'policy-page.view', 'banner.view'],
      items: [
        {
          title: 'FAQs',
          url: route('backend.faqs.index'),
          icon: Info,
          permission: 'faq.view'
        },
        {
          title: 'Policy Pages',
          url: route('backend.policy-pages.index'),
          icon: Info,
          permission: 'policy-page.view'
        },
        {
          title: 'Banners',
          url: route('backend.banners.index'),
          icon: Info,
          permission: 'banner.view'
        }
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
