// ssr.tsx
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import * as ReactDOMServer from 'react-dom/server';
import {route} from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Declare global route for SSR
declare global {
  var route: (name: string, params?: Record<string, any>, absolute?: boolean) => string;
}

// Type for Ziggy props coming from the server
interface ZiggySSR {
  url: string;
  location: string;
  routes: Record<string, any>;
  [key: string]: any;
}

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString, // SSR rendering
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
      resolvePageComponent(
        `./Pages/${name}.tsx`,
        import.meta.glob('./Pages/**/*.tsx')
      ),
    setup: ({ App, props }) => {
      // Cast page.props.ziggy to known type
      const ziggy = page.props.ziggy as ZiggySSR;

      // Create global route function
      global.route = (name: string, params?: Record<string, any>, absolute?: boolean) =>
        route(name, params || {}, absolute || false, {
          ...ziggy,
          location: new URL(ziggy.location),
        });

      return <App {...props} />;
    },
  })
);
