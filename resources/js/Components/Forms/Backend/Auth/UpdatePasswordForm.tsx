import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

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
import { PasswordInput } from '@/Components/UI/PasswordInput'

import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { cn } from '@/Utils/helpers'

import { hanldleUpdatePassword } from '@/Controllers/Backend/AuthController'
import { useTranslations } from '@/Hooks/useTranslations'

/* ---------------------------------- types --------------------------------- */

interface UpdatePasswordFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  className?: string
  redirectTo?: string
  passwordLength?: number
}

const buildSchema = (passwordLength: number) =>
  z
    .object({
      password: z
        .string()
        .min(1, 'Please enter your password')
        .min(
          passwordLength,
          `Password must be at least ${passwordLength} characters long`
        ),
      password_confirmation: z
        .string()
        .min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Passwords don't match",
      path: ['password_confirmation'],
    })

type PasswordFormValues = z.infer<ReturnType<typeof buildSchema>>


/* -------------------------------- component ------------------------------- */

export function UpdatePasswordForm({
  className,
  redirectTo,
  passwordLength = 6,
  isAdminRoute = true,
  ...props
}: any) {
  const passwordFormSchema = buildSchema(passwordLength)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  })


  const { t } = useTranslations();


  const { loading: isSubmitting, submit } = useInertiaForm()

  const onSubmit: SubmitHandler<PasswordFormValues> = (data) => {
    hanldleUpdatePassword(data, submit, isAdminRoute)
  }

  return (
    <Form {...form}>
      <form
        className={cn('grid gap-3', className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <FormField
          control={form.control as any}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel required>
                {t('Password')}
              </FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel required>
                {t('Confirm Password')}
              </FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-2" disabled={isSubmitting}>
          <ButtonLoader isSubmitting={isSubmitting} />
        </Button>
      </form>
    </Form>
  )
}
