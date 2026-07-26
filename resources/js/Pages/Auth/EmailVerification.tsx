import { EmailOtpVerification } from '@/Components/Forms/Backend/Auth/EmailOtpVerification'
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
import { TitleProps } from '@/Types'
import { Head, Link } from '@inertiajs/react'
export default function OtpVerification({ title }: TitleProps) {

    const { t } = useTranslations();


    return (
        <GuestLayout title={title} isAdminRoute={false} >
            <Head title={title} />
            <Card className='gap-4'>
                <CardHeader>
                    <CardTitle className='text-lg tracking-tight'>
                        {t('Email Verification')}
                    </CardTitle>
                    <CardDescription>
                        {t('Please enter the authentication code')}. <br /> {
                            t('We have sent the authentication code to your email')
                        }.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EmailOtpVerification />
                </CardContent>

                <CardFooter>
                    <p className='px-8 mx-auto text-sm text-center text-muted-foreground text-balance'>
                        {t('Want to access your account?')}{' '}
                        <Link
                            href={route('backend.login')}
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
