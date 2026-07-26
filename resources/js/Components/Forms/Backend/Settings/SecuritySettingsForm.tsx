import { Alert, AlertDescription } from '@/Components/UI/Alert'
import { Badge } from '@/Components/UI/Badge'
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
import { onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Shield } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const securitySettingsSchema = z.object({
  site_settings: z.object({
    // Authentication Settings
    session_timeout: z.string()
      .min(1, "Session timeout is required")
      .refine((val: string) => parseInt(val) >= 5, {
        message: "Session timeout must be at least 5 minutes"
      })
      .refine((val: string) => parseInt(val) <= 1440, {
        message: "Session timeout cannot exceed 24 hours (1440 minutes)"
      }),

    login_attempt_validation: z.boolean(),
    otp_expiry_seconds: z.string()
      .min(1, "OTP expiry second is required")
      .refine((val: string) => parseInt(val) >= 60, {
        message: "Session timeout must be at least 60 seconds"
      })
      .refine((val: string) => parseInt(val) <= 86400, {
        message: "Session timeout cannot exceed 24 hours (86400 seconds)"
      }),
    maximum_login_attempts: z.string()
      .min(1, "Max login attempts is required")
      .refine((val: string) => parseInt(val) >= 1, {
        message: "Must allow at least 1 login attempt"
      })
      .refine((val: string) => parseInt(val) <= 20, {
        message: "Maximum 20 login attempts allowed"
      }),

    // Password Security
    minimum_password_length: z.string()
      .min(1, "Minimum password length is required")
      .refine((val: string) => parseInt(val) >= 6, {
        message: "Minimum password length must be at least 6 characters"
      })
      .refine((val: string) => parseInt(val) <= 128, {
        message: "Password length cannot exceed 128 characters"
      }),

    strong_password: z.boolean(),


  })
});

export function SecuritySettingsForm({ props }: { props: any }) {


  const {
    session_timeout: sessionTimeout,
    login_attempt_validation: maxLoginValidation,
    maximum_login_attempts: maxLoginAttempts,
    minimum_password_length: minPasswordLength,
    strong_password: strongPasswordEnabled,
    otp_expiry_seconds: otpExpirySeconds
  } = props;


  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm();

  const form = useForm({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      site_settings: {
        session_timeout: sessionTimeout?.toString() || '120',
        login_attempt_validation: maxLoginValidation === "active",
        maximum_login_attempts: maxLoginAttempts?.toString() || '5',
        minimum_password_length: minPasswordLength?.toString() || '8',
        otp_expiry_seconds: otpExpirySeconds?.toString() || '120',
        strong_password: strongPasswordEnabled === "active",
      }
    }
  });

  const watchMaxLoginValidation = form.watch('site_settings.login_attempt_validation');
  const watchStrongPassword = form.watch('site_settings.strong_password');
  const { t } = useTranslations();


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">
          {t('Security Settings')}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((e: any) => onSettingsUpdate(e, submit))} className='space-y-6'>

          {/* Authentication Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-500" />
                <CardTitle>
                  {t('Authentication Security')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Session Timeout */}
              <FormField
                control={form.control as any}
                name="site_settings.session_timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {t('Session Timeout')}
                      <Badge variant="secondary" className="text-xs">
                        {t("Minutes")}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="5"
                        max="1440"
                        placeholder="120"
                        {...field}
                        className="max-w-xs"
                      />
                    </FormControl>
                    <FormDescription>
                      {t("Users will be automatically logged out after this period of inactivity (5 to 1440 minutes)")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control as any}
                name="site_settings.otp_expiry_seconds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {t('OTP Expiry Seconds')}
                      <Badge variant="secondary" className="text-xs">
                        {t("Seconds")}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="60"
                        max="86400"
                        placeholder="120"
                        {...field}
                        className="max-w-xs"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Login Attempts Validation Toggle */}
              <div className="space-y-4">
                <FormField
                  control={form.control as any}
                  name="site_settings.login_attempt_validation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t('Login Attempt Validation')}
                        </FormLabel>
                        <FormDescription>
                          {t('Enable protection against brute force attacks')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Max Login Attempts - Only show when validation is enabled */}
                {watchMaxLoginValidation && (
                  <FormField
                    control={form.control as any}
                    name="site_settings.maximum_login_attempts"
                    render={({ field }) => (
                      <FormItem className="ml-4">
                        <FormLabel className="flex items-center gap-2">
                          {t('Maximum Login Attempts')}
                          <Badge variant="destructive" className="text-xs">
                            {t('Critical')}
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            placeholder="5"
                            {...field}
                            className="max-w-xs"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Password Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                <CardTitle>
                  {t('Password Security')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Minimum Password Length */}
              <FormField
                control={form.control as any}
                name="site_settings.minimum_password_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {t('Minimum Password Length')}
                      <Badge variant="secondary" className="text-xs">
                        {t('Characters')}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="6"
                        max="128"
                        placeholder="8"
                        {...field}
                        className="max-w-xs"
                      />
                    </FormControl>
                    <FormDescription>
                      {t('Minimum number of characters required for user passwords')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Strong Password Toggle */}
              <FormField
                control={form.control as any}
                name="site_settings.strong_password"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        {t('Strong Password Requirements')}
                        {watchStrongPassword && (
                          <Badge variant="default" className="text-xs">
                            {t('Enabled')}
                          </Badge>
                        )}
                      </FormLabel>
                      <FormDescription>
                        {t('Require uppercase, lowercase, numbers, and special characters')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchStrongPassword && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                  <Shield className="w-4 h-4" />
                  <AlertDescription>
                    {t('Strong password policy is active. Passwords must contain:')}
                    <ul className="mt-2 ml-4 list-disc text-sm">
                      <li>{t('At least one uppercase letter ')} (A-Z)</li>
                      <li>{t("At least one lowercase letter")} (a-z)</li>
                      <li>{t("At least one number")} (0-9)</li>
                      <li>{t('At least one special character')} (!@#$%^&*)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>



          {/* Submit Button */}
          <Button disabled={isSubmitting} type='submit'>
            <ButtonLoader isSubmitting={isSubmitting} />
          </Button>
        </form>
      </Form>
    </div>
  );
}