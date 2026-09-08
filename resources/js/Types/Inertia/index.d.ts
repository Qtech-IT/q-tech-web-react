import type { BrandTokens } from "../brand";
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
  /**
   * Admin-authored brand. Sent on EVERY route, including `/backend` — the
   * admin adopts it at its accent points only (see `BaseLayout`). Optional
   * because a shared prop must survive the server sending less than it
   * promises.
   */
  brand?: BrandTokens | null;
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
