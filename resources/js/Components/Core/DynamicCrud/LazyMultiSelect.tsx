import React, { useRef, useEffect, useState, use } from 'react';
import { Input } from '@/Components/UI/Input';
import { Badge } from '@/Components/UI/Badge';
import { CheckboxPremative } from '@/Components/UI/CheckboxPremative';
import { Loader2, Search, X } from 'lucide-react';
import { cn } from '@/Utils/helpers';
import { useTranslations } from '@/Hooks/useTranslations';


interface LazyMultiSelectProps {
  id?: string;
  value: any;
  onChange: (value: any) => void;
  options?: Array<{ value: string; label: string }>;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const LazyMultiSelect: React.FC<LazyMultiSelectProps> = ({
  id,
  value,
  onChange,
  options = [],
  loading = false,
  disabled = false,
  error,
  placeholder = 'Select options...',
  onSearch,
  onScroll,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const {t} = useTranslations();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const input = dropdownRef.current.querySelector<HTMLInputElement>('input[type="text"]');
      if (input) {
        input.focus();
      }
    }
  }, [isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleToggle = (optionValue: string, currentValues: string[]) => {
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];
    return newValues;
  };

  const handleRemove = (optionValue: string, currentValues: string[]) => {
    const newValues = currentValues.filter((v) => v !== optionValue);
    onChange(newValues);
  };

  const getSelectedLabels = (values: string[]) => {
    return values
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean);
  };

  const selectedValues = Array.isArray(value) ? value : [];

  return (
    <div ref={dropdownRef} className="relative">
      {/* Selected Items Display */}
      <div
        className={cn(
          'min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedValues.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {getSelectedLabels(selectedValues).map((label: any, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="gap-1"
              >
                {label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(selectedValues[index], selectedValues);
                  }}
                  className="hover:bg-destructive/20 rounded-full p-0.5 ml-1"
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {/* Search Input */}
          {onSearch && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            className="max-h-60 overflow-y-auto p-1"
            onScroll={onScroll}
          >
            {options?.length === 0 && !loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t('No options found.')}
              </div>
            ) : (
              <>
                {options.map((option , index) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <div
                      key={option.value +"_"+ index}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-sm cursor-pointer hover:bg-accent',
                        isSelected && 'bg-accent/50'
                      )}
                      onClick={() => {
                        const newValues = handleToggle(option.value, selectedValues);
                        onChange(newValues);
                      }}
                    >
                      
                       <span className="text-sm flex-1">{option.label}</span>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                      {t('Loading more...')}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyMultiSelect;