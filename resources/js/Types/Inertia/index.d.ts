import type { Admin, User } from "../User";
import type { InertiaPage } from "./page";
import type { PageProps } from "@inertiajs/core"; 

/**
 * Shared props for the entire app
 */
export interface SharedProps  extends PageProps{
  auth: {
    user: Admin | User | null;
    authorization?: any
  };
  flash: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
  };
  theme: string;
  site_theme_settings: Record<string, any>;
  logos: Record<string, string>;
  pending_report_counter: {
    pending_contacts: number | string;
    email_unverified_users: number | string;
    kyc_unverified_users: number | string;
  };
}

/**
 * Full Inertia page type with shared props
 */
export type InertiaPageWithShared<Props = {}> = InertiaPage<Props & SharedProps>;
