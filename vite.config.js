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
        host: true,      // allows access via network IP
        port: 5174,      // dev server port
        strictPort: true,
        watch: {
            usePolling: true, // helps with file changes on some environments
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