

import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import {
  Form
} from '@/Components/UI/Form';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CrudConfig } from '@/Types/crud';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DynamicInputWrapper from './DynamicInputWrapper';

interface DynamicFormProps {
  config: CrudConfig;
  item?: any;
  mode: 'create' | 'edit';
  defaultValues?: Record<string, any>;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  serverErrors?: Record<string, string>;
  backendData?: Record<string, any>;
  onOpenChange: any
}

export function DynamicForm({
  config,
  item = null,
  onOpenChange = null,
  backendData = {},
}: DynamicFormProps) {

  const { t } = useTranslations();

  if (item && item?.data?.id) item = item.data;



  const fieldIds = config?.form?.fields.reduce((acc, field) => {
    acc[field.name] = `${field.name}-${Math.random().toString(36).substr(2, 9)}`;
    return acc;
  }, {} as any);

  // Build validation schema from field validations
  const schema = z.object(
    config?.form?.fields.reduce((acc: any, field: any) => {
      // Only add validation if it exists, otherwise make field optional
      if (field.validation) {
        acc[field.name] = field.validation;
      } else {
        acc[field.name] = z.any().optional();
      }
      return acc;
    }, {} as any)
  );

  // Build default values
  const defaultValues = config.form!.fields.reduce((acc, field) => {
    if (item) {
      // For edit mode: use item value, then field default, then appropriate empty value
      acc[field.name] = item[field.name] ?? field?.defaultValue ?? (field.type === 'number' ? 0 : '');
    } else {
      // For create mode: use field default, then appropriate empty value
      acc[field.name] = field?.defaultValue ?? (field.type === 'number' ? 0 : '');
    }
    return acc;
  }, {} as Record<string, any>);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const getOptions = (field: any) => {
    if (field.options) return field.options;

    if (field.optionsFrom && backendData[field.optionsFrom]) {
      const data = backendData[field.optionsFrom];
      return data.map((item: any) => ({
        value: item[field.optionValue || 'id'],
        label: item[field.optionLabel || 'name'],
      }));
    }

    return [];
  };

  const {
    create,
    update,
    isSubmitting,
    errors: serverErrors
  } = useCrudManager({
    config,
    onSuccess: (action) => {
      if (onOpenChange) {
        onOpenChange(false);
      } else {
        form.reset();
      }
    },
  });



  const isUpdate = (item?.uuid || item?.id) ? true : false;



  const onSubmit = (data: any) => {
    let id = item?.uuid ? item?.uuid : item?.id;
    isUpdate ? update(id, data) : create(data);
  };


  const isPage = config?.formDisplayMode === 'page'


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {config?.form?.fields.map?.((field: any, index: number) => (
            <div key={field.name || index} className={getGridColSpan(field.gridColumn)}>
              <DynamicInputWrapper
                field={field}
                form={form}
                isSubmitting={isSubmitting}
                serverErrors={serverErrors}
              />
            </div>
          ))}
        </div>

        <div
          className={isPage
            ? "flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t"
            : "flex flex-col sm:flex-row gap-3"}>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText={isUpdate ? t('Update') : t('Create')}
              loaderText={`${isUpdate ? t('Updating') : t('Creating')}...`}
              icon={<Save className="w-4 h-4" />}
            />
          </Button>

          {
            isPage && (
              <Button
                type="button"
                className="w-full sm:w-auto"
                variant="outline"
                onClick={() => router.visit(route(config?.routes?.index!))}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('Back')}
              </Button>
            )
          }


        </div>

      </form>
    </Form>
  );
}