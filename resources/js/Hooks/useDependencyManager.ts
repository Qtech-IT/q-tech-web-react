import { useState, useCallback } from 'react';
import axios from 'axios';

export function useDependencyManager() {
  const [options, setOptions] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchOptions = useCallback(
    async (fieldName: string, routeString: string, params: Record<string, any>) => {
      setLoading((prev) => ({ ...prev, [fieldName]: true }));
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));

      try {
        const response = await axios.get(route(routeString, params));
        
        const fetchedOptions = response.data?.data?.options || [];
        
        setOptions((prev) => ({ ...prev, [fieldName]: fetchedOptions }));
      } catch (error) {
        const msg = axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to load options'
          : 'Error loading options';
        setErrors((prev) => ({ ...prev, [fieldName]: msg }));
        setOptions((prev) => ({ ...prev, [fieldName]: [] }));
      } finally {
        setLoading((prev) => ({ ...prev, [fieldName]: false }));
      }
    },
    []
  );

  const handleChange = useCallback(
    (fieldName: string, value: any, dependencyConfig: any[]) => {
      // Find fields that depend on this field
      const dependent = dependencyConfig.filter((d) => d.dependsOn === fieldName);

      dependent.forEach((dep) => {
        if (!value) {
          setOptions((prev) => ({ ...prev, [dep.fieldName]: [] }));
          return;
        }

        const params = { [dep.paramName]: value };
        fetchOptions(dep.fieldName, dep.endpoint, params);
      });
    },
    [fetchOptions]
  );

  const clearChild = useCallback((fieldName: string, dependencyConfig: any[]) => {
    const child = dependencyConfig.filter((d) => d.dependsOn === fieldName);
    child.forEach((c) => {
      setOptions((prev) => ({ ...prev, [c.fieldName]: [] }));
    });
  }, []);

  return { options, loading, errors, fetchOptions, handleChange, clearChild };
}