import React from 'react';
import { Button } from '@/Components/UI/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from '@/Hooks/useTranslations';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startIndex: number = (currentPage - 1) * itemsPerPage;
  const endIndex: number   = Math.min(startIndex + itemsPerPage, totalItems);


  const {t} = useTranslations();

  // Generate page numbers to display
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if endPage is at the limit
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers: number[] = getPageNumbers();

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Results info */}
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
             {t('Showing')}{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {startIndex + 1}
            </span>{' '}
            {t('to')}{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {endIndex}
            </span>{' '}
             {t('of')}{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {totalItems}
            </span>{' '}
              {t('results')}
          </div>
        </div>

        {/* Page controls */}
        <div className="flex items-center space-x-2">
          {/* First page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-3 border-gray-300 h-9 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
             {t('First')}
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 border-gray-300 h-9 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">
                 {t('Previous')}
            </span>
          </Button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((pageNum: number) => (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`h-9 min-w-9 ${
                  pageNum === currentPage
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 text-white shadow-sm'
                    : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
                }`}
              >
                {pageNum}
              </Button>
            ))}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 border-gray-300 h-9 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            <span className="hidden sm:inline">
                 {t('Next')}
            </span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 border-gray-300 h-9 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
             {t('Last')}
          </Button>
        </div>
      </div>

      {/* Mobile-friendly page info */}
      <div className="pt-4 mt-4 border-t border-gray-200 sm:hidden dark:border-gray-700">
        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
           {t('Page')} {currentPage} {t('of')} {totalPages}
        </div>
      </div>
    </div>
  );
};

export default CustomPagination;
