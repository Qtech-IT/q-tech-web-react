import { DynamicFormInput } from '@/Components/Core/DynamicCrud/DynamicFormInput';
import { Badge } from '@/Components/UI/Badge';
import { Card, CardContent } from '@/Components/UI/Card';
import { useTranslations } from '@/Hooks/useTranslations';
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
import { Eye, EyeOff, GripVertical, Lock, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FormFieldPreviewProps {
  fields: any[];
  formId: string | number;
  dragdropRoute?: string;
  editable?: boolean;
}

interface SortableFieldProps {
  field: any;
  editable: boolean;
}

function SortableField({ field, editable }: SortableFieldProps) {
  const { t } = useTranslations();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id, disabled: !editable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Convert field values to options format for DynamicFormInput
  const fieldOptions = field.values
    ? Object.entries(field.values).map(([key, value]: [string, any]) => ({
      value: value,
      label: key,
    }))
    : [];

  // Dummy state for preview (no actual functionality)
  const [previewValue, setPreviewValue] = useState<any>(field.default_value || '');

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="border-l-4 border-l-blue-500 hover:shadow-sm transition-all duration-200"
    >
      <CardContent className="p-5">
        <div className="flex gap-3">
          {/* Drag Handle */}
          {editable && (
            <div
              className="flex-shrink-0 cursor-move pt-1.5"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
            </div>
          )}

          {/* Field Content */}
          <div className="flex-1 space-y-3">
            {/* Field Label & Attributes */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {field.label}
                  {field.is_required && <span className="text-red-500 ml-1">*</span>}
                </label>

              </div>

              {/* Compact Badges */}
              <div className="flex gap-1 flex-wrap justify-end">
                {field.is_required && (
                  <Badge variant="outline" className="text-[11px] px-1.5 py-0.5 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                    <Zap className="w-2.5 h-2.5 mr-0.5" />
                    {t('Required')}
                  </Badge>
                )}

                {field.is_read_only && (
                  <Badge variant="outline" className="text-[11px] px-1.5 py-0.5 bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800">
                    <Lock className="w-2.5 h-2.5 mr-0.5" />
                    {t('Read Only')}
                  </Badge>
                )}

                {field.is_hidden && (
                  <Badge variant="outline" className="text-[11px] px-1.5 py-0.5 bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                    <EyeOff className="w-2.5 h-2.5 mr-0.5" />
                    {t('Hidden')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Input Preview using DynamicFormInput */}
            <div className="relative">

              <DynamicFormInput
                field={{
                  type: field.input_type,
                  label: field.label,
                  placeholder: field.placeholder,
                  description: field.description,
                  rows: 3,
                } as any}
                value={previewValue as any}
                onChange={setPreviewValue as any}
                disabled={field.is_read_only as any}
                options={fieldOptions as any}
                formData={{ input_type: field.input_type } as any}
                editorRef={null as any}
              />
              {/* Disabled Overlay for non-functional preview */}
              <div className="absolute inset-0 cursor-not-allowed" onClick={(e) => e.preventDefault()} />
            </div>


          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FormFieldPreview({
  fields = [],
  formId,
  dragdropRoute,
  editable = true
}: FormFieldPreviewProps) {
  const { t } = useTranslations();
  const [items, setItems] = useState(fields);

  useEffect(() => {
    setItems(fields);
  }, [fields]);

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

      if (dragdropRoute) {
        router.post(
          route(dragdropRoute, { form: formId }),
          { orders: updatedOrders },
          {
            preserveScroll: true,
            preserveState: true,
          }
        );
      }
    }
  };

  if (!items || items.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
        <CardContent className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
            {t('No Fields Yet')}
          </h3>
          <p className="text-sm text-gray-500">
            {t('Create your first field to see it here in the preview')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedItems = [...items].sort((a, b) => a.order_level - b.order_level);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {t('Form Preview')}
            </h3>
            <p className="text-xs text-gray-500">
              {editable ? t('Drag to reorder fields') : t('View only mode')}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {items.length} {items.length === 1 ? t('Field') : t('Fields')}
        </Badge>
      </div>

      {/* Fields */}
      {editable ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedItems?.map((item: any) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {sortedItems?.map((field: any) => (
                <SortableField key={field.id} field={field} editable={editable} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="space-y-3">
          {sortedItems?.map((field: any) => (
            <SortableField key={field.id} field={field} editable={false} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FormFieldPreview;
