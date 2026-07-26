import { HotToaster } from '@/Components/UI/HotToast'
import { DirectionProvider } from '@/Contexts/Backend/DirectionProvider'
import { FontProvider } from '@/Contexts/Backend/FontProvider'
import { ThemeProvider } from '@/Contexts/ThemeProvider'
import type { SharedProps } from '@/Types/Inertia'
import { usePage } from '@inertiajs/react'
import { ToastProvider } from '../../Providers/ToastProvider'

export default function BaseLayout(props: any) {

    const { children } = props;
    const { props: pageProps } = usePage<SharedProps>();
    const { site_theme_settings } = pageProps;

    return (
        <ToastProvider>
            <ThemeProvider dbTheme={site_theme_settings?.theme_mode}>
                <FontProvider dbFont={site_theme_settings?.font}>
                    <DirectionProvider dbDirection={site_theme_settings?.direction}>
                        {children}
                        <HotToaster />
                    </DirectionProvider>
                </FontProvider>
            </ThemeProvider>
        </ToastProvider>
    );
}