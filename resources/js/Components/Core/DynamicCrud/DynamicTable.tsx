
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/UI/Table';
import { CheckCircle, ChevronDown, ChevronUp, Circle, Clock, Edit, Eye, GripVertical, MoreVertical, RotateCcw, Trash2, XCircle } from 'lucide-react';

import { BulkActionsCard } from '@/Components/Core/DynamicCrud/BulkActionsCard';
import { BulkActionDialog } from '@/Components/Core/DynamicCrud/Dialog/BulkActionDialog';
import { Card, CardContent } from '@/Components/UI/Card';
import { CheckboxPremative } from '@/Components/UI/CheckboxPremative';
import { Switch } from '@/Components/UI/Switch';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import type { DynamicTableProps } from '@/Types/crud';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CustomActionSubmenu } from './CustomActionOption';

interface SortableRowProps {
  row: any;
  index: number;
  config: any;
  selectedRows: Array<number | string>;
  onToggleRow?: (id: number | string) => void;
  onEdit?: (row: any) => void;
  onView?: (row: any) => void;
  onDelete?: (row: any) => void;
  onRestore?: (row: any) => void;
  onUpdateStatus?: (id: number | string, status: string) => void;
  isTrashMode: boolean;
  renderCellContent: (row: any, column: any) => React.ReactNode;
  t: (key: string) => string;
  can: (permission: string) => boolean;
  isSuperAdmin: boolean;
  user: any;
  isDragEnabled: boolean;
  editAction: string;
  deleteAction: string;
  restoreAction: string;
  permanentDeleteAction: string;
}

function SortableRow({
  row,
  index,
  config,
  selectedRows,
  onToggleRow,
  onEdit,
  onView,
  onDelete,
  onRestore,
  onUpdateStatus,
  isTrashMode,
  renderCellContent,
  t,
  can,
  isSuperAdmin,
  user,
  isDragEnabled,
  editAction,
  deleteAction,
  restoreAction,
  permanentDeleteAction,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id, disabled: !isDragEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Row: any = TableRow;

  return (
    <Row
      ref={setNodeRef}
      style={style}
      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      {isDragEnabled && (
        <TableCell className="px-4 py-4 cursor-move" {...attributes} {...listeners}>
          <GripVertical className="w-4 h-4 text-gray-400" />
        </TableCell>
      )}

      {config?.table?.selectable && (
        <TableCell className="px-6 py-4">
          <CheckboxPremative
            checked={selectedRows.includes(row.id)}
            onCheckedChange={() => onToggleRow?.(row.id)}
            className="border-gray-300 dark:border-gray-600"
          />
        </TableCell>
      )}

      {config?.table?.serializable && (
        <TableCell className="px-6 py-4  text-gray-700 dark:text-gray-300">
          #{index + 1}
        </TableCell>
      )}

      {config?.table?.columns.map((column: any) => (
        <TableCell key={column.key} className="px-6 py-4">
          {renderCellContent(row, column)}
        </TableCell>
      ))}

      {config?.table?.actions !== false && (
        <TableCell className="sticky right-0 z-10 px-6 py-4 text-center bg-white dark:bg-gray-900">
          {config?.labels?.key === 'user' && row.id === user?.id ? (
            '-'
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <span className="sr-only">{t('Open menu')}</span>
                  <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-sm font-semibold">
                  {t('Actions')}
                </DropdownMenuLabel>

                {config.routes.show && !isTrashMode && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onView?.(row)}
                      className="text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100"
                    >
                      <Eye className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" />
                      {t('View')}
                    </DropdownMenuItem>
                  </>
                )}

                {!isTrashMode && (
                  <>
                    {config.routes.update && can(editAction) && (
                      <DropdownMenuItem
                        onClick={() => onEdit?.(row)}
                        className="text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100"
                      >
                        <Edit className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" />
                        {t('Edit')}
                      </DropdownMenuItem>
                    )}

                    {config.statusType === 'binary' && config.routes.updateStatus && can(editAction) && (
                      <>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Circle className="w-4 h-4 mr-2" />
                            {t('Change Status')}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus?.(row.id, 'active')}
                              disabled={row.status === 'active'}
                            >
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              {t('Active')}
                              {row.status === 'active' && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {t('Current')}
                                </Badge>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onUpdateStatus?.(row.id, 'inactive')}
                              disabled={row.status === 'inactive'}
                            >
                              <XCircle className="w-4 h-4 mr-2 text-gray-500" />
                              {t('Inactive')}
                              {row.status === 'inactive' && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {t('Current')}
                                </Badge>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </>
                    )}

                    {config?.table?.customActionSubmenus && (
                      <>
                        <DropdownMenuSeparator />
                        {config?.table?.customActionSubmenus?.map((submenuConfig: any) => {
                          const hasPermission = can(submenuConfig.permission);

                          if (!hasPermission) return null;



                          if (submenuConfig?.actions?.length > 0) {
                            // Filter actions based on visible function
                            const visibleActions = submenuConfig?.actions?.filter((action: any) => {
                              // If visible function exists, use it; otherwise show the action
                              if (action.visible && typeof action.visible === 'function') {
                                return action.visible(row);
                              }
                              return true;
                            });

                            // Don't show submenu if no visible actions
                            if (!visibleActions) return null;
                          }




                          return (
                            <CustomActionSubmenu
                              key={submenuConfig.key}
                              config={submenuConfig}
                              item={row}
                            />
                          );
                        })}
                      </>
                    )}

                    {config.routes.destroy && can(deleteAction) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(row)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('Delete')}
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}

                {isTrashMode && (
                  <>
                    {can(restoreAction) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onRestore?.(row)}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          {t('Restore')}
                        </DropdownMenuItem>
                      </>
                    )}

                    {can(permanentDeleteAction) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(row)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('Permanent Delete')}
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      )}
    </Row>
  );
}

export function DynamicTable({
  config,
  data,
  selectedRows = [],
  clearSelection,
  onToggleRow,
  onToggleAll,
  onSort,
  onEdit,
  onView,
  onDelete,
  onRestore,
  onBulkAction,
  onUpdateStatus,
  sortBy,
  sortDirection,
  bulkActionLoader = false,
}: DynamicTableProps) {

  const { t } = useTranslations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { can, user, isSuperAdmin } = usePermission();
  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const {
    create: createAction = '',
    edit: editAction = '',
    restore: restoreAction = '',
    delete: deleteAction = '',
    permanentDelete: permanentDeleteAction = ''
  } = config.permissions?.actions ?? {};

  const isDragEnabled = config?.table?.dragdrop === true && !window.location.search.includes('is_trash=1') && can(editAction);
  const SortableRowAny = SortableRow as any;


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item: any) => item.id === active.id);
      const newIndex = items.findIndex((item: any) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Update order levels and send to backend
      const updatedOrders = newItems.map((item: any, index: number) => ({
        id: item.id,
        order_level: index + 1,
      }));

      // Call the route from config
      if (config?.table?.dragdropRoute) {
        router.post(
          route(config.table.dragdropRoute, config.routeParams?.index || {}),
          { orders: updatedOrders },
          {
            preserveScroll: true,
            preserveState: true,
          }
        );
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const isAllSelected = data?.length > 0 && data.every((item: { id: number | string }) => selectedRows.includes(item.id));

  const isTrashMode = window.location.search.includes('is_trash=1');

  const handleBulkActionApply = (ids: Array<number | string>, action: string) => {
    onBulkAction?.(ids, action);
  };

  const renderCellContent = (row: any, column: any) => {
    // If column has a custom render function in config, use it
    if (column.render && typeof column.render === 'function') {
      return column.render(row);
    }

    const value = column.relationKey
      ? column.relationKey.split('.').reduce((obj: any, key: string) => obj?.[key], row)
      : row[column.key];

    switch (column.renderType) {
      case 'avatar':
        return (
          <div className="flex items-center gap-3 max-w-full">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10">
              {row.img_url ? (
                <img
                  src={row.img_url}
                  alt={value}
                  className="w-10 h-10 object-cover rounded-full border"
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-gray-100 dark:bg-gray-700">
                  {column.defaultIcon && (
                    <column.defaultIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium text-gray-900 dark:text-gray-100
                          truncate leading-tight"
                title={value}
              >
                {value}
              </p>
            </div>
          </div>
        );


      case 'status':
        return (
          <div className="flex items-center gap-2">
            {config.statusType === 'binary' && onUpdateStatus ? (
              <>
                <Switch
                  disabled={!can(editAction)}
                  checked={row.status === 'active'}
                  onCheckedChange={() => onUpdateStatus(row.id, row.status === 'active' ? 'inactive' : 'active')}
                />
                <span className="text-xs text-muted-foreground capitalize">{row.status}</span>
              </>
            ) : (
              <Badge variant={value === 'active' ? 'default' : 'secondary'}>
                {value}
              </Badge>
            )}
          </div>
        );

      case 'badge':
        return <Badge variant="outline">{value}</Badge>;

      case 'boolean-badge':
        return (
          <Badge variant={value ? 'default' : 'outline'}>
            {t(value ? 'Yes' : 'No')}
          </Badge>
        );

      case 'date':
        return (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {value || 'N/A'}
          </div>
        );

      case 'percentage':
        return `${value || 0}%`;

      default:
        return value || '-';
    }
  };

  const label = config?.labels?.plural ?? null;

  const TRASH_ACTIONS = ['restore', 'permanent_delete'];

  const bulkActionConfig = {
    title: `Bulk ${label} Actions`,
    description: `Apply an action to ${selectedRows.length} selected ${label?.toLowerCase()}.`,

    // Build actions safely
    actions: (() => {
      const availableActions = config?.table?.bulkActions ?? [];

      const actionMap: Record<string, any> = {
        delete: {
          value: 'delete',
          label: t(`Delete Selected`),
          icon: Trash2,
          description: t(`Remove selected ${label?.toLowerCase()}`),
        },

        active: {
          value: 'active',
          label: t(`Activate Selected`),
          icon: CheckCircle,
          description: t(`Update status for selected ${label?.toLowerCase()}`)
        },

        inactive: {
          value: 'inactive',
          label: t(`Deactivate Selected`),
          icon: XCircle,
          description: t(`Update status for selected ${label?.toLowerCase()}`)
        },

        restore: {
          value: 'restore',
          label: `Restore Selected`,
          icon: RotateCcw,
          description: t(`Restore selected ${label?.toLowerCase()}`)
        },

        permanent_delete: {
          value: 'permanent_delete',
          label: `Permanent Delete Selected`,
          icon: Trash2,
          description: t(`Permanently remove selected ${label?.toLowerCase()}`)
        },
        pending: {
          value: 'pending',
          label: t(`Pending Selected`),
          icon: Clock,
          description: t(`Update status for selected ${label?.toLowerCase()}`)
        },
        approved: {
          value: 'approved',
          label: t(`Approved Selected`),
          icon: CheckCircle,
          description: t(`Update status for selected ${label?.toLowerCase()}`)
        },
        declined: {
          value: 'declined',
          label: t(`Declined Selected`),
          icon: XCircle,
          description: t(`Update status for selected ${label?.toLowerCase()}`)
        },
      };

      // Convert names to action objects
      const mappedActions = availableActions
        .map((action: any) => actionMap[action.key])
        .filter(Boolean);

      // Apply Trash Mode Filter
      if (isTrashMode) {
        return mappedActions.filter((a: typeof actionMap[keyof typeof actionMap]) => {
          if (!TRASH_ACTIONS.includes(a.value)) return false;
          let permission = availableActions?.find((act: any) => act.key === a.value)?.permission;
          if (!permission) return true;
          if (permission === 'superadmin_check') return isSuperAdmin;
          return can(permission);
        });
      }

      return mappedActions.filter((a: typeof actionMap[keyof typeof actionMap]) => {
        if (TRASH_ACTIONS.includes(a.value)) return false;

        let permission = availableActions?.find((act: any) => act.key === a.value)?.permission;

        // Permission check
        if (!permission) return true; // no permission needed
        if (permission === 'superadmin_check') return isSuperAdmin;
        return can(permission);
      });

    })(),

    warningMessage: t(
      `This action will affect ${selectedRows.length} ${label?.toLowerCase()}. This action cannot be undone.`
    ),

    showWarningAlert: true
  };

  const tableContent = (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <TableHeader className="bg-gray-50 dark:bg-gray-800">
        <TableRow>
          {isDragEnabled && (
            <TableHead className="w-12 px-4 py-3"></TableHead>
          )}

          {config?.table?.selectable && (
            <TableHead className="w-12 px-6 py-3">
              <CheckboxPremative
                checked={isAllSelected}
                onCheckedChange={() => onToggleAll?.(data.map((item: { id: number | string }) => item.id))}
                className="border-gray-300 dark:border-gray-600"
              />
            </TableHead>
          )}

          {config?.table?.serializable && (
            <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">
              {t('Serial')}
            </TableHead>
          )}

          {config?.table?.columns?.map((column: any) => (
            <TableHead
              key={column.key}
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300"
              onClick={column.sortable ? () => onSort?.(column.key) : undefined}
              style={column.sortable ? { cursor: 'pointer' } : {}}
            >
              <div className="flex items-center gap-2">
                {column.label}
                {column.sortable && (
                  sortBy === column.key ? (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )
                  ) : (
                    <ChevronUp className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                  )
                )}
              </div>
            </TableHead>
          ))}
          {config?.table?.actions !== false && (
            <TableHead className="sticky right-0 z-20 px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase bg-gray-50 dark:text-gray-300 dark:bg-gray-800">
              {t('Actions')}
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
        {items?.map((row: any, index: number) => (
          <SortableRowAny
            key={row.id}
            row={row}
            index={index}
            config={config}
            selectedRows={selectedRows}
            onToggleRow={onToggleRow}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onRestore={onRestore}
            onUpdateStatus={onUpdateStatus}
            isTrashMode={isTrashMode}
            renderCellContent={renderCellContent}
            t={t}
            can={can}
            isSuperAdmin={isSuperAdmin}
            user={user}
            isDragEnabled={isDragEnabled}
            editAction={editAction}
            deleteAction={deleteAction}
            restoreAction={restoreAction}
            permanentDeleteAction={permanentDeleteAction}
          />
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      {(config?.table?.selectable && selectedRows.length > 0) && (
        <BulkActionsCard
          selectedItems={selectedRows}
          onOpenBulkDialog={() => { setDialogOpen(true) }}
          onClearSelection={() => clearSelection()}
        />
      )}

      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isDragEnabled ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items.map((item: any) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tableContent}
                </SortableContext>
              </DndContext>
            ) : (
              tableContent
            )}
          </div>
        </CardContent>
      </Card>

      {(selectedRows.length > 0) && (
        <BulkActionDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          selectedItems={selectedRows}
          config={bulkActionConfig}
          onApply={handleBulkActionApply}
          loading={bulkActionLoader}
        />
      )}
    </>
  );
}