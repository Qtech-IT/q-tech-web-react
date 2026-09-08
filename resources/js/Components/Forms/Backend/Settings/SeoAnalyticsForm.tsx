import { zodResolver } from '@hookform/resolvers/zod'
import { BarChart3, Search, Tag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription } from '@/Components/UI/Alert'
import { Button } from '@/Components/UI/Button'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { Switch } from '@/Components/UI/Switch'
import { Textarea } from '@/Components/UI/Textarea'
import { onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'

/*
 * The identifier formats mirror `site_analytics()` on the server, which drops
 * anything that does not match — and any tag whose enable switch is off —
 * before it can reach a public page. An empty ID is always allowed.
 */
const optionalId = (pattern: RegExp, message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || pattern.test(value), { message })

const schema = z.object({
  site_settings: z.object({
    google_analytics_id: optionalId(
      /^(G|UA|AW)-[A-Z0-9-]+$/i,
      'Expected a Google tag ID like G-XXXXXXX',
    ),
    google_analytics_enabled: z.boolean(),
    google_tag_manager_id: optionalId(
      /^GTM-[A-Z0-9]+$/i,
      'Expected a container ID like GTM-XXXXXX',
    ),
    google_tag_manager_enabled: z.boolean(),
    google_adsense_id: optionalId(
      /^ca-pub-[0-9]+$/,
      'Expected a publisher ID like ca-pub-0000000000000000',
    ),
    google_adsense_enabled: z.boolean(),
    google_site_verification: optionalId(
      /^[A-Za-z0-9_-]+$/,
      'Use only the token, not the full meta tag',
    ),
    default_meta_title_suffix: z.string().max(120).optional(),
    default_meta_description: z.string().max(320).optional(),
  }),
})

type FormValues = z.infer<typeof schema>

const isOn = (value: unknown) => value === 'active' || value === true || value === 1

export function SeoAnalyticsForm({ props }: { props: any }) {
  const { t } = useTranslations()
  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      site_settings: {
        google_analytics_id: props?.google_analytics_id ?? '',
        google_analytics_enabled: isOn(props?.google_analytics_enabled),
        google_tag_manager_id: props?.google_tag_manager_id ?? '',
        google_tag_manager_enabled: isOn(props?.google_tag_manager_enabled),
        google_adsense_id: props?.google_adsense_id ?? '',
        google_adsense_enabled: isOn(props?.google_adsense_enabled),
        google_site_verification: props?.google_site_verification ?? '',
        default_meta_title_suffix: props?.default_meta_title_suffix ?? '',
        default_meta_description: props?.default_meta_description ?? '',
      },
    },
  })

  const gtmOn = form.watch('site_settings.google_tag_manager_enabled')

  const textField = (
    name: keyof FormValues['site_settings'],
    label: string,
    description: string,
    placeholder = '',
  ) => (
    <FormField
      control={form.control as any}
      name={`site_settings.${name}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormDescription>{t(description)}</FormDescription>
          <FormMessage />
          {serverErrors?.[`site_settings.${name}`] ? (
            <p className="text-sm text-destructive">
              {serverErrors[`site_settings.${name}`]}
            </p>
          ) : null}
        </FormItem>
      )}
    />
  )

  const switchField = (
    name: keyof FormValues['site_settings'],
    label: string,
    description: string,
  ) => (
    <FormField
      control={form.control as any}
      name={`site_settings.${name}`}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel>{t(label)}</FormLabel>
            <FormDescription>{t(description)}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value as boolean} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t('SEO & Analytics')}</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSettingsUpdate(values, submit))}
          className="space-y-6"
        >
          <Alert>
            <AlertDescription>
              {t(
                'These tags load on the public site only — the admin panel never loads analytics or ads. Each tag needs both its ID and its switch turned on. When Tag Manager is on, configure Analytics inside the container rather than also turning the Analytics tag on here.',
              )}
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <CardTitle>{t('Google Analytics & Tag Manager')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {textField(
                'google_analytics_id',
                'Google Analytics ID',
                'Measurement / tag ID, e.g. G-XXXXXXX.',
                'G-XXXXXXX',
              )}
              {switchField(
                'google_analytics_enabled',
                'Enable Google Analytics',
                gtmOn
                  ? 'Ignored while Tag Manager is enabled.'
                  : 'Load the Analytics tag on public pages.',
              )}
              {textField(
                'google_tag_manager_id',
                'Google Tag Manager ID',
                'Container ID, e.g. GTM-XXXXXX.',
                'GTM-XXXXXX',
              )}
              {switchField(
                'google_tag_manager_enabled',
                'Enable Google Tag Manager',
                'Load the Tag Manager container on public pages.',
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-green-500" />
                <CardTitle>{t('Google AdSense')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {textField(
                'google_adsense_id',
                'AdSense Publisher ID',
                'Publisher ID, e.g. ca-pub-0000000000000000.',
                'ca-pub-0000000000000000',
              )}
              {switchField(
                'google_adsense_enabled',
                'Enable Google AdSense',
                'Load the AdSense script site-wide on public pages.',
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-500" />
                <CardTitle>{t('Search & Metadata')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {textField(
                'google_site_verification',
                'Google Site Verification',
                'Search Console verification token (the content value only, not the whole tag).',
              )}
              {textField(
                'default_meta_title_suffix',
                'Default Meta Title Suffix',
                'Appended to every page title that does not set its own.',
              )}
              <FormField
                control={form.control as any}
                name="site_settings.default_meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Default Meta Description')}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('Used when a page has no SEO record and no excerpt.')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button disabled={isSubmitting} type="submit">
            <ButtonLoader isSubmitting={isSubmitting} />
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default SeoAnalyticsForm
