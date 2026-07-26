import React from "react";
import { NavItem, ProfileNavItem, SettingsNavItem, Currency } from "./crud";

import { FormConfig, Page, PageProps } from "@inertiajs/core";
import Breadcrumb from "@/Components/UI/Breadcrumb";

export type FontType = "inter" | "manrope" | "system";

export interface NavItemType extends NavItem {}
export interface ProfileNavItemType extends ProfileNavItem {}
export interface SettingsNavItemType extends SettingsNavItem {}
export interface CurrencyType extends Currency {}

export type IconLibrary = 'lucide' | 'radix';
export interface DynamicIconProps {
  iconName: string;
  iconLibrary?: IconLibrary;
  className?: string;
}

export declare function route(name: string, params?: Record<string, any>): string;


export interface TitleProps {
  title: string
}



export type SubmitFunction = (
  config: FormConfig & { data?: any }
) => Promise<Page<PageProps>>;


export type BreadcrumbProps = Array<{
  label: string;
  href?: any;
}>;
