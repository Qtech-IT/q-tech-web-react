import { Badge } from '@/Components/UI/Badge';
import { CheckboxPremative } from '@/Components/UI/CheckboxPremative';
import { Input } from '@/Components/UI/Input';
import KeyValueInput from '@/Components/UI/KeyValueInput';
import { PasswordInput } from '@/Components/UI/PasswordInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select';
import * as Switch from '@/Components/UI/Switch';
import { Textarea } from '@/Components/UI/Textarea';
import RichTextEditor from '@/Components/UI/TextEditor';
import ValidationRulesInput from '@/Components/UI/ValidationRulesInput';
import { useTranslations } from '@/Hooks/useTranslations';
import type { FormField } from '@/Types/crud';
import { EMPTY_SELECT_VALUE, isEmptySelectValue, limitText } from '@/Utils/helpers';
import { CheckCircle, Download, File as FileIcon, Image, X } from 'lucide-react';
import React, { useState } from 'react';
import LazyMultiSelect from './LazyMultiSelect';
import LazySingleSelect from './LazySingleSelect';


interface DynamicFormInputProps {
  id?: string;
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  previewImgUrl?: null | string;
  isLoading?: boolean;
  formData?: any;
  editorRef?: React.RefObject<any> | undefined;
}

/**
 * A component to render a dynamic form input based on the given field configuration.
 *
 * @param {DynamicFormInputProps} props - The props object with the following properties:
 *   id - The id attribute of the input element.
 *   field - The field configuration object.
 *   value - The value of the input element.
 *   onChange - The callback function to call when the value of the input element changes.
 *   error - The error message to display if the input element has an error.
 *   disabled - Whether the input element is disabled.
 *   options - An array of options to display in the select element.
 *   previewImgUrl - The URL of the image to display in the preview.
 *   isLoading - Whether the form is currently loading.
 *   formData - The form data object.
 *   editorRef - The ref object for the editor component.
 */
export function DynamicFormInput({
  id,
  field,
  value,
  onChange,
  error,
  disabled,
  options = [],
  previewImgUrl = null,
  isLoading = false,
  formData = {},
  editorRef

}: DynamicFormInputProps) {

  const [imagePreview, setImagePreview] = useState<string | null>(previewImgUrl);
  const { t } = useTranslations();

  const isImageFile = (val: any): boolean => {
    if (!val) return false;
    if (typeof File !== 'undefined' && val instanceof File) {
      return val.type?.startsWith('image/') ?? false;
    }
    if (typeof val === 'string') {
      return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(val);
    }
    return false;
  };

  const getFileName = (val: any): string => {
    if (typeof File !== 'undefined' && val instanceof File) return val.name;
    if (typeof val === 'string') return val.split('/').pop()?.split('?')[0] || 'file';
    return 'file';
  };

  const handleDownload = (val: any) => {
    if (typeof File !== 'undefined' && val instanceof File) {
      const url = URL.createObjectURL(val);
      const a = document.createElement('a');
      a.href = url;
      a.download = val.name;
      a.click();
      URL.revokeObjectURL(url);
    } else if (typeof val === 'string') {
      const a = document.createElement('a');
      a.href = val;
      a.download = getFileName(val);
      a.target = '_blank';
      a.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (field.preview && file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      }
      onChange(file);
    }
  };

  const clearFile = () => {
    setImagePreview(null);
    onChange(null);
    const fileInput: any = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'url':
      return (
        <Input
          id={id}
          type={field.type}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
        />
      );

    case 'number':
      return (
        <Input
          id={id}
          type="number"
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          min={field.min}
          max={field.max}
          step={field.step}
          className={error ? 'border-destructive' : ''}
        />
      );

    case 'date':
    case 'datetime-local':
    case 'time':
      return (
        <Input
          id={id}
          type={field.type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
        />
      );


    case 'daterange':
      return (
        <div className="flex items-center gap-2">
          <Input
            id={`${id}-start`}
            type="date"
            value={value?.start || ''}
            onChange={(e) => onChange({ ...value, start: e.target.value })}
            disabled={disabled}
            className={error ? 'border-destructive' : ''}
          />
          <span className="text-muted-foreground text-sm">—</span>
          <Input
            id={`${id}-end`}
            type="date"
            value={value?.end || ''}
            onChange={(e) => onChange({ ...value, end: e.target.value })}
            disabled={disabled}
            className={error ? 'border-destructive' : ''}
          />
        </div>
      );

    case 'disable':
      return (
        <Input
          id={id}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={true}
          className="opacity-60 cursor-not-allowed bg-muted"
        />
      );

    case 'color':
      return (
        <Input
          id={id}
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-10"
        />
      );

    case 'textarea':
      return (
        <Textarea
          id={id}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={field.rows || 4}
          className={error ? 'border-destructive' : ''}
        />
      );


    case 'password-input':
      return (
        <PasswordInput
          id={id}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled as any}
          ref={null}
          className={error ? 'border-destructive' : ''}
        />
      );


    case 'richtext':
      return (
        <RichTextEditor
          id={id}
          ref={editorRef}
          onChange={onChange}
          placeholder={field.placeholder}
          height={field.height || '300px'}
          value={value || ''}
        />
      );

    case 'select':

      if ((field as any).lazyLoad) {
        return (
          <LazySingleSelect
            id={id as any}
            value={value}
            onChange={onChange}
            options={options as any}
            loading={(field as any).loading}
            disabled={disabled as any}
            error={error as any}
            placeholder={field.placeholder as any}
            required={field.required as any}
            onSearch={(field as any).onSearch}
            onScroll={(field as any).onScroll}
          />
        );
      }

      /**
       * Radix forbids `value=""` on a `SelectItem` — the empty string is
       * reserved for clearing the trigger — so an option meaning "nothing
       * selected" (`{ value: '', label: '— No parent —' }`, which several
       * configs and every server-built option list ship) is rendered as the
       * `EMPTY_SELECT_VALUE` sentinel and mapped back to `null` on change.
       * Filtering it out instead would silently drop the only way to unset a
       * nullable relation.
       */
      const emptyOption = options.find((option) => isEmptySelectValue(option.value));
      const realOptions = options.filter((option) => !isEmptySelectValue(option.value));
      const showEmptyOption = !field.required || emptyOption !== undefined;
      const selectValue = isEmptySelectValue(value)
        ? showEmptyOption
          ? EMPTY_SELECT_VALUE
          : undefined
        : String(value);

      return (
        <div className="flex gap-2">
          <div className="flex-1 w-full">
            <Select
              /* `exactOptionalPropertyTypes` — an unset select must omit
                 `value` entirely rather than pass `undefined`. */
              {...(selectValue === undefined ? {} : { value: selectValue })}
              onValueChange={(val) =>
                onChange(val === EMPTY_SELECT_VALUE || val === 'null' ? null : val)
              }
              disabled={disabled ?? false}
            >
              <SelectTrigger
                id={id}
                className={error ? 'border-destructive ' : 'w-full'}
              >
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {showEmptyOption && (
                  <SelectItem value={EMPTY_SELECT_VALUE} className="text-muted-foreground">
                    {emptyOption?.label ?? t('None')}
                  </SelectItem>
                )}
                {realOptions.map((option) => (
                  <SelectItem key={String(option.value)} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!field.required && !isEmptySelectValue(value) && (
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={disabled}
              className="px-3 py-2 border rounded-md hover:bg-destructive/10 transition-colors"
              title={t('Clear selection')}
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
          )}
        </div>
      );



    case 'multi-select':
      if ((field as any)?.lazyLoad) {
        return (
          <LazyMultiSelect
            id={id as any}
            value={value}
            onChange={onChange}
            options={options as any}
            loading={(field as any).loading}
            disabled={disabled as any}
            error={error as any}
            placeholder={field?.placeholder as any}
            onSearch={(field as any).onSearch}
            onScroll={(field as any).onScroll}
          />
        );
      }

      // Regular multi-select with "Select All" option
      const selectedValues = Array.isArray(value) ? value : [];
      const availableOptions = options.filter(
        (opt) => !selectedValues.includes(opt.value.toString())
      );
      const allSelected = selectedValues.length === options.length && options.length > 0;

      return (
        <div className="space-y-3">
          <Select
            {...(false ? { value: "" } : {})}
            onValueChange={(val) => {
              if (val === '__select_all__') {
                // Select all options
                onChange(options.map(opt => opt.value.toString()));
              } else if (val === '__deselect_all__') {
                // Deselect all options
                onChange([]);
              } else if (!selectedValues.includes(val)) {
                onChange([...selectedValues, val]);
              }
            }}
            disabled={disabled ?? false}
          >
            <SelectTrigger
              id={id}
              className={error ? 'border-destructive' : ''}
            >
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>

            <SelectContent>
              {/* Select All / Deselect All option */}
              {options.length > 0 && (
                <>
                  {!allSelected && availableOptions.length > 0 && (
                    <SelectItem
                      value="__select_all__"
                      className="font-semibold text-primary"
                    >
                      ✓ {t('Select All')}
                    </SelectItem>
                  )}
                  {selectedValues.length > 0 && (
                    <SelectItem
                      value="__deselect_all__"
                      className="font-semibold text-destructive"
                    >
                      ✕ {t('Deselect All')}
                    </SelectItem>
                  )}
                  {availableOptions.length > 0 && <div className="my-1 h-px bg-border" />}
                </>
              )}

              {/* Individual options */}
              {availableOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedValues.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((val) => {
                  const option = options.find((opt) => opt.value.toString() === val);
                  return (
                    <Badge key={val} variant="secondary" className="gap-1">
                      {option?.label || val}
                      <button
                        type="button"
                        onClick={() => onChange(selectedValues.filter((v) => v !== val))}
                        className="ml-1 hover:text-destructive"
                        disabled={disabled}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>

              {/* Clear All Button */}
              <button
                type="button"
                onClick={() => onChange([])}
                disabled={disabled}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md border border-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                {t('Clear All')}
              </button>
            </div>
          )}
        </div>
      );


    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <CheckboxPremative
            id={id}
            checked={!!value}
            onCheckedChange={onChange}
            disabled={disabled}
          />
          {field.description && (
            <span className="text-sm text-muted-foreground">{field.description}</span>
          )}
        </div>
      );

    case 'switch':
      return (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{field.description}</span>
          <Switch.Switch
            id={id}
            checked={!!value}
            onCheckedChange={onChange}
            disabled={disabled}
          />
        </div>
      );

    case 'file':
      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              id={id}
              type="file"
              accept={field.accept}
              onChange={handleFileChange}
              disabled={disabled}
              className={`${error ? 'border-destructive' : ''}flex h-10 w-full flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium`}
              multiple={field.multiple}
            />
            {value && (
              <button
                type="button"
                onClick={clearFile}
                disabled={disabled}
                className="px-3 py-2 border rounded hover:bg-destructive/10"
              >
                <X className="w-4 h-4 text-destructive" />
              </button>
            )}
          </div>

          {((field.preview && imagePreview) || value) ? (
            <div className="flex items-center gap-4">
              {isImageFile(value) || imagePreview ? (
                <>
                  <img
                    src={imagePreview ?? (value instanceof File ? URL.createObjectURL(value as File) : value)}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg border object-cover"
                  />
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>{t('Image ready')}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3">
                  <FileIcon className="h-8 w-8 shrink-0 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {limitText(getFileName(value), 10)}
                    </p>
                    {value instanceof File && (
                      <p className="text-xs text-slate-400">
                        {((value as File).size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownload(value)}
                    className="flex shrink-0 items-center gap-1.5 rounded-md border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t('Download')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-8">
              <div className="text-center">
                {field?.name?.startsWith('image') ? (
                  <Image className="mx-auto h-8 w-8 text-slate-400" />
                ) : (
                  <FileIcon className="mx-auto h-8 w-8 text-slate-400" />
                )}
                <p className="mt-2 text-sm text-slate-500">{t('No file selected')}</p>
              </div>
            </div>
          )}
        </div>
      );

    case 'key-value':
      return (
        <KeyValueInput
          value={value}
          onChange={onChange}
          disabled={disabled}
          error={error}
          placeholder={field.placeholder}
        />
      );

    case 'validation-rules':
      return (
        <ValidationRulesInput
          value={value}
          onChange={onChange}
          disabled={disabled}
          error={error}
          inputType={formData?.input_type || 'text'}
        />
      );

    default:
      return (
        <Input
          id={id}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      );
  }
}

export default DynamicFormInput;