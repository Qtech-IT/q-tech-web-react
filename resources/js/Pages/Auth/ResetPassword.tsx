import { EmailVerificationForm } from '@/Components/Forms/Backend/Auth/EmailVerificationForm'
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
import { Head, Link } from '@inertiajs/react'
export default function ResetPassword({ title, isAdminRoute }: any) {
  const { t } = useTranslations();
  return (
    <GuestLayout title={title} isAdminRoute={isAdminRoute}>
      <Head title={title} />
      <Card className={`gap-4`}>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('Verify email')}
          </CardTitle>
          <CardDescription>
            {t('Please enter your email and get verification code.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailVerificationForm isAdminRoute={isAdminRoute} />
        </CardContent>

        <CardFooter>
          <p className='px-8 mx-auto text-sm text-center text-muted-foreground text-balance'>
            {t('Want to access your account')}?{' '}
            <Link
              href={isAdminRoute ? route('backend.login') : route('login')}
              className='underline hover:text-primary underline-offset-4'
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
