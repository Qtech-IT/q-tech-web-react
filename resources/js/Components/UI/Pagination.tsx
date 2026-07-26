import { Button } from '@/Components/UI/Button';
import { useTranslations } from '@/Hooks/useTranslations';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import * as React from 'react';

interface LinkItem {
  url: string | null;
  label: string;
  active?: boolean;
}

interface Links {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
  data?: LinkItem[];
}

interface Meta {
  from?: number;
  to?: number;
  total: number;
  current_page: number;
  last_page: number;
}

interface PaginationProps {
  links?: Links;
  meta?: Meta;
}

export const Pagination: React.FC<PaginationProps> = ({ links, meta }) => {
  if (!links || !meta) return null;

  const handlePageChange = (url?: string | null) => {
    if (url) {
      router.visit(url, { preserveState: true, preserveScroll: true });
    }
  };

  const { t } = useTranslations();

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">        {/* Results info */}

        <div className="flex items-center space-x-2 min-h-[24px]">
          {meta?.from && meta?.to && (
            <>
              <div className="p-2 rounded-lg bg-gray-50">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </div>
              <div className="text-sm text-gray-600">
                {t('Showing')} <span className="font-semibold text-gray-900">{meta.from}</span> {t('to')}{' '}
                <span className="font-semibold text-gray-900">{meta.to}</span> {t('of')}{' '}
                <span className="font-semibold text-gray-900">{meta.total}</span> {t('results')}
              </div>
            </>
          )}
        </div>


        {/* Page controls */}
        <div className="flex items-center space-x-2">
          {/* First page */}

          {
            links?.first
            &&
            (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(links.first)}
                disabled={!links.prev}
                className="hidden p-0 border-gray-300 sm:flex h-9 w-9 hover:bg-gray-50"
                title="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
            )
          }


          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(links.prev)}
            disabled={!links.prev}
            className="px-3 border-gray-300 h-9 hover:bg-gray-50"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">
              {t('Previous')}
            </span>
          </Button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {links.data?.map((link, index) => {
              if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                return null;
              }

              const isEllipsis = link.label.includes('...');

              if (isEllipsis) {
                return (
                  <span key={index} className="px-2 py-1 text-sm text-gray-400">
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={index}
                  variant={link.active ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(link.url)}
                  disabled={!link.url}
                  className={`h-9 min-w-9 ${link.active
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 text-white shadow-sm'
                    : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              );
            })}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(links.next)}
            disabled={!links.next}
            className="px-3 border-gray-300 h-9 hover:bg-gray-50"
            title="Next page"
          >
            <span className="hidden sm:inline">{t('Next')}</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>

          {/* Last page */}

          {
            links.last && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(links.last)}
                disabled={!links.next}
                className="hidden p-0 border-gray-300 sm:flex h-9 w-9 hover:bg-gray-50"
                title="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            )
          }

        </div>
      </div>

      {/* Mobile-friendly page info */}

      {
        meta.current_page && meta.last_page && (
          <div className="pt-4 mt-4 border-t border-gray-200 sm:hidden">
            <div className="text-sm text-center text-gray-500">
              Page {meta.current_page} of {meta.last_page}
            </div>
          </div>
        )
      }

    </div>
  );
};

export default Pagination;
