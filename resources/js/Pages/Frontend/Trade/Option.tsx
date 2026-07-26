import { useTranslations } from '@/Hooks/useTranslations'
import UserLayout from '@/Layouts/FrontendLayout'
import { keyToValue } from '@/Utils/helpers'
import { Link, router } from '@inertiajs/react'
import axios from 'axios'
import { AlignJustify, Check, ChevronDown, ChevronRight, ClipboardList, LineChart, TrendingDown, TrendingUp, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(p: any): string {
    if (!p && p !== 0) return '—'
    const n = Number(p)
    if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (n >= 1) return n.toFixed(4)
    return n.toFixed(2)
}
function cn(...args: any[]) { return args.filter(Boolean).join(' ') }

// ── Bottom Sheet ──────────────────────────────────────────────────────────────
function BottomSheet({ open, onClose, children }: any) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-[500] flex items-end" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50" style={{ backdropFilter: 'blur(2px)' }} />
            <div
                className="relative w-full bg-white rounded-t-2xl shadow-2xl z-10 overflow-hidden"
                style={{
                    animation: 'sheetUp .25s cubic-bezier(.32,.72,0,1)',
                    maxHeight: '92vh',
                    border: '1px solid #e2e8f0',
                    borderBottom: 'none',
                }}
                onClick={(e: any) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

// ── Left Drawer ───────────────────────────────────────────────────────────────
function LeftDrawer({ open, onClose, children }: any) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-[500] flex" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40" style={{ backdropFilter: 'blur(2px)' }} />
            <div
                className="relative w-72 bg-white shadow-2xl z-10 flex flex-col overflow-hidden"
                style={{ animation: 'sheetLeft .22s cubic-bezier(.32,.72,0,1)', borderRight: '1px solid #e2e8f0' }}
                onClick={(e: any) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ children, variant = 'default' }: any) {
    const map: Record<string, string> = {
        default: 'bg-slate-100 text-slate-600 border-slate-200',
        green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        red: 'bg-red-50 text-red-500 border-red-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
    }
    return (
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', map[variant])}>
            {children}
        </span>
    )
}

// ── Countdown Ring (small, for trade modal) ───────────────────────────────────
function CountdownRingSmall({ remaining, total }: any) {
    const r = 32, circ = 2 * Math.PI * r
    const pct = Math.max(0, remaining / total)
    // color based on remaining: green → amber → red
    const color = pct > 0.6 ? '#ef4444' : pct > 0.3 ? '#f59e0b' : '#ef4444'
    return (
        <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
            <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
                    strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray .8s ease, stroke .4s ease' }} />
            </svg>
            <div className="absolute flex items-center justify-center">
                <span className="text-lg font-bold text-slate-900  leading-none">{remaining}</span>
                <span className="text-[15px] text-slate-400 leading-none ml-0.5">s</span>
            </div>
        </div>
    )
}
// ── Trade Detail Modal (image 3 style) ────────────────────────────────────────
function TradeDetailModal({ trade, defaultCurrency, onClose }: any) {
    const { t } = useTranslations()
    if (!trade) return null
    const pl = parseFloat(trade.profit_loss ?? 0)
    const isWin = trade?.result === 'win'



    const rows = [
        { label: t('Profit/Loss'), value: trade?.profit_loss, color: isWin ? 'text-emerald-600' : 'text-red-500' },
        { label: t('Opening quantity'), value: trade.amount, color: 'text-slate-900' },
        { label: t('Purchase price'), value: Number(trade.open_price).toFixed(4), color: 'text-slate-900' },
        { label: t('Filled price'), value: Number(trade.close_price).toFixed(4), color: 'text-slate-900' },
        { label: t('Opening time'), value: trade.opened_at, color: 'text-slate-900' },
        { label: t('Settlement Time'), value: trade.closes_at ?? '—', color: 'text-slate-900' },
    ]

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}>
            <div
                className="w-full bg-white flex flex-col overflow-hidden"
                style={{
                    maxWidth: 520,
                    borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.20)',
                    animation: 'popIn .28s cubic-bezier(.34,1.56,.64,1) both',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[15px] text-slate-900 tracking-tight">
                            {trade.crypto_symbol ?? 'BTC'}/{defaultCurrency}
                        </span>
                        <span className={cn('text-sm font-semibold', trade.direction === 'long' ? 'text-emerald-600' : 'text-red-500')}>
                            {trade.direction === 'long' ? t('Buy up') : t('Sell short')}
                        </span>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                {/* Rows */}
                <div className="flex-1 divide-y divide-slate-100">
                    {rows.map(({ label, value, color }) => (
                        <div key={label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-1">
                            <span className="text-sm text-slate-500">{label}</span>
                            <span
                                className={cn(
                                    'text-sm font-semibold  break-all sm:break-normal text-right sm:text-left',
                                    color
                                )}
                            >
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Confirm button */}
                <div className="px-5 py-4 border-t border-slate-100">
                    <button onClick={onClose}
                        className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all active:scale-[.98]">
                        {t('Confirm')}
                    </button>
                </div>
            </div>
        </div>
    )
}


// ── NEW: Trade Progress Modal (images 1 & 2 style) ────────────────────────────
function TradeModal({ activeTrade, result, yieldPct, defaultCurrency, cryptoSymbol, onClose, onPlaceAnother }: any) {
    const { t } = useTranslations()

    // phases: 'progress' | 'settling' | 'settled'
    const phase = result?.is_settled ? 'settled' : activeTrade ? 'progress' : 'settling'

    const isWin = result && (result.won || Number(result.profit_loss) > 0)
    const pl = result ? Number(result.profit_loss) : 0


    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(4px)' }}>
            <div
                className="w-full bg-white flex flex-col"
                style={{
                    maxWidth: 480,
                    minHeight: 320,
                    borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                    animation: 'popIn .3s cubic-bezier(.34,1.56,.64,1) both',
                    margin: '0 16px',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <span className="font-bold text-[15px] text-slate-900 tracking-tight">
                        {cryptoSymbol}/{defaultCurrency}
                    </span>
                    {phase === 'settled' && (
                        <button onClick={onClose}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col px-5 py-5 gap-4">

                    {/* ── IN PROGRESS ── */}
                    {(phase === 'progress') && (
                        <>
                            {
                                phase === 'progress' ?

                                    <div className="flex justify-center py-2">
                                        <CountdownRingSmall remaining={activeTrade.remaining} total={activeTrade.total} />
                                    </div>
                                    :
                                    <div className="flex justify-center items-center py-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="text-sm text-slate-400 font-medium">{t('Settling')}...</p>
                                        </div>
                                    </div>
                            }


                            <div className="rounded-xl border border-teal-300 bg-white px-4 py-4 space-y-2.5">
                                <div className="text-sm text-slate-700">
                                    <span className="text-slate-500">{t('Current price')} : </span>
                                    <span className="font-semibold ">{fmt(activeTrade.openPrice ?? '—')}</span>
                                </div>
                                <div className="text-sm text-slate-700">
                                    <span className="text-slate-500">{t('Cycle')} : </span>
                                    <span className="font-semibold">{activeTrade.total}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-slate-500">{t('Type')} : </span>
                                    <span className={cn('font-semibold', activeTrade.direction === 'long' ? 'text-teal-500' : 'text-red-500')}>
                                        {activeTrade.direction === 'long' ? t('Buy up') : t('Sell short')}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-700">
                                    <span className="text-slate-500">{t('Amount')} : </span>
                                    <span className="font-semibold">{Number(activeTrade.amount).toLocaleString()}</span>
                                </div>
                                <div className="text-sm text-slate-700">
                                    <span className="text-slate-500">{t('Position establishment')} : </span>
                                    <span className="font-semibold ">{activeTrade.openedAt ?? '—'}</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── SETTLING ── */}
                    {phase === 'settling' && (
                        <>
                            <div className="flex justify-center items-center py-4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                                    <p className="text-sm text-slate-400 font-medium">{t('Settling')}...</p>
                                </div>
                            </div>
                            <div className="rounded-xl border border-teal-300 bg-white px-4 py-4 space-y-2.5">
                                <div className="text-sm text-slate-400 text-center">{t('Calculating your result...')}</div>
                            </div>
                        </>
                    )}

                    {/* ── SETTLED ── */}
                    {phase === 'settled' && result && (
                        <>
                            {/* Settled banner */}
                            <div className="rounded-xl border border-teal-300 bg-white px-4 py-5 flex items-center justify-center">
                                <span className="text-base font-semibold text-slate-700 mr-2">{t('Settled')}</span>
                                <span className={cn('text-base font-bold ', isWin ? 'text-teal-500' : 'text-red-500')}>
                                    {isWin ? '+' : ''}{pl.toFixed(2)}
                                </span>
                            </div>

                            {/* Trade details */}
                            <div className="rounded-xl border border-teal-300 bg-white px-4 py-4 space-y-2.5">
                                <div className="text-sm text-slate-700">
                                    <span className="text-slate-500">{t('Current price')} : </span>
                                    <span className="font-semibold ">{fmt(result.closePrice ?? result.close_price ?? '—')}</span>
                                </div>
                                <div className="text-sm text-slate-700">
                                    <span className="text-slate-500">{t('Cycle')} : </span>
                                    <span className="font-semibold">{result.duration ?? activeTrade?.total ?? '—'}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-slate-500">{t('Type')} : </span>
                                    <span className={cn('font-semibold', (result.direction ?? activeTrade?.direction) === 'long' ? 'text-teal-500' : 'text-red-500')}>
                                        {(result.direction ?? activeTrade?.direction) === 'long' ? t('Buy up') : t('Sell short')}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-700">
                                    <span className="text-slate-500">{t('Amount')} : </span>
                                    <span className="font-semibold">{Number(result.amount ?? activeTrade?.amount ?? 0).toLocaleString()}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-slate-500">{t('Profit')} : </span>
                                    <span className={cn('font-bold ', isWin ? 'text-teal-500' : 'text-red-500')}>
                                        {isWin ? '+' : ''}{pl.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer button */}
                <div className="px-5 pb-5">
                    <button
                        onClick={phase === 'settled' ? onPlaceAnother : undefined}
                        disabled={phase !== 'settled'}
                        className={cn(
                            'w-full py-3.5 rounded-xl font-semibold text-sm transition-all',
                            phase === 'settled'
                                ? 'bg-blue-500 hover:bg-blue-600 text-white active:scale-[.98] cursor-pointer'
                                : 'bg-blue-400 text-white cursor-not-allowed opacity-80'
                        )}
                    >
                        {t('Place another order')}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Order Panel ───────────────────────────────────────────────────────────────
function OrderPanel({
    defaultCurrency, presets, selectedPreset, setPreset, amount, setAmount,
    userBalance, settings, selectedDuration, setDuration,
    currentSetting, yieldPct, error, activeTrade,
    onBuyLong, onSellShort,
}: any) {
    const { t } = useTranslations()
    return (
        <div className="space-y-5">
            <div>
                <p className="text-[15px] font-medium text-slate-600 mb-2">{t('Transaction Mode')}</p>
                <div className="inline-flex items-center gap-2 rounded-lg border border-blue-400 px-3 py-2 bg-white">
                    <span className="text-sm font-medium text-slate-900">{defaultCurrency ?? 'USDT'}</span>
                    <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                </div>
            </div>
            <div>
                <p className="text-[15px] font-medium text-slate-600 mb-2">{t('Opening quantity')}</p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                    {presets.map((p: any) => {
                        const isSel = selectedPreset === p
                        return (
                            <button key={p}
                                onClick={(e) => { e.stopPropagation(); setPreset(p); setAmount(String(p)) }}
                                className={cn('relative py-2.5 text-sm rounded-xl border font-medium transition-all text-center overflow-hidden',
                                    isSel ? 'border-blue-400 text-blue-600 bg-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300')}>
                                {Number(p).toFixed(2)}
                                {isSel && (
                                    <span className="absolute bottom-0 right-0">
                                        <div className="w-5 h-5 flex items-center justify-center"
                                            style={{ background: '#3b82f6', borderRadius: '0 0 10px 0', borderTopLeftRadius: 5 }}>
                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                        </div>
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
                <div className="flex items-center border-b border-slate-200 pb-1.5 focus-within:border-blue-400 transition-colors">
                    <input value={amount}
                        onChange={(e: any) => { setAmount(e.target.value); setPreset(null) }}
                        placeholder="Please enter the opening quantity"
                        className="flex-1 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none py-1"
                        onClick={(e) => e.stopPropagation()} />
                    <button onClick={(e) => { e.stopPropagation(); setAmount(String(userBalance)); setPreset(null) }}
                        className="text-sm font-medium text-blue-500 hover:text-blue-600 pl-3 shrink-0 transition-colors">
                        {t('All')}
                    </button>
                </div>
                {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
            </div>
            <div>
                <p className="text-[15px] font-medium text-slate-600 mb-2">{t('Opening time')}</p>
                <div className="flex flex-wrap gap-2">
                    {settings.map((s: any) => {
                        const isSel = selectedDuration === s.duration_seconds
                        const initialAmount = currentSetting.amount_presets[0] ?? 100
                        return (
                            <button key={s.duration_seconds}
                                onClick={(e) => { e.stopPropagation(); setDuration(s.duration_seconds); setAmount(initialAmount); setPreset(initialAmount) }}
                                className={cn('relative px-4 py-2 text-sm rounded-xl border font-medium transition-all overflow-hidden',
                                    isSel ? 'border-blue-400 text-blue-600 bg-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300')}>
                                {s.label ?? `${s.duration_seconds}s`}
                                {isSel && (
                                    <span className="absolute bottom-0 right-0">
                                        <div className="w-5 h-5 flex items-center justify-center"
                                            style={{ background: '#3b82f6', borderRadius: '0 0 10px 0', borderTopLeftRadius: 5 }}>
                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                        </div>
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                    <p className="text-sm text-emerald-600 font-medium">{t('Account balance')} : {Number(userBalance).toFixed(2)}</p>
                    {currentSetting?.min_trade_amount != null && (
                        <p className="text-sm text-emerald-600">
                            {t('Opening quantity')} : {Number(currentSetting.min_trade_amount).toLocaleString()} - {Number(currentSetting.max_trade_amount).toLocaleString()}
                        </p>
                    )}
                </div>
                <p className="text-sm text-emerald-600 font-medium whitespace-nowrap shrink-0">{t('Estimated Yield')} : {yieldPct}%</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50 }}>
                <button type="button"
                    onClick={(e) => { e.stopPropagation(); onBuyLong() }}
                    disabled={!!activeTrade}
                    className={cn('py-2.5 rounded-lg font-semibold text-sm transition-all',
                        activeTrade ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-[.98]')}>
                    {t('Buy Long')}
                </button>
                <button type="button"
                    onClick={(e) => { e.stopPropagation(); onSellShort() }}
                    disabled={!!activeTrade}
                    className={cn('py-2.5 rounded-lg font-semibold text-sm transition-all',
                        activeTrade ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white active:scale-[.98]')}>
                    {t('Sell Short')}
                </button>
            </div>
        </div>
    )
}


// ── TradingView ───────────────────────────────────────────────────────────────
function TradingViewWidget({ symbol }: any) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!ref.current) return
        ref.current.innerHTML = ''
        const s = document.createElement('script')
        s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
        s.async = true
        s.innerHTML = JSON.stringify({
            symbol: `BINANCE:${symbol}`,
            interval: 'D',
            theme: 'light',
            autosize: true,
            hide_top_toolbar: false,
            hide_legend: false,
            hide_side_toolbar: false,
            allow_symbol_change: false,
            save_image: false,
            backgroundColor: '#ffffff',
            gridLineColor: 'rgba(0,0,0,0.04)',
            enable_publishing: false,
            withdateranges: true,
            details: false,
            hotlist: false,
            calendar: false,
        })
        ref.current.appendChild(s)
    }, [symbol])
    return <div ref={ref} className="w-full h-full" style={{ minHeight: 0 }} />
}


// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function TradeShow({
    crypto: cryptoProp,
    cryptos: cryptosProp,
    settings: settingsProp = [],
    balance: balanceProp = 0,
    price: initialPrice = 0,
    defaultCurrency,
    orders: ordersProp,
}: any) {
    const crypto: any = cryptoProp?.data ?? cryptoProp ?? {}
    let high_24h = crypto?.meta_data?.high_24h
    let low_24h = crypto?.meta_data?.low_24h
    let price_change_24h = crypto?.meta_data?.total_volume

    const cryptos: any[] = cryptosProp?.data ?? cryptosProp ?? []
    const settings: any[] = settingsProp?.data ?? settingsProp ?? []
    const userBalance = Number(balanceProp) || 0
    const { t } = useTranslations()

    const [price] = useState(Number(initialPrice) || Number(crypto.usd_price) || 0)
    const [selectedDuration, setDuration] = useState(settings[0]?.duration_seconds ?? 20)
    const [amount, setAmount] = useState('')
    const [selectedPreset, setPreset] = useState<any>(null)
    const [error, setError] = useState('')
    const [activeTrade, setActiveTrade] = useState<any>(undefined)
    const [result, setResult] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('trade')
    const [confirming, setConfirming] = useState<any>(null)
    const [showTradeModal, setShowTradeModal] = useState(false)
    const [selectedWin, setSelectedWin] = useState<any>(null)
    const [showCoinDrawer, setShowCoinDrawer] = useState(false)
    const [showOrderSheet, setShowOrderSheet] = useState(false)
    const [selectedTrade, setSelectedTrade] = useState<any>(null)

    // ── NEW: controls whether right panel shows chart or positions ──
    const [showPositions, setShowPositions] = useState(false)

    const countdownRef = useRef<any>(null)

    const currentSetting: any = settings.find(s => s.duration_seconds === selectedDuration) ?? settings[0] ?? {}
    const minAmount = Number(currentSetting?.min_trade_amount ?? 0)
    const maxAmount = Number(currentSetting?.max_trade_amount ?? Infinity)
    const presets: any[] = currentSetting?.amount_presets ?? [10, 1000, 10000, 1000000]
    let yieldPct = Number(currentSetting?.display_yield_pct ?? 0)
    yieldPct = yieldPct % 1 === 0 ? yieldPct : Number(yieldPct.toFixed(2))

    useEffect(() => {
        if (presets.length > 0 && !amount) {
            setAmount(String(presets[0]))
            setPreset(presets[0])
        }
    }, [presets])

    const winOptions = [
        { key: 'a', value: Number(currentSetting?.win_pct_option_a ?? 0) },
        { key: 'b', value: Number(currentSetting?.win_pct_option_b ?? 0) },
        { key: 'c', value: Number(currentSetting?.win_pct_option_c ?? 0) },
    ].filter(o => o.value > 0)
    const pickRandomWin = () => winOptions.length ? winOptions[Math.floor(Math.random() * winOptions.length)] : null

    const priceChange = Number(crypto.price_change_24h ?? 0)
    const priceUp = priceChange >= 0
    const binanceSymbol = crypto.binance_symbol ?? (crypto.symbol + defaultCurrency)

    const displayAmount = amount
        ? Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : (presets[0] ? Number(presets[0]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '10.00')

    useEffect(() => {
        if (!activeTrade) return
        countdownRef.current = setInterval(() => {
            setActiveTrade((prev: any) => {
                if (!prev) return null
                const next = prev.remaining - 1
                if (next <= 0) {
                    clearInterval(countdownRef.current)
                    axios.post(route('user.trade.settle'), { trade_id: prev.trade_id })
                        .then((res: any) => {
                            const tr = res.data.trade
                            setResult({
                                is_settled: true,
                                won: tr.result === 'win',
                                profit_loss: tr.profit_loss,
                                closePrice: tr.close_price,
                                direction: tr.direction ?? prev.direction,
                                amount: tr.amount ?? prev.amount,
                                duration: tr.duration_seconds ?? prev.total,
                            })
                        })
                        .catch(() => setResult({ is_settled: true, won: false, profit_loss: '0' }))
                    return null
                }
                return { ...prev, remaining: next }
            })
        }, 1000)
        return () => clearInterval(countdownRef.current)
    }, [activeTrade?.trade_id])

    useEffect(() => { if (activeTrade?.trade_id) setShowTradeModal(true) }, [activeTrade?.trade_id])

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    const handleModalClose = () => { setShowTradeModal(false); setResult(null); router.reload() }
    const handlePlaceAnother = () => { setShowTradeModal(false); setResult(null); router.reload() }


    const handleTrade = (dir: string) => {
        if (userBalance < Number(amount)) { toast.error('Insufficient balance', { position: 'bottom-center' }); setError('Insufficient balance'); return }
        if (!amount || Number(amount) <= 0) { toast.error('Enter a valid amount', { position: 'bottom-center' }); setError('Enter a valid amount'); return }
        if (Number(amount) < minAmount) { toast.error(`Min: ${minAmount} ${defaultCurrency}`, { position: 'bottom-center' }); setError(`Min: ${minAmount} ${defaultCurrency}`); return }
        if (Number(amount) > maxAmount) { toast.error(`Max: ${maxAmount} ${defaultCurrency}`, { position: 'bottom-center' }); setError(`Max: ${maxAmount} ${defaultCurrency}`); return }
        setSelectedWin(pickRandomWin())
        setError('')
        setConfirming(dir)
    }

    const confirmTrade = async () => {
        setConfirming(null)
        try {
            const r: any = await axios.post(route('user.trade.open'), {
                crypto_id: crypto.id, duration_seconds: selectedDuration,
                direction: confirming, amount,
                win_pct: selectedWin?.value, currentSetting: currentSetting?.id,
            })
            const { trade } = r.data


            setActiveTrade({
                trade_id: trade.id,
                total: selectedDuration,
                remaining: selectedDuration,
                direction: confirming,
                amount,
                openPrice: trade.open_price ?? price,
                openedAt: trade.opened_at,
            })


            setResult(null)
        } catch (e: any) {
            setError(e.response?.data?.message ?? 'Trade failed.')
        }
    }

    const orderPanelProps = {
        defaultCurrency, presets, selectedPreset, setPreset, amount, setAmount,
        userBalance, settings, selectedDuration,
        setDuration: (d: number) => setDuration(d),
        currentSetting, yieldPct, error, activeTrade,
        onBuyLong: () => handleTrade('long'),
        onSellShort: () => handleTrade('short'),
    }

    const NAV_H = 64

    return (
        <UserLayout title={`${crypto.symbol ?? '...'}/${defaultCurrency}`} back={route('market')}>
            <div
                className="fixed top-0 left-0 right-0 z-[80] bg-white flex flex-col"
                style={{ bottom: '64px', fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-4 bg-white border-b border-slate-100 shrink-0" style={{ height: 48 }}>
                    <div className="flex items-center gap-2">
                        <Link href={route('market')} className="p-1 rounded-lg active:bg-slate-100 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </Link>
                        <button onClick={() => setShowCoinDrawer(true)} className="flex items-center gap-1 active:opacity-60 transition-opacity">
                            <AlignJustify className="w-4 h-4 text-slate-500" />
                            <span className="font-bold text-[15px] text-slate-900 tracking-tight">
                                {crypto.symbol ?? 'BTC'}/{defaultCurrency ?? 'USDT'}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    </div>
                    <button
                        onClick={() => setShowPositions(prev => !prev)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors active:scale-95"
                    >
                        {showPositions ? (
                            <><LineChart className="w-3.5 h-3.5 text-blue-500" /><span className="text-xs font-semibold text-blue-500">{t('K-Line')}</span></>
                        ) : (
                            <><ClipboardList className="w-3.5 h-3.5 text-blue-500" /><span className="text-xs font-semibold text-blue-500">{t('Positions')}</span></>
                        )}
                    </button>
                </div>

                {/* ── Price strip ── */}
                <div className="px-4 py-2 bg-white border-b border-slate-100 shrink-0 relative">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col min-w-0 max-w-[38%]">
                            <span className={cn('text-xl font-bold  truncate', priceUp ? 'text-emerald-500' : 'text-red-500')}>
                                {Number(price || crypto.usd_price || 0).toFixed(2)}
                            </span>
                            <span className={cn('text-sm font-medium flex items-center gap-0.5 mt-0.5', priceUp ? 'text-emerald-500' : 'text-red-500')}>
                                {priceUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {priceUp ? '+' : ''}{priceChange.toFixed(2)}%
                            </span>
                        </div>
                        <div className="flex flex-col items-center text-center absolute left-1/2 -translate-x-1/2">
                            <div className="text-[12.5px] text-slate-400 whitespace-nowrap">{t('High')}</div>
                            <div className="text-[12.5px] text-slate-400 whitespace-nowrap">{t('Low')}</div>
                            <div className="text-[12.5px] text-slate-400 whitespace-nowrap">{t('24H vol')}</div>
                        </div>
                        <div className="flex flex-col text-[12.5px] max-w-[38%]">
                            <div className="font-semibold text-slate-700">{fmt(high_24h)}</div>
                            <div className="font-semibold text-slate-700">{fmt(low_24h)}</div>
                            <div className="font-semibold text-slate-700">{fmt(price_change_24h)}</div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════
                MOBILE layout (< 768px)
                - tabs on top, chart below, bottom trade bar
            ══════════════════════════════════════════ */}
                {isMobile ? (
                    <>
                        {/* Tabs */}
                        {!showPositions && (
                            <div className="flex bg-white border-b border-slate-100 shrink-0">
                                {[
                                    { id: 'trade', label: t('Trade') },
                                    { id: 'market', label: t('Market') },
                                    // { id: 'orders', label: t('Orders') },
                                ].map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={cn('flex-1 py-2.5 text-sm font-semibold relative transition-colors',
                                            activeTab === tab.id ? 'text-slate-900' : 'text-slate-400')}>
                                        {tab.label}
                                        {activeTab === tab.id && <span className="absolute bottom-0 left-1/4 right-1/4 h-[2.5px] bg-blue-500 rounded-full" />}
                                    </button>
                                ))}
                            </div>
                        )}
                        {showPositions && (
                            <div className="flex bg-white border-b border-slate-100 shrink-0">
                                <div className="flex-1 py-2.5 text-sm font-semibold text-slate-900 text-center relative">
                                    {t('Positions')}
                                    <span className="absolute bottom-0 left-1/4 right-1/4 h-[2.5px] bg-blue-500 rounded-full" />
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-hidden flex flex-col min-h-0" style={{ paddingBottom: 58 }}>
                            {showPositions && (
                                <div className="flex-1 overflow-y-auto bg-white">

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-xs text-slate-400 font-medium">
                                        <div>{t('Quantity')}</div>
                                        <div className="text-right sm:text-left">{t('P&L')}</div>

                                        <div className="hidden sm:block">{t('Buy Price')}</div>
                                        <div className="hidden sm:block">{t('Close')}</div>
                                    </div>

                                    {(ordersProp ?? []).length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="text-5xl mb-3">📭</div>
                                            <p className="text-sm font-semibold text-slate-700">{t('No trades yet')}</p>
                                            <p className="text-xs text-slate-400 mt-1">{t('Your completed trades will appear here')}</p>
                                        </div>
                                    ) : (
                                        (ordersProp ?? []).map((trade: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors cursor-pointer active:bg-slate-100"
                                                onClick={() =>
                                                    setSelectedTrade({
                                                        ...trade,
                                                        crypto_symbol: crypto.symbol ?? 'BTC',
                                                    })
                                                }
                                            >
                                                {/* Main Grid */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                                                    {/* Quantity */}
                                                    <div className="text-sm font-semibold  text-slate-900">
                                                        {trade.amount}
                                                    </div>

                                                    {/* P&L */}
                                                    <div
                                                        className={cn(
                                                            'text-sm font-bold  text-right sm:text-left',
                                                            trade.result === 'win'
                                                                ? 'text-emerald-600'
                                                                : 'text-red-500'
                                                        )}
                                                    >
                                                        {parseFloat(trade.profit_loss) >= 0 ? '+' : ''}
                                                        {trade.profit_loss}
                                                    </div>

                                                    {/* Buy + Close (Mobile stacked) */}
                                                    <div className="text-xs  text-slate-500 sm:block col-span-2 sm:col-span-1">
                                                        <span className="sm:hidden">Buy: </span>
                                                        {Number(trade.open_price)?.toFixed(4)}
                                                    </div>

                                                    <div className="text-xs  text-slate-500 sm:block col-span-2 sm:col-span-1">
                                                        <span className="sm:hidden">Close: </span>
                                                        {Number(trade.close_price)?.toFixed(4)}
                                                    </div>
                                                </div>

                                                {/* Bottom Info */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <span className="text-xs text-slate-400">
                                                        {trade.opened_at}
                                                    </span>

                                                    <div className="flex gap-1.5 flex-wrap">
                                                        <span
                                                            className={cn(
                                                                'text-xs px-2 py-0.5 rounded-md',
                                                                trade.result === 'win'
                                                                    ? 'bg-emerald-50 text-emerald-600'
                                                                    : trade.result === 'loss'
                                                                        ? 'bg-red-50 text-red-500'
                                                                        : 'bg-slate-100 text-slate-500'
                                                            )}
                                                        >
                                                            {trade.result?.toUpperCase()}
                                                        </span>

                                                        <span
                                                            className={cn(
                                                                'text-xs px-2 py-0.5 rounded-md',
                                                                trade.direction === 'long'
                                                                    ? 'bg-emerald-50 text-emerald-600'
                                                                    : 'bg-red-50 text-red-500'
                                                            )}
                                                        >
                                                            {trade.direction === 'long'
                                                                ? '▲ Buy'
                                                                : '▼ Sell'}
                                                        </span>

                                                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                                                            {keyToValue(trade.status)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}


                                </div>
                            )}
                            {!showPositions && activeTab === 'trade' && (
                                <div className="flex-1 min-h-0"><TradingViewWidget symbol={binanceSymbol} /></div>
                            )}
                            {!showPositions && activeTab === 'market' && (
                                <div className="flex-1 overflow-y-auto bg-white">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">{t('Spot Trading')}</p>
                                        <p className="text-sm font-semibold text-blue-500 mt-0.5">{defaultCurrency}</p>
                                    </div>
                                    {cryptos.map((c: any, i: number) => (
                                        <div key={c.id ?? c.symbol}>
                                            <Link href={route('user.trade.show', { crypto: c.symbol })}
                                                className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    {c.images?.small ? <img src={c.images.small} alt={c.symbol} className="w-9 h-9 rounded-full" /> : <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{c.symbol?.[0]}</div>}
                                                    <div>
                                                        <span className="text-sm font-semibold text-slate-900">{c.symbol}</span>
                                                        <span className="text-slate-400 text-sm">/{defaultCurrency}</span>
                                                        <div className="text-xs text-slate-400  mt-0.5">{fmt(c.usd_price)}</div>
                                                    </div>
                                                </div>
                                                <div className={cn('text-sm font-semibold px-3 py-1.5 rounded-lg', Number(c.price_change_24h) >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500')}>
                                                    {Number(c.price_change_24h) >= 0 ? '+' : ''}{Number(c.price_change_24h ?? 0).toFixed(2)}%
                                                </div>
                                            </Link>
                                            {i < cryptos.length - 1 && <div className="h-px bg-slate-50 mx-4" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!showPositions && activeTab === 'orders' && (
                                <div className="flex-1 overflow-y-auto bg-white">
                                    <div className="grid grid-cols-4 gap-1 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                                        {['Quantity', 'Buy Price', 'Close', 'P&L'].map(h => (
                                            <div key={h} className="text-xs text-slate-400 font-medium">{h}</div>
                                        ))}
                                    </div>
                                    {(ordersProp ?? []).length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="text-5xl mb-3">📭</div>
                                            <p className="text-sm font-semibold text-slate-700">{t('No trades yet')}</p>
                                            <p className="text-xs text-slate-400 mt-1">{t('Your completed trades will appear here')}</p>
                                        </div>
                                    ) : (ordersProp ?? []).map((trade: any, idx: number) => (
                                        <div key={idx}
                                            className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors cursor-pointer active:bg-slate-100"
                                            onClick={() => setSelectedTrade({ ...trade, crypto_symbol: crypto.symbol ?? 'BTC' })}>
                                            <div className="grid grid-cols-4 gap-1 mb-1.5">
                                                <div className="text-sm font-semibold  text-slate-900">{trade.amount}</div>
                                                <div className="text-xs  text-slate-500">{Number(trade.open_price)?.toFixed(4)}</div>
                                                <div className="text-xs  text-slate-500">{Number(trade.close_price)?.toFixed(4)}</div>
                                                <div className={cn('text-sm font-bold ', trade.result === 'win' ? 'text-emerald-600' : 'text-red-500')}>
                                                    {parseFloat(trade.profit_loss) >= 0 ? '+' : ''}{trade.profit_loss}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between flex-wrap gap-1">
                                                <span className="text-xs text-slate-400">{trade.opened_at}</span>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    <span className={cn('text-xs px-2 py-0.5 rounded-md', trade.result === 'win' ? 'bg-emerald-50 text-emerald-600' : trade.result === 'loss' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500')}>
                                                        {trade.result?.toUpperCase()}
                                                    </span>
                                                    <span className={cn('text-xs px-2 py-0.5 rounded-md', trade.direction === 'long' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500')}>
                                                        {trade.direction === 'long' ? '▲ Buy' : '▼ Sell'}
                                                    </span>
                                                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">{keyToValue(trade.status)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile trade action bar */}
                        <div className="fixed left-0 right-0 z-[90] bg-white/95 backdrop-blur border-t border-slate-200" style={{ bottom: NAV_H }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '6px 10px', width: '100%', boxSizing: 'border-box' }}>
                                <button onClick={() => setShowOrderSheet(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
                                    <span style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 1, lineHeight: 1, whiteSpace: 'nowrap' }}>
                                        {t('Quantity')} <ChevronDown style={{ width: 10, height: 10 }} />
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1, marginTop: 2 }}>{displayAmount}</span>
                                </button>
                                <div style={{ width: 1, height: 26, background: '#e2e8f0', flexShrink: 0 }} />
                                <button onClick={() => setShowOrderSheet(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
                                    <span style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 1, lineHeight: 1, whiteSpace: 'nowrap' }}>
                                        {t('Time')} <ChevronDown style={{ width: 10, height: 10 }} />
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1, marginTop: 2 }}>{selectedDuration}s</span>
                                </button>
                                <button onClick={() => handleTrade('long')} disabled={!!activeTrade}
                                    style={{ flex: 1, height: 44, borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: activeTrade ? 'not-allowed' : 'pointer', background: activeTrade ? '#e2e8f0' : '#22c55e', color: activeTrade ? '#94a3b8' : '#fff', flexShrink: 0, whiteSpace: 'nowrap' }}>
                                    {t('Buy Long')}
                                </button>
                                <button onClick={() => handleTrade('short')} disabled={!!activeTrade}
                                    style={{ flex: 1, height: 44, borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: activeTrade ? 'not-allowed' : 'pointer', background: activeTrade ? '#e2e8f0' : '#f87171', color: activeTrade ? '#94a3b8' : '#fff', flexShrink: 0, whiteSpace: 'nowrap' }}>
                                    {t('Sell Short')}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* ══════════════════════════════════════════
                       DESKTOP layout (>= 768px)
                       - Left 50%: chart/market/positions
                       - Right 50%: order panel (always visible)
                    ══════════════════════════════════════════ */
                    <div className="flex-1 min-h-0 flex overflow-hidden">

                        {/* LEFT: Chart side */}
                        <div className="flex flex-col border-r border-slate-100" style={{ width: '50%', minWidth: 0 }}>
                            {!showPositions && (
                                <div className="flex bg-white border-b border-slate-100 shrink-0">
                                    {[
                                        { id: 'trade', label: t('Trade') },
                                        { id: 'market', label: t('Market') },
                                    ].map(tab => (
                                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                            className={cn('flex-1 py-2.5 text-sm font-semibold relative transition-colors',
                                                activeTab === tab.id ? 'text-slate-900' : 'text-slate-400')}>
                                            {tab.label}
                                            {activeTab === tab.id && <span className="absolute bottom-0 left-1/4 right-1/4 h-[2.5px] bg-blue-500 rounded-full" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {showPositions && (
                                <div className="flex bg-white border-b border-slate-100 shrink-0">
                                    <div className="flex-1 py-2.5 text-sm font-semibold text-slate-900 text-center relative">
                                        {t('Positions')}
                                        <span className="absolute bottom-0 left-1/4 right-1/4 h-[2.5px] bg-blue-500 rounded-full" />
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                                {showPositions && (
                                    <div className="flex-1 overflow-y-auto bg-white">
                                        <div className="grid grid-cols-4 gap-1 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                                            {['Quantity', 'Buy Price', 'Close', 'P&L'].map(h => (
                                                <div key={h} className="text-xs text-slate-400 font-medium">{h}</div>
                                            ))}
                                        </div>
                                        {(ordersProp ?? []).length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                                <div className="text-5xl mb-3">📭</div>
                                                <p className="text-sm font-semibold text-slate-700">{t('No trades yet')}</p>
                                                <p className="text-xs text-slate-400 mt-1">{t('Your completed trades will appear here')}</p>
                                            </div>
                                        ) : (ordersProp ?? []).map((trade: any, idx: number) => (
                                            <div key={idx}
                                                className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors cursor-pointer active:bg-slate-100"
                                                onClick={() => setSelectedTrade({ ...trade, crypto_symbol: crypto.symbol ?? 'BTC' })}>
                                                <div className="grid grid-cols-4 gap-1 mb-1.5">
                                                    <div className="text-sm font-semibold  text-slate-900">{trade.amount}</div>
                                                    <div className="text-xs  text-slate-500">{Number(trade.open_price)?.toFixed(4)}</div>
                                                    <div className="text-xs  text-slate-500">{Number(trade.close_price)?.toFixed(4)}</div>
                                                    <div className={cn('text-sm font-bold ', trade.result === 'win' ? 'text-emerald-600' : 'text-red-500')}>
                                                        {parseFloat(trade.profit_loss) >= 0 ? '+' : ''}{trade.profit_loss}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between flex-wrap gap-1">
                                                    <span className="text-xs text-slate-400">{trade.opened_at}</span>
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        <span className={cn('text-xs px-2 py-0.5 rounded-md', trade.result === 'win' ? 'bg-emerald-50 text-emerald-600' : trade.result === 'loss' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500')}>
                                                            {trade.result?.toUpperCase()}
                                                        </span>
                                                        <span className={cn('text-xs px-2 py-0.5 rounded-md', trade.direction === 'long' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500')}>
                                                            {trade.direction === 'long' ? '▲ Buy' : '▼ Sell'}
                                                        </span>
                                                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">{keyToValue(trade.status)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!showPositions && activeTab === 'trade' && (
                                    <div className="flex-1 min-h-0"><TradingViewWidget symbol={binanceSymbol} /></div>
                                )}
                                {!showPositions && activeTab === 'market' && (
                                    <div className="flex-1 overflow-y-auto bg-white">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">{t('Spot Trading')}</p>
                                            <p className="text-sm font-semibold text-blue-500 mt-0.5">{defaultCurrency}</p>
                                        </div>
                                        {cryptos.map((c: any, i: number) => (
                                            <div key={c.id ?? c.symbol}>
                                                <Link href={route('user.trade.show', { crypto: c.symbol })}
                                                    className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        {c.images?.small ? <img src={c.images.small} alt={c.symbol} className="w-9 h-9 rounded-full" /> : <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{c.symbol?.[0]}</div>}
                                                        <div>
                                                            <span className="text-sm font-semibold text-slate-900">{c.symbol}</span>
                                                            <span className="text-slate-400 text-sm">/{defaultCurrency}</span>
                                                            <div className="text-xs text-slate-400  mt-0.5">{fmt(c.usd_price)}</div>
                                                        </div>
                                                    </div>
                                                    <div className={cn('text-sm font-semibold px-3 py-1.5 rounded-lg', Number(c.price_change_24h) >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500')}>
                                                        {Number(c.price_change_24h) >= 0 ? '+' : ''}{Number(c.price_change_24h ?? 0).toFixed(2)}%
                                                    </div>
                                                </Link>
                                                {i < cryptos.length - 1 && <div className="h-px bg-slate-50 mx-4" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Order panel */}
                        <div className="flex flex-col bg-white" style={{ width: '50%', minWidth: 0 }}>
                            <div className="flex bg-white border-b border-slate-100 shrink-0">
                                <div className="flex-1 py-2.5 text-sm font-semibold text-slate-900 text-center relative">
                                    {t('Order')}
                                    <span className="absolute bottom-0 left-1/4 right-1/4 h-[2.5px] bg-blue-500 rounded-full" />
                                </div>
                            </div>
                            {/* Increased padding + min-height for order panel */}
                            <div className="flex-1 overflow-y-auto px-5 py-5">
                                <OrderPanel {...orderPanelProps} />
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* ── Coin Drawer ── */}
            <LeftDrawer open={showCoinDrawer} onClose={() => setShowCoinDrawer(false)}>
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 shrink-0">
                    <span className="text-[15px] font-semibold text-slate-900">Select Market</span>
                    <button onClick={() => setShowCoinDrawer(false)} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-slate-100">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1">
                    {cryptos.map((c: any, i: number) => (
                        <div key={c.id ?? c.symbol}>
                            <Link href={route('user.trade.show', { crypto: c.symbol })} onClick={() => setShowCoinDrawer(false)}
                                className={cn('flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors', c.symbol === crypto.symbol ? 'bg-blue-50' : '')}>
                                <div className="flex items-center gap-2.5">
                                    {c.images?.small ? <img src={c.images.small} alt={c.symbol} className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{c.symbol?.[0]}</div>}
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">{c.symbol}<span className="text-slate-400 font-normal">/{defaultCurrency}</span></div>
                                        <div className="text-xs text-slate-400 ">{fmt(c.usd_price)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={cn('text-xs font-semibold', Number(c.price_change_24h) >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                                        {Number(c.price_change_24h) >= 0 ? '+' : ''}{Number(c.price_change_24h ?? 0).toFixed(2)}%
                                    </span>
                                    {c.symbol === crypto.symbol && <ChevronRight className="w-4 h-4 text-blue-500" />}
                                </div>
                            </Link>
                            {i < cryptos.length - 1 && <div className="h-px bg-slate-50 mx-4" />}
                        </div>
                    ))}
                </div>
            </LeftDrawer>

            {/* ── Mobile Order Sheet ── */}
            {isMobile && (
                <BottomSheet open={showOrderSheet} onClose={() => setShowOrderSheet(false)}>
                    <div className="flex justify-center pt-3 pb-1 shrink-0">
                        <div className="w-10 h-1 rounded-full bg-slate-200" />
                    </div>
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
                        <span className="text-[16px] font-semibold text-slate-900">{t('Opening Quantity')}</span>
                        <button onClick={() => setShowOrderSheet(false)} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-slate-100">
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1 px-5 py-5 pb-8">
                        <OrderPanel {...orderPanelProps}
                            onBuyLong={() => { setShowOrderSheet(false); handleTrade('long') }}
                            onSellShort={() => { setShowOrderSheet(false); handleTrade('short') }} />
                    </div>
                </BottomSheet>
            )}

            {/* ── Confirm Sheet ── */}
            {confirming && (
                <BottomSheet open={!!confirming} onClose={() => setConfirming(null)}>
                    <div className="flex justify-center pt-3 pb-1 shrink-0">
                        <div className="w-10 h-1 rounded-full bg-slate-200" />
                    </div>
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
                        <span className="text-[16px] font-semibold text-slate-900">{t('Confirm Order')}</span>
                        <button onClick={() => setConfirming(null)} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-slate-100">
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                    <div className="px-5 py-5 space-y-4 overflow-y-auto flex-1">
                        <div className="rounded-xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                            {[
                                ['Direction', confirming === 'long' ? '▲ Buy Long' : '▼ Sell Short', confirming === 'long' ? 'text-emerald-600' : 'text-red-500'],
                                ['Amount', `${Number(amount).toLocaleString()} ${defaultCurrency}`, 'text-slate-900'],
                                ['Duration', currentSetting?.label ?? `${selectedDuration}s`, 'text-slate-900'],
                                ['Possible Profit', `+${((Number(amount) * (selectedWin?.value ?? 0)) / 100).toFixed(2)} ${defaultCurrency}`, 'text-emerald-600'],
                                ['Total Return', `${(Number(amount) + ((Number(amount) * (selectedWin?.value ?? 0)) / 100)).toFixed(2)} ${defaultCurrency}`, 'text-blue-600'],
                            ].map(([label, val, color]: any) => (
                                <div key={label} className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-slate-500">{label}</span>
                                    <span className={cn('text-sm font-semibold', color)}>{val}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3 pb-2">
                            <button onClick={() => setConfirming(null)}
                                className="py-3.5 rounded-2xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                                {t('Cancel')}
                            </button>
                            <button onClick={confirmTrade}
                                className={cn('py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[.98]',
                                    confirming === 'long' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600')}>
                                {t('Confirm')} {confirming === 'long' ? 'Buy' : 'Sell'}
                            </button>
                        </div>
                    </div>
                </BottomSheet>
            )}

            {/* ── Trade Modal ── */}
            {showTradeModal && (
                <TradeModal
                    activeTrade={activeTrade}
                    result={result}
                    yieldPct={yieldPct}
                    defaultCurrency={defaultCurrency}
                    cryptoSymbol={crypto.symbol ?? 'BTC'}
                    onClose={handleModalClose}
                    onPlaceAnother={handlePlaceAnother}
                />
            )}


            {/* ── Trade Detail Modal (image 3 style) ── */}
            {selectedTrade && (
                <TradeDetailModal
                    trade={selectedTrade}
                    defaultCurrency={defaultCurrency}
                    onClose={() => setSelectedTrade(null)}
                />
            )}

            <style>{`
            @keyframes sheetUp    { from { transform: translateY(100%) } to { transform: translateY(0) } }
            @keyframes sheetLeft  { from { transform: translateX(-100%) } to { transform: translateX(0) } }
            @keyframes popIn      { from { transform: scale(.92); opacity: 0 } to { transform: scale(1); opacity: 1 } }
            @keyframes rayBurst   { from { transform: rotate(var(--r,0deg)) scaleY(0); opacity:0 } to { transform: rotate(var(--r,0deg)) scaleY(1); opacity:1 } }
            @keyframes shakeIn    { 0%{transform:translateX(-12px) scale(.8);opacity:0} 20%{transform:translateX(10px);opacity:1} 40%{transform:translateX(-8px)} 60%{transform:translateX(6px)} 80%{transform:translateX(-3px)} 100%{transform:translateX(0) scale(1)} }
            @keyframes fadeUp     { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            @keyframes fadeScatter{ from { transform: scale(0) rotate(-30deg); opacity:0 } to { transform: scale(1) rotate(0deg); opacity:1 } }
        `}</style>
        </UserLayout>
    )
}