
import { valueToKey } from "@/Utils/helpers.js";
import { usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core"; 

export interface LanguageSettings {
    current_language?: string;
    translations?: Record<string, string>;
}


interface CustomPageProps extends InertiaPageProps {
    language_settings?: LanguageSettings;
}


export const useTranslations = () => {

    const page = usePage<CustomPageProps>().props;
    const locale: string = page.language_settings?.current_language ?? "en";
    const translations: Record<string, string> = page.language_settings?.translations ?? {};

    const t = (
        key: string,
        replacements: Record<string, string | number> = {}
    ): string => {

        /*
         * The untranslated fallback is the KEY ITSELF, not `keyToValue(key)`.
         *
         * Every `t()` call in this codebase passes a human-readable English
         * sentence, and `keyToValue` replaces every non-alphanumeric character
         * with a space — it exists to turn a snake_case status like
         * `pending_review` into "Pending review", which is a different job.
         *
         * Run over a display string it destroys the string: `':count items'`
         * became "count items" because the colon was eaten before the
         * replacement below could find `:count`, and every apostrophe, full
         * stop, em dash and curly quote in the admin was flattened the same
         * way. That is what was rendering "count items" under every section
         * card in the page builder.
         *
         * `valueToKey` is still the lookup, so authored translations are
         * unaffected; only the fallback changes, and it now returns exactly
         * what the developer wrote.
         */
        let translation: string = translations[valueToKey(key.trim())] ?? key;

        Object.keys(replacements).forEach((placeholder) => {
            // Word-boundary anchored so `:count` cannot also match the start of
            // `:count_total`, which would leave a stray `_total` behind.
            const regex = new RegExp(`:${placeholder}(?![A-Za-z0-9_])`, "g");
            translation = translation.replace(
                regex,
                String(replacements[placeholder])
            );
        });

        return translation;
    };

    const trans = t;

    return { t, trans, locale, translations };
};
