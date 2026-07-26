import { Button } from '@/Components/UI/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/UI/Card'
import { Input } from '@/Components/UI/Input'
import { Label } from '@/Components/UI/Label'
import { useTranslations } from '@/Hooks/useTranslations'
import UserLayout from '@/Layouts/FrontendLayout'
import { Link, useForm } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function ProfileShow({ user, title }: any) {

    user = user?.data || user
    const { t } = useTranslations()

    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        image: null as File | null
    })

    const [preview, setPreview] = useState(user.img_url)

    const submitProfile = (e: any) => {
        e.preventDefault()
        post(route('user.profile.update'), { forceFormData: true })
    }

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: ''
    })

    const submitPassword = (e: any) => {
        e.preventDefault()
        passwordForm.post(route('user.profile.password.update'))
    }

    return (
        <UserLayout title={title}>

            {/* FIX: prevents mobile scroll jitter */}
            <div className="min-h-dvh bg-slate-50 text-slate-900 px-4 py-6">

                <div className="max-w-xl mx-auto space-y-6">

                    {/* BACK */}
                    <Link
                        href={route('user.profile.index')}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition"
                    >
                        <ArrowLeft size={16} />
                        {t('Back to Profile')}
                    </Link>

                    {/* PROFILE CARD */}
                    <Card className="bg-white border border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900 text-lg">
                                {t('Profile Information')}
                            </CardTitle>
                            <CardDescription className="text-slate-500">
                                {t('Update your account profile information and email address.')}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submitProfile} className="space-y-6">

                                {/* AVATAR */}
                                <div className="flex items-center gap-4">

                                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center text-sm font-semibold text-slate-600">
                                        {preview ? (
                                            <img src={preview} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name?.[0]
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <Label className="text-sm text-slate-700">
                                            {t('Profile Picture')}
                                        </Label>

                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="h-10 bg-white border-slate-300 text-slate-900 file:text-sm"
                                            onChange={(e: any) => {
                                                const file = e.target.files[0]
                                                setData('image', file)
                                                if (file) setPreview(URL.createObjectURL(file))
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* INPUTS */}
                                {[
                                    { label: t('Full Name'), key: 'name', value: data.name, placeholder: 'John Doe' },
                                    { label: t('Username'), key: 'username', value: data.username, placeholder: 'john_doe' },
                                    { label: t('Email Address'), key: 'email', value: data.email, placeholder: 'john@email.com', type: 'email' },
                                    { label: t('Phone Number'), key: 'phone', value: data.phone, placeholder: '+8801XXXXXXXXX' },
                                ].map((field, i) => (
                                    <div key={i} className="space-y-2">
                                        <Label className="text-sm text-slate-700">
                                            {field.label}
                                        </Label>

                                        <Input
                                            type={field.type || 'text'}
                                            placeholder={field.placeholder}
                                            className="h-11 bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                                            value={field.value}
                                            onChange={(e) => setData(field.key as any, e.target.value)}
                                        />

                                        {errors[field.key as keyof typeof errors] && (
                                            <p className="text-red-500 text-xs">
                                                {errors[field.key as keyof typeof errors]}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    disabled={processing}
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {t('Update Profile')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* PASSWORD CARD */}
                    <Card className="bg-white border border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900 text-lg">
                                {t('Security')}
                            </CardTitle>
                            <CardDescription className="text-slate-500">
                                {t('Change your account password regularly to stay secure.')}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submitPassword} className="space-y-5">

                                {[
                                    { label: t('Current Password'), key: 'current_password' },
                                    { label: t('New Password'), key: 'password' },
                                    { label: t('Confirm Password'), key: 'password_confirmation' },
                                ].map((field, i) => (
                                    <div key={i} className="space-y-2">
                                        <Label className="text-sm text-slate-700">
                                            {field.label}
                                        </Label>

                                        <Input
                                            type="password"
                                            className="h-11 bg-white border-slate-300 text-slate-900"
                                            value={passwordForm?.data[field.key! as keyof typeof passwordForm.data]}
                                            onChange={(e) =>
                                                passwordForm.setData(field.key as any, e.target.value)
                                            }
                                            placeholder={field.label}
                                        />

                                        {passwordForm.errors[field.key as keyof typeof passwordForm.errors] && (
                                            <p className="text-red-500 text-xs">
                                                {passwordForm.errors[field.key as keyof typeof passwordForm.errors]}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    disabled={passwordForm.processing}
                                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    {t('Update Password')}
                                </Button>

                            </form>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </UserLayout>
    )
}