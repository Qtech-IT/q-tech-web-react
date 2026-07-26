
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/Components/UI/Button'
import { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { handleImageChange } from '@/Utils/helpers'
import { onLogoUpdate, onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import { Image, Upload, CheckCircle, Info, X, Eye, Palette, Users, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card'
import { Alert, AlertDescription } from '@/Components/UI/Alert'
import { Badge } from '@/Components/UI/Badge'
import { useTranslations } from '@/Hooks/useTranslations'

const logoSettingsSchema = z.object({
  site_settings: z.object({
    company_logo: z.any()
      .refine((file: any) => !file || file instanceof File, "Must be a file")
      .optional(),
    favicon: z.any()
      .refine((file: any) => !file || file instanceof File, "Must be a file")
      .optional()
  })
})

export function LogoForm({ props }: { props: any }) {

  const logos = props?.logos;


  const [logoPreview, setLogoPreview]       = useState<string | null>(logos?.company_logo || null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(logos?.favicon || null)

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

  const form = useForm({
    resolver: zodResolver(logoSettingsSchema),
    defaultValues: {
      site_settings: {
        company_logo: null,
        favicon: null,
      }
    }
  })

  const clearPreview = (type: string): void => {
    if (type === 'company_logo') {
      setLogoPreview(null);
      form.setValue('site_settings.company_logo', null);
    } else if (type === 'favicon') {
      setFaviconPreview(null);
      form.setValue('site_settings.favicon', null);
    } 
  };

  const hasChanges = form.watch('site_settings.company_logo') ||
                     form.watch('site_settings.favicon');


  const {t} = useTranslations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Image className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">
           {t('Logo & Branding')}
        </h1>
        <div className="flex gap-2 ml-auto">
          <Badge variant="outline" className="text-xs">
             {t('Visual Identity')}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((e: any) => onLogoUpdate(e,submit))} className='space-y-6'>

          {/* Logo & Branding Overview */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <Palette className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">
                    {t('Brand Identity Management')}
                </p>
                <p className="text-sm">
                   {t('Upload your site logo, favicon to establish your brand identity across all touchpoints.')}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Site Logo Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-blue-500" />
                <CardTitle>
                   {t("Company Logo")}
                </CardTitle>
                {logoPreview && (
                  <Badge variant="default" className="text-xs">
                     {t('Current')}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control as any}
                name="site_settings.company_logo"
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                       {t('Upload Logo')}
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e: any) => handleImageChange(e, onChange, setLogoPreview)}
                            className="max-w-md"
                          />
                          {logoPreview && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => clearPreview('company_logo')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-3 h-3 mr-1" />
                              {t('Clear')}
                            </Button>
                          )}
                        </div>

                        {logoPreview && (
                          <div className="relative inline-block">
                            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                              <img
                                src={logoPreview}
                                alt="Company Logo Preview"
                                className="object-contain w-48 h-24 rounded-lg"
                              />
                              <div className="flex items-center gap-2 mt-3 text-xs text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                 {t('Logo ready for upload')}
                              </div>
                            </div>
                          </div>
                        )}

                        {!logoPreview && (
                          <div className="p-8 text-center border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600">
                            <Image className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="mb-1 text-sm text-gray-500">
                              {t('No logo uploaded')}
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                       {t('Your main site logo that appears in headers and navigation. Recommended size: 200x80 pixels or similar aspect ratio.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-500" />
                <CardTitle>Favicon</CardTitle>
                {faviconPreview && (
                  <Badge variant="default" className="text-xs">Current</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control as any}
                name="site_settings.favicon"
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                     {t(" Upload Favicon")}
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*,.ico"
                            onChange={(e: any) => handleImageChange(e, onChange, setFaviconPreview)}
                            className="max-w-md"
                          />
                          {faviconPreview && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => clearPreview('favicon')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-3 h-3 mr-1" />
                              {t('Clear')}
                            </Button>
                          )}
                        </div>

                        {faviconPreview && (
                          <div className="relative inline-block">
                            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                              <div className="flex items-center gap-4">
                                <img
                                  src={faviconPreview}
                                  alt="Favicon Preview"
                                  className="object-cover w-8 h-8 border rounded"
                                />
                                <img
                                  src={faviconPreview}
                                  alt="Favicon Preview Large"
                                  className="object-cover w-16 h-16 border rounded-lg"
                                />
                                <div className="text-xs text-gray-500">
                                  <div className="mb-1 font-medium">
                                     {t("Preview sizes")}
                                  </div>
                                  <div>{t('Small: Browser tab')}</div>
                                  <div>{t("Large: Bookmarks")}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-3 text-xs text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                  {t('Favicon ready for upload')}
                              </div>
                            </div>
                          </div>
                        )}

                        {!faviconPreview && (
                          <div className="p-8 text-center border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600">
                            <Eye className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="mb-1 text-sm text-gray-500">
                               {t('No favicon uploaded')}
                            </p>
                            <p className="text-xs text-gray-400">
                              {t('ICO, PNG files up to 1MB')}
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                       {t('Small icon that appears in browser tabs and bookmarks. Recommended size: 32x32 pixels. ICO format preferred for best compatibility.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Brand Guidelines */}
          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-500" />
                <CardTitle className="text-purple-800 dark:text-purple-200">
                   {t('Brand Guidelines')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-purple-800 dark:text-purple-200">
                    {t('Logo Requirements')}
                  </h4>
                  <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                    <li>• {t('Transparent background preferred')}</li>
                    <li>• {t('High resolution (minimum 200px wide)')}</li>
                    <li>• {t('Clear, readable at small sizes')}</li>
                    <li>• {t('PNG format recommended')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-purple-800 dark:text-purple-200">{t('Favicon Best Practices')}</h4>
                  <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                    <li>• {t('32x32 pixels is standard')}</li>
                    <li>• {t('Simple, recognizable design')}</li>
                    <li>• {t('Good contrast for visibility')}</li>
                    <li>• {t('ICO format for best support')}</li>
                  </ul>
                </div>

               
              </div>
            </CardContent>
          </Card>

          {/* Upload Summary */}
          {hasChanges && (
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                       {t('Ready to Update')}
                      <Badge variant="outline" className="text-xs">
                        {[logoPreview, faviconPreview].filter(Boolean).length} {t('file(s) ready')}
                      </Badge>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {form.watch('site_settings.company_logo') && t("New logo selected")}
                      {form.watch('site_settings.company_logo') && (form.watch('site_settings.favicon')) && " • "}

                      { (form.watch('site_settings.favicon') ) && " • "}
                      {form.watch('site_settings.favicon') && "New favicon selected"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 text-green-600 bg-green-100 rounded-full dark:bg-green-900">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

             <Button disabled={isSubmitting} type='submit'>
                <ButtonLoader isSubmitting={isSubmitting} />
            </Button>

        </form>
      </Form>
    </div>
  )
}
