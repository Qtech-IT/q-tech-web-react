import { Button } from '@/Components/UI/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/UI/Card'
import { Input } from '@/Components/UI/Input'
import { Label } from '@/Components/UI/Label'
import { useTranslations } from '@/Hooks/useTranslations'
import UserLayout from '@/Layouts/FrontendLayout'
import { Link, useForm } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'

export default function WithdrawAddresses({ user, defaultCurrency, title }: any) {

    user = user?.data || user
    const { t } = useTranslations()

    const { data, setData, post, processing, errors } = useForm({
        withdrawal_address: user.withdrawal_address || '',
    })

    const submitProfile = (e: any) => {
        e.preventDefault()
        post(route('user.profile.withdraw.addresses.update'), { forceFormData: true })
    }

    return (
        <UserLayout title={title}>

            {/* PAGE WRAPPER */}
            <div className="bg-slate-50 min-h-screen px-4 py-6">

                <div className="max-w-xl mx-auto space-y-6">

                    {/* BACK BUTTON */}
                    <Link
                        href={route('user.profile.index')}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition"
                    >
                        <ArrowLeft size={16} />
                        {t('Back to Profile')}
                    </Link>

                    {/* CARD */}
                    <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">

                        <CardHeader className="pb-4">
                            <CardTitle className="text-slate-900 text-lg font-semibold">
                                {t('Withdrawal Address')}
                            </CardTitle>
                            <CardDescription className="text-slate-500 text-sm">
                                {t('Update your withdrawal address information.')}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submitProfile} className="space-y-5">

                                {/* INPUT */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">
                                        {t('Withdrawal Address')} ({defaultCurrency})
                                    </Label>

                                    <Input
                                        placeholder="EX: 0x1234...abcd"
                                        className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                                        value={data.withdrawal_address}
                                        onChange={e => setData('withdrawal_address', e.target.value)}
                                    />

                                    {errors.withdrawal_address && (
                                        <p className="text-red-500 text-xs">
                                            {errors.withdrawal_address}
                                        </p>
                                    )}
                                </div>

                                {/* BUTTON */}
                                <Button
                                    disabled={processing}
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                                >
                                    {t('Update')}
                                </Button>

                            </form>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </UserLayout>
    )
}