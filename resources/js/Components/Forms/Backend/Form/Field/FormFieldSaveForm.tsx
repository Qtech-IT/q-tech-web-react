
import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import {
  Settings,
  ArrowLeft,
  Save,
  ChevronDown,
  Lock,
  Shield,
  CheckSquare,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/Components/UI/Button';
import { Form } from '@/Components/UI/Form';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { useTranslations } from '@/Hooks/useTranslations';
import { CrudPageProps } from '@/Types/crud';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldPreview from '@/Components/Feature/Backend/FormField/FormFieldPreview';

export const FormFieldSaveForm: React.FC<CrudPageProps> = ( props ) => {

  let { config, item: formField = null, fields = null, form: formData = null , nextOrderLevel = 1 } = props;

  const isUpdate = !!formField;
  formField      = formField?.data || {};
  
  const existingFields = fields?.data || [];
  const currentForm    = formData?.data || {};
  
  const [showPreview, setShowPreview] = useState(true);
  
  const fieldSchema = z.object(config?.formValidationRules);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
                                                    configuration: true,
                                                    attributes: false,
                                                    validation: false,
                                                    status: false
                                                  });

  const basicFields         = config?.form?.fields.filter((f: any) => f.section === 'basic');
  const configurationFields = config?.form?.fields.filter((f: any) => f.section === 'configuration');
  const attributeFields     = config?.form?.fields.filter((f: any) => f.section === 'attributes');
  const validationFields    = config?.form?.fields.filter((f: any) => f.section === 'validation');
  const statusFields        = config?.form?.fields.filter((f: any) => f.section === 'status');

  type FormFieldFormType = z.infer<typeof fieldSchema>;

  const form = useForm<FormFieldFormType>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: formField?.name || '',
      order_level: formField?.order_level || nextOrderLevel,
      label: formField?.label || '',
      input_type: formField?.input_type || '',
      placeholder: formField?.placeholder || '',
      hint_text: formField?.hint_text || '',
      description: formField?.description || '',
      default_value: formField?.default_value || '',
      values: formField?.values || {},
      parent_id: formField?.parent_id || '',
      is_required: formField?.is_required || false,
      is_read_only: formField?.is_read_only || false,
      is_hidden: formField?.is_hidden || false,
      validation_rules: formField?.s || {},
      status: formField?.status || 'active',
    },
  });

  useEffect(() => {
    if (formField && isUpdate) {
      form.reset({
        name: formField?.name || '',
        order_level: formField?.order_level || nextOrderLevel + 1,
        label: formField?.label || '',
        input_type: formField?.input_type || '',
        placeholder: formField?.placeholder || '',
        hint_text: formField?.hint_text || '',
        description: formField?.description || '',
        default_value: formField?.default_value || '',
        values: formField?.values || {},
        parent_id: formField?.parent_id || '',
        is_required: formField?.is_required || false,
        is_read_only: formField?.is_read_only || false,
        is_hidden: formField?.is_hidden || false,
        validation_rules: formField?.validation_rules || {},
        status: formField?.status || 'active',
      });
    }
  }, [formField, isUpdate, form]);

  const { create, update, isSubmitting, errors: serverErrors } = useCrudManager({
    config,
    onSuccess: (action) => {
      if (action === 'create') {
        form.reset({
          name: '',
          label: '',
          input_type: '',
          placeholder: '',
          hint_text: '',
          description: '',
          default_value: '',
          values: {},
          parent_id: '',
          is_required: false,
          is_read_only: false,
          is_hidden: false,
          validation_rules: {},
          status: 'active',
        });
        form.clearErrors();
      }
    },
  });

  const onSubmit = (data: FormFieldFormType) => {
    isUpdate ? update(formField?.id, data) : create(data);
  };

  const { t } = useTranslations();

  const inputType: any = form.watch('input_type');
  const isSelectType   = ['select', 'multi-select'].includes(inputType);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'configuration':
        return <Settings className="w-5 h-5 text-blue-500" />;
      case 'attributes':
        return <CheckSquare className="w-5 h-5 text-purple-500" />;
      case 'validation':
        return <Shield className="w-5 h-5 text-orange-500" />;
      case 'status':
        return <Lock className="w-5 h-5 text-green-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderFieldsForSection = (fields: any[], section: string) => {
    if (!fields?.length) return null;

    const formData      = form.getValues();
    const visibleFields = fields.filter((f) => (f.conditional ? f.conditional(formData) : true));

    if (visibleFields.length === 0) return null;

    return (
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection(section)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getSectionIcon(section)}
              <CardTitle className="text-base capitalize">
                {section} {t('Settings')}
              </CardTitle>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                expandedSections[section] ? 'rotate-180' : ''
              }`}
            />
          </div>
        </CardHeader>
        {expandedSections[section] && (
          <CardContent className="border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleFields.map((field: any, index: number) => (
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
          </CardContent>
        )}
      </Card>
    );
  };

  const dragdropRoute = config?.table?.dragdropRoute;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT SIDE - FORM */}
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* BASIC INFORMATION CARD - Always Expanded */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  <CardTitle>{t('Basic Information')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  {basicFields?.map((field: any, index: number) => (
                    <div key={field.name || index} className="w-full">
                      <DynamicInputWrapper
                        field={field}
                        form={form}
                        isSubmitting={isSubmitting}
                        serverErrors={serverErrors}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ALERT FOR SELECT/MULTI-SELECT */}
            {isSelectType && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">
                    {t('Important')}
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                    {t(
                      'For select or multi-select fields, you must define options below in the Configuration section. Add key-value pairs where the key is the stored value and the value is the display label.'
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* CONFIGURATION SECTION - Collapsible */}
            {renderFieldsForSection(configurationFields, 'configuration')}

            {/* ATTRIBUTES SECTION - Collapsible */}
            {renderFieldsForSection(attributeFields, 'attributes')}

            {/* VALIDATION SECTION - Collapsible */}
            {renderFieldsForSection(validationFields, 'validation')}

            {/* STATUS SECTION - Collapsible */}
            {renderFieldsForSection(statusFields, 'status')}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">


              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                <ButtonLoader
                  isSubmitting={isSubmitting}
                  btnText={isUpdate ? 'Update Field' : 'Create Field'}
                  loaderText={isUpdate ? 'Updating...' : 'Creating...'}
                  icon={<Save className="w-4 h-4" />}
                />
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                variant="outline"
                onClick={() =>
                  router.visit(route(config.routes.index, config?.routeParams?.index || null))
                }
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('Back to Fields')}
              </Button>

            </div>
          </form>
        </Form>
      </div>

      {/* RIGHT SIDE - PREVIEW */}
      <div className="lg:sticky lg:top-6 lg:h-fit">
        <div className="mb-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden"
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? t('Hide Preview') : t('Show Preview')}
          </Button>
        </div>

        {(showPreview || window.innerWidth >= 1024) && (
          <FormFieldPreview
            fields={existingFields}
            formId={currentForm?.id}
            dragdropRoute={dragdropRoute}
            editable={true}
          />
        )}
      </div>
    </div>
  );
};

export default FormFieldSaveForm;