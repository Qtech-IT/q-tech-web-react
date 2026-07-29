import { Can } from '@/Components/Can';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Label } from '@/Components/UI/Label';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import type {
  CmsBlockTypeDefinition,
  CmsSectionBlock,
  CmsSectionField,
} from '@/Types/cms';
import { restrictToParentElement, restrictToVerticalAxis } from '@/Utils/dndModifiers';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import CmsDynamicField from '../Shared/CmsDynamicField';
import { CmsEmpty } from '../Shared/CmsStateBlock';

interface SectionRepeaterProps {
  /** The section these items belong to. Repeater items cannot exist without one. */
  pageSectionId: number;
  blockType: string;
  definition: CmsBlockTypeDefinition;
  items: CmsSectionBlock[];
  /** Nesting level — `min`/`max` are per level, not per section. */
  parentId?: number | null;
  depth?: number;
  onChanged: () => void;
}

/**
 * A repeater: the `store: 'block'` half of the registry, backed by real
 * `section_blocks` rows.
 *
 * Repeaters are rows and not a JSON array for two reasons the schema doc is
 * explicit about: a JSON array index is not a stable translation address, and
 * two editors reordering at once corrupt an array but merely race on rows.
 *
 * Items nest, so this component renders itself for each item's children. The
 * `max` cap is enforced per level, matching `SectionBlockService::guardCount()`
 * — a section with `max: 8` allows eight top-level items *and* eight children
 * under each of them.
 */
export function SectionRepeater({
  pageSectionId,
  blockType,
  definition,
  items,
  parentId = null,
  depth = 0,
  onChanged,
}: SectionRepeaterProps) {
  const { t } = useTranslations();

  const { submit, loading } = useInertiaForm();

  /** Optimistic order, reverted if the server rejects the reorder. */
  const [order, setOrder] = useState<CmsSectionBlock[] | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);

  const siblings = useMemo(
    () =>
      (order ?? items)
        .filter((item) => (item.parent_id ?? null) === parentId)
        .sort((a, b) => a.sort_order - b.sort_order),
    [order, items, parentId]
  );

  const max = definition.max ?? 0;
  const atCapacity = max > 0 && siblings.length >= max;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const persistOrder = useCallback(
    (reordered: CmsSectionBlock[]): void => {
      const previous = order ?? items;

      setOrder(reordered);

      submit({
        method: 'POST',
        url: route('backend.section-blocks.reorder'),
        data: { blocks: reordered.map((item) => item.uuid) },
        onSuccess: () => {
          setOrder(null);
          onChanged();
        },
        /* Snap back on failure — a list that keeps a rejected order is
           lying about what the server holds. */
        onError: () => setOrder(previous),
      }).catch(() => setOrder(previous));
    },
    [order, items, submit, onChanged]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const from = siblings.findIndex((item) => item.uuid === active.id);
      const to = siblings.findIndex((item) => item.uuid === over.id);

      if (from === -1 || to === -1) {
        return;
      }

      persistOrder(arrayMove(siblings, from, to));
    },
    [siblings, persistOrder]
  );

  const addItem = (): void => {
    submit({
      method: 'POST',
      url: route('backend.section-blocks.store'),
      data: {
        page_section_id: pageSectionId,
        parent_id: parentId,
        block_type: blockType,
        label: '',
        /* `SectionBlockSaveRequest` requires both of these, so a new row must
           carry them or the create fails on an empty form. */
        link_type: 'none',
        status: 'active',
      },
      onSuccess: onChanged,
    }).catch(() => undefined);
  };

  const updateItem = (item: CmsSectionBlock, patch: Record<string, unknown>): void => {
    submit({
      method: 'POST',
      url: `${route('backend.section-blocks.update', { section_block: item.uuid })}?_method=PATCH`,
      data: {
        page_section_id: item.page_section_id,
        parent_id: item.parent_id,
        block_type: item.block_type,
        label: item.label,
        value: item.value,
        description: item.description,
        body: item.body,
        icon: item.icon,
        link_type: item.link_type,
        link_url: item.link_url,
        status: item.status,
        sort_order: item.sort_order,
        ...patch,
      },
      onSuccess: onChanged,
    }).catch(() => undefined);
  };

  const deleteItem = (item: CmsSectionBlock): void => {
    submit({
      method: 'DELETE',
      url: route('backend.section-blocks.destroy', { section_block: item.uuid }),
      onSuccess: onChanged,
    }).catch(() => undefined);
  };

  return (
    <div className={depth > 0 ? 'mt-3 ps-4 border-s border-border' : 'space-y-3'}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            {definition.label ?? blockType}
          </Label>
          <Badge variant="outline" className="text-[10px]">
            {max > 0
              ? t(':used of :max', { used: siblings.length, max })
              : t(':count items', { count: siblings.length })}
          </Badge>
        </div>

        <Can permission="section.edit">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={atCapacity || loading}
            onClick={addItem}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
            {t('Add item')}
          </Button>
        </Can>
      </div>

      {atCapacity ? (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {t('This level is full. Remove an item before adding another.')}
        </p>
      ) : null}

      {siblings.length === 0 ? (
        <CmsEmpty
          title={t('No items yet')}
          description={t('Add the first one to start filling this repeater.')}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={siblings.map((item) => item.uuid)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {siblings.map((item) => (
                <RepeaterRow
                  key={item.uuid}
                  item={item}
                  fields={definition.fields ?? []}
                  expanded={expanded.includes(item.id)}
                  onToggle={() =>
                    setExpanded((current) =>
                      current.includes(item.id)
                        ? current.filter((id) => id !== item.id)
                        : [...current, item.id]
                    )
                  }
                  onUpdate={(patch) => updateItem(item, patch)}
                  onDelete={() => deleteItem(item)}
                  busy={loading}
                >
                  {/* Children of this item, capped against this item rather
                      than against the section. */}
                  <SectionRepeater
                    pageSectionId={pageSectionId}
                    blockType={blockType}
                    definition={definition}
                    items={items}
                    parentId={item.id}
                    depth={depth + 1}
                    onChanged={onChanged}
                  />
                </RepeaterRow>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

interface RepeaterRowProps {
  item: CmsSectionBlock;
  /** `blockTypes[type].fields` — the item's schema, same shape as a section's. */
  fields: CmsSectionField[];
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Record<string, unknown>) => void;
  onDelete: () => void;
  busy: boolean;
  children: React.ReactNode;
}

/**
 * One repeater item, rendered from its block type's own field descriptors.
 *
 * `blockTypes()` declares a `fields` array per block type using exactly the
 * same `SectionField::make()` shape a section uses, so the item form is driven
 * by the registry for the same reason the section form is: a new block type
 * needs no frontend change. A `stat` item gets value/label/description/icon
 * and a `logo` item gets name/media, because that is what the PHP says — not
 * because this component knows the difference.
 */
function RepeaterRow({
  item,
  fields,
  expanded,
  onToggle,
  onUpdate,
  onDelete,
  busy,
  children,
}: RepeaterRowProps) {
  const { t } = useTranslations();

  /** Local edits, flushed to the server on blur so typing is not a request. */
  const [draft, setDraft] = useState<Record<string, unknown>>({});

  const readValue = (field: CmsSectionField): unknown => {
    if (field.name in draft) {
      return draft[field.name];
    }

    if (field.store === 'column') {
      if (field.name === 'media_id') {
        return item.media?.id ?? null;
      }

      if (field.name === 'cta_id') {
        return item.cta?.id ?? null;
      }

      return (item as unknown as Record<string, unknown>)[field.name] ?? '';
    }

    const bag = (field.store === 'settings' ? item.settings : item.data) ?? {};

    return (bag as Record<string, unknown>)[field.name];
  };

  /**
   * A media or CTA pick is a reference change, not a keystroke, so it is
   * persisted immediately — there is no blur to wait for on a dialog.
   */
  const commit = (field: CmsSectionField, value: unknown, immediate = false): void => {
    setDraft((current) => ({ ...current, [field.name]: value }));

    if (!immediate) {
      return;
    }

    onUpdate(patchFor(field, value, item));
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.uuid });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-xl border bg-background ${
        isDragging ? 'z-10 shadow-md border-primary' : 'border-border'
      }`}
    >
      <div className="flex items-center gap-2 p-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={t('Reorder :name', { name: item.label || t('item') })}
          className="p-1 rounded cursor-grab touch-none text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <GripVertical className="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex items-center flex-1 min-w-0 gap-2 text-left rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}
          <span className="text-sm truncate text-foreground">
            {item.label || t('Untitled item')}
          </span>
          {item.value ? (
            <Badge variant="secondary" className="text-[10px] shrink-0">
              {item.value}
            </Badge>
          ) : null}
        </button>

        <Can permission="section.delete">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={busy}
            aria-label={t('Delete item')}
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 text-destructive" aria-hidden="true" />
          </Button>
        </Can>
      </div>

      {expanded ? (
        <div className="p-3 pt-0 space-y-4">
          {fields.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              {t('This item type declares no editable fields.')}
            </p>
          ) : null}

          {fields.map((field) => (
            <CmsDynamicField
              key={`${field.store}.${field.name}`}
              field={field}
              value={readValue(field)}
              disabled={busy}
              media={field.name === 'media_id' ? (item.media ?? null) : null}
              cta={field.name === 'cta_id' ? (item.cta ?? null) : null}
              onChange={(value) =>
                commit(field, value, ['media', 'cta', 'select', 'switch', 'boolean'].includes(field.type))
              }
              onMediaChange={() => undefined}
              onCtaChange={() => undefined}
            />
          ))}

          {/* Text fields flush on blur rather than per keystroke. */}
          <div
            onBlur={() => {
              for (const field of fields) {
                if (field.name in draft) {
                  onUpdate(patchFor(field, draft[field.name], item));
                }
              }

              setDraft({});
            }}
          />

          {children}
        </div>
      ) : null}
    </li>
  );
}

export default SectionRepeater;

/**
 * Turn one field's new value into the partial payload
 * `SectionBlockSaveRequest` expects.
 *
 * `column` fields are top-level attributes; `data` and `settings` are merged
 * into their bag rather than replacing it, so editing one key never drops the
 * others.
 */
function patchFor(
  field: CmsSectionField,
  value: unknown,
  item: CmsSectionBlock
): Record<string, unknown> {
  if (field.store === 'column') {
    return { [field.name]: value };
  }

  const key = field.store === 'settings' ? 'settings' : 'data';
  const bag = (field.store === 'settings' ? item.settings : item.data) ?? {};

  return { [key]: { ...bag, [field.name]: value } };
}
