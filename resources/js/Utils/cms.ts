import type {
  CmsCta,
  CmsMedia,
  CmsMenuItem,
  CmsPageSection,
  CmsPaginated,
  CmsSectionBlock,
  CmsSectionField,
  CmsSectionType,
} from '@/Types/cms';
import { isEmptySelectValue } from '@/Utils/helpers';

/**
 * Unwrap a list prop.
 *
 * Inertia resolves every `Responsable` it finds, including the nested
 * `AnonymousResourceCollection` inside `formatLengthAwarePagination()`, so the
 * same payload arrives as one of three shapes depending on whether it was
 * paginated and how deeply the resource nested. Normalising in one place is
 * what stops every screen inventing its own `?.data?.data` chain.
 */
export function unwrapList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) {
    return raw as T[];
  }

  if (raw && typeof raw === 'object') {
    const inner = (raw as { data?: unknown }).data;

    if (Array.isArray(inner)) {
      return inner as T[];
    }

    if (inner && typeof inner === 'object') {
      const deeper = (inner as { data?: unknown }).data;

      if (Array.isArray(deeper)) {
        return deeper as T[];
      }

      return recordValues<T>(inner);
    }

    return recordValues<T>(raw);
  }

  return [];
}

/**
 * Values of a keyed collection, or `[]` when `raw` is not one.
 *
 * `SectionTypeResource::collection($registry->all())` is handed a PHP array
 * keyed by section-type key, and a keyed PHP array serialises to a JSON
 * *object*, not an array — so `sectionTypes` arrives as
 * `{ data: { 'hero.split': {...} } }`. Treating that as "no list" is what made
 * every section report "Unknown section type" while the registry was fine.
 *
 * The every-value-is-an-object guard is what keeps this from mistaking a single
 * resource (`{ data: { id: 1, name: 'x' } }`) for a collection.
 */
function recordValues<T>(raw: object): T[] {
  const values = Object.values(raw as Record<string, unknown>);

  if (values.length === 0) {
    return [];
  }

  const allObjects = values.every(
    (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
  );

  return allObjects ? (values as T[]) : [];
}

/** Unwrap a single-resource prop, which Inertia wraps as `{ data: {...} }`. */
export function unwrapItem<T>(raw: unknown): T | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const inner = (raw as { data?: unknown }).data;

  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner as T;
  }

  return raw as T;
}

/**
 * Strip the resource envelopes from one section, recursively.
 *
 * WHY THIS IS NEEDED AT ALL
 * -------------------------
 * `PageSectionResource` nests other API Resources — `MediaResource`,
 * `CtaResource`, `SectionBlockResource::collection()` — and Laravel applies
 * `JsonResource::$wrap` to each of them independently. `->resolve()` in
 * `PageRenderService` unwraps only the OUTER collection, so what actually
 * reaches the client is `blocks: { data: [...] }` and `cta: { data: {...} }`
 * while `CmsPageSection` in `Types/cms.ts` declares them as a bare array and a
 * bare object.
 *
 * The types and the wire format disagreed, so `tsc` was happy and the runtime
 * was not: `blocksOfType` calls `.filter` on what it is told is an array, got
 * an object, threw, and `SectionBoundary` caught it — which is why a fully
 * populated hero rendered as nothing at all with no error in sight.
 *
 * Normalising here, once, is the same argument `unwrapList` already makes: the
 * alternative is every section component growing its own `?.data` chain, and
 * the first one to forget reintroduces exactly this bug.
 */
export function normalizeSection<T extends CmsPageSection>(raw: T): T {
  return {
    ...raw,
    media: unwrapItem<CmsMedia>(raw.media),
    cta: unwrapItem<CmsCta>(raw.cta),
    secondary_cta: unwrapItem<CmsCta>(raw.secondary_cta),
    gallery: unwrapList<CmsMedia>(raw.gallery),
    blocks: unwrapList<CmsSectionBlock>(raw.blocks).map(normalizeSectionBlock),
  };
}

/**
 * The same treatment for one block, and for its nested rows.
 *
 * Recursive because a repeater may nest: `children` is another wrapped
 * collection at every level, and a section that renders nesting would hit the
 * identical `.filter` crash one level down.
 */
function normalizeSectionBlock(block: CmsSectionBlock): CmsSectionBlock {
  return {
    ...block,
    media: unwrapItem<CmsMedia>(block.media),
    cta: unwrapItem<CmsCta>(block.cta),
    children: unwrapList<CmsSectionBlock>(block.children).map(
      normalizeSectionBlock
    ),
  };
}

/** Pagination meta, when the payload carries any. */
export function unwrapMeta<T>(raw: unknown): CmsPaginated<T>['meta'] | undefined {
  if (raw && typeof raw === 'object' && 'meta' in raw) {
    return (raw as CmsPaginated<T>).meta;
  }

  return undefined;
}

/* ------------------------------------------------------------------ */
/* Section registry helpers                                           */
/* ------------------------------------------------------------------ */

/** Index the registry by key, so a section resolves its type in O(1). */
export function indexSectionTypes(
  types: CmsSectionType[]
): Record<string, CmsSectionType> {
  const index: Record<string, CmsSectionType> = {};

  for (const type of types) {
    index[type.key] = type;
  }

  return index;
}

/**
 * Fields for one storage target, in declaration order.
 *
 * Mirrors `SectionTypeRegistry::fieldsFor()` so the form renders exactly the
 * set the server will accept — a field the client invents is stripped by
 * `SectionSaveRequest`, and a field it omits silently loses its value.
 */
export function fieldsForStore(
  type: CmsSectionType | null | undefined,
  store: CmsSectionField['store']
): CmsSectionField[] {
  return (type?.fields ?? []).filter((field) => field.store === store);
}

/** Ordered, de-duplicated `group` values across a field set, for tab headings. */
export function fieldGroups(fields: CmsSectionField[]): string[] {
  const groups: string[] = [];

  for (const field of fields) {
    const group = field.group || 'Content';

    if (!groups.includes(group)) {
      groups.push(group);
    }
  }

  return groups;
}

/**
 * Whether a conditional field should render right now.
 *
 * A hidden field is not cleared — the server still accepts whatever is stored,
 * and clearing on toggle would destroy content an editor is mid-way through
 * reorganising.
 */
export function isFieldVisible(
  field: CmsSectionField,
  values: Record<string, unknown>
): boolean {
  if (!field.conditional) {
    return true;
  }

  return values[field.conditional.field] === field.conditional.value;
}

/**
 * Normalise `options`, which may be a static array or an enum class name.
 *
 * An empty-valued entry is dropped: Radix throws on `<SelectItem value="">`,
 * and a descriptor that ships a placeholder-style option would otherwise take
 * the whole editor down. The trigger's own placeholder covers that case.
 */
export function fieldOptions(
  field: CmsSectionField
): Array<{ value: string | number; label: string }> {
  return Array.isArray(field.options)
    ? field.options.filter((option) => !isEmptySelectValue(option.value))
    : [];
}

/* ------------------------------------------------------------------ */
/* Trees                                                              */
/* ------------------------------------------------------------------ */

/** A node in a client-side nested tree, with its children resolved. */
export interface CmsTreeNode<T> {
  item: T;
  depth: number;
  children: Array<CmsTreeNode<T>>;
}

/**
 * Nest a flat, pre-ordered list by `parent_id`.
 *
 * The backend ships the list flat and already sorted, so this is a single pass
 * with no query and no sort — see `MenuItemController::index()`.
 */
export function buildTree<T extends { id: number; parent_id: number | null }>(
  items: T[]
): Array<CmsTreeNode<T>> {
  const nodes = new Map<number, CmsTreeNode<T>>();
  const roots: Array<CmsTreeNode<T>> = [];

  for (const item of items) {
    nodes.set(item.id, { item, depth: 0, children: [] });
  }

  for (const item of items) {
    const node = nodes.get(item.id);

    if (!node) {
      continue;
    }

    const parent = item.parent_id === null ? undefined : nodes.get(item.parent_id);

    if (parent) {
      node.depth = parent.depth + 1;
      parent.children.push(node);
    } else {
      // An orphan — parent filtered out or deleted — is promoted to root
      // rather than dropped, so no item ever becomes invisible and
      // uneditable.
      roots.push(node);
    }
  }

  return roots;
}

/** Depth-first flatten, so a nested tree can drive a single dnd-kit list. */
export function flattenTree<T>(
  nodes: Array<CmsTreeNode<T>>
): Array<CmsTreeNode<T>> {
  const flat: Array<CmsTreeNode<T>> = [];

  const walk = (list: Array<CmsTreeNode<T>>): void => {
    for (const node of list) {
      flat.push(node);
      walk(node.children);
    }
  };

  walk(nodes);

  return flat;
}

/**
 * Every descendant id of `id`, plus `id` itself.
 *
 * The menu builder uses this to refuse a reparent into the dragged node's own
 * subtree before the request leaves the browser. The server refuses it too,
 * but a rejected drop that snaps back is a far better experience than a
 * validation error after the tree has already visually reordered.
 */
export function subtreeIds<T extends { id: number; parent_id: number | null }>(
  items: T[],
  id: number
): Set<number> {
  const byParent = new Map<number | null, T[]>();

  for (const item of items) {
    const siblings = byParent.get(item.parent_id) ?? [];
    siblings.push(item);
    byParent.set(item.parent_id, siblings);
  }

  const collected = new Set<number>([id]);
  const queue: number[] = [id];

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === undefined) {
      break;
    }

    for (const child of byParent.get(current) ?? []) {
      if (!collected.has(child.id)) {
        collected.add(child.id);
        queue.push(child.id);
      }
    }
  }

  return collected;
}

/**
 * Whether `parentId` is a legal new parent for `itemId`.
 *
 * Illegal when it is the item itself or anything beneath it — that would
 * detach the subtree from the tree entirely.
 */
export function canReparent(
  items: CmsMenuItem[],
  itemId: number,
  parentId: number | null
): boolean {
  if (parentId === null) {
    return true;
  }

  return !subtreeIds(items, itemId).has(parentId);
}

/**
 * Depth of the deepest node in `itemId`'s subtree, counted from `itemId`.
 *
 * A leaf is 0. Used with `menu.max_depth` to refuse a drop that would push
 * descendants past the menu's declared limit.
 */
export function subtreeHeight(items: CmsMenuItem[], itemId: number): number {
  const children = items.filter((item) => item.parent_id === itemId);

  if (children.length === 0) {
    return 0;
  }

  return 1 + Math.max(...children.map((child) => subtreeHeight(items, child.id)));
}

/* ------------------------------------------------------------------ */
/* Misc                                                               */
/* ------------------------------------------------------------------ */

/** `move(list, from, to)` — the array reorder both builders share. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [moved] = next.splice(from, 1);

  if (moved === undefined) {
    return list;
  }

  next.splice(to, 0, moved);

  return next;
}

/** Slugify for anchors and keys. Mirrors the server's `Str::slug()` closely enough for a live preview. */
export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
