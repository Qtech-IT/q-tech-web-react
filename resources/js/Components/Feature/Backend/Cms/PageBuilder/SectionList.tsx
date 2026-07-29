import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsPageSection } from '@/Types/cms';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@/Utils/dndModifiers';
import { useCallback } from 'react';

import SortableSectionCard from './SortableSectionCard';

interface SectionListProps {
  sections: CmsPageSection[];
  /** Receives the full uuid order, already reordered. Persisting is the caller's job. */
  onReorder: (orderedUuids: string[], reordered: CmsPageSection[]) => void;
  onEdit: (section: CmsPageSection) => void;
  onDuplicate: (section: CmsPageSection) => void;
  onDelete: (section: CmsPageSection) => void;
  onToggleStatus: (section: CmsPageSection, active: boolean) => void;
  onPublish: (section: CmsPageSection) => void;
  canReorder: boolean;
  busy?: boolean;
}

/**
 * The drag-and-drop section list.
 *
 * Sortable by uuid, not id: `SectionReorderRequest` validates
 * `sections.*` as `uuid|exists:page_sections,uuid`, so the ids the DnD context
 * carries are exactly the ids the request wants. Translating between two id
 * spaces on submit is how off-by-one reorder bugs get in.
 *
 * `KeyboardSensor` is wired with `sortableKeyboardCoordinates`, which makes the
 * whole list operable with Space to lift, arrows to move, Space to drop —
 * dnd-kit announces each step through its own live region.
 */
export function SectionList({
  sections,
  onReorder,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onPublish,
  canReorder,
  busy = false,
}: SectionListProps) {
  const { t } = useTranslations();

  const sensors = useSensors(
    /**
     * An 8px activation distance means a click on the handle stays a click.
     * Without it every attempt to focus the handle starts a drag.
     */
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const from = sections.findIndex((section) => section.uuid === active.id);
      const to = sections.findIndex((section) => section.uuid === over.id);

      if (from === -1 || to === -1) {
        return;
      }

      const reordered = arrayMove(sections, from, to);

      onReorder(
        reordered.map((section) => section.uuid),
        reordered
      );
    },
    [sections, onReorder]
  );

  return (
    <DndContext
      sensors={canReorder ? sensors : []}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements: {
          onDragStart: ({ active }) =>
            t('Picked up section :id', { id: String(active.id) }),
          onDragOver: ({ over }) =>
            over ? t('Section moved over position :id', { id: String(over.id) }) : '',
          onDragEnd: ({ over }) =>
            over ? t('Section dropped') : t('Section returned to its position'),
          onDragCancel: () => t('Reordering cancelled'),
        },
      }}
    >
      <SortableContext
        items={sections.map((section) => section.uuid)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-3">
          {sections.map((section) => (
            <SortableSectionCard
              key={section.uuid}
              section={section}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              onPublish={onPublish}
              busy={busy}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

export default SectionList;
