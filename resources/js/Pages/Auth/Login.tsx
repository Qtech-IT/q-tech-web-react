
import { UserAuthForm } from '@/Components/Forms/Backend/Auth/UserAuthForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/Components/UI/Card'
import { useTranslations } from '@/Hooks/useTranslations'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head } from '@inertiajs/react'

export default function Login({ title, isAdminRoute }: any) {
  const { t } = useTranslations();

  return (
    <GuestLayout title={title} isAdminRoute={isAdminRoute}>
      <Head title={title} />

      <Card className={`gap-4`}>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('Sign in')}
          </CardTitle>
          <CardDescription>
            {t('Enter your username and password below to')}
            <br />
            {t('log into your account')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UserAuthForm isAdminRoute={isAdminRoute} />
        </CardContent>
      </Card>

    </GuestLayout>
  )
}