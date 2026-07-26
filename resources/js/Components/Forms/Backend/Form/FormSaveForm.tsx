import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Form } from '@/Components/UI/Form';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import { CrudPageProps } from '@/Types/crud';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Save
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


export const FormSaveForm: React.FC<CrudPageProps> = (props) => {

  let { config, item: systemForm = null, onOpenChange } = props;

  const isUpdate = systemForm?.id ? true : false;
  const systemFormSchema = z.object(config?.formValidationRules || {});
  const fields = config?.form?.fields || []
  type systemFormFormType = z.infer<typeof systemFormSchema>;


  const getDefaultValues = () => {
    return {
      name: systemForm?.name || '',
      description: systemForm?.description || '',
    }
  };

  const form = useForm<systemFormFormType>({
    resolver: zodResolver(systemFormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (systemForm && isUpdate) {
      form.reset(getDefaultValues());
    }
  }, [systemForm, isUpdate, form]);


  const {
    create,
    update,
    isSubmitting,
    errors: serverErrors
  } = useCrudManager({
    config,
    onSuccess: (action) => {
      if (action === 'create') {
        form.reset(getDefaultValues());
      }
      onOpenChange(false);
    },
  });

  const onSubmit = (data: systemFormFormType) => {

    isUpdate ? update(systemForm?.uuid, data) : create(data);
  };

  const { t } = useTranslations();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields?.map((field: any, index: number) => (
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

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText={isUpdate ? t('Update') : t('Create')}
              loaderText={isUpdate ? t('Updating...') : t('Creating...')}
              icon={<Save className="w-4 h-4" />}
            />
          </Button>
        </div>

      </form>
    </Form>
  );
};

export default FormSaveForm;