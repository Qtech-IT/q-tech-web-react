import { Badge } from '@/Components/UI/Badge';
import Breadcrumb from '@/Components/UI/Breadcrumb';
import { Button } from '@/Components/UI/Button';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import { countActiveFilters } from '@/Utils/helpers';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Database,
  Download,
  Filter,
  Menu,
  Plus,
  Table2,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

type BreadcrumbItem = {
  label: string;
  href?: string | null;
  active?: boolean;
};

type CrudManagerHeaderProps = {
  config: any;
  breadcrumbItems?: BreadcrumbItem[];
  onCreateClick?: () => void;
  onFilterChange?: (open: boolean) => void;
  onResetFilters?: () => void;
  onStatsToggle?: (expanded: boolean) => void;
  onTrashToggle?: (trashMode: boolean) => void;
  onCollectionToggle?: (isCollection: boolean) => void;
  onExportClick?: () => void;
  onImportClick?: () => void;
  currentFilters: Record<string, any>;
  hasFilters?: boolean;
  isCollection?: boolean;
  isTrashMode?: boolean;
};

export function CrudManagerHeader({
  config,
  onCreateClick,
  onFilterChange,
  onResetFilters,
  onStatsToggle,
  onTrashToggle,
  onCollectionToggle,
  onExportClick,
  onImportClick,
  currentFilters,
  hasFilters = false,
  isCollection = false,
  isTrashMode = false,
}: CrudManagerHeaderProps) {

  const { t } = useTranslations();

  const breadcrumbItems = config?.breadcrumbs['index'] || [];

  const [isStatsExpandedDesktop, setIsStatsExpandedDesktop] = useState<boolean>(true);
  const [isStatsExpandedMobile, setIsStatsExpandedMobile] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const { can } = usePermission();

  const {
    create: createAction = '',
    restore: restoreAction = '',
    export: exportAction = '',
    import: importAction = '',
  } = config.permissions?.actions ?? {};


  const hasCreateRoute = !!config?.routes?.create || !!config?.routes?.store;


  // Handlers
  const handleStatsToggle = (isMobile = false) => {
    if (isMobile) {
      setIsStatsExpandedMobile(!isStatsExpandedMobile);
    } else {
      setIsStatsExpandedDesktop(!isStatsExpandedDesktop);
    }
    onStatsToggle?.(!isStatsExpandedDesktop);
  };

  const handleTrashToggle = () => {
    onTrashToggle?.(!isTrashMode);
  };

  const handleCollectionToggle = () => {
    onCollectionToggle?.(!isCollection);
  };

  const handleFilterToggle = (shouldClose = false) => {
    setIsFilterOpen(!isFilterOpen);
    onFilterChange?.(!isFilterOpen);

    if (shouldClose) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleCreate = () => {
    onCreateClick?.();
    setIsMobileMenuOpen(false);
  };

  const handleExport = () => {
    onExportClick?.();
    setIsMobileMenuOpen(false);
  };

  const handleImport = () => {
    onImportClick?.();
    setIsMobileMenuOpen(false);
  };

  const handleResetFilters = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onResetFilters?.();
  };

  const activeFilterCount = useMemo(() => countActiveFilters(currentFilters), [currentFilters]);

  const hasExportRoute = !!config.routes?.export;
  const hasImportRoute = !!config.routes?.import || !!config.routes?.importCreate;
  const canExport = hasExportRoute && can(exportAction);
  const canImport = hasImportRoute && can(importAction);

  const customHeaderActions = config.customHeaderActions || [];

  return (
    <div className="p-8 border shadow-sm rounded-2xl bg-card">
      <div className="space-y-6">
        {/* Breadcrumb */}
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <Breadcrumb items={breadcrumbItems} />
        )}

        {/* Header and Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight truncate">{config.title}</h1>
            {config.description && <p className="text-muted-foreground text-sm mt-1">{config.description}</p>}
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">


            {
              customHeaderActions.map((action: any) => {
                if (action.permission && !can(action.permission)) {
                  return null;
                }

                return (
                  <Button
                    key={action.key}
                    variant={action?.variant ?? 'default'}
                    size="sm"
                    onClick={() => { if (action.href) { router.visit(action.href); } else { action.onClick(); } }}
                    title={action.tooltip || action.label}
                    className={` ${action.className || 'h-9 px-3 rounded-lg'}`}
                  >
                    {action.icon && <action.icon className="w-4 h-4" />}
                    <span>{action.label}</span>
                  </Button>

                )
              })
            }
            {/* Stats Toggle */}
            {config.stats && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatsToggle(false)}
                className="h-9 px-3 rounded-lg"
                title={isStatsExpandedDesktop ? t('Hide Statistics') : t('Show Statistics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                <span>{isStatsExpandedDesktop ? 'Hide' : 'Show'} {t('Stats')}</span>
                {isStatsExpandedDesktop ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            )}

            {/* Trash Toggle */}
            {(config.routes.restore && can(restoreAction)) && (
              <Button
                variant={isTrashMode ? 'default' : 'outline'}
                size="sm"
                onClick={handleTrashToggle}
                className="h-9 px-3 rounded-lg"
                title={isTrashMode ? t('Exit Trash') : t('Recycle Bin')}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>{isTrashMode ? t('Exit Trash') : t('Trash')}</span>
              </Button>
            )}

            {/* Collection/Paginated Toggle */}
            {config?.fetchToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCollectionToggle}
                className="h-9 px-3 rounded-lg"
                title={isCollection ? 'Paginated Mode' : 'Collection Mode'}
              >
                {isCollection ? <Table2 className="w-4 h-4 mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                <span>{isCollection ? t('Collection') : t('Paginated')}</span>
              </Button>
            )}



            {/* Filter Toggle */}
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterToggle(false)}
                className="h-9 px-3 rounded-lg relative"
                title={isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              >
                <Filter className="w-4 h-4 mr-2" />
                <span>{t('Filters')}</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs group-hover:opacity-0"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Clear all filters"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Export Button - Icon with Tooltip */}
            {canExport && (
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="h-9 w-9 p-0 rounded-lg"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {t('Export')}
                </div>
              </div>
            )}

            {/* Import Button - Icon with Tooltip */}
            {canImport && (
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImport}
                  className="h-9 w-9 p-0 rounded-lg"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {t('Import')}
                </div>
              </div>
            )}

            {/* Create Button */}
            {
              (can(createAction) && hasCreateRoute)
              &&
              (
                <Button
                  onClick={handleCreate}
                  className="h-9 rounded-lg"
                  title={`Add new ${config.labels.singular.toLowerCase()}`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span>{t('Add')} {config.labels.singular}</span>
                </Button>

              )
            }

          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">



            {
              (can(createAction) && hasCreateRoute) &&
              (

                <Button
                  onClick={handleCreate}
                  className="h-9 rounded-lg"
                  size="sm"
                  title={`Add new ${config.labels.singular.toLowerCase()}`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">{t('Add')}</span>
                </Button>

              )
            }


            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-9 w-9 p-0 rounded-lg lg:hidden"
              title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2 overflow-hidden"
            >


              {
                customHeaderActions.map((action: any) => {
                  if (action.permission && !can(action.permission)) {
                    return null;
                  }

                  return (
                    <Button
                      key={action.key}
                      variant={action?.variant ?? 'default'}
                      size="sm"
                      onClick={() => { if (action.href) { router.visit(action.href); } else { action.onClick(); } }}
                      title={action.tooltip || action.label}
                      className={`w-full justify-start h-9 rounded-lg`}
                    >
                      {action.icon && <action.icon className="w-4 h-4" />}
                      <span>{action.label}</span>
                    </Button>

                  )
                })
              }




              {/* Mobile Buttons */}
              {config.stats && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatsToggle(true)}
                  className="w-full justify-start h-9 rounded-lg"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span>{isStatsExpandedMobile ? 'Hide' : 'Show'} {t('Stats')}</span>
                </Button>
              )}

              {(config.routes.restore && can(restoreAction)) && (
                <Button
                  variant={isTrashMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleTrashToggle}
                  className="w-full justify-start h-9 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>{isTrashMode ? 'Exit Trash' : 'Trash'}</span>
                </Button>
              )}

              {config?.fetchToggle && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCollectionToggle}
                  className="w-full justify-start h-9 rounded-lg"
                >
                  {isCollection ? <Table2 className="w-4 h-4 mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                  <span>{isCollection ? 'Collection' : 'Paginated'}</span>
                </Button>
              )}

              {canExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="w-full justify-start h-9 rounded-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>{t('Export')}</span>
                </Button>
              )}

              {canImport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImport}
                  className="w-full justify-start h-9 rounded-lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <span>{t('Import')}</span>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterToggle(true)}
                className="w-full justify-start h-9 rounded-lg relative"
              >
                <Filter className="w-4 h-4 mr-2" />

                <span>{t('Filters')}</span>

                {activeFilterCount > 0 && (
                  <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </Badge>
                )}

              </Button>

              {activeFilterCount > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2">
                  <button
                    onClick={(e) => {
                      handleResetFilters(e);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    <span>
                      {t('Clear Filters')}
                    </span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}