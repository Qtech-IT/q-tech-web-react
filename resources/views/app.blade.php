<!DOCTYPE html>
<html  lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ site_settings('site_name')}}</title>

        @routes
        @viteReactRefresh

  

        @php
                $cssFile = request()->is('backend*')
                    ? 'resources/css/app.css'
                    : 'resources/css/user.css';


                     $cssFile = 'resources/css/app.css';


        @endphp

        <!-- @vite([
            'resources/js/app.tsx',
            $cssFile
        ]) -->

        @vite([
            'resources/js/app.tsx',
            $cssFile
        ])

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
