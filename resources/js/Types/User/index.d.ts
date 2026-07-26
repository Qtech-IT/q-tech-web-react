import type { ReactElement } from "react";

/** Top navigation item */
export interface TopNavItem {
  title: string;
  href: string;
  isActive: boolean;
  disabled: boolean;
}

/** Profile navigation item */
export interface ProfileNavItem {
  title: string;
  exact: boolean;
  href: string;
  icon: any;
  group: "general" | "security";
}

/** Settings navigation item */
export interface SettingsNavItem {
  title: string;
  exact: boolean;
  href: string;
  icon: any;
  group: "general" | "security" | "advanced";
}

/** Font options */
export type FontOption = "inter" | "manrope" | "system";

/** Currency type */
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export type FontType = "inter" | "manrope" | "system";

export interface NavItemType extends NavItem {}
export interface ProfileNavItemType extends ProfileNavItem {}
export interface SettingsNavItemType extends SettingsNavItem {}
export interface CurrencyType extends Currency {}

export interface PaginationMeta {
  current_page: number;
  from: number;
  to: number;
  total: number;
  last_page: number;
}

export interface UsePaginationOptions {
  routeName: string;
  initialMeta?: PaginationMeta;
  preserveState?: boolean;
  preserveScroll?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  username?:string

  address?: string | null;

  img_url?: string | null;

  is_email_verified?: string | null;   
  email_verified_at?: string | null;   

  google2fa_secret?: string | null;
  recovery_codes?: string[] | null;

  two_factor_enabled: boolean;
  two_factor_confirmed_at?: string | null;


  status: string | number | boolean;

  created_at?: string | null;
  updated_at?: string | null;

}


interface SidebarItem {
  title: string;
  url?: string;
  icon?: any;
  items?: SidebarItem[];
  counter_key?: string;
  counter_keys?: string[];
  permission?:string,
  permissionsAny?:Array[];

}

export interface SidebarGroup {
  title: string;
  permissionsAny?:Array[];
  items: SidebarItem[];
}

export interface OnboardingProps {
  title: string;
  step?: string;
  systemName:string
}


export interface AuthOnboardingProps {
  title: string;
  languages?: any;
  dateFormats?:Array[];
  timeFormats?:Array[];
  timezones?:Array[];
  routeName?:string
  
}

export interface ModelProperty {
  routePrefix?: string;
  [key: string]: any;
}


export interface ProfileProps {
  title: string;
  component?: string;
  modelProperty?: ModelProperty; 
  sessions?: any[];
  setupData?: any;
}
