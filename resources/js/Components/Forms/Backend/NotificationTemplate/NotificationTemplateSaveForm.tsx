import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Form } from '@/Components/UI/Form';
import { SafePreview } from '@/Components/UI/SafePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/UI/Tabs';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import { CrudPageProps } from '@/Types/crud';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Code,
  Eye,
  Info,
  Mail,
  Save,
  Settings,
  Smartphone
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import TemplateKeysSidebar from '@/Components/Feature/Backend/NotificationTemplate/TemplateKeysSidebar';
import { generatePreview } from '@/Controllers/Backend/NotificationTemplateController';

export const NotificationTemplateSaveForm: React.FC<CrudPageProps> = (props) => {

  let { config, item: template = null } = props;

  const isUpdate = !!template;
  template = template?.data || {};

  const fieldSchema = z.object(config?.formValidationRules);

  const [activeTab, setActiveTab] = useState('edit');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    email: true,
    realtime: false,
    info: false
  });

  const editorRef = useRef(null);

  const isEmailEnabled = !template?.is_mail_disable;
  const isRealtimeEnabled = !template?.is_real_time_disable;
  const templateKeys = template?.template_key || {};

  const emailFields = config?.form?.fields.filter((f: any) => f.section === 'email');
  const realtimeFields = config?.form?.fields.filter((f: any) => f.section === 'realtime');

  type NotificationTemplateFormType = z.infer<typeof fieldSchema>;

  const form = useForm<NotificationTemplateFormType>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      subject: template?.subject || '',
      mail_body: template?.mail_body || '',
      push_notification_body: template?.push_notification_body || '',
      email_notification: template?.email_notification === 'active',
      push_notification: template?.push_notification === 'active',
      site_notificaton: template?.site_notificaton === 'active',
      _isEmailEnabled: isEmailEnabled,
      _isRealtimeEnabled: isRealtimeEnabled,
    } as any,
  });

  useEffect(() => {
    if (template && isUpdate) {
      form.reset({
        subject: template?.subject || '',
        mail_body: template?.mail_body || '',
        push_notification_body: template?.push_notification_body || '',
        email_notification: template?.email_notification === 'active',
        push_notification: template?.push_notification === 'active',
        site_notificaton: template?.site_notificaton === 'active',
        _isEmailEnabled: isEmailEnabled,
        _isRealtimeEnabled: isRealtimeEnabled,
      } as any);
    }
  }, [template, isUpdate, form, isEmailEnabled, isRealtimeEnabled]);

  const { update, isSubmitting, errors: serverErrors } = useCrudManager({
    config,
    onSuccess: (action) => { },
  });

  const onSubmit = (data: NotificationTemplateFormType) => {

    const payload = {
      ...data
    };

    update(template?.uuid, payload);
  };

  const { t } = useTranslations();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'email':
        return <Mail className="w-5 h-5 text-blue-500" />;
      case 'realtime':
        return <Bell className="w-5 h-5 text-green-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-gray-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'email':
        return t('Email Configuration');
      case 'realtime':
        return t('Real-time Notifications');
      case 'info':
        return t('Template Information');
      default:
        return section;
    }
  };

  const renderFieldsForSection = (fields: any[], section: string) => {
    if (!fields?.length) return null;
    const formData = form.getValues();
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
              <CardTitle className="text-base">
                {getSectionTitle(section)}
              </CardTitle>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${expandedSections[section] ? 'rotate-180' : ''
                }`}
            />
          </div>
        </CardHeader>
        {expandedSections[section] && (
          <CardContent className="border-t pt-6">
            <div className="grid grid-cols-1 gap-6">
              {visibleFields.map((field: any, index: number) => (
                <div key={field.name || index} className={getGridColSpan(field.gridColumn)}>
                  <DynamicInputWrapper
                    field={field}
                    form={form}
                    isSubmitting={isSubmitting}
                    serverErrors={serverErrors}
                    editorRef={field.type === 'richtext' ? editorRef : undefined as any}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  const previewBody = form.watch('mail_body');
  const previewSubject = form.watch('subject');
  const previewPushBody = form.watch('push_notification_body');

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              {t('Edit')}
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {t('Preview')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-6 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* EMAIL SECTION - Conditionally Visible */}
                {isEmailEnabled && renderFieldsForSection(emailFields, 'email')}

                {/* DISABLED EMAIL ALERT */}
                {!isEmailEnabled && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                          {t('Email Notifications Disabled')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {t('Email functionality is disabled for this template type.')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* REALTIME SECTION - Conditionally Visible */}
                {isRealtimeEnabled && renderFieldsForSection(realtimeFields, 'realtime')}



                {/* TEMPLATE INFORMATION SECTION */}
                <Card>
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleSection('info')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSectionIcon('info')}
                        <CardTitle className="text-base">
                          {getSectionTitle('info')}
                        </CardTitle>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${expandedSections.info ? 'rotate-180' : ''
                          }`}
                      />
                    </div>
                  </CardHeader>
                  {expandedSections.info && (
                    <CardContent className="border-t pt-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{t('Name')}:</span> {template.name}
                        </div>

                        <div className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{t('Created')}:</span> {template.created_at}
                        </div>
                      </div>

                      {/* Template Keys */}
                      {templateKeys && Object.keys(templateKeys).length > 0 && (
                        <div className="mt-4">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{t('Available Template Keys')}:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(templateKeys).map(([key, description]) => (
                              <span
                                key={key}
                                className="px-2 py-1  text-xs text-blue-800 bg-blue-100 border border-blue-200 rounded dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-700"
                                title={description as string}
                              >
                                {`{{${key}}}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* ACTION BUTTONS */}

                <div className="flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">

                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    <ButtonLoader
                      isSubmitting={isSubmitting}
                      btnText={t('Update Template')}
                      loaderText={t('Updating...')}
                      icon={<Save className="w-4 h-4" />}
                    />
                  </Button>
                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    variant="outline"
                    onClick={() =>
                      router.visit(route(config.routes.index))
                    }
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('Back to Templates')}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="preview" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t('Email Preview')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEmailEnabled ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t('Subject')}</label>
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded border">
                        <SafePreview html={generatePreview(previewSubject, templateKeys)} />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {t('Body')}
                      </label>

                      <div
                        className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded border
               max-w-full overflow-x-hidden whitespace-pre-wrap break-all"
                      >
                        <SafePreview html={generatePreview(previewBody, templateKeys)} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    {t('Email preview not available - email notifications are disabled')}
                  </div>
                )}
              </CardContent>
            </Card>

            {isRealtimeEnabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    {t('Push Notification Preview')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded border">
                    <SafePreview html={generatePreview(previewPushBody, templateKeys)} />
                  </div>
                </CardContent>
              </Card>
            )}

            {!isEmailEnabled && !isRealtimeEnabled && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {t('No preview available - all notification types are disabled')}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* TEMPLATE KEYS SIDEBAR */}
      <TemplateKeysSidebar templateKeys={templateKeys} editorRef={editorRef} />
    </div>
  );
};

export default NotificationTemplateSaveForm;