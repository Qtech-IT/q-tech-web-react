import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog';
import { Button } from '@/Components/UI/Button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form';
import { Input } from '@/Components/UI/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { Badge } from '@/Components/UI/Badge';
import { Globe, Plus, Edit, Info, Languages, ArrowLeftRight } from 'lucide-react';
import { handleSaveLanguage } from '@/Controllers/Backend/LanguageController';
import { useTranslations } from '@/Hooks/useTranslations';
const languageSchema = z.object({
  name: z.string().min(1, 'Language name is required').max(100, 'Name must be less than 100 characters'),
  code: z.string().min(1, 'Language code is required').max(100, 'Code must be less than 100 characters'),
  direction: z.string(),
});

// Popular languages that should appear at the top
const POPULAR_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh',
  'ar', 'hi', 'tr', 'pl', 'nl', 'sv', 'da', 'no', 'fi'
];

export function LanguageDialog({
  open ,
  onOpenChange,
  language = null,
  mode = 'create',
  langCodes = [],
  routePrefix
}:any) {

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm();
  const [searchTerm, setSearchTerm] = React.useState('');
  const {t} = useTranslations();

  const isEditing = mode === 'edit' && language;


  const defaultValues : any = {
    name: language?.name || '',
    code: language?.code || '',
    direction: language?.direction || 'ltr'
  };

  const form = useForm({
    resolver: zodResolver(languageSchema),
    defaultValues: defaultValues
  });

  React.useEffect(() => {
    if (open && language && mode === 'edit') {
      form.reset({
        name: language?.name || '',
        code: language?.code || '',
        direction: language.direction || 'ltr',
      });
    } else if (open && mode === 'create') {
      form.reset({
        name: '',
        code: '',
        direction: 'ltr',
      });
    }
  }, [open, language, mode, form]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  // Watch form values for dynamic rendering
  const watchLangCode  = form.watch('code');
  const watchDirection = form.watch('direction');
  
  // Process and organize language codes
  const processedLangCodes = langCodes.map((lang: any) => ({
                                                            value: lang?.lang_code,
                                                            label: lang?.name,
                                                          }));

  // Find selected language code info
  const selectedLangInfo = (langCodes as any[])?.find(
    (item: any) => item.lang_code === watchLangCode
  );

  // Auto-suggest direction based on language
  const handleLanguageCodeChange = (langCode : any) => {
    form.setValue('code', langCode);

    // Auto-set direction for common RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ku', 'dv'];
    if (rtlLanguages.includes(langCode)) {
      form.setValue('direction', 'rtl');
    } else if (form.getValues('direction') === 'rtl' && !rtlLanguages.includes(langCode)) {
      // Reset to LTR if switching from RTL language to non-RTL
      form.setValue('direction', 'ltr');
    }

    // Auto-fill name if empty
    const selectedLang: any = langCodes.find(
      (item: any) => item.lang_code === langCode
    );

    if (selectedLang && !form.getValues('name').trim()) {
      form.setValue('name', selectedLang?.name);
    }
  };

  return (

    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8">
            {isEditing ? (
              <>
                <Edit className="w-5 h-5" />
                 {t('Update Language')}
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                 {t('Add Language')}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update language settings and localization configuration.'
              : 'Add a new language to enable localization and multi-language support.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto px-1">

          {/* Language Overview */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <Info className="w-4 h-4" />
            <AlertDescription>
              <div>
                <p className="font-medium">
                   {t('Language Configuration')}
                </p>
                <p className="mt-1 text-sm">
                   {t("Configure language settings for your application's localization system.")}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((e) => handleSaveLanguage(e, submit, handleClose , routePrefix))} className="space-y-6">

              {/* Language Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-blue-500" />
                    <CardTitle>
                       {t('Language Details')}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* Language Code - Now First */}
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                           {t('Language')}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={handleLanguageCodeChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">

                            {/* Popular Languages */}
                            {processedLangCodes.length > 0 && (
                              <>
                                <div className="px-2 py-1 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50 dark:bg-gray-800">
                                   {t(' Popular Languages')}
                                </div>
                                {processedLangCodes?.map((langItem : any) => (
                                  <SelectItem
                                    key={`popular-${langItem.value}`}
                                    value={langItem.value}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center gap-3">
                                        <div className="font-medium">{langItem.label}</div>
                                        <code className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded dark:bg-blue-900 dark:text-blue-300">
                                          {langItem.value}
                                        </code>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t('Choose from popular languages shown first, or browse all available languages below')}.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Selected Language Info */}
                  {selectedLangInfo && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                      <Globe className="w-4 h-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span><strong>{t('Selected')}:</strong> {selectedLangInfo.name}</span>
                            <code className="px-2 py-1 text-xs bg-white rounded dark:bg-gray-800">
                              {selectedLangInfo.lang_code}
                            </code>
                          </div>
                          <Badge variant={POPULAR_LANGUAGES.includes(selectedLangInfo.lang_code) ? "default" : "secondary"} className="text-xs">
                            {POPULAR_LANGUAGES.includes(selectedLangInfo.lang_code) ? "Popular" : "Standard"}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Language Name - Auto-filled but editable */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                           {t('Display Name')}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., English, Español, العربية"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                           {t('How this language will appear to users. Auto-filled but you can customize it')}.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Text Direction Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-purple-500" />
                    <CardTitle>
                       {t('Text Direction')}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">

                  <FormField
                    control={form.control}
                    name="direction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            {t('Reading Direction')}
                          <Badge variant="secondary" className="text-xs">
                             {t('Auto-detected')}
                          </Badge>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select text direction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ltr">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs text-blue-600">
                                  {t('LTR')}
                                </Badge>
                                <span>
                                   {t('Left to Right')}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">({t('English, Spanish, French...')})</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="rtl">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs text-purple-600">
                                  {t('RTL')}
                                </Badge>
                                <span>
                                   {t("Right to Left")}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">({t('Arabic, Hebrew, Persian')}...)</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                            {t('Text reading direction. This is automatically detected based on your language selection.')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Direction Preview */}
                  {watchDirection && (
                    <Alert className={`${
                      watchDirection === 'rtl'
                        ? 'border-purple-200 bg-purple-50 dark:bg-purple-950'
                        : 'border-blue-200 bg-blue-50 dark:bg-blue-950'
                    }`}>
                      <ArrowLeftRight className="w-4 h-4" />
                      <AlertDescription>
                        <div className={`${watchDirection === 'rtl' ? 'text-right' : 'text-left'}`}>
                          <p><strong>{t('Preview')}:</strong> {t('Text will flow')} {watchDirection === 'rtl' ? 'right to left' : 'left to right'}</p>
                          <p className="mt-1 text-sm">{t('Sample text')}: {watchDirection === 'rtl' ? 'مرحبا بك في التطبيق' : 'Welcome to the application'}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                </CardContent>
              </Card>

            </form>
          </Form>
        </div>

        <div className="sticky bottom-0 flex flex-col justify-end gap-3 pt-6 bg-white border-t sm:flex-row dark:bg-gray-950">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {t('Cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
            onClick={() => form.handleSubmit((e) => handleSaveLanguage(e, submit, handleClose , routePrefix))()}
          >
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText={isEditing ? t("Update Language") : t("Create Language")}
              loaderText={isEditing ? t('Updating...') : t('Creating...')}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}