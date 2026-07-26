
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select';
import { useTranslations } from '@/Hooks/useTranslations';

interface PaginatedSelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange: (value: string) => void;
  onLoadMore?: () => void;
  onSearch?: (search: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
  options,
  value,
  onChange,
  onLoadMore,
  onSearch,
  isLoading = false,
  hasMore = false,
  placeholder = 'Select an option',
  error,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options?.find((opt) => opt.value === value);

  // Handle scroll to load more - attach to inner scrollable div
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;

    // Load more when user scrolls near bottom (100px threshold)
    if (scrollHeight - scrollTop - clientHeight < 100 && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  // Focus search input when opening
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [open]);

  // Clear search when closing
  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  const { t } = useTranslations();

  return (
    <div className="w-full space-y-2">
      <Select
        value={value || ''}
        onValueChange={(val) => onChange(val)}
        onOpenChange={setOpen}
        disabled={disabled}
      >
        <SelectTrigger
          className={`w-full ${
            error
              ? 'border-red-500 dark:border-red-400'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          ref={contentRef}
          className="p-0"
        >
          {/* Search Input - Fixed at top */}
          <div className="sticky top-0 z-50 p-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                onKeyDown={(e) => e.stopPropagation()} // Prevent Select keyboard navigation
              />
            </div>
          </div>

          {/* Scrollable Options Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto overflow-x-hidden"
            style={{ 
              overflowY: 'auto',
              maxHeight: '240px' 
            }}
          >
            {/* Options */}
            {options.length === 0 && !isLoading ? (
              <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                {t("No options found")}
              </div>
            ) : (
              options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="px-3 py-4 text-center flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
              </div>
            )}

            {/* Load More Indicator */}
            {hasMore && !isLoading && options.length > 0 && (
              <div className="px-3 py-3 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                ↓ {t('Scroll for more results')}
              </div>
            )}
          </div>
        </SelectContent>
      </Select>

      {/* Error Message */}
      {error && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default PaginatedSelect;