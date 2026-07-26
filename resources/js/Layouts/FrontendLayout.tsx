import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/UI/DropdownMenu"
import { useTranslations } from "@/Hooks/useTranslations"
import { SubmitFunction } from "@/Types"
import { Language } from "@/Types/User/setting"
import { Head, Link, usePage } from "@inertiajs/react"
import { ChevronDown, Globe } from "lucide-react"
import { useState } from "react"

import { HotToaster } from "@/Components/UI/HotToast"
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { ToastProvider } from "@/Providers/ToastProvider"

export default function UserLayout({
    children,
    title = "App",
    back,
}: any) {

    const { url } = usePage()
    const props: any = usePage().props;

    const user = props.auth.user;
    let logo = props?.logos?.company_logo;

    const languageSettings = props?.language_settings;

    let { available_languages, current_language: dbLanguage } = languageSettings || {};
    const languages: Language[] = available_languages?.data || [];

    const { loading: isSubmitting, submit } = useInertiaForm()

    const [language, setLanguage] = useState<string | undefined>(dbLanguage)

    const handleLanguageChange = async (submit: SubmitFunction, lang: any, setLanguage: any) => {
        try {
            await submit({
                method: 'POST',
                url: route('switch.language'),
                data: { id: lang.id }
            })
            setLanguage(lang?.code)
        } catch (error) { }
    }

    const { t } = useTranslations();

    const navItems = [
        { href: route("frontend.home"), label: t("Home"), icon: HomeIcon },
        { href: route("market"), label: t("Market"), icon: MarketIcon },
        { href: route("user.trade.index"), label: t("Trade"), icon: TradeIcon },
        { href: route("user.trade.options"), label: t("Options"), icon: OptionsIcon },
        { href: route("user.profile.assets"), label: t("Assets"), icon: AssetsIcon },
    ]

    return (
        <ToastProvider>
            <Head title={title} />

            <div
                className="min-h-screen flex flex-col"
                style={{ background: "#f8fafc", color: "#0f172a" }}
            >
                {/* TOP HEADER */}
                <header
                    className="sticky top-0 z-50"
                    style={{
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                >
                    <div className="h-14 flex items-center justify-between px-4 md:px-6">

                        <div className="flex items-center gap-3">
                            {back && (
                                <Link
                                    href={back}
                                    className="p-1.5 rounded-lg"
                                    style={{ color: "#475569" }}
                                >
                                    <ChevronLeft />
                                </Link>
                            )}


                            {/* USER */}


                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 outline-none">
                                            <img src={logo} alt="Logo" className="h-6 object-contain" />
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="start" className="w-48 bg-white">

                                        <div className="px-3 py-2 border-b border-gray-200 flex items-center gap-3">
                                            {/* Avatar */}
                                            <img
                                                src={user.img_url}
                                                className="h-9 w-9 rounded-full object-cover border border-gray-200"
                                            />

                                            {/* User info */}
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[140px]">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <DropdownMenuItem asChild>
                                            <Link href={route("user.profile.index")}>
                                                {t("Profile")}
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() =>
                                                submit({
                                                    method: "POST",
                                                    url: route("user.logout"),
                                                })
                                            }
                                            className="text-red-500"
                                        >
                                            {t("Logout")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href={route("login")} className="flex items-center gap-2">
                                    <img src={logo} alt="Logo" className="h-6 object-contain" />
                                </Link>
                            )}


                        </div>

                        <div className="flex items-center gap-2">

                            {/* LANGUAGE */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="flex items-center gap-1.5 text-xs px-2.5 h-8 rounded-lg"
                                        style={{
                                            color: "#475569",
                                            background: "#f1f5f9",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <Globe className="h-3.5 w-3.5" />
                                        <span className="font-medium">{language?.toUpperCase()}</span>
                                        <ChevronDown className="h-3 w-3" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-36">
                                    {languages.map((lang) => (
                                        <DropdownMenuItem
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(submit, lang, setLanguage)}
                                        >
                                            {lang.code.toUpperCase()}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="flex-1 pb-24 px-4 md:px-6 py-4 bg-slate-50">
                    {children}
                </main>

                {/* BOTTOM NAV */}
                <nav
                    className="fixed bottom-0 left-0 right-0 z-50"
                    style={{
                        background: "rgba(255,255,255,0.98)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                    }}
                >
                    <div className="grid grid-cols-5 py-2 px-1 pb-3">
                        {navItems.map((item) => {
                            const active = url.startsWith(item.href)
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex flex-col items-center gap-1 py-1"
                                >
                                    <div
                                        className="w-10 h-9 rounded-xl flex items-center justify-center"
                                        style={
                                            active
                                                ? {
                                                    background: "rgba(99,102,241,0.12)",
                                                    boxShadow: "0 0 10px rgba(99,102,241,0.15)",
                                                }
                                                : {}
                                        }
                                    >
                                        <Icon active={active} className="h-[18px] w-[18px]" />
                                    </div>

                                    <span
                                        className="text-[11px] font-medium"
                                        style={{
                                            color: active ? "#6366f1" : "#64748b",
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            </div>

            <HotToaster />
        </ToastProvider>
    )
}



/* ICONS — LIGHT MODE ONLY */

function HomeIcon({ className, active }: { className?: string; active?: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "#818cf8" : "#64748b"}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className || "h-5 w-5"}
        >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}

function MarketIcon({ className, active }: { className?: string; active?: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "#818cf8" : "#64748b"}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className || "h-5 w-5"}
        >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    )
}

function TradeIcon({ className, active }: { className?: string; active?: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "#818cf8" : "#64748b"}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className || "h-5 w-5"}
        >
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
    )
}

function OptionsIcon({ className, active }: { className?: string; active?: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "#818cf8" : "#64748b"}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className || "h-5 w-5"}
        >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    )
}

function AssetsIcon({ className, active }: { className?: string; active?: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "#818cf8" : "#64748b"}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className || "h-5 w-5"}
        >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
    )
}

function ChevronLeft({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className || "h-5 w-5"}
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    )
}