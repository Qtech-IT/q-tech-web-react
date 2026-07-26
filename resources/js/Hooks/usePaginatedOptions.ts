import { useState, useCallback } from 'react';
import axios from 'axios';

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  has_more: boolean;
}

interface PaginatedOption {
  value: string;
  label: string;
}

export function usePaginatedOptions() {
  const [options, setOptions] = useState<Record<string, PaginatedOption[]>>({});
  const [pagination, setPagination] = useState<Record<string, PaginationMeta>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchPaginatedOptions = useCallback(
    async (
      fieldName: string,
      routeString: string,
      params: Record<string, any>,
      page: number = 1,
      search: string = ''
    ) => {
      setLoading((prev) => ({ ...prev, [fieldName]: true }));
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));

      try {
        const response = await axios.get(route(routeString), {
          params: {
            ...params,
            page,
            search,
          },
        });

        const fetchedOptions = response.data?.data?.data || [];
        const paginationMeta = response.data?.data?.pagination;

        setOptions((prev) => {
          const existing = prev[fieldName] || [];
          const newOptions = page > 1 ? [...existing, ...fetchedOptions] : fetchedOptions;
          return { ...prev, [fieldName]: newOptions };
        });

        setPagination((prev) => ({
          ...prev,
          [fieldName]: paginationMeta,
        }));
      } catch (error) {
        const msg = axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to load options'
          : 'Error loading options';
        setErrors((prev) => ({ ...prev, [fieldName]: msg }));
      } finally {
        setLoading((prev) => ({ ...prev, [fieldName]: false }));
      }
    },
    []
  );

  const loadMoreOptions = useCallback(
    (fieldName: string, routeString: string, params: Record<string, any>, search: string = '') => {
      const currentPagination = pagination[fieldName];
      if (currentPagination && currentPagination.has_more) {
        fetchPaginatedOptions(
          fieldName,
          routeString,
          params,
          currentPagination.current_page + 1,
          search
        );
      }
    },
    [pagination, fetchPaginatedOptions]
  );

  const searchOptions = useCallback(
    (fieldName: string, routeString: string, params: Record<string, any>, search: string) => {
      // Reset to page 1 for search
      fetchPaginatedOptions(fieldName, routeString, params, 1, search);
    },
    [fetchPaginatedOptions]
  );

  const clearOptions = useCallback((fieldName: string) => {
    setOptions((prev) => ({ ...prev, [fieldName]: [] }));
    setPagination((prev : any) => ({ ...prev, [fieldName]: undefined }));
  }, []);

  return {
    options,
    pagination,
    loading,
    errors,
    fetchPaginatedOptions,
    loadMoreOptions,
    searchOptions,
    clearOptions,
  };
}