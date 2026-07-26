import {
  Cpu,
  CurrencyIcon,
  HardDrive,
  Image,
  Lock,
  MonitorCog,
  Palette,
  Settings,
  Shield,
  ShieldCheck,
  TabletSmartphone,
  UserCog
} from "lucide-react";



import type { Currency, FontOption, ProfileNavItem, SettingsNavItem, TopNavItem } from "@/Types/User";
import { route } from "ziggy-js";


/** Fonts */
export const fonts: FontOption[] = ['inter', 'manrope', 'system'];

/** Top navigation items */
export const topNav: TopNavItem[] = [


];

/** Profile navigation items */
export const profileNavItems: ProfileNavItem[] = [
  {
    title: "Account",
    exact: true,
    href: route("backend.profile.index"),
    icon: UserCog,
    group: "general"
  },
  {
    title: "Sessions",
    exact: true,
    href: route('backend.profile.browser.session'),
    icon: TabletSmartphone,
    group: "general"
  },
  {
    title: "Password",
    exact: true,
    href: route('backend.profile.password.index'),
    icon: Lock,
    group: "security"
  },
  {
    title: "2FA",
    exact: true,
    href: route('backend.2fa.index'),
    icon: ShieldCheck,
    group: "security"
  }
];

/** Settings navigation items */
export const settingsNavItems: SettingsNavItem[] = [
  { title: "General", exact: true, href: route("backend.settings.index"), icon: Settings, group: "general" },
  {
    title: 'Withdraw & Deposit Config',
    exact: true,
    href: route('backend.settings.withdraw-deposit.configuration'),
    icon: MonitorCog,
    group: "general"
  },
  { title: "Appearance", exact: true, href: route('backend.settings.appearance'), icon: Palette, group: "general" },
  {
    title: 'Support Settings', exact: true, href: route('backend.settings.support'), icon: UserCog, group: "general"
  },
  { title: "Logo", exact: true, href: route('backend.settings.logo'), icon: Image, group: "general" },
  { title: "Storage", exact: true, href: route('backend.settings.storage'), icon: HardDrive, group: "general" },
  { title: "Currency", exact: true, href: route('backend.settings.currency'), icon: CurrencyIcon, group: "general" },
  { title: "Security Center", exact: true, href: route('backend.settings.security'), icon: Shield, group: "security" },
  { title: "System Config", exact: true, href: route('backend.settings.system'), icon: Cpu, group: "advanced" },

];


export const exportFormats = [
  'Excel', 'CSV'
];



export const importFormats = [
  'Excel', 'CSV'
];


export const FORMAT_EXTENSION_MAP: Record<string, string[]> = {
  'csv': ['csv'],
  'excel': ['xls', 'xlsx', 'xlsm', 'xlt', 'xltx', 'xltm'],
  'exel': ['xls', 'xlsx', 'xlsm', 'xlt', 'xltx', 'xltm'], // typo variant
  'both': ['csv', 'xls', 'xlsx', 'xlsm', 'xlt', 'xltx', 'xltm'],
};


export const currencies: Currency[] = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound Sterling", symbol: "£" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س" }
];


