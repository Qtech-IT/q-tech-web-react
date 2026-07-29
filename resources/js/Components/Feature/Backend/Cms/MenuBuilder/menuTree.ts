import type { CmsMenuItem } from '@/Types/cms';
import { buildTree, flattenTree, subtreeHeight, subtreeIds } from '@/Utils/cms';

/** One row of the flattened tree the sortable list actually renders. */
export interface FlatMenuNode {
  item: CmsMenuItem;
  depth: number;
  parentId: number | null;
  /** True when this node has children, so the row can show a collapse control. */
  hasChildren: boolean;
}

/**
 * Flatten a menu into the single ordered list dnd-kit sorts.
 *
 * A nested `SortableContext` per level cannot express "drag this item out of
 * its parent and into its uncle" — the drag would end at the boundary of its
 * own context. One flat list plus a depth projection is how dnd-kit's own
 * tree example does it, and it is the only shape that supports reparenting.
 */
export function flattenMenu(
  items: CmsMenuItem[],
  collapsed: number[] = []
): FlatMenuNode[] {
  const nodes = flattenTree(buildTree(items));

  const hidden = new Set<number>();

  for (const id of collapsed) {
    for (const descendant of subtreeIds(items, id)) {
      if (descendant !== id) {
        hidden.add(descendant);
      }
    }
  }

  return nodes
    .filter((node) => !hidden.has(node.item.id))
    .map((node) => ({
      item: node.item,
      depth: node.depth,
      parentId: node.item.parent_id,
      hasChildren: items.some((candidate) => candidate.parent_id === node.item.id),
    }));
}

export interface DropProjection {
  depth: number;
  parentId: number | null;
}

/**
 * Where a drop would land, given the horizontal offset of the pointer.
 *
 * Dragging right increases depth (become a child of the row above); dragging
 * left decreases it (become a sibling of an ancestor). The result is clamped
 * to what is structurally legal — you cannot be deeper than one level below
 * the previous row, and you cannot be shallower than the next row requires.
 */
export function projectDrop(
  nodes: FlatMenuNode[],
  activeId: number,
  overIndex: number,
  dragOffsetX: number,
  indentWidth: number,
  maxDepth: number
): DropProjection {
  const activeIndex = nodes.findIndex((node) => node.item.id === activeId);

  if (activeIndex === -1) {
    return { depth: 0, parentId: null };
  }

  const moved = [...nodes];
  const [carried] = moved.splice(activeIndex, 1);

  if (!carried) {
    return { depth: 0, parentId: null };
  }

  moved.splice(overIndex, 0, carried);

  const previous = moved[overIndex - 1];
  const next = moved[overIndex + 1];

  const projected = carried.depth + Math.round(dragOffsetX / indentWidth);

  /* One level deeper than the row above at most — anything more would skip a
     level and leave a hole in the tree. */
  const maxAllowed = previous ? previous.depth + 1 : 0;
  const minAllowed = next ? next.depth : 0;

  /* The dragged subtree travels with the node, so its own height counts
     against the menu's declared max_depth. */
  let depth = Math.max(minAllowed, Math.min(projected, maxAllowed));

  depth = Math.max(0, Math.min(depth, Math.max(0, maxDepth - 1)));

  if (depth === 0) {
    return { depth: 0, parentId: null };
  }

  /* Walk back to the nearest preceding row at depth - 1: that is the parent. */
  for (let index = overIndex - 1; index >= 0; index -= 1) {
    const candidate = moved[index];

    if (candidate && candidate.depth === depth - 1) {
      return { depth, parentId: candidate.item.id };
    }
  }

  return { depth: 0, parentId: null };
}

/**
 * Whether a projected drop is legal.
 *
 * Two rules, both enforced here as well as on the server: an item may not
 * become its own descendant, and the subtree it carries may not push past the
 * menu's `max_depth`. Client-side checks turn an illegal drop into a drop that
 * simply does not take, rather than a validation error arriving after the list
 * has already visually rearranged.
 */
export function isDropAllowed(
  items: CmsMenuItem[],
  activeId: number,
  projection: DropProjection,
  maxDepth: number
): boolean {
  if (projection.parentId !== null) {
    if (subtreeIds(items, activeId).has(projection.parentId)) {
      return false;
    }
  }

  return projection.depth + subtreeHeight(items, activeId) < maxDepth;
}

/**
 * The ordered uuid list of the destination parent's children after the move.
 *
 * `MenuItemMoveRequest` wants the whole sibling set in one request, not a
 * per-node call: splitting reparent from reorder is what produces a tree that
 * is briefly wrong between the two, and permanently wrong if the second
 * request fails.
 */
export function siblingOrderAfterMove(
  items: CmsMenuItem[],
  nodes: FlatMenuNode[],
  activeId: number,
  overIndex: number,
  parentId: number | null
): string[] {
  const activeIndex = nodes.findIndex((node) => node.item.id === activeId);

  const moved = [...nodes];
  const [carried] = moved.splice(activeIndex, 1);

  if (!carried) {
    return [];
  }

  moved.splice(overIndex, 0, carried);

  /* Siblings under the new parent, in the visual order the drop produced. */
  const ordered = moved
    .filter((node) =>
      node.item.id === activeId ? true : (node.item.parent_id ?? null) === parentId
    )
    .map((node) => node.item.uuid);

  /* Collapsed descendants never appear in `nodes`, but they are still
     siblings; append any that the visual pass missed. */
  for (const item of items) {
    if (
      (item.parent_id ?? null) === parentId &&
      item.id !== activeId &&
      !ordered.includes(item.uuid)
    ) {
      ordered.push(item.uuid);
    }
  }

  return ordered;
}
