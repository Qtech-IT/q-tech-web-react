

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

interface UseTableFiltersOptions {
  routeName: string;
  routeParams?: any;
  initialFilters?: Record<string, any>;
}

export function useTableFilters({
  routeName,
  routeParams,
  initialFilters = {
    search: '',
    page: 1,
    sort_by: 'id',
    sort_direction: 'desc',
  },
}: UseTableFiltersOptions) {
  const page = usePage();
  const isNavigating = useRef(false);

  // Read query params from the current URL
  const queryParams = page?.url?.includes('?')
    ? Object.fromEntries(new URLSearchParams(page.url.split('?')[1]).entries())
    : {};

  // Merge URL params → initial filters
  const mergedInitials = { ...initialFilters, ...queryParams };

  const [filters, setFilters] = useState<Record<string, any>>(mergedInitials);
  const [selectedRows, setSelectedRows] = useState<Array<number | string>>([]);

  // Sync with URL when page changes (Back/Forward browser buttons)
  useEffect(() => {
    if (!isNavigating.current) {
      setFilters(mergedInitials);
    }
  }, [page.url]);

  const updateFilter = useCallback(
    (key: string, value: any) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value, page: 1 };
        
        // Prevent navigation if value hasn't actually changed
        if (prev[key] == value) {
          return prev;
        }

        isNavigating.current = true;
        navigateWithFilters(newFilters, routeParams, routeName, () => {
          isNavigating.current = false;
        });
        
        return newFilters;
      });
    },
    [routeName, routeParams]
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    isNavigating.current = true;

    router.get(route(routeName, routeParams || {}), {}, {
      preserveState: false,
      preserveScroll: true,
      onFinish: () => {
        isNavigating.current = false;
      },
    });
  }, [routeName, routeParams, initialFilters]);

  const updateSort = useCallback(
    (column: string) => {
      setFilters((prev) => {
        const newDirection =
          prev.sort_by === column && prev.sort_direction === 'asc' ? 'desc' : 'asc';

        const newFilters = {
          ...prev,
          sort_by: column,
          sort_direction: newDirection,
          page: 1,
        };

        isNavigating.current = true;
        navigateWithFilters(newFilters, routeParams, routeName, () => {
          isNavigating.current = false;
        });
        
        return newFilters;
      });
    },
    [routeName, routeParams]
  );

  const changePage = useCallback(
    (pageNum: number) => {
      setFilters((prev) => {
        const newFilters = { ...prev, page: pageNum };
        
        isNavigating.current = true;
        navigateWithFilters(newFilters, routeParams, routeName, () => {
          isNavigating.current = false;
        });
        
        return newFilters;
      });
    },
    [routeName, routeParams]
  );

  const changePerPage = useCallback(
    (perPage: number) => {
      setFilters((prev) => {
        const newFilters = { ...prev, per_page: perPage, page: 1 };
        
        isNavigating.current = true;
        navigateWithFilters(newFilters, routeParams, routeName, () => {
          isNavigating.current = false;
        });
        
        return newFilters;
      });
    },
    [routeName, routeParams]
  );

  const toggleRow = useCallback((id: number | string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleAll = useCallback((ids: Array<number | string>) => {
    setSelectedRows((prev) => (prev.length === ids.length ? [] : ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const isCollection = useMemo(() => filters.format === 'collection', [filters.format]);

  const hasFilters = useMemo(() => {
    return Object.keys(filters).some(
      (key) =>
        key !== 'page' &&
        key !== 'sort_by' &&
        key !== 'sort_direction' &&
        key !== 'per_page' &&
        filters[key]
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    updateSort,
    changePage,
    changePerPage,
    selectedRows,
    toggleRow,
    toggleAll,
    clearSelection,
    isCollection,
    hasFilters,
  };
}

// Helper
function navigateWithFilters(
  filters: Record<string, any>,
  routeParams: any,
  routeName: string,
  onFinish?: () => void
) {
  const queryParams: Record<string, any> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined || value === '') continue;

    if (key === 'date_range') {
      try {
        const range = typeof value === 'string' ? JSON.parse(value) : value;
        if (range.from && range.to) {
          queryParams[key] = `${format(new Date(range.from), 'MM/dd/yyyy')} - ${format(new Date(range.to), 'MM/dd/yyyy')}`;
        }
      } catch {
        queryParams[key] = value;
      }
    } else {
      queryParams[key] = value;
    }
  }

  router.get(route(routeName, routeParams || {}), queryParams, {
    preserveState: true,
    preserveScroll: true,
  });
}