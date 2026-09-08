{{--
    Third-party analytics / ads, injected into the PUBLIC <head> only.

    Every identifier comes from App Settings (Settings → SEO & Analytics), is
    gated by its own enable switch, and is format-validated in `site_analytics()`
    before it reaches this file — so each value below is known to be safe to
    interpolate into a quoted JS string.

    In the Blade shell rather than a React <Head> on purpose: these libraries
    must load once and persist across Inertia visits. Per-visit page views are
    reported from `resources/js/app.tsx` on `router.on('navigate')`.

    When Tag Manager is enabled it is the single source of truth — gtag.js is
    not also loaded, so Analytics is wired inside the container instead of
    firing twice.
--}}
@php($analytics = site_analytics())

@if ($analytics['verification'])
    <meta name="google-site-verification" content="{{ $analytics['verification'] }}">
@endif

@if ($analytics['gtm'])
    {{-- Google Tag Manager --}}
    <script>
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', '{{ $analytics['gtm'] }}');
    </script>
@elseif ($analytics['ga'])
    {{-- Google Analytics (gtag.js) — only when Tag Manager is not in use --}}
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ $analytics['ga'] }}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', '{{ $analytics['ga'] }}');
    </script>
@endif

@if ($analytics['adsense'])
    {{-- Google AdSense --}}
    <script async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ $analytics['adsense'] }}"
        crossorigin="anonymous"></script>
@endif
