import { useMemo } from "react";
import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@/Types/Inertia";

type QueryParams = Record<string, string>;

export function useRoute() {
  const page = usePage<SharedProps>();

  const url = String(page.url);
  const component = String(page.component);
  const props = page.props;

  return useMemo(() => ({
    url,
    component,
    props,
    is: (path: string) => url === path,
    startsWith: (path: string) => url.startsWith(path),
    contains: (segment: string) => url.includes(segment),
    matches: (pattern: string) => new RegExp(pattern).test(url),
    isComponent: (componentName: string) => component === componentName,

    segments: url.split("/").filter(Boolean),
    segment: (index: number) => url.split("/").filter(Boolean)[index] || null,
    inGroup: (groupName: string) => url.split("/").filter(Boolean).includes(groupName),

    query: (): QueryParams => {
      const urlParams = new URLSearchParams(window.location.search);
      const params: QueryParams = {};
      for (const [key, value] of urlParams) {
        params[key] = value;
      }
      return params;
    },

    hasParam: (param: string) => new URLSearchParams(window.location.search).has(param),
    param: (param: string, defaultValue: string | null = null) =>
      new URLSearchParams(window.location.search).get(param) || defaultValue,
  }), [url, component, props]);
}
