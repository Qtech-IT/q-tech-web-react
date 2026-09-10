@php
    $themePreference = theme_preference();
    $isSystemTheme   = $themePreference === \App\Enums\Common\Theme::SYSTEM->value;
@endphp

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ locale_direction() }}"@if ($themePreference === \App\Enums\Common\Theme::DARK->value) class="dark"@endif @unless ($isSystemTheme) style="color-scheme: {{ $themePreference }}"@endunless>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @if ($isSystemTheme)
           <script>(function(){try{var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;e.classList.toggle('dark',m);e.style.colorScheme=m?'dark':'light';}catch(_){}})();</script>
        @endif

        {{--
            Preload the display weights the public hero renders in, so the real
            font is in place before first paint instead of swapping in ~600ms
            later (right as the headline reveal ends) and reflowing the text.
            Public pages only; wrapped because a missing manifest entry throws.
        --}}
        @unless (request()->is('backend', 'backend/*'))
            @php
                $preloadFonts = [];
                foreach ([
                    'node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2',
                    'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2',
                ] as $font) {
                    try {
                        $preloadFonts[] = Vite::asset($font);
                    } catch (\Throwable $e) {
                        // Font not in the manifest for this build — skip the hint.
                    }
                }
            @endphp
            @foreach ($preloadFonts as $fontUrl)
                <link rel="preload" as="font" type="font/woff2" crossorigin
                      href="{{ $fontUrl }}">
            @endforeach
        @endunless

        <title inertia>
           {{ site_settings('site_name') }}
        </title>

        {{-- Analytics / ads on public pages only; the admin panel never loads them. --}}
        @unless (request()->is('backend', 'backend/*'))
            @include('partials.analytics')
        @endunless

        @routes
        @viteReactRefresh

        @vite([
            'resources/js/app.tsx',
            'resources/css/app.css'
        ])

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @unless (request()->is('backend', 'backend/*'))
            @php($gtmId = site_analytics()['gtm'])
            @if ($gtmId)
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmId }}"
                        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            @endif
        @endunless

        @inertia
    </body>
</html>
