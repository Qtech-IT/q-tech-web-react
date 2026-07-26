import { Button } from '@/Components/UI/Button'
import {
  Form
} from '@/Components/UI/Form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper'
import { Alert, AlertDescription } from '@/Components/UI/Alert'
import { Badge } from '@/Components/UI/Badge'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card'
import { useSettingsConfig } from '@/Config/useSettingsConfig'
import { onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { getSettings } from '@/Utils/helpers'
import { Clock, Globe, Info, Phone, Settings } from 'lucide-react'

const generalSettingsSchema = z.object({
  site_settings: z.object({
    company_name: z.string().min(1, "Site name is required").max(100, "Site name must be less than 100 characters"),
    company_phone: z.string().min(1, "Phone is required").regex(/^[\+]?[0-9\s\-\(\)]+$/, "Enter a valid phone number"),
    kyc_verification: z.string().min(1, "KYC verification is required"),
    email_verification: z.string().min(1, "Email verification is required"),
    company_email: z.string().min(1, "Email is required").email('Enter valid email'),
    address: z.object({
      full_address: z.string().min(1, 'Full address is required'),
      city: z.string().optional(),
      postal_code: z.string().optional(),
    }).optional(),

    copy_right_text: z.string().min(1, "Copyright text is required").max(300, "Copyright text must be less than 300 characters"),
    timezone: z.string().min(1, "Time zone is required"),
    date_format: z.string().min(1, "Date format is required"),
    time_format: z.string().min(1, "Time format is required"),
    pagination_number: z.any(),
  })
})

export function GeneralSettingsForm({ props }: { props: any }) {

  let {
    dateFormats,
    timeFormats,
    timeZones,
    settings
  } = props?.data;

  const { t } = useTranslations();
  settings = settings?.data || [];



  dateFormats = dateFormats?.map((dateFormat: any) => ({
    value: dateFormat,
    label: dateFormat
  }));

  timeFormats = timeFormats?.map((timeFormat: any) => ({
    value: timeFormat,
    label: timeFormat
  }));

  timeZones = timeZones?.map((timeZone: any) => ({
    value: timeZone,
    label: timeZone
  }));

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()


  const address = getSettings(settings, 'address');



  const form = useForm({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      site_settings: {
        company_name: getSettings(settings, 'company_name') || '',
        company_phone: getSettings(settings, 'company_phone') || '',
        company_email: getSettings(settings, 'company_email') || '',
        kyc_verification: getSettings(settings, 'kyc_verification') || 'inactive',
        email_verification: getSettings(settings, 'email_verification') || 'inactive',
        address: {
          full_address: address?.full_address || '',
          city: address?.city || '',
          postal_code: address?.postal_code || '',
        } as any,
        copy_right_text: getSettings(settings, 'copy_right_text', '{company_name} All rights reserved.'),

        timezone: getSettings(settings, 'timezone') || 'UTC',
        date_format: getSettings(settings, 'date_format', 'd M, Y') || 'd M, Y',
        time_format: getSettings(settings, 'time_format', 'h:i A') || 'h:i A',
        pagination_number: (getSettings(settings, 'pagination_number', 10) || 10),
      }
    }
  })


  const config = useSettingsConfig(timeZones, dateFormats, timeFormats);


  const basicFields = config?.form?.general_settings_fields.filter((f: any) => f.section === 'basic');

  const contactFields = config?.form?.general_settings_fields.filter((f: any) => f.section === 'contact');

  const addressFields = config?.form?.general_settings_fields.filter((f: any) => f.section === 'address');

  const dateTimeFields = config?.form?.general_settings_fields.filter((f: any) => f.section === 'date_time');


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">
          {t('General Settings')}
        </h1>
        <div className="flex gap-2 ml-auto">
          <Badge variant="outline" className="text-xs">
            {t('System Configuration')}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((e: any) => onSettingsUpdate(e, submit))} className='space-y-6'>

          {/* General Settings Overview */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <Info className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">
                  {t('Site Configuration')}
                </p>
                <p className="text-sm">
                  {t('Configure basic site information, contact details, and system preferences that will be used throughout your application.')}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <CardTitle>
                  {t("Basic Information")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              {basicFields?.map((field: any, index: Number) => (
                <DynamicInputWrapper
                  key={field.name || index}
                  field={field}
                  form={form}
                  isSubmitting={isSubmitting}
                  serverErrors={serverErrors}
                />
              ))}

            </CardContent>
          </Card>



          {/* Contact Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-500" />
                <CardTitle>
                  {t('Contact Information')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              {contactFields?.map((field: any, index: Number) => (
                <DynamicInputWrapper
                  key={field.name || index}
                  field={field}
                  form={form}
                  isSubmitting={isSubmitting}
                  serverErrors={serverErrors}
                />
              ))}

              {addressFields?.map((field: any, index: Number) => (
                <DynamicInputWrapper
                  key={field.name || index}
                  field={field}
                  form={form}
                  isSubmitting={isSubmitting}
                  serverErrors={serverErrors}
                />
              ))}


            </CardContent>
          </Card>

          {/* Localization Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <CardTitle>
                  {t('Localization & Time')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">


              {dateTimeFields?.map((field: any, index: Number) => (
                <DynamicInputWrapper
                  key={field.name || index}
                  field={field}
                  form={form}
                  isSubmitting={isSubmitting}
                  serverErrors={serverErrors}
                />
              ))}


            </CardContent>
          </Card>



          {/* Submit Button */}
          <Button disabled={isSubmitting} type='submit'>
            <ButtonLoader isSubmitting={isSubmitting} />
          </Button>

        </form>
      </Form>
    </div>
  )
}