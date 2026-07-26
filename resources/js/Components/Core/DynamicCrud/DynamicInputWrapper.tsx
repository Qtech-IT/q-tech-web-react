

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form';
import { useTranslations } from '@/Hooks/useTranslations';
import { useEffect, useRef } from 'react';
import { DynamicFormInput } from './DynamicFormInput';

interface DynamicInputWrapperProps {
  field: any;
  form: any;
  isSubmitting: boolean;
  serverErrors?: Record<string, string>;
  editorRef?: React.RefObject<any>;
  onDependencyChange?: (fieldName: string, value: any) => void;
  dependentLoading?: Record<string, boolean>;
  displayLabel?: boolean;
}

/**
 * A wrapper component for DynamicFormInput that handles conditional logic and dependency loading.
 * 
 * @param field - The field configuration object.
 * @param form - The form object from react-hook-form.
 * @param isSubmitting - Whether the form is currently submitting.
 * @param serverErrors - The server errors object from react-hook-form.
 * @param editorRef - The ref object for the editor component.
 * @param onDependencyChange - The callback function to call when a dependency changes.
 * @param dependentLoading - The object with dependency loading status.
 * @param displayLabel - Whether to display the label for the field.
 * 
 * @returns A JSX element with the DynamicFormInput component.
 */

export function DynamicInputWrapper({
  field,
  form,
  isSubmitting,
  serverErrors = {},
  editorRef,
  onDependencyChange,
  dependentLoading = {},
  displayLabel = true
}: DynamicInputWrapperProps) {
  const { t } = useTranslations();
  const watchValue = form.watch(field.name);
  const previousValueRef = useRef<any>(null);

  // Watch all form values to pass to DynamicFormInput
  const formData = form.getValues();

  useEffect(() => {
    if (field.type === 'select' && field.hasDependents && onDependencyChange) {
      if (previousValueRef.current !== watchValue) {
        previousValueRef.current = watchValue;

        const timer = setTimeout(() => {
          if (watchValue && watchValue !== '' && watchValue !== 'null') {
            onDependencyChange(field.name, watchValue);
          }
        }, 0);

        return () => clearTimeout(timer);
      }
    }
  }, [watchValue, field.hasDependents, onDependencyChange, field.name]);

  const fieldOptions = field.options || [];
  const isLoading = dependentLoading[field.name] || false;

  const showPlaceholder = field.hasDependents && fieldOptions.length <= 1 && !isLoading;

  // Check if field should be shown based on conditional logic
  const shouldShowField = field?.conditional ? field?.conditional(formData) : true;

  console.log(shouldShowField);

  if (!shouldShowField) {
    return null;
  }

  return (
    <FormField
      control={form.control as any}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem style={{ gridColumn: field.gridColumn || 'span 1' }}>

          {
            displayLabel && (

              <FormLabel className="flex items-center gap-2">
                {field.icon}
                {(field.label)}
                {field.required && <span className="text-red-500">*</span>}
              </FormLabel>

            )
          }


          <FormControl>
            {showPlaceholder ? (
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm">
                {field.placeholder || t('Select parent location first')}
              </div>
            ) : (
              <DynamicFormInput
                field={field}
                value={formField.value}
                onChange={formField.onChange}
                error={form.formState.errors[field.name]?.message as string}
                disabled={isSubmitting || isLoading}
                options={fieldOptions}
                editorRef={editorRef}
                isLoading={isLoading}
                formData={formData}
                previewImgUrl={field?.previewImgDbKey ? (formData as any)[field.previewImgDbKey] : null}
              />
            )}
          </FormControl>

          {isLoading && (
            <p className="text-xs text-blue-600">{t('Loading...')}</p>
          )}

          {field.description &&
            !['checkbox', 'switch', 'key-value', 'validation-rules'].includes(field.type) && (
              <FormDescription>{field.description}</FormDescription>
            )}

          <FormMessage />

          {serverErrors?.[field.name] && (
            <p className="text-sm font-medium text-destructive">
              {serverErrors[field.name]}
            </p>
          )}
        </FormItem>
      )}
    />
  );
}

export default DynamicInputWrapper;