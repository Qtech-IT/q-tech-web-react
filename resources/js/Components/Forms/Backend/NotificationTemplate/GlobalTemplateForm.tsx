import { Button } from '@/Components/UI/Button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { usePage } from '@inertiajs/react'
import { Code, Mail, Bell, Smartphone, Settings } from 'lucide-react'

import { ButtonLoader } from '@/Components/UI/ButtonLoader'

import { isDarkMode } from '@/Utils/helpers'
import { RefObject } from 'react'
import { onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import RichTextEditor from '@/Components/UI/TextEditor'
import { useTranslations } from '@/Hooks/useTranslations'



type GlobalTemplateFormValues = {
  site_settings: {
    default_mail_template: string
    default_push_template: string
  }
}

type Props = {
  form: any
  mailEditorRef: RefObject<any>
}



export function GlobalTemplateForm({
  form,
  mailEditorRef
}: Props) {
  const { loading: isSubmitting, submit } = useInertiaForm()
  const { props } = usePage<any>()

  const {t} = useTranslations();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e : any) =>
          onSettingsUpdate(e, submit)
        )}
        className="space-y-6"
      >
        {/* Global Mail Template */}
        <div className="p-4 space-y-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <Mail className="w-5 h-5" />
              {t(' Global Mail Template')}
          </h3>

          <FormField
            control={form.control}
            name="site_settings.default_mail_template"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                   {t('Mail Template Content')}
                </FormLabel>
                <FormControl>
                  <RichTextEditor
                    ref={mailEditorRef}
                    value={field.value}
                    onChange={field.onChange}
                    height="400px"
                    toolbar="full"
                    placeholder="Enter global mail template content..."
                    darkMode={isDarkMode(
                      props?.site_theme_settings
                    )}
                  />
                </FormControl>
                <FormDescription>
                  {t('Base layout for all email notifications.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      
        {/* Usage Info */}
        <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
          <h4 className="flex items-center gap-2 mb-3 font-medium">
            <Settings className="w-4 h-4" />
             {t('Template Usage Guidelines')}
          </h4>
          <div className="space-y-2 text-sm">
            <p>
              <strong>{t('Mail')}:</strong>  {t('Wrapper/layout for all emails')}
            </p>
            <p>
              <strong>{t('Push')}:</strong> {t('Short message format for notifications')}
            </p>
            <p>
              <strong>{t('Keys')}:</strong> {t('Use sidebar template keys for')}
               {t('dynamic values')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText="Save Global Templates"
              loaderText="Saving Templates..."
              icon={<Settings className="w-4 h-4" />}
            />
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default GlobalTemplateForm
