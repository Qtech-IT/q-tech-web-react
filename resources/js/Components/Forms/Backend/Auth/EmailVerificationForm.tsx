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
import { Input } from '@/Components/UI/Input'
import { handleResetPassword } from '@/Controllers/Backend/AuthController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a your email" })
})

interface EmailVerificationFormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string
}

export function EmailVerificationForm({ className, isAdminRoute, ...props }: any) {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    },
  })

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

  const { t } = useTranslations();

  return (

    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => handleResetPassword(e, submit, isAdminRoute))}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control as any}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel required >
                {t("Email")}
              </FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
              {serverErrors?.email && <p className="text-sm font-medium text-destructive">{serverErrors.email}</p>}
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isSubmitting}>

          <ButtonLoader
            isSubmitting={isSubmitting}
            btnText={t("Continue")}
            loaderText={t("Continue .....")}
            icon={<ArrowRight />}
          />

        </Button>
      </form>
    </Form>
  )
}
