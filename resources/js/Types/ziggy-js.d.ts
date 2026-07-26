declare module 'ziggy-js' {
  import { Config } from 'ziggy-js';

  export interface ZiggyConfig extends Config {}

  export function route(
    name: string,
    params?: Record<string, any>,
    absolute?: boolean,
    config?: ZiggyConfig
  ): string;

  export const Ziggy: ZiggyConfig;
}
