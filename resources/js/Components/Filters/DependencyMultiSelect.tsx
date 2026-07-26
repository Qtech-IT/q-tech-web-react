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

interface DependencyMultiSelectProps {
  fieldKey: string;
  label: string;
  value: string[];
  options: FilterOption[];
  onChange: (value: string[]) => void;
  dependency?: DependencyConfig | null;
  dependsOnValue?: string | string[] | null;
  isActive?: boolean;
}

export function DependencyMultiSelect({
  fieldKey,
  label,
  value = [],
  options: initialOptions,
  onChange,
  dependency,
  dependsOnValue,
  isActive = false,
}: DependencyMultiSelectProps): React.ReactElement {
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

      // Load options if dependency changed
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependency, dependsOnValue, initialOptions]);

  // --- Clear value when dependency changes ---
  useEffect(() => {
    if (!dependency || !value || value.length === 0) return;

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
      onChange([]);
    } else if (currentNormalized !== prevNormalized && prevNormalized !== '') {
      onChange([]);
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

  // Handle item selection/deselection
  const handleToggleItem = (itemValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    const isSelected = currentValues.includes(itemValue);
    
    if (isSelected) {
      onChange(currentValues.filter(v => v !== itemValue));
    } else {
      onChange([...currentValues, itemValue]);
    }
  };

  // Remove individual item
  const handleRemoveItem = (itemValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentValues = Array.isArray(value) ? value : [];
    onChange(currentValues.filter(v => v !== itemValue));
  };

  // Get selected options for display
  const selectedOptions = options.filter(opt => 
    Array.isArray(value) && value.includes(opt.value)
  );

  // Get display text
  const getDisplayText = () => {
    const count = Array.isArray(value) ? value.length : 0;
    if (count === 0) return label;
    if (count === 1 && selectedOptions.length > 0) return selectedOptions[0]!.label;
    return `${count} selected`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-auto min-h-[36px] px-3 py-2 justify-between w-full hover:bg-accent/50"
          disabled={isDisabled}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
            {selectedOptions.length === 0 ? (
              <span className="text-sm text-muted-foreground truncate">{label}</span>
            ) : (
              <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
                {selectedOptions.slice(0, 3).map(option => (
                  <Badge 
                    key={option.value} 
                    variant="secondary" 
                    className="text-xs font-normal px-2 py-0.5 bg-secondary/80 hover:bg-secondary flex items-center gap-1 max-w-[120px]"
                  >
                    <span className="truncate">{option.label}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors flex-shrink-0"
                      onClick={(e) => handleRemoveItem(option.value, e)}
                    />
                  </Badge>
                ))}
                {selectedOptions.length > 3 && (
                  <Badge variant="secondary" className="text-xs font-normal px-2 py-0.5 bg-secondary/80 flex-shrink-0">
                    +{selectedOptions.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {value.length > 0 && (
              <Badge variant="secondary" className="h-5 px-2 text-xs font-medium bg-primary/10 text-primary border-0">
                {value.length}
              </Badge>
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
                  {options.map((option) => {
                    const isSelected = Array.isArray(value) && value.includes(option.value);
                    const uniqueKey = option.id || `${fieldKey}-${option.value}`;
                    
                    return (
                      <CommandItem
                        key={uniqueKey}
                        onSelect={() => handleToggleItem(option.value)}
                        className="flex items-center justify-between cursor-pointer py-2.5 px-3 hover:bg-accent"
                      >
                        <span className="flex-1 pr-3 text-sm truncate">{option.label}</span>
                        {isSelected && (
                          <div className="flex-shrink-0 w-4 h-4 rounded-sm bg-primary flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-primary-foreground"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
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

        {value.length > 0 && !isDisabled && (
          <div className="border-t p-2 bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 text-xs font-medium hover:bg-muted"
              onClick={() => {
                onChange([]);
                setOpen(false);
              }}
            >
              Clear all ({value.length})
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}