

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, RotateCcw, ChevronDown, Filter, Calendar } from 'lucide-react';
import { Input } from '@/Components/UI/Input';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from '@/Components/UI/Command';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/UI/Popover';
import { DateRangePicker } from '@/Components/UI/DateRangePicker';
import { useTranslations } from '@/Hooks/useTranslations';
import { format } from 'date-fns';
import type { DynamicFiltersProps } from '@/Types/crud';
import { countActiveFilters } from '@/Utils/helpers';
import { DependencySelect } from '@/Components/Filters/DependencySelect';
import axios from 'axios';

interface FilterOption {
  value: string | number;
  label: string;
}

interface DependencyConfig {
  dependsOn: string;
  endpoint: string;
  paramName: string;
  treeId: number;
  childTreeId: number | null;
}

interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'multi-select' | 'boolean' | 'daterange' | 'date-range' | 'date' | 'date_range' | 'text' | 'number' | 'searchable-select';
  options?: FilterOption[];
  optionsFrom?: string;
  optionValue?: string;
  optionLabel?: string;
  placeholder?: string;
  note?: string;
  isMultiple?: boolean;
  dependency?: DependencyConfig | null;
}

export function DynamicFilters({
  config,
  currentFilters,
  onFilterChange,
  onClearFilters,
  backendData = {},
}: DynamicFiltersProps): React.ReactElement {
  const [searchValue, setSearchValue] = useState<string>(currentFilters.search || '');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [dependencyOptionsCache, setDependencyOptionsCache] = useState<Record<string, FilterOption[]>>({});
  const { t } = useTranslations();

  const filterFields: FilterField[] = (config.filters?.filterFields as FilterField[]) || [];

  // Determine if a field is multi-select
  const isMultiSelect = useCallback((field: FilterField): boolean => {
    return field.isMultiple === true || field.type === 'multi-select';
  }, []);

  // Handle search
  const handleSearch = useCallback((value: string) => {
    onFilterChange('search', value || null);
  }, [onFilterChange]);

  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchValue);
    }
  }, [searchValue, handleSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    onFilterChange('search', null);
  }, [onFilterChange]);

  const updateFilter = useCallback((key: string, value: string | number | null, field: FilterField) => {
    if (isMultiSelect(field)) {
      // Multi-select: toggle value in array
      const currentValue = currentFilters[key];
      const stringValue = String(value);
      
      // Parse current value to array
      let currentArray: string[] = [];
      if (!currentValue) {
        currentArray = [];
      } else if (Array.isArray(currentValue)) {
        currentArray = currentValue;
      } else if (typeof currentValue === 'string') {
        currentArray = currentValue.split(',').filter(v => v.trim() !== '');
      } else {
        currentArray = [String(currentValue)];
      }
      
      // Toggle the value
      const updatedValue = currentArray.includes(stringValue)
        ? currentArray.filter((v) => v !== stringValue)
        : [...currentArray, stringValue];

      // Pass as comma-separated string for query params
      onFilterChange(key, updatedValue.length > 0 ? updatedValue.join(',') : null);
    } else {
      // Single-select: replace value
      onFilterChange(key, value);
    }
  }, [currentFilters, onFilterChange, isMultiSelect]);

  const handleClearAllFilters = useCallback(() => {
    setSearchValue('');
    setDependencyOptionsCache({});
    onClearFilters();
  }, [onClearFilters]);

  const getOptions = useCallback((field: FilterField): FilterOption[] => {
    if (field?.type === 'boolean') {
      return [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' }
      ];
    }

    if (field.options && Array.isArray(field.options)) {
      return field.options.filter(opt => opt.value !== null && opt.value !== '');
    }

    if (field.optionsFrom && backendData[field.optionsFrom]) {
      const data = backendData[field.optionsFrom];
      return Array.isArray(data)
        ? data.map(item => ({
            value: item[field.optionValue || 'id'],
            label: item[field.optionLabel || 'name'],
          })).filter(opt => opt.value !== null && opt.value !== '')
        : [];
    }
    return [];
  }, [backendData]);

  // Get display values as array
  const getFieldValueAsArray = useCallback((fieldValue: any): string[] => {
    if (!fieldValue) return [];
    if (Array.isArray(fieldValue)) return fieldValue;
    if (typeof fieldValue === 'string') {
      return fieldValue.split(',').filter(v => v.trim() !== '');
    }
    return [String(fieldValue)];
  }, []);

  // Fetch dependency options when needed for active filter badges
  const fetchDependencyOptionsForBadge = useCallback(async (field: FilterField, value: string) => {
    if (!field.dependency) return null;

    const cacheKey = `${field.key}-${value}`;
    if (dependencyOptionsCache[cacheKey]) {
      return dependencyOptionsCache[cacheKey];
    }

    try {
      // Get the parent value
      const parentValue = currentFilters[field.dependency.dependsOn];
      if (!parentValue) return null;

      const response = await axios.get(field.dependency.endpoint, {
        params: {
          [field.dependency.paramName]: parentValue,
          child_tree_id: field.dependency.childTreeId,
          search: '',
          page: 1,
          per_page: 100, // Get more to ensure we have the option
        },
      });

      const options = response.data?.data?.data || [];
      
      // Cache the options
      setDependencyOptionsCache(prev => ({
        ...prev,
        [cacheKey]: options
      }));

      return options;
    } catch (error) {
      console.error('Error fetching dependency options for badge:', error);
      return null;
    }
  }, [currentFilters, dependencyOptionsCache]);

  // Get label for a dependency field value
  const getDependencyLabel = useCallback(async (field: FilterField, value: string): Promise<string> => {
    const options = await fetchDependencyOptionsForBadge(field, value);
    if (!options) return value;

    const option = options.find((opt: any) => String(opt.value) === String(value));
    return option?.label || value;
  }, [fetchDependencyOptionsForBadge]);

  // Count active filters
  const activeFilterCount = useMemo(() => countActiveFilters(currentFilters), [currentFilters]);

  const totalActiveCount = activeFilterCount;

  useEffect(() => {
    setSearchValue(currentFilters.search || '');
  }, [currentFilters.search]);

  useEffect(() => {
    if (activeFilterCount > 0) setIsAdvancedOpen(true);
  }, [activeFilterCount]);

  // Component for active filter badges (handles async dependency labels)
  const ActiveFilterBadge = ({ field, value }: { field: FilterField; value: string }) => {
    const [label, setLabel] = useState<string>(value);

    useEffect(() => {
      if (field.dependency) {
        getDependencyLabel(field, value).then(setLabel);
      } else {
        const options = getOptions(field);
        const option = options.find((opt) => String(opt.value) === value);
        setLabel(option?.label || value);
      }
    }, [field, value]);

    return (
      <Badge
        variant="secondary"
        className="flex items-center gap-1.5 text-xs whitespace-nowrap h-6 pl-2 pr-1 flex-shrink-0"
      >
        <span className="flex items-center gap-1">
          <span className="font-medium">{field.label}:</span>
          <span>{label}</span>
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 w-4 h-4 rounded-sm hover:bg-destructive/20"
          onClick={() => {
            if (isMultiSelect(field)) {
              updateFilter(field.key, value as string, field);
            } else {
              onFilterChange(field.key, null);
            }
          }}
          type="button"
          aria-label={`Remove ${label}`}
        >
          <X className="w-2.5 h-2.5" />
        </Button>
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search + Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={`${t('Search')} ${config.filters?.searchFields?.join(', ') || 'all fields'}...`}
            value={searchValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchValue(newValue);
              handleSearch(newValue);
            }}
            onKeyDown={handleSearchKeyPress}
            className="pl-9 pr-9"
          />
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              type="button"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {filterFields?.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            size="sm"
            className="relative flex-shrink-0"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            {totalActiveCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {totalActiveCount}
              </Badge>
            )}
          </Button>
        )}

        {totalActiveCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAllFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('Reset')}
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isAdvancedOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border border-input bg-background rounded-lg p-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterFields?.map(field => {
                  const fieldValue = currentFilters[field.key];
                  const options = getOptions(field);
                  const valueArray = getFieldValueAsArray(fieldValue);
                  const selectedCount = valueArray.length;
                  const isActive = selectedCount > 0;
                  const isMulti = isMultiSelect(field);

                  // Date Range Filters
                  if (field.type === 'daterange' || field.type === 'date-range' || field.type === 'date_range') {
                    const dateRange = fieldValue as { from?: string; to?: string } | null;
                    const hasDateRange = dateRange?.from && dateRange?.to;
                    return (
                      <Popover key={field.key}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9 px-3 justify-between w-full">
                            <span className="flex items-center gap-2 truncate">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">
                                {hasDateRange
                                  ? `${format(new Date(dateRange.from!), 'MMM dd')} - ${format(new Date(dateRange.to!), 'MMM dd, yyyy')}`
                                  : field.label}
                              </span>
                            </span>
                            {isActive && <Badge variant="secondary" className="h-4 px-1.5 ml-1 text-xs flex-shrink-0">{selectedCount}</Badge>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="start">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{field.label}</span>
                            {isActive && (
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => onFilterChange(field.key, null)}>
                                {t('Clear')}
                              </Button>
                            )}
                          </div>
                          <DateRangePicker value={fieldValue || null} onChange={(value) => onFilterChange(field.key, value)} className="w-full" />
                        </PopoverContent>
                      </Popover>
                    );
                  }

                  // Dependency Select Filters
                  if (field.dependency) {
                    const dependsOnValue = currentFilters[field.dependency.dependsOn];
                    
                    return (
                      <DependencySelect
                          key={field.key}
                          fieldKey={field?.key! as any}
                          label={field.label}
                          value={fieldValue || null}
                          options={options as any}
                          onChange={(value) => onFilterChange(field.key, value)}
                          dependency={field.dependency}
                          dependsOnValue={dependsOnValue}
                          isActive={isActive}
                      />
                    );
                  }

                  // Regular Select Filters (Single or Multi)
                  return (
                    <Popover key={field.key}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 px-3 justify-between w-full">
                          <span className="flex items-center gap-2 truncate">
                            <Filter className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{field.label}</span>
                          </span>
                          {isActive && <Badge variant="secondary" className="h-4 px-1.5 ml-1 text-xs flex-shrink-0">{selectedCount}</Badge>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-0">
                        <Command>
                          <CommandInput placeholder={`${t('Search') || 'Search'} ${field.label}...`} />
                          <CommandList>
                            <CommandGroup>
                              {options.length > 0 ? (
                                options.map(option => {
                                  const isSelected = valueArray.includes(String(option.value));
                                  return (
                                    <CommandItem 
                                      key={String(option.value)} 
                                      onSelect={() => updateFilter(field.key, option.value, field)} 
                                      className="flex justify-between cursor-pointer"
                                    >
                                      <span className="flex-1 pr-2 truncate">{option.label}</span>
                                      {isSelected && (
                                        <div className="flex-shrink-0">
                                          {isMulti ? (
                                            <div className="w-4 h-4 rounded border border-primary bg-primary flex items-center justify-center">
                                              <span className="text-white text-xs">✓</span>
                                            </div>
                                          ) : (
                                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                                          )}
                                        </div>
                                      )}
                                    </CommandItem>
                                  );
                                })
                              ) : (
                                <div className="p-2 text-center text-sm text-muted-foreground">{t('No options available')}</div>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                        {isMulti && selectedCount > 0 && (
                          <div className="border-t p-2 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{selectedCount} selected</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs" 
                              onClick={() => onFilterChange(field.key, null)}
                            >
                                {t('Clear')}
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  );
                })}
              </div>

              {/* Active Filters Display */}
              {totalActiveCount > 0 && (
                <div className="pt-3 space-y-2 border-t">
                  <span className="text-xs font-medium sm:text-sm text-muted-foreground">
                    {t('Active filters') || 'Active filters'}:
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
                    {/* Search badge */}
                    {searchValue && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1.5 text-xs whitespace-nowrap h-6 pl-2 pr-1 flex-shrink-0"
                      >
                        <span className="flex items-center gap-1">
                          <span className="font-medium">{t('Search') || 'Search'}:</span>
                          <span>{searchValue}</span>
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 w-4 h-4 rounded-sm hover:bg-destructive/20"
                          onClick={handleClearSearch}
                          type="button"
                          aria-label="Remove search"
                        >
                          <X className="w-2.5 h-2.5" />
                        </Button>
                      </Badge>
                    )}

                    {/* Filter badges */}
                    {filterFields.flatMap((field: FilterField) => {
                      const fieldValue = (currentFilters as Record<string, any>)[field.key];
                      if (!fieldValue) return [];

                      // Date range filters
                      if (field.type === 'daterange' || field.type === 'date-range' || field.type === 'date_range') {
                        const dateRange = fieldValue as { from?: string; to?: string };
                        if (dateRange?.from && dateRange?.to) {
                          return [
                            <Badge
                              key={`${field.key}-range`}
                              variant="secondary"
                              className="flex items-center gap-1.5 text-xs whitespace-nowrap h-6 pl-2 pr-1 flex-shrink-0"
                            >
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{field.label}:</span>
                                <span>
                                  {format(new Date(dateRange.from), 'MMM dd')} -{' '}
                                  {format(new Date(dateRange.to), 'MMM dd, yyyy')}
                                </span>
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 w-4 h-4 rounded-sm hover:bg-destructive/20"
                                onClick={() => onFilterChange(field.key, null)}
                                type="button"
                                aria-label={`Remove ${field.label} filter`}
                              >
                                <X className="w-2.5 h-2.5" />
                              </Button>
                            </Badge>,
                          ];
                        }
                        return [];
                      }

                      // Multi-select and regular filters (including dependency filters)
                      const valueArray = getFieldValueAsArray(fieldValue);

                      return valueArray.map((value: string) => (
                        <ActiveFilterBadge key={`${field.key}-${value}`} field={field} value={value} />
                      ));
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DynamicFilters;