import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/Components/UI/Button'
import {
  Form
} from '@/Components/UI/Form'

import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { onPasswordUpdate } from '@/Controllers/Backend/ProfileController'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card'
import { Alert, AlertDescription } from '@/Components/UI/Alert'
import { Badge } from '@/Components/UI/Badge'
import { Lock, Shield, CheckCircle, Key } from 'lucide-react'
import { useTranslations } from '@/Hooks/useTranslations'
import { usePasswordUpdateConfig } from '@/Config/usePasswordUpdateConfig'
import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper'

export function PasswordForm({ passwordLength = 6 , routePrefix }: { passwordLength: any , routePrefix : string}) {

  const {t} = useTranslations();
  const passwordFormSchema = z.object({
      password: z
          .string()
          .min(1, t('Please enter your password'))
          .min(passwordLength, t(`Password must be at least ${passwordLength} characters long`)),
      password_confirmation: z
          .string()
          .min(1, t('Please confirm your password')),
      }).refine((data) => data.password === data.password_confirmation, {
      message: "Passwords don't match",
      path: ["password_confirmation"],
  })

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()


  const config = usePasswordUpdateConfig(passwordLength)

  const form = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: '',
      password_confirmation: ''
    }
  })

  const watchPassword        = form.watch('password');
  const watchConfirmPassword = form.watch('password_confirmation');
  const passwordsMatch       = watchPassword && watchConfirmPassword && watchPassword === watchConfirmPassword;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">
           {t('Security Settings')}
        </h1>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline" className="text-xs">
             {t(' Password Management')}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((e) => onPasswordUpdate(e,submit ,form ,routePrefix))} className='space-y-6'>

          {/* Security Overview */}
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">
                   {t('Password Security')}
                </p>
                <p className="text-sm">
                  {t("Choose a strong password to protect your account. Make sure it's at least")} {passwordLength} {t('characters long and unique to this account')}.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-red-500" />
                <CardTitle>
                   {t('Change Password')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">


              {config?.form?.fields?.map((field :any , index :any) => (
                                        
                  <DynamicInputWrapper
                    key={field.name || index} 
                    field ={field}
                    form ={form}
                    isSubmitting ={isSubmitting}
                    serverErrors ={serverErrors}
                  />

                ))}

            </CardContent>
          </Card>

          {/* Password Status */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                     {t('Password Status')}
                    <Badge variant={passwordsMatch ? "default" : "outline"} className="text-xs">
                      {passwordsMatch ? "Passwords Match" : "Ready to Update"}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {watchPassword && `Password length: ${watchPassword.length} characters`}
                    {passwordsMatch && ' • Passwords match'}
                    {watchPassword && watchPassword.length >= passwordLength && ' • Meets minimum requirements'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    passwordsMatch ? 'bg-green-100 text-green-600 dark:bg-green-900' : 'bg-gray-100 text-gray-600 dark:bg-gray-900'
                  }`}>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>
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
