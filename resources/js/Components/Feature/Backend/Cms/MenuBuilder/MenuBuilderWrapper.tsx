import { DeleteDialog } from '@/Components/Core/DynamicCrud/Dialog/DeleteDialog';
import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { Button } from '@/Components/UI/Button';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import type { CmsMenu, CmsMenuItem, MenuBuilderProps } from '@/Types/cms';
import { unwrapItem, unwrapList } from '@/Utils/cms';
import { restrictToParentElement } from '@/Utils/dndModifiers';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { router } from '@inertiajs/react';
import { Info, ListTree, Network, Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { CmsEmpty } from '../Shared/CmsStateBlock';
import MenuItemDialog from './MenuItemDialog';
import SortableMenuNode, { INDENT_WIDTH } from './SortableMenuNode';
import {
  flattenMenu,
  isDropAllowed,
  projectDrop,
  siblingOrderAfterMove,
} from './menuTree';
import type { DropProjection } from './menuTree';

/**
 * The menu builder — a WordPress-style nested tree.
 *
 * One flat `SortableContext` renders every level, with depth applied as
 * indentation and computed live from the pointer's horizontal offset. Nesting
 * a `SortableContext` per level would make it impossible to drag an item out
 * of its parent, because the drag would end at that context's boundary.
 *
 * A drop persists through a single `menu-items.move` call carrying both the
 * new parent and the complete new sibling order. The two guards the server
 * enforces — no reparent into your own subtree, and no exceeding the menu's
 * `max_depth` — are also checked here, so an illegal drop simply does not
 * take rather than rearranging the list and then failing validation.
 */
export function MenuBuilderWrapper(props: MenuBuilderProps) {
  const { t } = useTranslations();
  const { can } = usePermission();

  const { title, linkTypes = [], visibilities = [], statuses = [] } = props;

  const menu = useMemo(() => unwrapItem<CmsMenu>(props.menu), [props.menu]);

  const serverItems = useMemo(
    () => unwrapList<CmsMenuItem>(props.data),
    [props.data]
  );

  /** Optimistic tree; null means the server's copy is authoritative. */
  const [optimistic, setOptimistic] = useState<CmsMenuItem[] | null>(null);
  const items = optimistic ?? serverItems;

  const [collapsed, setCollapsed] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const [editing, setEditing] = useState<CmsMenuItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<CmsMenuItem | null>(null);

  const { submit, loading } = useInertiaForm();

  const maxDepth = menu?.max_depth ?? 3;

  const nodes = useMemo(() => flattenMenu(items, collapsed), [items, collapsed]);

  const projection = useMemo<DropProjection | null>(() => {
    if (activeId === null || overIndex === null) {
      return null;
    }

    return projectDrop(nodes, activeId, overIndex, offsetX, INDENT_WIDTH, maxDepth);
  }, [nodes, activeId, overIndex, offsetX, maxDepth]);

  const dropAllowed = useMemo(() => {
    if (activeId === null || !projection) {
      return true;
    }

    return isDropAllowed(items, activeId, projection, maxDepth);
  }, [items, activeId, projection, maxDepth]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const refresh = useCallback((): void => {
    setOptimistic(null);
    router.reload({ only: ['data', 'menu'] });
  }, []);

  const handleDragStart = (event: DragStartEvent): void => {
    const node = nodes.find((candidate) => candidate.item.uuid === event.active.id);

    setActiveId(node?.item.id ?? null);
    setOffsetX(0);
    setOverIndex(node ? nodes.indexOf(node) : null);
  };

  const handleDragMove = (event: DragMoveEvent): void => {
    setOffsetX(event.delta.x);

    if (event.over) {
      const index = nodes.findIndex((node) => node.item.uuid === event.over?.id);

      if (index !== -1) {
        setOverIndex(index);
      }
    }
  };

  const reset = (): void => {
    setActiveId(null);
    setOffsetX(0);
    setOverIndex(null);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const currentActive = activeId;
    const currentProjection = projection;
    const currentOverIndex = overIndex;

    reset();

    if (
      currentActive === null ||
      !currentProjection ||
      currentOverIndex === null ||
      !event.over
    ) {
      return;
    }

    if (!isDropAllowed(items, currentActive, currentProjection, maxDepth)) {
      return;
    }

    const moved = items.find((item) => item.id === currentActive);

    if (!moved) {
      return;
    }

    const siblings = siblingOrderAfterMove(
      items,
      nodes,
      currentActive,
      currentOverIndex,
      currentProjection.parentId
    );

    if (siblings.length === 0) {
      return;
    }

    const previous = items;

    /* Reflect the reparent immediately; the depth recomputes from parent_id. */
    setOptimistic(
      items.map((item) =>
        item.id === currentActive
          ? { ...item, parent_id: currentProjection.parentId }
          : item
      )
    );

    submit({
      method: 'POST',
      url: route('backend.menu-items.move', { menu_item: moved.uuid }),
      /* Parent AND full sibling order in one request — splitting them is what
         leaves a tree briefly wrong, and permanently wrong on a partial
         failure. */
      data: { parent_id: currentProjection.parentId, siblings },
      onSuccess: () => setOptimistic(null),
      onError: () => setOptimistic(previous),
    }).catch(() => setOptimistic(previous));
  };

  const deleteItem = (id: number | string): void => {
    const target = items.find((item) => item.id === id || item.uuid === id);

    if (!target) {
      return;
    }

    submit({
      method: 'DELETE',
      url: route('backend.menu-items.destroy', { menu_item: target.uuid }),
      onSuccess: () => {
        setDeleting(null);
        refresh();
      },
    }).catch(() => undefined);
  };

  const toggleCollapse = useCallback((id: number): void => {
    setCollapsed((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }, []);

  if (!menu) {
    return (
      <MainLayout title={title}>
        <CmsEmpty
          icon={Network}
          title={t('Menu not found')}
          description={t('This menu could not be loaded. It may have been deleted.')}
          action={
            <Button type="button" onClick={() => router.visit(route('backend.menus.index'))}>
              {t('Back to menus')}
            </Button>
          }
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout title={title}>
      <CommonLayoutHeader
        variant="inner"
        breadcrumbItems={[
          { label: t('Dashboard'), href: route('backend.dashboard') },
          { label: t('Menus'), href: route('backend.menus.index') },
          { label: menu.name },
        ]}
        title={menu.name}
        description={t('Drag items to reorder them, or sideways to nest them under another item.')}
        icon={ListTree}
        backUrl={route('backend.menus.index')}
        badges={[
          { label: menu.key, variant: 'outline' },
          { label: t('Max depth :depth', { depth: maxDepth }), variant: 'secondary' },
        ]}
        primaryAction={
          can('menu.create')
            ? {
                label: t('Add Item'),
                icon: Plus,
                onClick: () => {
                  setEditing(null);
                  setCreating(true);
                },
                variant: 'default',
              }
            : null
        }
      />

      <Alert>
        <Info className="w-4 h-4" aria-hidden="true" />
        <AlertDescription>
          {t('Keyboard: focus a drag handle, press Space to lift, arrow keys to move, then Space to drop.')}
        </AlertDescription>
      </Alert>

      {activeId !== null && !dropAllowed ? (
        <Alert variant="destructive" role="status">
          <AlertDescription>
            {t('That position is not allowed — an item cannot be nested inside itself, or deeper than this menu permits.')}
          </AlertDescription>
        </Alert>
      ) : null}

      {nodes.length === 0 ? (
        <CmsEmpty
          icon={Network}
          title={t('This menu has no items yet')}
          description={t('Add the first item to start building the navigation.')}
          action={
            can('menu.create') ? (
              <Button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setCreating(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                {t('Add Item')}
              </Button>
            ) : null
          }
        />
      ) : (
        <DndContext
          sensors={can('menu.reorder') ? sensors : []}
          collisionDetection={closestCenter}
          modifiers={[restrictToParentElement]}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onDragCancel={reset}
          accessibility={{
            announcements: {
              onDragStart: ({ active }) =>
                t('Picked up item :id', { id: String(active.id) }),
              onDragOver: () =>
                projection
                  ? t('Nesting level :depth', { depth: projection.depth + 1 })
                  : '',
              onDragEnd: () =>
                dropAllowed ? t('Item dropped') : t('Drop position not allowed'),
              onDragCancel: () => t('Reordering cancelled'),
            },
          }}
        >
          <SortableContext
            items={nodes.map((node) => node.item.uuid)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {nodes.map((node) => (
                <SortableMenuNode
                  key={node.item.uuid}
                  item={node.item}
                  depth={node.depth}
                  hasChildren={node.hasChildren}
                  collapsed={collapsed.includes(node.item.id)}
                  onToggleCollapse={toggleCollapse}
                  onEdit={(item) => {
                    setCreating(false);
                    setEditing(item);
                  }}
                  onDelete={setDeleting}
                  projectedDepth={
                    node.item.id === activeId ? projection?.depth : undefined
                  }
                  dropAllowed={dropAllowed}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <MenuItemDialog
        open={creating || editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false);
            setEditing(null);
          }
        }}
        menu={menu}
        item={editing}
        linkTypes={linkTypes}
        visibilities={visibilities}
        statuses={statuses}
        onSaved={refresh}
      />

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open: boolean) => setDeleting(open ? deleting : null)}
        onDelete={deleteItem}
        item={deleting}
        isSubmitting={loading}
        config={{
          title: t('Delete Menu Item'),
          description: t('Are you sure you want to delete this item?'),
          itemType: 'Menu item',
          warningMessage: t('Items nested underneath it are deleted too.'),
          showWarningAlert: true,
          showItemDetails: true,
          itemDisplayFields: [
            { label: t('Label'), key: 'label', className: 'font-semibold' },
            { label: t('Destination'), key: 'href', className: 'text-muted-foreground' },
          ],
        }}
      />
    </MainLayout>
  );
}

export default MenuBuilderWrapper;
