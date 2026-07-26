import { Badge } from '@/Components/UI/Badge'
import { Separator } from '@/Components/UI/Separator'
import { useTranslations } from '@/Hooks/useTranslations'
import UserLayout from '@/Layouts/FrontendLayout'
import { keyToValue } from '@/Utils/helpers'
import { Link, router } from '@inertiajs/react'
import {
    ArrowLeftRight,
    CheckCircle,
    ChevronRight,
    FileText,
    LogOut,
    MessageSquare,
    Monitor,
    ShieldCheck,
    Wallet,
    XCircle
} from 'lucide-react'
import { useMemo } from 'react'

interface Props {
    user: any
    pages: any[]
    kycVerification: any
    hasPendingKyc: any
    isKycVerified: any
}

export default function Profile({
    user,
    pages,
    kycVerification,
    hasPendingKyc,
    isKycVerified,
    title
}: any) {

    user = user?.data || user
    const { t } = useTranslations()

    const handleLogout = () => {
        router.post(route('user.logout'))
    }

    const menuItems = useMemo(() => ({
        account: [
            ...(kycVerification ? [{
                href: (hasPendingKyc || isKycVerified)
                    ? route('user.kyc.logs')
                    : route('user.kyc.apply'),
                icon: <Monitor size={16} />,
                label: t('Identity Verification'),
                sub: t('KYC & account security'),
                badge: (
                    <Badge
                        className={
                            user.is_kyc_verified
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }
                    >
                        {user.is_kyc_verified ? t('Verified') : t('Pending')}
                    </Badge>
                )
            }] : []),

            {
                href: route('user.profile.show'),
                icon: <ShieldCheck size={16} />,
                label: t('Account Settings'),
                sub: t('Personal information')
            },
            {
                href: route('user.profile.withdraw.addresses'),
                icon: <Wallet size={16} />,
                label: t('Bind Withdrawal Address'),
                sub: t('Manage payout addresses')
            },
        ],

        finance: [
            {
                href: route('user.trade'),
                icon: <ArrowLeftRight size={16} />,
                label: t('Trade History'),
                sub: t('All trading activity')
            },
            {
                href: route('user.deposit.history'),
                icon: <ArrowLeftRight size={16} />,
                label: t('Deposit History'),
                sub: t('Funding records')
            },
            {
                href: route('user.withdraw.history'),
                icon: <ArrowLeftRight size={16} />,
                label: t('Withdraw History'),
                sub: t('Payout records')
            },
        ],

        support: [
            {
                href: route('user.support'),
                icon: <MessageSquare size={16} />,
                label: t('Support Center'),
                sub: t('Help & Support')
            }
        ],

        legal: pages?.map((page: any) => ({
            href: route('pages', page.slug),
            icon: <FileText size={16} />,
            label: page.translated_title,
        })) || []
    }), [user, pages])

    const renderItem = (item: any) => (
        <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
        >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                {item.icon}
            </div>

            <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                    {item.label}
                </div>
                {item.sub && (
                    <div className="text-xs text-gray-500">
                        {item.sub}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                {item.badge}
                <ChevronRight size={16} className="text-gray-400" />
            </div>
        </Link>
    )



    return (
        <UserLayout title={title}>

            <div className="bg-gray-50 min-h-screen">

                {/* ── PROFILE HEADER (BINANCE STYLE) ── */}
                <div className="bg-white border-b border-gray-200 px-5 py-6 text-center">

                    <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-blue-600 flex items-center justify-center">
                        <img
                            src={user.img_url}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h1 className="mt-3 text-lg font-semibold text-gray-900">
                        {user.name}
                    </h1>

                    <p className="text-sm text-gray-500">
                        {user.email}
                    </p>

                    <div className="flex justify-center items-center gap-2 mt-2">
                        {user.email_verified_at ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs text-gray-500">
                            {user.email_verified_at ? 'Verified' : 'Unverified'}
                        </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                        {t('UID')}: {user.id}
                    </p>
                </div>

                {/* ── QUICK STATS (BINANCE STYLE CARDS) ── */}
                <div className="grid grid-cols-2 gap-3 px-5 py-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-500">
                            {t('Account Status')}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                            {keyToValue(user.status)}
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-500">
                            {t('KYC Verification ')}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                            {user.is_kyc_verified ? 'Verified' : 'Unverified'}
                        </p>
                    </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* ── MENU SECTIONS ── */}
                <div className="pb-20 space-y-2">

                    <div className="px-5 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t('Account')}
                    </div>
                    <div className="bg-white mx-4 rounded-xl border border-gray-200">
                        {menuItems.account.map(renderItem)}
                    </div>

                    <div className="px-5 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t('Finance')}
                    </div>
                    <div className="bg-white mx-4 rounded-xl border border-gray-200">
                        {menuItems.finance.map(renderItem)}
                    </div>

                    <div className="px-5 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t('Support')}
                    </div>
                    <div className="bg-white mx-4 rounded-xl border border-gray-200">
                        {menuItems.support.map(renderItem)}
                    </div>

                    {menuItems.legal.length > 0 && (
                        <>
                            <div className="px-5 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {t('Legal')}
                            </div>
                            <div className="bg-white mx-4 rounded-xl border border-gray-200">
                                {menuItems.legal.map(renderItem)}
                            </div>
                        </>
                    )}

                    {/* ── LOGOUT ── */}
                    <div className="mx-4 mt-4 bg-white border border-gray-200 rounded-xl">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition"
                        >
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-100 text-red-600">
                                <LogOut size={16} />
                            </div>

                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-red-600">
                                    {t('Logout')}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {t('Sign out from account')}
                                </div>
                            </div>

                            <ChevronRight size={16} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="h-20" />
                </div>
            </div>
        </UserLayout>
    )
}