import { useState, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import type { PaginationMeta, UsePaginationOptions } from '@/Types/User';
import { route } from 'ziggy-js';

export function usePagination(options: UsePaginationOptions) {

  const { routeName, initialMeta, preserveState = true, preserveScroll = true } = options;
  const [meta, setMeta] = useState<PaginationMeta | undefined>(initialMeta);

  /*
   * Navigate to specific page
   */
  const goToPage = useCallback(
    (page: number) => {
      router.get(
        route(routeName),
        { page },
        {
          preserveState,
          preserveScroll,
          only: ['data', 'meta'],
          onSuccess: (page:any) => {
            const newMeta = page.props.meta as PaginationMeta;
            if (newMeta) {
              setMeta(newMeta);
            }
          },
        }
      );
    },
    [routeName, preserveState, preserveScroll]
  );

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (meta && meta.current_page < meta.last_page) {
      goToPage(meta.current_page + 1);
    }
  }, [meta, goToPage]);

  /**
   * Go to previous page
   */
  const previousPage = useCallback(() => {
    if (meta && meta.current_page > 1) {
      goToPage(meta.current_page - 1);
    }
  }, [meta, goToPage]);

  /**
   * Go to first page
   */
  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  /**
   * Go to last page
   */
  const lastPage = useCallback(() => {
    if (meta) {
      goToPage(meta.last_page);
    }
  }, [meta, goToPage]);

  /**
   * Change items per page
   */
  const changePerPage = useCallback(
    (perPage: number) => {
      router.get(
        route(routeName),
        {  page: 1 },
        {
          preserveState,
          preserveScroll,
          only: ['data', 'meta'],
          onSuccess: (page:any) => {
            const newMeta = page.props.meta as PaginationMeta;
            if (newMeta) {
              setMeta(newMeta);
            }
          },
        }
      );
    },
    [routeName, preserveState, preserveScroll]
  );

  /**
   * Calculate page numbers to display
   */
  const pageNumbers = useMemo(() => {
    if (!meta) return [];

    const { current_page, last_page } = meta;
    const delta = 2; // Number of pages to show on each side
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= last_page; i++) {
      if (i === 1 || i === last_page || (i >= current_page - delta && i <= current_page + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }, [meta]);

  /**
   * Check if we're on first page
   */
  const isFirstPage = useMemo(() => {
    return meta ? meta.current_page === 1 : true;
  }, [meta]);

  /**
   * Check if we're on last page
   */
  const isLastPage = useMemo(() => {
    return meta ? meta.current_page === meta.last_page : true;
  }, [meta]);

  /**
   * Get pagination info text
   */
  const paginationText = useMemo(() => {
    if (!meta || meta.total === 0) {
      return 'No items';
    }
    return `Showing ${meta.from} to ${meta.to} of ${meta.total} items`;
  }, [meta]);

  return {
    meta,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changePerPage,
    pageNumbers,
    isFirstPage,
    isLastPage,
    paginationText,
  };
}

