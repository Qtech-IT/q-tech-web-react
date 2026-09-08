import { useEffect, useMemo } from 'react'
import { usePage } from '@inertiajs/react'

import { HotToaster } from '@/Components/UI/HotToast'
import { DirectionProvider } from '@/Contexts/Backend/DirectionProvider'
import { FontProvider } from '@/Contexts/Backend/FontProvider'
import type { BrandTokens } from '@/Types/brand'
import type { SharedProps } from '@/Types/Inertia'
import { ToastProvider } from '../../Providers/ToastProvider'

/**
 * Map the `brand` shared prop onto the INPUT properties `theme.css` reads.
 *
 * Only the accent points are published. The accent, secondary-button and
 * dark-accent settings are deliberately absent: they drive the public `--fx-*`
 * system and have no admin counterpart, and importing them here is exactly the
 * boundary crossing this change is not allowed to make.
 *
 * A missing value is OMITTED rather than emitted empty, for the reason
 * `PublicLayout` documents: every consumer reads these as
 * `var(--admin-brand-x, <literal default>)`, and a declared-but-empty custom
 * property is NOT the same as an absent one — it suppresses the fallback and
 * computes to nothing. Omitting is what makes the fallback fire.
 */
function adminBrandVars(
  brand: BrandTokens | null | undefined
): Record<string, string> {
  if (!brand) {
    return {}
  }

  const inputs: Array<[string, string | undefined]> = [
    ['--admin-brand-primary', brand.buttonPrimary],
    ['--admin-brand-primary-ink', brand.buttonPrimaryInk],
    ['--admin-brand-radius', brand.radius],
  ]

  const vars: Record<string, string> = {}

  for (const [name, value] of inputs) {
    if (typeof value === 'string' && value.trim() !== '') {
      vars[name] = value.trim()
    }
  }

  return vars
}

/**
 * Admin shell. `ThemeProvider` is deliberately NOT mounted here — it lives at
 * the root in `app.tsx` so the public site and the admin share one provider,
 * one cookie and one class-application path. Nesting a second instance would
 * give the admin its own state and let the two disagree.
 *
 * BRAND
 * -----
 * The tokens are written to `<html>`, not to a wrapper div, for one concrete
 * reason: Radix portals every dialog, dropdown and select to `document.body`,
 * which is outside this subtree. Scoped to a wrapper, a primary button inside
 * a modal would silently fall back to the stock palette while the same button
 * on the page behind it carried the brand. `<html>` is the only node both
 * trees inherit from. Mutating it from the shell is the pattern `FontProvider`
 * already uses, and the cleanup returns the admin to the stock palette when
 * the layout unmounts — so a public route never inherits admin bindings.
 */
export default function BaseLayout(props: any) {
    const { children } = props;
    const { props: pageProps } = usePage<SharedProps>();
    const { site_theme_settings } = pageProps;

    // Keyed on the prop identity so a navigation that does not change the
    // brand does not touch the document at all.
    const brandVars = useMemo(
        () => adminBrandVars(pageProps.brand),
        [pageProps.brand]
    );

    useEffect(() => {
        const root = document.documentElement;
        const names = Object.keys(brandVars);

        if (names.length === 0) {
            // No usable brand: leave `theme.css`'s authored palette alone.
            root.removeAttribute('data-admin-brand');
            return;
        }

        for (const name of names) {
            root.style.setProperty(name, brandVars[name] as string);
        }

        // The flag is what activates the admin brand block. Set last, so the
        // rebinding never runs against a half-written set of inputs.
        root.setAttribute('data-admin-brand', '');

        return () => {
            for (const name of names) {
                root.style.removeProperty(name);
            }
            root.removeAttribute('data-admin-brand');
        };
    }, [brandVars]);

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
