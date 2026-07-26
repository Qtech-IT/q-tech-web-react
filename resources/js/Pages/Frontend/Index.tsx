import { useTranslations } from "@/Hooks/useTranslations"
import UserLayout from "@/Layouts/FrontendLayout"
import { Link, usePage } from "@inertiajs/react"
import {
    ArrowDownToLine,
    ArrowLeftRight,
    Banknote,
    Headset,
    RefreshCw,
    Zap
} from "lucide-react"
import { useEffect, useState } from "react"

/* ─── Design tokens ──────────────────────────────────────────── */
const C = {
    base: "#f8fafc",
    surface: "#ffffff",
    surfaceHover: "#f1f5f9",
    border: "rgba(15,23,42,0.08)",
    borderAccent: "rgba(99,102,241,0.25)",
    text: "#0f172a",
    muted: "#64748b",
    green: "#16a34a",
    red: "#dc2626",
    indigo: "#6366f1",
    indigoDim: "rgba(99,102,241,0.12)",
}



function FAQItem({ item }: any) {
    const [open, setOpen] = useState(false)

    return (
        <div
            style={{
                borderBottom: "1px solid rgba(15,23,42,0.07)",
            }}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-4 py-3 text-left"
            >
                <span
                    className="text-[15px] font-medium"
                    style={{ color: C.text }}
                >
                    {item.t_question}
                </span>

                <span
                    className="text-xs transition-transform duration-200"
                    style={{
                        color: C.muted,
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                >
                    ▼
                </span>
            </button>

            <div
                className="px-4 overflow-hidden transition-all duration-300"
                style={{
                    maxHeight: open ? "120px" : "0px",
                }}
            >
                <p
                    className="text-[12px] pb-3"
                    style={{ color: C.muted }}
                >
                    {item.t_answer}
                </p>
            </div>
        </div>
    )
}

/* ─── Coin colours for fallback logos ───────────────────────── */
const COIN_GRADS: Record<string, string> = {
    BTC: "linear-gradient(135deg,#f59e0b,#f97316)",
    ETH: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    SOL: "linear-gradient(135deg,#9945ff,#14f195)",
    USDT: "linear-gradient(135deg,#10b981,#059669)",
    BNB: "linear-gradient(135deg,#f3ba2f,#e8a000)",
    XRP: "linear-gradient(135deg,#346aa9,#00aae4)",
    ADA: "linear-gradient(135deg,#0033ad,#3cc8c8)",
    DOGE: "linear-gradient(135deg,#c2a633,#e6d08a)",
    default: "linear-gradient(135deg,#6366f1,#8b5cf6)",
}

function coinGrad(sym: string) {
    return COIN_GRADS[sym?.toUpperCase()] || COIN_GRADS.default
}

export default function Dashboard({
    cryptos = [],
    banners = [],
    faqs = [],
    totalUsd = 0,
    title,

    quickActions = [],

}: any) {

    const props: any = usePage().props;
    const user = props.auth.user;


    const { t } = useTranslations();


    const actionConfig = [
        { label: t("Recharge"), key: "recharge", href: route('user.deposit'), icon: Banknote, bg: "#e0f7fa", stroke: "#00bcd4" },
        { label: t("Withdraw"), key: "withdraw", href: route('user.withdrawal'), icon: ArrowDownToLine, bg: "#e0f7fa", stroke: "#00bcd4" },
        { label: t("Customer service"), key: "customer_service", href: route('user.support'), icon: Headset, bg: "#e0f7fa", stroke: "#00bcd4" },
        { label: t("Flash swap"), key: "flash_swap", href: route('user.flash.swap'), icon: RefreshCw, bg: "#e0f7fa", stroke: "#00bcd4" },
        { label: t("Boost loan"), key: "boost_loan", href: route('user.loan'), icon: Zap, bg: "#e0f7fa", stroke: "#00bcd4" },
        { label: t("Transfer"), key: "transfer", href: route('user.transfer'), icon: ArrowLeftRight, bg: "#e0f7fa", stroke: "#00bcd4" },
    ]



    faqs = faqs?.data || faqs || []

    const [bannerIdx, setBannerIdx] = useState(0)

    const rawList = cryptos?.data || cryptos || []
    banners = banners?.data || banners || []

    /* Auto banner */
    useEffect(() => {
        if (banners.length < 2) return
        const t = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 4200)
        return () => clearInterval(t)
    }, [banners.length])

    return (
        <UserLayout
            title={title}
        >

            {/* ── BANNER ─────────────────────────────────────────── */}
            {banners.length > 0 ? (
                <div
                    className="relative h-36 overflow-hidden rounded-2xl mb-5"
                    style={{ border: "1px solid rgba(99,102,241,0.2)" }}
                >
                    {banners.map((b: any, i: number) => (
                        <div
                            key={b.id}
                            className="absolute inset-0 flex items-end p-4 transition-opacity duration-700"
                            style={{
                                opacity: i === bannerIdx ? 1 : 0,
                                backgroundImage: b.image
                                    ? `url(${b.image})`
                                    : "linear-gradient(135deg,#eef2ff 0%,#e0e7ff 50%,#eef2ff 100%)",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0.05) 60%,transparent 100%)" }} />
                            <div className="relative z-10">
                                <p className="text-white font-semibold text-sm line-clamp-1">{b.title}</p>
                                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "rgba(255,255,255,0.75)" }}>{b.content}</p>
                            </div>
                        </div>
                    ))}
                    <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
                        {banners.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setBannerIdx(i)}
                                className="rounded-full transition-all duration-300"
                                style={{
                                    width: i === bannerIdx ? "16px" : "6px",
                                    height: "6px",
                                    background: i === bannerIdx ? C.indigo : "rgba(15,23,42,0.2)",
                                }}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                /* Fallback hero when no banners */
                <div
                    className="rounded-2xl mb-5 p-5 relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg,#eef2ff 0%,#e0e7ff 50%,#eff6ff 100%)",
                        border: "1px solid rgba(99,102,241,0.15)",
                        minHeight: "120px",
                    }}
                >
                    {/* Decorative glow orbs */}
                    <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(99,102,241,0.1)", filter: "blur(40px)" }} />
                    <div style={{ position: "absolute", bottom: "-30px", left: "30px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(139,92,246,0.08)", filter: "blur(30px)" }} />
                    <p className="font-semibold text-base relative z-10" style={{ color: C.text }}>Welcome back 👋</p>
                    <p className="text-sm mt-1 relative z-10" style={{ color: C.muted }}>
                        {t('Your crypto portfolio at a glance')}
                    </p>
                </div>
            )}


            {/* ── ACTIONS ───────────────────────────────────────── */}


            {/* ── FEATURED COINS MARQUEE ────────────────────────── */}
            <div className="mb-6">
                <h2 className="text-[15px] font-semibold mb-3 uppercase tracking-wider" style={{ color: C.muted }}>
                    {t('Featured Coins')}
                </h2>
                <div className="overflow-hidden">
                    <div
                        className="flex gap-3"
                        style={{
                            animation: "marquee 70s linear infinite",
                            width: "max-content",
                        }}
                    >
                        {[...rawList, ...rawList].slice(0, 20).map((c: any, i: number) => (
                            <Link key={`${c.id}-${i}`} href={route('user.trade.show', { crypto: c.symbol })}>
                                <div
                                    className="flex-shrink-0 w-[190px] p-3.5 rounded-2xl transition-all duration-200"
                                    style={{
                                        background: C.surface,
                                        border: `1px solid ${C.border}`,
                                        boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
                                    }}
                                >
                                    <div className="flex items-center gap-2.5 mb-3">
                                        {c.images?.small ? (
                                            <img src={c.images.small} className="h-9 w-9 rounded-full" alt={c.symbol} />
                                        ) : (
                                            <div
                                                className="h-9 w-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                                                style={{ background: coinGrad(c.symbol) }}
                                            >
                                                {c.symbol?.slice(0, 2)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-sm" style={{ color: C.text }}>{c.symbol}</p>
                                            <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>{c.name}</p>
                                        </div>
                                    </div>
                                    <p className="text-[14px] font-bold  no-slash-zero" style={{ color: C.text }}>
                                        {(c.format_usd_price)}
                                    </p>
                                    <div className="flex justify-between mt-2 items-center">
                                        <span
                                            className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md"
                                            style={{
                                                color: c.price_change_24h >= 0 ? C.green : C.red,
                                                background: c.price_change_24h >= 0 ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                                            }}
                                        >
                                            {c.price_change_24h >= 0 ? "+" : ""}{Number(c.price_change_24h).toFixed(2)}%
                                        </span>
                                        <span className="text-[10px]" style={{ color: C.muted }}>{formatVol(c.volume_24h_usd)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-2 gap-2 mb-6">
                {actionConfig.map((a) => {
                    const Icon = a.icon

                    if (!quickActions.includes(a.key)) return

                    return (
                        <Link key={a.label} href={a.href}>
                            <div
                                className="flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-150 active:scale-[0.97]"
                                style={{
                                    background: C.surface,
                                    border: `1px solid ${C.border}`,
                                    boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = C.surface)}
                            >
                                <div
                                    className="h-[42px] w-[42px] rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: a.bg }}
                                >
                                    <Icon
                                        className="h-[22px] w-[22px]"
                                        style={{ color: a.stroke }}
                                        strokeWidth={1.8}
                                    />
                                </div>
                                <span className="text-[14px] font-medium" style={{ color: C.text }}>
                                    {a.label}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* ── MARKETS ───────────────────────────────────────── */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-[15px] font-semibold uppercase tracking-wider" style={{ color: C.muted }}>
                        {t('Markets')}
                    </h2>
                    <Link href={route('market')} className="text-xs font-medium" style={{ color: C.indigo }}>
                        {t('View All')}
                    </Link>
                </div>

                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                        boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
                    }}
                >
                    {/* Table header */}
                    <div
                        className="grid items-center px-4 py-2.5"
                        style={{
                            gridTemplateColumns: "22px 1fr auto 64px",
                            background: "rgba(99,102,241,0.04)",
                            borderBottom: `1px solid ${C.border}`,
                        }}
                    >
                        <span className="text-[10px] font-medium uppercase" style={{ color: C.muted }}>#</span>
                        <span className="text-[10px] font-medium uppercase" style={{ color: C.muted }}>
                            {t('Coin')}
                        </span>
                        <span className="text-[10px] font-medium uppercase text-right pr-3" style={{ color: C.muted }}>
                            {t("Price")}
                        </span>
                        <span className="text-[10px] font-medium uppercase text-right" style={{ color: C.muted }}>
                            {t('24h')}
                        </span>
                    </div>

                    {/* Rows */}
                    <div>
                        {rawList.slice(0, 8).map((c: any, i: number) => (
                            <Link
                                key={c.id}
                                href={route('user.trade.show', { crypto: c.symbol })}
                                className="grid items-center px-4 py-3 transition-all duration-150"
                                style={{
                                    gridTemplateColumns: "22px 1fr auto 64px",
                                    borderBottom: i < 7 ? `1px solid ${C.border}` : "none",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <div className="text-[11px]" style={{ color: C.muted }}>{i + 1}</div>

                                <div className="flex items-center gap-2.5 min-w-0">
                                    {c.images?.small ? (
                                        <img src={c.images.small} className="h-8 w-8 rounded-full shrink-0" alt={c.symbol} />
                                    ) : (
                                        <div
                                            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                                            style={{ background: coinGrad(c.symbol) }}
                                        >
                                            {c.symbol?.slice(0, 2)}
                                        </div>
                                    )}
                                    <div className="min-w-0 overflow-hidden">
                                        <p className="font-semibold text-[14px] truncate leading-none" style={{ color: C.text }}>
                                            {c.symbol}
                                        </p>
                                        <p className="text-[10px] truncate mt-0.5" style={{ color: C.muted }}>
                                            {c.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="no-slash-zero  font-semibold text-[14px] text-right whitespace-nowrap pr-3" style={{ color: C.text }}>
                                    {(c.format_usd_price)}
                                </div>

                                <div
                                    className="text-right text-[12px] font-semibold whitespace-nowrap px-2 py-1 rounded-lg"
                                    style={{
                                        color: c.price_change_24h >= 0 ? C.green : C.red,
                                        background: c.price_change_24h >= 0 ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                                    }}
                                >
                                    {c.price_change_24h >= 0 ? "+" : ""}{Number(c.price_change_24h).toFixed(2)}%
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FAQ ───────────────────────────────────────── */}
            {faqs.length > 0 && (
                <div className="mt-7">
                    <h2
                        className="text-[15px] font-semibold uppercase tracking-wider mb-3"
                        style={{ color: C.muted }}
                    >
                        {t("FAQ")}
                    </h2>

                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: C.surface,
                            border: `1px solid ${C.border}`,
                            boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
                        }}
                    >
                        {faqs.map((item: any, i: any) => (
                            <FAQItem key={i} item={item} />
                        ))}
                    </div>
                </div>
            )}

        </UserLayout>
    )
}

/* ─── Helpers ────────────────────────────────────────────────── */
function formatPrice(p: any) {
    if (!p) return "—"
    const n = Number(p)
    if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
    if (n >= 1) return n.toFixed(4)
    return n.toFixed(6)
}

function formatVol(v: any) {
    if (!v) return "—"
    if (v >= 1e9) return (v / 1e9).toFixed(1) + "B"
    if (v >= 1e6) return (v / 1e6).toFixed(1) + "M"
    return (v / 1e3).toFixed(1) + "K"
}