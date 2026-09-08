import { Can } from '@/Components/Can';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu';
import { Switch } from '@/Components/UI/Switch';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CmsPageSection } from '@/Types/cms';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertTriangle,
  Clock,
  Copy,
  GripVertical,
  Layers,
  MoreVertical,
  Pencil,
  Radio,
  Trash2,
} from 'lucide-react';
import { memo } from 'react';

interface SortableSectionCardProps {
  section: CmsPageSection;
  onEdit: (section: CmsPageSection) => void;
  onDuplicate: (section: CmsPageSection) => void;
  onDelete: (section: CmsPageSection) => void;
  onToggleStatus: (section: CmsPageSection, active: boolean) => void;
  onPublish: (section: CmsPageSection) => void;
  /** True while the reorder request for this list is in flight. */
  busy?: boolean;
}

/**
 * One row of the section list.
 *
 * Memoised because a drag re-renders the whole list on every pointer move, and
 * the cards carry badges and dropdowns that are not free to rebuild.
 *
 * The drag handle is a `<button>` with dnd-kit's keyboard listeners attached
 * rather than the whole card being draggable: making the card itself the
 * handle would swallow clicks on the actions inside it, and would give the
 * keyboard sensor no focusable target.
 */
function SortableSectionCardComponent({
  section,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onPublish,
  busy = false,
}: SortableSectionCardProps) {
  const { t } = useTranslations();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.uuid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isActive = section.status === 'active';
  const isPublished = section.publish_status === 'published';
  const isScheduled = section.publish_status === 'scheduled';

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border bg-card transition-shadow ${
        isDragging ? 'z-10 shadow-lg border-primary' : 'border-border'
      } ${busy ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={t('Reorder :name', { name: section.name ?? section.section_type })}
          className="p-1 -m-1 rounded cursor-grab touch-none text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold truncate text-foreground">
              {section.name || section.type_label || section.section_type}
            </h3>

            {/* A section whose type left the registry still renders here so it
                can be deleted or re-typed — it just cannot be edited. */}
            {section.is_known_type ? (
              <Badge variant="outline" className="gap-1 text-[10px]">
                <Layers className="w-3 h-3" aria-hidden="true" />
                {section.type_label ?? section.section_type}
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1 text-[10px]">
                <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                {t('Unknown type: :type', { type: section.section_type })}
              </Badge>
            )}

            {isPublished ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <Radio className="w-3 h-3" aria-hidden="true" />
                {t('Published')}
              </span>
            ) : null}

            {isScheduled ? (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <Clock className="w-3 h-3" aria-hidden="true" />
                {section.published_at ?? t('Scheduled')}
              </span>
            ) : null}

            {!isPublished && !isScheduled ? (
              <Badge variant="secondary" className="text-[10px] capitalize">
                {String(section.publish_status ?? '').replace(/_/g, ' ') || t('Draft')}
              </Badge>
            ) : null}
          </div>

          {section.heading ? (
            <p className="text-sm truncate text-muted-foreground">{section.heading}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground/70">
              {t('No heading set')}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {section.anchor ? <code>#{section.anchor}</code> : null}
            {section.blocks && section.blocks.length > 0 ? (
              <span>{t(':count items', { count: section.blocks.length })}</span>
            ) : null}
            {section.block_id ? <span>{t('From a global block')}</span> : null}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Can permission="section.edit">
            <div className="items-center hidden gap-2 sm:flex">
              <Switch
                checked={isActive}
                disabled={busy}
                onCheckedChange={(checked) => onToggleStatus(section, checked)}
                aria-label={t('Enable :name', {
                  name: section.name ?? section.section_type,
                })}
              />
            </div>
          </Can>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={t('Actions for :name', {
                  name: section.name ?? section.section_type,
                })}
              >
                <MoreVertical className="w-4 h-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
              <Can permission="section.edit">
                <DropdownMenuItem
                  disabled={!section.is_known_type}
                  onSelect={() => onEdit(section)}
                >
                  <Pencil className="w-4 h-4 mr-2" aria-hidden="true" />
                  {t('Edit content')}
                </DropdownMenuItem>
              </Can>

              <Can permission="section.publish">
                <DropdownMenuItem onSelect={() => onPublish(section)}>
                  <Radio className="w-4 h-4 mr-2" aria-hidden="true" />
                  {t('Publishing…')}
                </DropdownMenuItem>
              </Can>

              {/* Duplicating is authorised as `create`: a duplicate is a
                  pre-filled create, and it always lands as a draft. */}
              <Can permission="section.create">
                <DropdownMenuItem onSelect={() => onDuplicate(section)}>
                  <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                  {t('Duplicate')}
                </DropdownMenuItem>
              </Can>

              <Can permission="section.delete">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => onDelete(section)}
                >
                  <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                  {t('Delete')}
                </DropdownMenuItem>
              </Can>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
}

export const SortableSectionCard = memo(SortableSectionCardComponent);

export default SortableSectionCard;
