import { Button } from '@/Components/UI/Button'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import Checkbox from "@/Components/UI/Checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { PasswordInput } from '@/Components/UI/PasswordInput'
import { handleLogin } from '@/Controllers/Backend/AuthController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@inertiajs/react'
import { LogIn } from 'lucide-react'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from "zod"

const formSchema = z.object({
  username: z.string().min(1, "Please enter username"),
  password: z
    .string()
    .min(1, "Please enter your password"),
  remember: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string
  redirectTo?: string
}

export function UserAuthForm({ isAdminRoute = false, className, redirectTo, ...props }: any) {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false
    },
  })

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

  const onSubmit: SubmitHandler<FormValues> = (data) =>
    handleLogin(data, submit, isAdminRoute)

  const { t } = useTranslations();

  return (
    <Form {...form}>
      <form
        className={cn("grid gap-3", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control as any}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('Username')}
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="joe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <Link
                href={isAdminRoute ? route('backend.password.request.form') : route('password.request.form')}
                className="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75"
              >
                {t('Forgot password')}?
              </Link>
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormLabel className="!m-0">
                {t('Remember me')}
              </FormLabel>
            </FormItem>
          )}
        />

        <Button className="mt-2" disabled={isSubmitting}>
          <ButtonLoader
            isSubmitting={isSubmitting}
            btnText={t("Sign in")}
            loaderText={t("Sign in ......")}
            icon={<LogIn className="w-4 h-4" />}
          />
        </Button>

        {/* Register option (only for user, not admin) */}
        {!isAdminRoute && (
          <div className="text-center text-sm text-muted-foreground mt-2">
            {t("Don't have an account?")}{" "}
            <Link
              href={route('register')}
              className="text-primary font-medium hover:underline"
            >
              {t("Register")} ?
            </Link>
          </div>
        )}
      </form>
    </Form>
  )
}
