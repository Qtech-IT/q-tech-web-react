import { useTranslations } from '@/Hooks/useTranslations'
import UserLayout from '@/Layouts/FrontendLayout'
import { Link } from '@inertiajs/react'
import { useMemo, useState } from 'react'

const C = {
    surface: "#ffffff",
    surfaceHover: "#f1f5f9",
    border: "#e2e8f0",
    text: "#0f172a",
    muted: "#64748b",
    green: "#16a34a",
    red: "#dc2626",
}


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


export default function Market({ cryptos = [], title }: any) {
    const [search, setSearch] = useState('')

    cryptos = cryptos?.data || [];

    const filtered = useMemo(() => {
        if (!search.trim()) return cryptos
        const q = search.toLowerCase()
        return cryptos.filter((c: any) =>
            c.symbol.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q)
        )
    }, [cryptos, search])

    const { t } = useTranslations()

    return (
        <UserLayout title={title}>

            {/* 🔍 Search */}
            <div className="mb-4">
                <div
                    className="relative rounded-xl px-3 py-2"
                    style={{
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                    }}
                >
                    <input
                        placeholder="Search coins..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm pl-2"
                        style={{ color: C.text }}
                    />
                </div>
            </div>



            {/* 📈 List */}

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

                    {filtered.length === 0 && (
                        <div className="p-10 text-center text-sm" style={{ color: C.muted }}>
                            {t('No results')}
                        </div>
                    )}


                    {filtered.map((c: any, i: number) => (
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

                            <div className=" font-semibold text-[13px] text-right whitespace-nowrap pr-3" style={{ color: C.text }}>
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



        </UserLayout>
    )
}

/* 🪙 Logo */
function CoinLogo({ symbol, logo }: any) {
    return logo ? (
        <img
            src={logo}
            alt={symbol}
            className="h-9 w-9 rounded-full object-cover shrink-0"
        />
    ) : (
        <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            }}
        >
            {symbol?.slice(0, 2)}
        </div>
    )
}

/* helpers */
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