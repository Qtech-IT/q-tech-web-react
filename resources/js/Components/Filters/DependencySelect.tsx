
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/Components/UI/Command';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/UI/Popover';
import { Badge } from '@/Components/UI/Badge';
import axios from 'axios';
import { useTranslations } from '@/Hooks/useTranslations';

interface FilterOption {
  id?: string;
  value: string;
  label: string;
  code?: string;
}

interface DependencyConfig {
  dependsOn: string;
  endpoint: string;
  paramName: string;
  treeId: number;
  childTreeId: number | null;
}

interface DependencySelectProps {
  fieldKey: string;
  label: string;
  value: string | null;
  options: FilterOption[];
  onChange: (value: string | null) => void;
  dependency?: DependencyConfig | null;
  dependsOnValue?: string | string[] | null;
  isActive?: boolean;
}

export function DependencySelect({
  fieldKey,
  label,
  value,
  options: initialOptions,
  onChange,
  dependency,
  dependsOnValue,
  isActive = false,
}: DependencySelectProps): React.ReactElement {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);

  const normalizeOptions = (opts: any): FilterOption[] => {
    if (!opts) return [];
    if (Array.isArray(opts)) return opts;
    return [];
  };

  const [options, setOptions] = useState<FilterOption[]>(normalizeOptions(initialOptions));
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  const loadingRef = useRef(false);
  const previousDependsOnValue = useRef<string | string[] | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadDone = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastFetchedParams = useRef<string>('');

  const isDisabled = !!(dependency && !dependsOnValue);

  // Convert dependsOnValue to comma-separated string
  const getParentIdParam = useCallback(() => {
    if (!dependsOnValue) return null;
    if (Array.isArray(dependsOnValue)) {
      return dependsOnValue.filter(Boolean).join(',');
    }
    return String(dependsOnValue);
  }, [dependsOnValue]);

  // --- 1. Load options from API ---
  const loadOptions = useCallback(
    async (pageNum: number, search: string = '', resetOptions: boolean = false) => {

      if (!dependency || !dependsOnValue || loadingRef.current) return;
      const parentIdParam = getParentIdParam();
      if (!parentIdParam) return;

      // Create unique key for this fetch to prevent duplicates
      const fetchKey = `${parentIdParam}-${pageNum}-${search}`;
      
      // Skip if we're already fetching the same params
      if (loadingRef.current && lastFetchedParams.current === fetchKey) {
        return;
      }

      loadingRef.current = true;
      lastFetchedParams.current = fetchKey;
      setLoading(true);

      try {
        const response = await axios.get(dependency.endpoint, {
          params: {
            [dependency.paramName]: parentIdParam,
            child_tree_id: dependency.childTreeId,
            page: pageNum,
            per_page: 50,
            search: search,
          },
        });

        const newOptions = normalizeOptions(response.data?.data?.data);
        const pagination = response.data?.data?.pagination;

        setOptions((prev) => {
          if (resetOptions || pageNum === 1) {
            return newOptions;
          }
          // Append for load more (avoid duplicates)
          const existingValues = new Set(prev.map(opt => opt.value));
          const uniqueNewOptions = newOptions.filter(opt => !existingValues.has(opt.value));
          return [...prev, ...uniqueNewOptions];
        });

        setHasMore(pagination?.has_more || false);
        setPage(pageNum);
      } catch (error) {
        console.error('Error loading dependency options:', error);
        if (resetOptions || pageNum === 1) {
          setOptions([]);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [dependency, dependsOnValue, getParentIdParam]
  );

  // --- 2. Initial Load & Dependency Change Handler ---
  useEffect(() => {

    if (dependency) {
      const currentDepValue = dependsOnValue;
      const prevDepValue = previousDependsOnValue.current;

      // Normalize values for comparison (handle arrays properly)
      const normalizeValue = (val: any) => {
        if (!val) return '';
        if (Array.isArray(val)) {
          return val.filter(Boolean).sort().join(',');
        }
        return String(val);
      };

      const currentNormalized = normalizeValue(currentDepValue);
      const prevNormalized = normalizeValue(prevDepValue);
      const hasChanged = currentNormalized !== prevNormalized;

      

      // Reset if no dependency value
      if (!currentDepValue || (Array.isArray(currentDepValue) && currentDepValue.length === 0)) {
        setOptions([]);
        setPage(1);
        setHasMore(false);
        setSearchQuery('');
        initialLoadDone.current = false;
        previousDependsOnValue.current = null;
        lastFetchedParams.current = '';
        return;
      }

      // Load options if dependency changed OR initial load with dependency value
      if (hasChanged && currentNormalized) {
        // Reset and load new options
        setPage(1);
        setSearchQuery('');
        lastFetchedParams.current = '';
        initialLoadDone.current = true;
        loadOptions(1, '', true);
        previousDependsOnValue.current = currentDepValue;
      } else if (!initialLoadDone.current && currentNormalized) {
        // Initial load - only if not already done
        initialLoadDone.current = true;
        loadOptions(1, '', true);
        previousDependsOnValue.current = currentDepValue;
      }
    } else {
      // No dependency, use initial options
      setOptions(normalizeOptions(initialOptions));
      initialLoadDone.current = false;
      lastFetchedParams.current = '';
    }
    // Note: Intentionally excluding loadOptions, onChange, value from deps to prevent loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependency, dependsOnValue, initialOptions]);

  // --- Clear value when dependency changes (separate effect to avoid setState during render) ---
  useEffect(() => {
    if (!dependency) return;

    const normalizeValue = (val: any) => {
      if (!val) return '';
      if (Array.isArray(val)) {
        return val.filter(Boolean).sort().join(',');
      }
      return String(val);
    };

    const currentNormalized = normalizeValue(dependsOnValue);
    const prevNormalized = normalizeValue(previousDependsOnValue.current);

    // Clear value when dependency changes or becomes empty
    if (!dependsOnValue || (Array.isArray(dependsOnValue) && dependsOnValue.length === 0)) {
      // Only clear if we have a value
      if (value) {
        onChange(null);
      }
    } else if (currentNormalized !== prevNormalized && prevNormalized !== '') {
      // Parent dependency changed - always clear current value
      if (value) {
        onChange(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependsOnValue, dependency]);

  // --- 3. Search Handler (Debounced) ---
  useEffect(() => {
    if (!dependency || !dependsOnValue || !initialLoadDone.current) return;
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      loadOptions(1, searchQuery, true);
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // --- 4. Scroll Event Handler for Load More ---
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || loading || !initialLoadDone.current || loadingRef.current) return;

    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    // Check if scrolled to bottom (with 20px threshold)
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      loadOptions(page + 1, searchQuery, false);
    }
  }, [hasMore, loading, page, searchQuery, loadOptions]);

  // Reset search when closing popover
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  const selectedOption = Array.isArray(options)
    ? options.find((opt) => String(opt.value) === String(value))
    : undefined;

  // Get display text - prefer label over value
  const getDisplayText = () => {
    if (!value) return label;
    if (selectedOption?.label) return selectedOption.label;
    // Fallback: try to find in options by value
    const foundOption = options.find(opt => String(opt.value) === String(value));
    return foundOption?.label || label;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 justify-between w-full hover:bg-accent/50"
          disabled={isDisabled}
        >
          <span className="flex items-center gap-2 flex-1 min-w-0">
            <span className={`truncate text-sm ${!value ? 'text-muted-foreground' : ''}`}>
              {getDisplayText()}
            </span>
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isActive && value && (
              <Badge variant="secondary" className="h-5 px-2 text-xs font-medium bg-primary/10 text-primary border-0">
                1
              </Badge>
            )}
            {value && !isDisabled && (
              <X
                className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
              />
            )}
            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={`${t('Search')} ${label}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
            />
          </div>
          <CommandList 
            className="max-h-64 overflow-y-auto overflow-x-hidden"
            onScroll={handleScroll}
            ref={scrollContainerRef as any}
          >
            <CommandGroup>
              {loading && page === 1 ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : options.length > 0 ? (
                <>
                  {options.map((option, index) => {
                    // Create stable unique key
                    const uniqueKey = option.id || `${fieldKey}-${option.value}`;
                    const isSelected = String(value) === String(option.value);
                    
                    return (
                      <CommandItem
                        key={uniqueKey}
                        onSelect={() => {
                          onChange(value === option.value ? null : option.value);
                          setOpen(false);
                        }}
                        className="flex items-center justify-between cursor-pointer py-2.5 px-3 hover:bg-accent"
                      >
                        <span className="flex-1 pr-3 text-sm truncate">{option.label}</span>
                        {isSelected && (
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                        )}
                      </CommandItem>
                    );
                  })}
                  
                  {/* Loading indicator for load more */}
                  {hasMore && loading && page > 1 && (
                    <div className="p-2 text-center">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto text-gray-400" />
                    </div>
                  )}

                  {/* Spacer for triggering load more */}
                  {hasMore && !loading && (
                    <div className="h-2" />
                  )}
                </>
              ) : (
                <CommandEmpty className="p-4 text-sm text-center">
                  {isDisabled
                    ? `${t('Please select')} ${dependency?.dependsOn || 'parent'} ${t('first')}`
                    : searchQuery
                    ? t('No results found')
                    : t('No options available')}
                </CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
