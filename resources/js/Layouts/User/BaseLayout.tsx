import { HotToaster } from '@/Components/UI/HotToast'
import { DirectionProvider } from '@/Contexts/Backend/DirectionProvider'
import { FontProvider } from '@/Contexts/Backend/FontProvider'
import type { SharedProps } from '@/Types/Inertia'
import { usePage } from '@inertiajs/react'
import { ToastProvider } from '../../Providers/ToastProvider'

/**
 * Admin shell. `ThemeProvider` is deliberately NOT mounted here — it lives at
 * the root in `app.tsx` so the public site and the admin share one provider,
 * one cookie and one class-application path. Nesting a second instance would
 * give the admin its own state and let the two disagree.
 */
export default function BaseLayout(props: any) {

    const { children } = props;
    const { props: pageProps } = usePage<SharedProps>();
    const { site_theme_settings } = pageProps;

    return (
        <ToastProvider>
            <FontProvider dbFont={site_theme_settings?.font}>
                <DirectionProvider dbDirection={site_theme_settings?.direction}>
                    {children}
                    <HotToaster />
                </DirectionProvider>
            </FontProvider>
        </ToastProvider>
    );
}