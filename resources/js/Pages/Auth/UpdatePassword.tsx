import { UpdatePasswordForm } from '@/Components/Forms/Backend/Auth/UpdatePasswordForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/Components/UI/Card'
import { useTranslations } from '@/Hooks/useTranslations'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head, Link, usePage } from '@inertiajs/react'

interface PageProps {
  site_theme_settings?: {
    minimum_password_length?: number | string
  }
}

export default function ResetPassword({ title, minimumPasswordLength, isAdminRoute }: any) {

  const { props: any } = usePage()
  const passwordLength: any = minimumPasswordLength || 6;

  const { t } = useTranslations();

  return (
    <GuestLayout title={title} isAdminRoute={isAdminRoute}>
      <Head title={title} />

      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">
            {t('Update password')}
          </CardTitle>
          <CardDescription>
            {t('Please enter your new password and confirm it to update your account credentials')}.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdatePasswordForm passwordLength={passwordLength} isAdminRoute={isAdminRoute} />
        </CardContent>

        <CardFooter>
          <p className="px-8 mx-auto text-sm text-center text-muted-foreground text-balance">
            {t('Want to access your account')}?{' '}
            <Link
              href={route('backend.login')}
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('Login')}
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </GuestLayout>
  )
}
