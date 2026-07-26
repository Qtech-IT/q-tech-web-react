import { Button } from '@/Components/UI/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { handle2faVerifyRequest } from '@/Controllers/Backend/ProfileController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Shield, Smartphone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const twoFaSchema = z.object({
  code: z
    .string()
    .min(1, 'Please enter the verification code')
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only numbers'),
})

export function TwoFaDialog({ open, onOpenChange, qrCodeUrl, routePrefix }:
  { open: any, onOpenChange: any, qrCodeUrl: any, routePrefix: string }
) {

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

  const { t } = useTranslations();

  const form = useForm({
    resolver: zodResolver(twoFaSchema),
    defaultValues: {
      code: '',
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className='text-center'>
          <div className='flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10'>
            <Shield className='w-6 h-6 text-primary' />
          </div>
          <DialogTitle>
            {t('Enable Two-Factor Authentication')}
          </DialogTitle>
          <DialogDescription>
            {t('Scan the QR code with your authenticator app, then enter the 6-digit code to complete setup.')}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* QR Code Section */}
          <div className='flex flex-col items-center space-y-4'>
            <div className='p-4 bg-white border-2 border-gray-200 rounded-lg'>
              <img
                src={qrCodeUrl || '/placeholder-qr.png'}
                alt={t('2FA QR Code')}
                className='object-contain w-48 h-48'
              />
            </div>

            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Smartphone className='w-4 h-4' />
              <span>
                {t('Scan with Google Authenticator or similar app')}
              </span>
            </div>
          </div>

          {/* Code Input Form */}
          <Form {...form}>
            <form
              id='two-fa-form'
              onSubmit={form.handleSubmit((e) => handle2faVerifyRequest(e, submit, onOpenChange, routePrefix))}
              className='space-y-4'
            >
              <FormField
                control={form.control as any}
                name='code'
                render={({ field }) => (
                  <FormItem className='grid items-center grid-cols-6 space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t("Verification Code")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='123456'
                        className='col-span-4  text-lg tracking-widest text-center'
                        maxLength={6}
                        autoComplete='off'
                        disabled={isSubmitting}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className='flex justify-between'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("Cancel")}
          </Button>

          <Button
            type='submit'
            form='two-fa-form'
            disabled={isSubmitting}
          >

            {isSubmitting && <Loader2 className='animate-spin' />}
            {t("Verify & Enable")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
