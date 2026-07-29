import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

import type { CmsOption } from '@/Types/cms';
import { unwrapList } from '@/Utils/cms';

interface SharedLanguage {
  code: string;
  name: string;
  is_default?: boolean;
}

interface LocalePageProps {
  language_settings?: {
    available_languages?: unknown;
    current_language?: string;
  };
  [key: string]: unknown;
}

/**
 * Locale options for CMS screens.
 *
 * `pages.locale` and `seo_meta.locale` are both validated against
 * `exists:languages,code`, and the site's languages are already shared on
 * every Inertia response — so the CMS screens read them from there rather
 * than each controller shipping a duplicate list.
 */
export function useCmsLocales(): {
  locales: SharedLanguage[];
  localeOptions: CmsOption[];
  currentLocale: string;
  defaultLocale: string;
} {
  const props = usePage<LocalePageProps>().props;

  return useMemo(() => {
    const locales = unwrapList<SharedLanguage>(
      props.language_settings?.available_languages
    );

    const currentLocale = props.language_settings?.current_language ?? 'en';

    return {
      locales,
      localeOptions: locales.map((language) => ({
        value: language.code,
        label: `${language.name} (${language.code})`,
      })),
      currentLocale,
      defaultLocale:
        locales.find((language) => language.is_default)?.code ?? currentLocale,
    };
  }, [props.language_settings]);
}
