import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";


import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';




import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import './bootstrap.js';


import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import LoadingBar from 'react-top-loading-bar';

import { ThemeProvider } from '@/Contexts/ThemeProvider';

const appName = import.meta.env.VITE_APP_NAME;

// Define types for site settings
interface SiteThemeSettings {
    company_name?: string;
    /** CMS default for first-time visitors only; the cookie always wins. */
    theme_mode?: string;
}

interface Logos {
    favicon?: string;
}

interface AppPageProps {
    site_theme_settings?: SiteThemeSettings;
    logos?: Logos;
    [key: string]: any;
}

interface PageState {
    page?: {
        props?: AppPageProps;
    };
}

// Type for LoadingBar ref
interface LoadingBarRef {
    continuousStart: () => void;
    complete: () => void;
}

// Create loading bar instance
let loadingBarRef: LoadingBarRef | null = null;

// Setup Inertia event listeners for loading bar
router.on('start', () => {
    if (loadingBarRef) {
        loadingBarRef.continuousStart();
    }
});

router.on('finish', () => {
    if (loadingBarRef) {
        loadingBarRef.complete();
    }
});

const updateFavicon = (faviconUrl?: string): void => {
    if (!faviconUrl) return;

    const existingFavicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (existingFavicon) {
        existingFavicon.remove();
    }

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = faviconUrl;

    document.head.appendChild(link);
};




createInertiaApp({
    title: (title: string) => {
        const pageState = window.history.state as PageState | null;
        const props = pageState?.page?.props || {};
        const settings = props.site_theme_settings || {};

        const siteName = settings.company_name || appName;

        return title ? `${title} - ${siteName}` : siteName;
    },
    resolve: async (name: string) => {
        try {
            // Try to resolve the page component
            const page = await resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            );
            return page;
        } catch (error) {

            console.log(error);

            // If page not found, return the NotFound component
            return await import('./Pages/Errors/404');

        }
    },
    setup({ el, App, props }: { el: HTMLElement; App: any; props: any }) {
        const initialProps = props.initialPage?.props as AppPageProps | undefined;

        // Update favicon
        const favicon = initialProps?.logos?.favicon;
        if (favicon) {
            updateFavicon(favicon);
        }

        // Mounted once at the root so public pages and admin share one theme
        // source. `theme_mode` only seeds first-time visitors — the
        // `qtech_theme` cookie always wins once the user has chosen.
        const root: Root = createRoot(el);
        root.render(
            <ThemeProvider dbTheme={initialProps?.site_theme_settings?.theme_mode}>
                <LoadingBar
                    color='#093f28ff'
                    height={2}
                    shadow={true}
                    ref={(ref: LoadingBarRef | null) => {
                        loadingBarRef = ref;
                    }}
                />
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#093f28ff',
    },
});

// Listen for page changes to update meta tags
router.on('navigate', (event: any) => { });