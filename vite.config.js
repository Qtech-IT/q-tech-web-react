import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.tsx',
                'resources/css/app.css',
            ],
            refresh: true, // enables HMR for Blade files
        }),
        react({
            jsxRuntime: 'automatic',
        }),
    ],

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@/Components': path.resolve(__dirname, 'resources/js/Components'),
            '@/Pages': path.resolve(__dirname, 'resources/js/Pages'),
            '@/Layouts': path.resolve(__dirname, 'resources/js/Layouts'),
            '@/Utils': path.resolve(__dirname, 'resources/js/Utils'),
            '@/Hooks': path.resolve(__dirname, 'resources/js/Hooks'),
            '@/Assets': path.resolve(__dirname, 'resources/js/Assets'),
        },
    },

    server: {
        /*
         * The dev server runs on the HOST (not inside the Sail container), and
         * the browser reaches it directly. Two things here fix "the page keeps
         * doing a full reload when I click a link / submit a form":
         *
         *  - `host: 'localhost'` instead of `true`. With `true` the server
         *    advertised itself on the IPv6 wildcard `[::]` (see `public/hot`),
         *    an address the browser's HMR client cannot open — so every HMR
         *    ping failed and Vite fell back to reloading the whole page.
         *  - `hmr.host` pinned to the same, so the client connects to a real
         *    address even when Vite is bound more broadly.
         *
         * `usePolling` is gone: on the host filesystem native FS events work,
         * and polling pinned a CPU core and produced phantom change events that
         * made `refresh: true` reload the page mid-interaction.
         *
         * If you ever run Vite INSIDE the container instead, set `host` back to
         * `true`, add `VITE_PORT=5174` to `.env`, and expose 5174 in
         * docker-compose.yml.
         */
        host: 'localhost',
        port: 5174,
        strictPort: true,
        hmr: {
            host: 'localhost',
        },
    },

    build: {
        target: 'esnext',
        outDir: 'public/build',
        sourcemap: true,
    },

    optimizeDeps: {
        include: [
            '@inertiajs/react',
            'axios',
            'react-dom/client',
            'lucide-react',
            'react-hook-form',
            '@radix-ui/react-slot',
            'class-variance-authority',
            'clsx',
            'react-hot-toast',
            'tailwind-merge',
            '@radix-ui/react-label',
        ],
    },

    logLevel: 'info'
})