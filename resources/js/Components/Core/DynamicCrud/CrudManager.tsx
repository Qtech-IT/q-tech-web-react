import { router } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import React, { useState } from 'react';

// UI Components
import { StatsCard } from '@/Components/Feature/Stats/StatsCard';
import { Collapsible, CollapsibleContent } from '@/Components/UI/Collapsible';
import { AnimatePresence, motion } from 'framer-motion';
import { DynamicDialog } from './Dialog/DynamicDialog';


import { DeleteDialog } from '@/Components/Core/DynamicCrud/Dialog/DeleteDialog';
import EmptyTableState from '@/Components/UI/EmptyTableState';
import Pagination from '@/Components/UI/Pagination';
import { CrudManagerHeader } from './CrudManagerHeader';
import { DynamicFilters } from './DynamicFilters';
import { DynamicTable } from './DynamicTable';

// Hooks
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTableFilters } from '@/Hooks/useTableFilters';

// Layouts

// Types
import { MainLayout } from '@/Layouts/User/MainLayout';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import { buildRouteParams } from '@/Utils/helpers';
import { DynamicViewDialog } from './Dialog/DynamicViewDialog';
import { RestoreDialog } from './Dialog/RestoreDialog';

interface CrudManagerProps extends CrudPageProps {
  config: CrudConfig;
  customDialogs?: Record<string, React.ComponentType<any>>;
}

export function CrudManager(props: CrudManagerProps) {

  const { config, title, data, stats, modelProperty, advanceFilter, customDialogs = {}, customActions = null } = props;

  // Normalize API data into a "list"
  const raw: any = data;
  const list: any[] =
    Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.data?.data)
          ? raw.data.data
          : [];

  // Pagination meta
  const meta: any = raw?.meta ?? null;
  const links: any = raw?.links ?? null;

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'delete' | 'restore' | 'view'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Stats State
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [isStatsExpandedDesktop, setIsStatsExpandedDesktop] = useState(true);

  // Custom Dialog States
  const [activeCustomDialog, setActiveCustomDialog] = useState<string | null>(null);
  const [customDialogData, setCustomDialogData] = useState<any>(null);

  // CRUD Manager Hook
  const {
    create,
    update,
    destroy,
    bulkDestroy,
    bulkAction,
    updateStatus,
    restore,
    isSubmitting,
    errors
  } = useCrudManager({
    config,
    onSuccess: (action) => {
      if (action === 'create' || action === 'update' || action === 'delete' || action === 'restore') {
        setDialogOpen(false);
        setSelectedItem(null);
      }

      if (action === 'bulk-action') {
        clearSelection();
      }
    },
  });

  // Table Filters Hook
  const {
    filters,
    updateFilter,
    resetFilters,
    updateSort,
    changePage,
    changePerPage,
    selectedRows,
    toggleRow,
    toggleAll,
    clearSelection,
    isCollection,
    hasFilters
  } = useTableFilters({
    routeName: config.routes.index!,
    routeParams: config?.routeParams?.index! || {},
    initialFilters: {
      search: '',
      page: 1,
      sort_by: config?.table?.defaultSort!,
      sort_direction: config?.table?.defaultSortDirection,
    },
  });

  // Filter section visibility
  const [isFilterOpen, setIsFilterOpen] = useState(hasFilters);
  const isTrashMode = filters.is_trash === '1';

  const formDisplayMode = config?.formDisplayMode;
  const isModalForm = formDisplayMode === 'modal';


  // -------------------------
  // Handlers
  // -------------------------


  const handleExport = () => {
    router.get(route(config.routes.export!), filters, {
      preserveState: true,
      preserveScroll: true,
    });

  };

  const handleImport = () => {
    router.visit(route(config.routes.importCreate!))
  }


  const handleCreate = () => {

    if (isModalForm) {
      setDialogMode('create');
      setSelectedItem(null);
      setDialogOpen(true);
    } else {
      let routeParams = config?.routeParams?.create || null;
      router.visit(route(config.routes.create!, routeParams))
    }


  };

  const handleEdit = (item: any) => {

    if (!isModalForm && config?.routes?.edit) {

      let routeParams = config?.routeParams?.edit || null;

      if (routeParams) {

        routeParams = buildRouteParams(routeParams, [
          { pattern: '{item.id}', value: item?.uuid ? item?.uuid : item?.id }]);

        router.visit(route(config.routes.edit, routeParams));

      } else {
        router.visit(route(config.routes.edit, item?.uuid ? item?.uuid : item?.id));
      }

    } else {
      setDialogMode('edit');
      setSelectedItem(item);
      setDialogOpen(true);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (dialogMode === 'create') {
      create(data);
    } else if (selectedItem) {
      update(selectedItem.id, data);
    }
  };

  const handleBulkAction = (ids: Array<number | string>, action: string) => {
    bulkAction(ids, action);
  };

  const handleView = (item: any) => {
    if (config.viewDisplayMode == 'modal') {
      setDialogMode('view');
      setSelectedItem(item);
      setDialogOpen(true);
    }
    else {


      let routeParams = config?.routeParams?.show || null;

      let routeName = config?.routes?.show;


      if (routeParams) {

        routeParams = buildRouteParams(routeParams, [
          { pattern: '{item.id}', value: item?.uuid ? item?.uuid : item?.id }]);

        router.visit(route(routeName!, routeParams));

      } else {
        router.visit(route(routeName!, item?.uuid ? item?.uuid : item?.id));
      }
    }
  };

  const handleDestroy = (item: any) => {
    setDialogMode('delete');
    setSelectedItem(item);
    setDialogOpen(true);
  };



  const handleRestore = (item: any) => {

    setDialogMode('restore');
    setSelectedItem(item);
    setDialogOpen(true);

  };

  // -------------------------
  // Render Table
  // -------------------------

  const renderTable = () => {
    if (list?.length === 0) {
      return (
        <EmptyTableState
          icon={config?.table?.emptyMessageIcon || Edit}
          title={`No ${config?.labels?.plural.toLowerCase()} found`}
          description={config?.table?.emptyMessage || `No ${config?.labels?.plural.toLowerCase()} available.`}
        />
      );
    }

    return (
      <>
        <div className="space-y-6">

          <DynamicTable
            config={config}
            data={list}
            isCollection={isCollection}
            selectedRows={selectedRows}
            clearSelection={clearSelection}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
            onSort={updateSort}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDestroy}
            onRestore={handleRestore}
            onBulkDelete={bulkDestroy}
            onBulkAction={handleBulkAction}
            onUpdateStatus={updateStatus}
            onPageChange={changePage}
            onPerPageChange={changePerPage}
            customActions={customActions}
            sortBy={filters?.sort_by}
            sortDirection={filters?.sort_direction as 'asc' | 'desc'}
            bulkActionLoader={isSubmitting}
          />

        </div>

        {(links || meta) && <Pagination links={links} meta={meta} />}
      </>
    );
  };

  // -------------------------
  // Render Stats Cards
  // -------------------------

  const renderStatsCards = (statConfig: any, stats: any) => {
    const key = statConfig.key;
    const value = stats[key] ?? null;

    const changeKey = `${statConfig.key}_${key}`;
    const change = stats.hasOwnProperty(changeKey) ? stats[changeKey] : null;

    return (
      <StatsCard
        key={statConfig.key}
        title={statConfig.title}
        value={value}
        change={change}
        icon={statConfig.icon}
        iconColor={statConfig.iconColor}
        iconBgColor={statConfig.iconBgColor}
        description={statConfig.description}
      />
    );
  };

  // -------------------------
  // Return
  // -------------------------

  return (

    <MainLayout title={title} >


      {/* Page Header */}
      <CrudManagerHeader
        config={config}
        onCreateClick={handleCreate}
        onFilterChange={(isOpen) => setIsFilterOpen(isOpen)}
        onResetFilters={resetFilters}
        onExportClick={handleExport}
        onImportClick={handleImport}
        onStatsToggle={(isExpanded) => setIsStatsExpandedDesktop(isExpanded)}
        onTrashToggle={(isTrash) => updateFilter('is_trash', isTrash ? '1' : null)}
        onCollectionToggle={(isCollection) => updateFilter('format', isCollection ? 'collection' : null)}
        currentFilters={filters}
        hasFilters={hasFilters}
        isCollection={isCollection}
        isTrashMode={isTrashMode}
      />

      {/* Stats Section */}
      {config.stats && stats && (
        <>
          {/* Desktop Stats */}
          <Collapsible open={isStatsExpandedDesktop} className="hidden md:block">
            <CollapsibleContent>
              <motion.div
                initial={false}
                animate={{
                  opacity: isStatsExpandedDesktop ? 1 : 0,
                  height: isStatsExpandedDesktop ? 'auto' : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {config.stats.map((statConfig) => renderStatsCards(statConfig, stats))}
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* Mobile Stats */}
          <AnimatePresence>
            {isStatsExpanded && (
              <motion.div
                className="md:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  {config.stats.map((statConfig) => renderStatsCards(statConfig, stats))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Filters */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DynamicFilters
              config={config}
              currentFilters={filters}
              onFilterChange={updateFilter}
              onClearFilters={resetFilters}
              backendData={props}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      {
        config?.customTableComponent ? config.customTableComponent(props) : renderTable()
      }




      {/* Create/Edit Dialog */}
      {(dialogMode === 'create' || dialogMode === 'edit') && (
        <DynamicDialog
          config={config}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode={dialogMode}
          item={selectedItem}
          isSubmitting={isSubmitting}
          serverErrors={errors}
          backendData={props}
        />
      )}


      {/* ViewDialog */}
      {(dialogMode === 'view') && (
        <DynamicViewDialog
          config={config}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          item={selectedItem}
          isSubmitting={isSubmitting}
          serverErrors={errors}
          size={config?.viewDialogConfig?.size}
        />
      )}

      {/* Delete Dialog */}
      {dialogMode === 'delete' && (
        <DeleteDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          item={selectedItem}
          config={config?.destroyDialogConfig}
          onDelete={destroy}
          isSubmitting={isSubmitting}
        />
      )}


      {/* Restore Dialog */}
      {dialogMode === 'restore' && (
        <RestoreDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          item={selectedItem}
          onRestore={restore}
          isSubmitting={isSubmitting}
        />
      )}


      {/* Custom Dialogs */}
      {activeCustomDialog && customDialogs[activeCustomDialog] &&
        React.createElement(customDialogs[activeCustomDialog], {
          open: !!activeCustomDialog,
          onOpenChange: (open: boolean) => {
            if (!open) {
              setActiveCustomDialog(null);
              setCustomDialogData(null);
            }
          },
          data: customDialogData,
        })}

    </MainLayout>


  );
}
