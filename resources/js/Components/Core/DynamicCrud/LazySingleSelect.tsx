import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/Components/UI/Input';
import { Badge } from '@/Components/UI/Badge';
import { Loader2, Search, X, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/Utils/helpers';
import { useTranslations } from '@/Hooks/useTranslations';

interface LazySingleSelectProps {
  id?: string;
  value: any;
  onChange: (value: any) => void;
  options?: Array<{ value: string; label: string }>;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
  onSearch?: (query: string) => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const LazySingleSelect: React.FC<LazySingleSelectProps> = ({
  id,
  value,
  onChange,
  options = [],
  loading = false,
  disabled = false,
  error,
  placeholder = 'Select option...',
  required = false,
  onSearch,
  onScroll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslations();

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

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const getSelectedLabel = () => {
    if (!value) return null;
    const selected = options.find((opt) => opt.value === value);
    return selected?.label || value;
  };

  const selectedLabel = getSelectedLabel();

  return (
    <div ref={dropdownRef} className="relative">
      {/* Selected Item Display */}
      <div
        className={cn(
          'flex items-center justify-between min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex items-center gap-2">
          {selectedLabel ? (
            <span className="text-gray-900 dark:text-gray-100">{selectedLabel}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!required && value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="hover:bg-destructive/10 rounded-full p-1 transition-colors"
              title={t('Clear selection')}
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
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
                  placeholder={t('Search options...')}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1" onScroll={onScroll}>
            {/* None option for non-required fields */}
            {!required && (
              <div
                className={cn(
                  'flex items-center justify-between gap-2 px-3 py-2 rounded-sm cursor-pointer hover:bg-accent',
                  !value && 'bg-accent/50'
                )}
                onClick={() => handleSelect(null as any)}
              >
                <span className="text-sm text-muted-foreground">{t('None')}</span>
                {!value && <Check className="w-4 h-4 text-primary" />}
              </div>
            )}

            {options?.length === 0 && !loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t('No options found.')}
              </div>
            ) : (
              <>
                {options.map((option, index) => {
                  const isSelected = value === option.value;
                  return (
                    <div
                      key={option.value + '_' + index}
                      className={cn(
                        'flex items-center justify-between gap-2 px-3 py-2 rounded-sm cursor-pointer hover:bg-accent',
                        isSelected && 'bg-accent/50'
                      )}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className="text-sm flex-1">{option.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
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

export default LazySingleSelect;