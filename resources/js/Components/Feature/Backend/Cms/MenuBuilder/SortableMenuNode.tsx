import { Can } from '@/Components/Can';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsMenuItem } from '@/Types/cms';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  GripVertical,
  Heading,
  Minus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { memo } from 'react';

/** Pixels of indentation per tree level. Shared with the drop projection. */
export const INDENT_WIDTH = 28;

interface SortableMenuNodeProps {
  item: CmsMenuItem;
  depth: number;
  hasChildren: boolean;
  collapsed: boolean;
  onToggleCollapse: (id: number) => void;
  onEdit: (item: CmsMenuItem) => void;
  onDelete: (item: CmsMenuItem) => void;
  /** Live depth while this node is the drag subject; otherwise its stored depth. */
  projectedDepth?: number | undefined;
  /** False when the current drop target would be illegal. */
  dropAllowed?: boolean;
}

/**
 * One node of the menu tree.
 *
 * Indentation is applied to the inner element rather than the `<li>` so the
 * drag transform and the indent do not fight over the same transform stack.
 */
function SortableMenuNodeComponent({
  item,
  depth,
  hasChildren,
  collapsed,
  onToggleCollapse,
  onEdit,
  onDelete,
  projectedDepth,
  dropAllowed = true,
}: SortableMenuNodeProps) {
  const { t } = useTranslations();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.uuid });

  const effectiveDepth = projectedDepth ?? depth;

  const isHeading = item.link_type === 'heading';
  const isSeparator = item.link_type === 'separator';

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'relative z-10' : ''}
    >
      <div
        style={{ marginInlineStart: `${effectiveDepth * INDENT_WIDTH}px` }}
        className={`flex items-center gap-2 p-2.5 border rounded-xl bg-card transition-colors ${
          isDragging
            ? dropAllowed
              ? 'border-primary shadow-lg'
              : 'border-destructive shadow-lg'
            : 'border-border'
        }`}
      >
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={t('Reorder :name', { name: item.label })}
          className="p-1 rounded cursor-grab touch-none text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" aria-hidden="true" />
        </button>

        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggleCollapse(item.id)}
            aria-expanded={!collapsed}
            aria-label={
              collapsed
                ? t('Expand :name', { name: item.label })
                : t('Collapse :name', { name: item.label })
            }
            className="p-1 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        ) : (
          <span className="w-6" aria-hidden="true" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Structural nodes render as a heading or a rule, never as a
                focusable link to nowhere. */}
            {isHeading ? (
              <Heading className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            ) : null}
            {isSeparator ? (
              <Minus className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            ) : null}

            <span className="text-sm font-medium truncate text-foreground">
              {isSeparator ? t('Separator') : item.label}
            </span>

            {item.badge_label ? (
              <Badge variant="secondary" className="text-[10px]">
                {item.badge_label}
              </Badge>
            ) : null}

            {item.opens_in_new_tab ? (
              <ExternalLink
                className="w-3 h-3 text-muted-foreground"
                aria-label={t('Opens in a new tab')}
              />
            ) : null}

            {item.status !== 'active' ? (
              <Badge variant="outline" className="text-[10px]">
                {t('Disabled')}
              </Badge>
            ) : null}
          </div>

          {!item.is_structural ? (
            <p className="text-xs truncate text-muted-foreground">
              {item.href ?? (
                <span className="text-amber-600 dark:text-amber-400">
                  {t('Destination does not resolve')}
                </span>
              )}
            </p>
          ) : null}
        </div>

        <Badge variant="outline" className="hidden text-[10px] capitalize sm:inline-flex">
          {String(item.link_type ?? '').replace(/_/g, ' ')}
        </Badge>

        <div className="flex items-center gap-1 shrink-0">
          <Can permission="menu.edit">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={t('Edit :name', { name: item.label })}
              onClick={() => onEdit(item)}
            >
              <Pencil className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Can>

          <Can permission="menu.delete">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={t('Delete :name', { name: item.label })}
              onClick={() => onDelete(item)}
            >
              <Trash2 className="w-4 h-4 text-destructive" aria-hidden="true" />
            </Button>
          </Can>
        </div>
      </div>
    </li>
  );
}

export const SortableMenuNode = memo(SortableMenuNodeComponent);

export default SortableMenuNode;
