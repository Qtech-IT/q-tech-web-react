
import { keyToValue, valueToKey } from "@/Utils/helpers.js";
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

        let translation: string = translations[valueToKey(key.trim())] ?? keyToValue(key);

        Object.keys(replacements).forEach((placeholder) => {
            const regex = new RegExp(`:${placeholder}`, "g");
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
