
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {  Mail, Send } from 'lucide-react'

import { useTranslations } from '@/Hooks/useTranslations'
import { Button } from '@/Components/UI/Button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import { Alert, AlertDescription } from '@/Components/UI/Alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog'


const testMailSchema = z.object({
  email: z.string().email("Invalid email address")
})

type TestMailFormValues = z.infer<typeof testMailSchema>


export function TestMailDialog({ 
  open, 
  onOpenChange, 
  routePrefix 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  routePrefix: string
}) {

  const { t } = useTranslations()
  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

  const form = useForm<TestMailFormValues>({
    resolver: zodResolver(testMailSchema),
    defaultValues: {
      email: ''
    }
  })

  const handleTestMail = (data: TestMailFormValues) => {

     try {
            submit({
                method: 'POST',
                url: route(`${routePrefix}.test`),
                data: data,
            })
        } catch (error) {

        }

  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            {t('Send Test Email')}
          </DialogTitle>
          <DialogDescription>
            {t('Send a test email to verify your mail configuration is working correctly')}
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <Mail className="w-4 h-4" />
          <AlertDescription>
            <p className="font-medium">{t('Test Mail Configuration')}</p>
            <p className="text-sm mt-1">
              {t('A test email will be sent to verify SMTP settings. Make sure you have saved your configuration first')}
            </p>
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleTestMail)} className="space-y-4">
            <FormField
              control={form.control as any}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t('Recipient Email')}
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder={t('Enter email address')}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                    <FormDescription>
                        {t('Enter the email address where you want to receive the test email')}
                    </FormDescription>
                  <FormMessage />
                  {serverErrors?.email && (
                    <p className="text-sm font-medium text-destructive">
                      {serverErrors.email}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                >
                {t('Cancel')}
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                    <ButtonLoader
                        isSubmitting={isSubmitting}
                        btnText={t('Send Test Email')}
                        loaderText={t('Sending...')}
                        icon={<Send className="w-4 h-4" />}
                    />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
