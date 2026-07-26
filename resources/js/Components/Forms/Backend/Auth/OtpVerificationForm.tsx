import { Button } from '@/Components/UI/Button'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/Components/UI/InputOtp'
import { handleOtpVerify } from '@/Controllers/Backend/AuthController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'


/**
 * Zod Schema
 */
const formSchema = z.object({
  verification_code: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

/**
 * Form Values Type
 */
type FormValues = z.infer<typeof formSchema>

/**
 * Component Props
 */
interface OtpVerificationFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  className?: string
  isGoogle2fa?: boolean
}

export function OtpVerificationForm({
  className,
  isGoogle2fa = false,
  isAdminRoute = true,
  ...props
}: any) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verification_code: '',
    },
  })

  const otp = form.watch('verification_code')

  const {
    loading: isSubmitting,
    errors: serverErrors,
    submit,
  } = useInertiaForm()

  const { t } = useTranslations();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) =>
          handleOtpVerify(e, submit, isGoogle2fa, isAdminRoute)
        )}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control as any}
          name="verification_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">
                {t('One-Time Password')}
              </FormLabel>

              <FormControl>
                <div className="w-full flex justify-center overflow-x-auto">
                  <InputOTP
                    maxLength={6}
                    {...field}
                    containerClassName="flex flex-nowrap justify-center items-center gap-0.5 xs:gap-1 sm:gap-2 md:gap-3"
                  >
                    <InputOTPGroup className="flex gap-0.5 xs:gap-1 sm:gap-2 md:gap-3">
                      <InputOTPSlot className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-xs xs:text-sm sm:text-base md:text-lg shrink-0" index={0} />
                      <InputOTPSlot className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-xs xs:text-sm sm:text-base md:text-lg shrink-0" index={1} />
                    </InputOTPGroup>

                    <InputOTPSeparator className="shrink-0" />

                    <InputOTPGroup className="flex gap-0.5 xs:gap-1 sm:gap-2 md:gap-3">
                      <InputOTPSlot className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-xs xs:text-sm sm:text-base md:text-lg shrink-0" index={2} />
                      <InputOTPSlot className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-xs xs:text-sm sm:text-base md:text-lg shrink-0" index={3} />
                    </InputOTPGroup>

                    <InputOTPSeparator className="shrink-0" />

                    <InputOTPGroup className="flex gap-0.5 xs:gap-1 sm:gap-2 md:gap-3">
                      <InputOTPSlot className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-xs xs:text-sm sm:text-base md:text-lg shrink-0" index={4} />
                      <InputOTPSlot className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-xs xs:text-sm sm:text-base md:text-lg shrink-0" index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </FormControl>


              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-2"
          disabled={otp.length < 6 || isSubmitting}
        >
          <ButtonLoader
            isSubmitting={isSubmitting}
            btnText="Verify"
            loaderText="Verifying ......"
            icon={<ArrowRight />}
          />
        </Button>
      </form>
    </Form>
  )
}
