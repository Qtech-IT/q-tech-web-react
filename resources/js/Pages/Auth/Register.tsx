import { RegisterForm } from '@/Components/Forms/Backend/Auth/RegisterForm'
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

export default function Register({ title, passwordLength }: any) {

    const { t } = useTranslations();
    return (
        <GuestLayout title={title} isAdminRoute={false}>
            <Head title={title} />

            <Card>
                <CardHeader>
                    <CardTitle>
                        {t('Register')}
                    </CardTitle>
                    <CardDescription>
                        {t('Create your account')}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <RegisterForm passwordLength={passwordLength} />
                </CardContent>

                <CardFooter>
                    <p className='px-8 mx-auto text-sm text-center text-muted-foreground text-balance'>
                        {t('Want to access your account?')}{' '}
                        <Link
                            href={route('login')}
                            className='underline hover:text-primary underline-offset-4'
                        >
                            {t('Login')}?
                        </Link>
                        .
                    </p>
                </CardFooter>
            </Card>
        </GuestLayout>
    )
}