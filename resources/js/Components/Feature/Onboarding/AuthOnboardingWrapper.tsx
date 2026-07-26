import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from '@/Hooks/useTranslations';
import BaseLayout from '@/Layouts/User/BaseLayout';
import { AuthenticatedLayout } from '@/Layouts/User/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { MainContainer } from '@/Layouts/User/MainContainer';
import { ArrowRight, ArrowLeft, LucideTableConfig, PlayCircle, Calendar, Plus, RotateCcw, Trash2, GripHorizontal } from 'lucide-react';
import { Button } from '@/Components/UI/Button';
import OnboardingSetupImg from '@/Assets/images/setup-img.png'
import { AuthOnboardingProps } from '@/Types/User';
import { Form, FormField } from '@/Components/UI/Form';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { Input } from '@/Components/UI/Input';
import { currencies, exportFormats, importFormats } from '@/Utils/constants';

import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { ConfigCard } from './Auth/ConfigCardSection';
import { SelectFieldComponent } from './Auth/SelectFieldComponent';


const onboardingSchema = z.object({
    system_language_code: z.string().min(1, 'Language is required'),
    default_currency: z.string().min(1, 'System currency is required'),
    bulk_upload_format: z.string().min(1, 'Bulk upload format is required'),
    export_format: z.string().min(1, 'Export format is required'),
    date_format: z.string().min(1, 'Date format is required'),
    time_format: z.string().min(1, 'Time format is required'),
    timezone: z.string().min(1, 'Timezone is required'),
});

type OnboardingFormType = z.infer<typeof onboardingSchema>;

interface HierarchyItem {
  id: string;
  name: string;
}

const AuthOnboardingWrapper: React.FC<AuthOnboardingProps> = ({ title, languages, dateFormats, timeFormats, timezones, routeName }) => {

  const { t } = useTranslations();
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [hierarchy, setHierarchy] = useState<HierarchyItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const draggedIndexRef = useRef<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const form = useForm<OnboardingFormType>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
        system_language_code: 'bn',
        default_currency: 'BDT',
        bulk_upload_format: '',
        export_format: '',
        date_format: '',
        time_format: '',
        timezone: 'Asia/Dhaka',
    },
  });

  const language       = form.watch('system_language_code');
  const systemCurrency = form.watch('default_currency');
  const bulkFormat     = form.watch('bulk_upload_format');
  const exportFormat   = form.watch('export_format');
  const dateFormat     = form.watch('date_format');
  const timeFormat     = form.watch('time_format');
  const timezone       = form.watch('timezone');

  const isLanguageConfigured  = !!language;
  const isCurrencyConfigured  = !!systemCurrency;
  const isReportConfigured    = !!bulkFormat && !!exportFormat;
  const isDateTimeConfigured  = !!dateFormat && !!timeFormat && !!timezone;

  // Create unique keys for options to avoid React key warnings
  const languageOptions = languages?.data?.map((lang: any) => ({ 
                                    value: lang.code, 
                                    label: `${lang.name} - (${lang?.direction})`,
                                })) || [];

  const dateFormatOptions = dateFormats?.map((format: any) => ({ 
                                    value: format, 
                                    label: format,
                                })) || [];

  const timeFormatOptions = timeFormats?.map((format: any) => ({ 
                                        value: format, 
                                        label: format,
                                    })) || [];

  const currencyOptions = currencies?.map((currency: any) => ({
                                        value: currency?.code,
                                        label: `${currency.code} - ${currency.name} (${currency.symbol})`,
                                    })) || [];

  const importFormatOptions = importFormats?.map((f: any) => ({ 
                                                value: f, 
                                                label: f,
                                            })) || [];

  const exportFormatOptions = exportFormats?.map((f: any) => ({ 
                                                value: f, 
                                                label: f,
                                            })) || [];

  const timezoneOptions = timezones?.map((tz: any) => ({ 
                                            value: tz.id || tz, 
                                            label: tz.name || tz,
                                        })) || [];

  const nameExists = (name: string): boolean => {
    return hierarchy.some(item => item.name.toLowerCase() === name.toLowerCase());
  };

  const addElement = () => {
    if (!inputValue.trim()) {
      setErrorMessage(t('Please enter a name'));
      return;
    }

    if (nameExists(inputValue)) {
      setErrorMessage(t('This name already exists'));
      return;
    }

    const newItem: HierarchyItem = {
      id: Date.now().toString(),
      name: inputValue.trim(),
    };

    setHierarchy([...hierarchy, newItem]);
    setInputValue('');
    setErrorMessage('');
  };

  const resetHierarchy = () => {
    setHierarchy([]);
    setInputValue('');
    setErrorMessage('');
  };

  const deleteItem = (index: number) => {
    setHierarchy(hierarchy.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    draggedIndexRef.current = index;
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetIndex(index);
  };

  const handleDragLeave = () => {
    setDropTargetIndex(null);
  };

  const handleDrop = (targetIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    const draggedIndex = draggedIndexRef.current;

    if (draggedIndex === null || draggedIndex === targetIndex) {
      draggedIndexRef.current = null;
      setDropTargetIndex(null);
      return;
    }

    const newHierarchy = [...hierarchy];
    const draggedItem = newHierarchy[draggedIndex];
    newHierarchy.splice(draggedIndex, 1);
    newHierarchy.splice(targetIndex, 0, draggedItem as any);

    setHierarchy(newHierarchy);
    draggedIndexRef.current = null;
    setDropTargetIndex(null);
  };

  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    setDropTargetIndex(null);
  };

  const ListItem: React.FC<{ item: HierarchyItem; index: number }> = ({ item, index }) => {
    const isDropTarget = dropTargetIndex === index;

    return (
      <div
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(index, e)}
        onDrop={(e) => handleDrop(index, e)}
        onDragLeave={handleDragLeave}
        className={`flex items-center gap-3 p-3 mb-2 rounded-md border-2 transition-all cursor-move ${
          isDropTarget
            ? 'bg-blue-100 border-blue-500'
            : 'border-[#E4E4E7] bg-[#F4F4F5] hover:bg-[#EBEBF0]'
        }`}
      >
        <GripHorizontal className="w-5 h-5 text-gray-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-900 flex-1 truncate">{item.name}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteItem(index)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const handleProceedToStep2 = async () => {
    setErrorMessage('');
    const isValid = await form.trigger();

    if (!isValid) {
      setErrorMessage(t('Please complete all required fields'));
      return;
    }

    if (!isLanguageConfigured || !isCurrencyConfigured || !isReportConfigured || !isDateTimeConfigured) {
      setErrorMessage(t('Please complete all configuration sections'));
      return;
    }

    setStep(2);
  };

  const { loading: isLoading, submit } = useInertiaForm()

  const handleFinalSubmit = (skipHierarchy = false) => {

    if (!skipHierarchy && hierarchy.length === 0) {
      setErrorMessage(t('Please create at least one hierarchy element'));
      return;
    }

    submit({
        method: 'POST',
        url: route(`${routeName}.store`),
        data: {
            settings: form.getValues(),
            hierarchy: hierarchy,
          },
    })
  };

  return (
    <BaseLayout>
      <AuthenticatedLayout>
        <Head title={title} />
        <MainContainer>
          {/* STEP 1 */}
          {step === 1 && (

            <Form {...form}>
              <form className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                      <LucideTableConfig className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {t('Onboarding')} - {t('Step')} 1
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Welcome! Begin by configuring your system modules.')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col items-center justify-between space-y-4 rounded-md border p-8 md:flex-row">
                  <div className="max-w-md">
                    <h4 className="text-base font-bold text-gray-900">
                      {t('We Are Glad You Are here')}
                    </h4>
                    <p className="mt-2 text-sm font-normal dark:text-gray-400">
                      {t('Watch this short video to see the various modules and customize according to your organizational structure')}
                    </p>
                    <Button className="mt-4">
                      <PlayCircle />
                      {t('Watch Video')}
                    </Button>
                  </div>
                  <img src={OnboardingSetupImg} alt="onboarding image" />
                </div>

                {errorMessage && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="mt-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <ConfigCard title={t('Language Settings')} isConfigured={isLanguageConfigured}>
                      <FormField
                        control={form.control as any}
                        name="system_language_code"
                        render={({ field }) => (
                          <SelectFieldComponent
                            label={t('Language')}
                            placeholder={t("Select Language")}
                            options={languageOptions}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </ConfigCard>

                     <ConfigCard title={t('Currency Configuration')} isConfigured={isCurrencyConfigured}>
                      <FormField
                        control={form.control as any}
                        name="default_currency"
                        render={({ field }) => (
                          <SelectFieldComponent
                            label={t("System Currency")}
                            placeholder={t("Select Currency")}
                            options={currencyOptions}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </ConfigCard> 

                    <ConfigCard title={t('Select Report Format')} isConfigured={isReportConfigured}>
                      <div className="space-y-3">
                        <FormField
                          control={form.control as any}
                          name="bulk_upload_format"
                          render={({ field }) => (
                            <SelectFieldComponent
                              label={t("Bulk Upload")}
                              placeholder={t("Select Format")}
                              options={importFormatOptions}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        <FormField
                          control={form.control as any}
                          name="export_format"
                          render={({ field }) => (
                            <SelectFieldComponent
                              label={t("Export Format")}
                              placeholder={t("Select Format")}
                              options={exportFormatOptions}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </ConfigCard>

                    <ConfigCard title={t('Date & Time Settings')} icon={<Calendar className="w-5 h-5 text-blue-600" />} isConfigured={isDateTimeConfigured}>
                      <div className="space-y-3">
                        <FormField
                          control={form.control as any}
                          name="date_format"
                          render={({ field }) => (
                            <SelectFieldComponent
                              label={t("Date Format")}
                              placeholder={t("Select Format")}
                              options={dateFormatOptions}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control as any}
                            name="time_format"
                            render={({ field }) => (
                              <SelectFieldComponent
                                label={t("Time Format")}
                                placeholder={t("Select")}
                                options={timeFormatOptions}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                          <FormField
                            control={form.control as any}
                            name="timezone"
                            render={({ field }) => (
                              <SelectFieldComponent
                                label={t("Timezone")}
                                placeholder={t("Select")}
                                options={timezoneOptions}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </ConfigCard>
                  </div>
                </div>

                <div className="mt-5">
                  <Button type="button" onClick={handleProceedToStep2} className="w-full sm:w-auto">
                    {t('Next Step')} <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </form>
            </Form>

          )}

          {/* STEP 2 */}
          {step === 2 && (

            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                    <LucideTableConfig className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                      {t('Onboarding')} - {t('Step')} 2
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('Create your Work Area Hierarchy')}
                    </p>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-bold text-[var(--primary-color)]">
                    {t('Create Work Area Hierarchy List')}
                  </h4>
                  <Button
                    variant="outline"
                    className="!border-[var(--primary-color)] !bg-white !px-6 !text-[var(--primary-color)] shadow-none"
                    onClick={resetHierarchy}
                  >
                    <RotateCcw className="w-5 h-5" />
                    {t('Reset')}
                  </Button>
                </div>

                <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
                  <div className="flex-1 md:flex-[4]">
                    <Input
                      placeholder="Type Text Here (e.g., Territory)"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addElement()}
                    />
                  </div>
                  <Button
                    className="mt-3 flex-1 cursor-pointer !px-6 shadow-none md:mt-0 md:flex-none"
                    onClick={addElement}
                  >
                    <Plus className="w-5 h-5" />
                    {t('Add Element')}
                  </Button>
                </div>

                <div
                  className="mt-6 p-4 bg-gray-50 rounded-md border border-dashed border-gray-300 min-h-32"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={handleDropOnRoot}
                  onDragLeave={handleDragLeave}
                >
                  {hierarchy.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      {t('No elements added yet. Add your first element above.')}
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {hierarchy.map((item, index) => (
                        <ListItem key={item.id} item={item} index={index} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  className="flex-1 !bg-white !font-normal text-[var(--secondary-color)] md:min-w-36 md:flex-[0]"
                  onClick={() => {
                    setStep(1);
                    setErrorMessage('');
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('Back')}
                </Button>
                <Button
                  className="flex-1 !font-normal md:min-w-36 md:flex-[0]"
                  onClick={() => handleFinalSubmit()}
                >
                    <ButtonLoader
                        isSubmitting={isLoading}
                        btnText={t("Save")}
                        loaderText={t('Saving.....')}
                        icon={<ArrowRight className="ml-2" />}
                    />

                </Button>

                  <Button
                    variant="outline"
                    className="flex-1 md:min-w-36 md:flex-[0]"
                    onClick={() => handleFinalSubmit(true)}
                  >
                   
                     <ButtonLoader
                        isSubmitting={isLoading}
                        btnText={t("Skip")}
                        loaderText={t('Skiping.....')}
                        icon={<ArrowRight className="ml-2" />}
                    />
                  </Button>
                  
              </div>
            </div>
          )}
        </MainContainer>
      </AuthenticatedLayout>
    </BaseLayout>
  );
};

export default AuthOnboardingWrapper;