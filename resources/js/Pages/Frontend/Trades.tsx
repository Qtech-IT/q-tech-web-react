import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader } from "@/Components/UI/Card";
import { useTranslations } from "@/Hooks/useTranslations";
import UserLayout from "@/Layouts/FrontendLayout";
import { keyToValue } from "@/Utils/helpers";
import { router } from "@inertiajs/react";
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Clock,
    Filter,
    TrendingDown,
    TrendingUp,
    X
} from "lucide-react";
import { useCallback, useState } from "react";

/* ─────────────────────────── helpers ─────────────────────── */

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        open: 'bg-emerald-600 text-white border-emerald-600',
        closed: 'bg-zinc-600 text-white border-zinc-600',
        cancelled: 'bg-rose-600 text-white border-rose-600',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${map[status] ?? map.closed}`}>
            {keyToValue(status)}
        </span>
    );
}

function ResultBadge({ result }: { result: string }) {

    const { t } = useTranslations();
    if (!result || result === 'pending') return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-600 text-white border border-amber-600">
            <Clock className="w-3 h-3" /> {t('Pending')}
        </span>
    );

    const win = result === 'win';

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${win ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600'
            }`}>
            {win ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {keyToValue(result)}
        </span>
    );
}

function DirectionIcon({ direction }: { direction: string }) {
    const up = direction?.toLowerCase() === 'up';
    return up
        ? <ArrowUpRight className="w-4 h-4 text-emerald-400" />
        : <ArrowDownRight className="w-4 h-4 text-rose-400" />;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <div className="
            rounded-xl p-4 flex flex-col gap-1
            border transition
            bg-white border-zinc-200 text-zinc-900
            dark:bg-zinc-900 dark:border-zinc-800 dark:text-white
        ">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold">{value}</p>
            {sub && <p className="text-xs text-zinc-500">{sub}</p>}
        </div>
    );
}

/* ─────────────────────────── types ───────────────────────── */

type FilterState = {
    crypto_id: string;
    status: string;
    result: string;
    date_range: string;
};

const EMPTY_FILTERS: FilterState = {
    crypto_id: '',
    status: '',
    result: '',
    date_range: '',
};

/* ─────────────────── date-range picker ───────────────────── */
// Renders two <input type="date"> side by side.
// Produces the "MM/DD/YYYY - MM/DD/YYYY" string your Laravel scope expects.

function DateRangePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const toInputDate = (mmddyyyy: string) => {
        if (!mmddyyyy) return '';
        const [m, d, y] = mmddyyyy.split('/');
        return `${y}-${m}-${d}`;
    };

    const toDisplay = (yyyymmdd: string) => {
        if (!yyyymmdd) return '';
        const [y, m, d] = yyyymmdd.split('-');
        return `${m}/${d}/${y}`;
    };

    const parts = value?.split(' - ') ?? [];
    const fromRaw = parts[0] ?? '';
    const toRaw = parts[1] ?? '';

    return (
        <div className="flex items-center gap-1">
            <input
                type="date"
                value={toInputDate(fromRaw)}
                onChange={e => {
                    const f = toDisplay(e.target.value);
                    onChange(f && toRaw ? `${f} - ${toRaw}` : f);
                }}
                className="h-8 px-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-500"
            />
            <span className="text-gray-400 text-xs">—</span>
            <input
                type="date"
                value={toInputDate(toRaw)}
                onChange={e => {
                    const t2 = toDisplay(e.target.value);
                    onChange(fromRaw && t2 ? `${fromRaw} - ${t2}` : t2);
                }}
                className="h-8 px-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-500"
            />
        </div>
    );
}

/* ─────────────────────── filter bar ─────────────────────── */



function FilterBar({ options, filters, onChange, onApply, onClear }: {
    options: any[];
    filters: FilterState;
    onChange: (k: string, v: string) => void;
    onApply: () => void;
    onClear: () => void;
}) {
    const { t } = useTranslations();

    return (
        <div className="flex flex-wrap items-end gap-3 overflow-x-auto sm:overflow-visible pb-3">
            {options.map((opt: any) => {
                if (opt.type === 'select') return (
                    <div key={opt.key} className="flex flex-col gap-1 min-w-[180px] sm:min-w-0">
                        <label className="text-[11px] text-gray-500 uppercase tracking-wider">{opt.label}</label>
                        <select
                            value={(filters as any)[opt.key] ?? ''}
                            onChange={e => onChange(opt.key, e.target.value)}
                            className="h-8 px-3 rounded-lg bg-white border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-500 cursor-pointer"
                        >
                            {opt.options?.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                );

                if (opt.type === 'daterange') return (
                    <div key={opt.key} className="flex flex-col gap-1 min-w-[220px] sm:min-w-0">
                        <label className="text-[11px] text-gray-500 uppercase tracking-wider">{opt.label}</label>
                        <DateRangePicker value={(filters as any)[opt.key] ?? ''} onChange={v => onChange(opt.key, v)} />
                    </div>
                );

                return null;
            })}

            <Button size="sm" onClick={onApply} className="h-8 bg-blue-600 hover:bg-blue-500 text-white">
                {t('Apply')}
            </Button>

            {Object.values(filters).some(Boolean) && (
                <Button variant="ghost" size="sm" onClick={onClear} className="h-8 px-2 text-gray-500 hover:text-black">
                    <X className="w-3.5 h-3.5 mr-1" />{t('Clear')}
                </Button>
            )}
        </div>
    );
}


/* ─────────────────────── pagination ─────────────────────── */

function Pagination({
    meta,
    filters,
}: {
    meta: any;
    filters: FilterState;
}) {
    const { t } = useTranslations();
    if (!meta || meta.last_page <= 1) return null;

    const goTo = (page: number) => {
        // Strip empty filters before sending
        const params: Record<string, any> = { page };
        (Object.keys(filters) as (keyof FilterState)[]).forEach(k => {
            if (filters[k]) params[k] = filters[k];
        });
        router.get(window.location.pathname, params, { preserveScroll: true, preserveState: true });
    };

    // Build page window (max 5 pages around current)
    const current = meta.current_page;
    const last = meta.last_page;
    const pageNums: (number | '...')[] = [];

    if (last <= 7) {
        for (let i = 1; i <= last; i++) pageNums.push(i);
    } else {
        pageNums.push(1);
        if (current > 3) pageNums.push('...');
        for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) pageNums.push(i);
        if (current < last - 2) pageNums.push('...');
        pageNums.push(last);
    }

    return (
        <div className="flex items-center justify-between px-1">
            <p className="text-xs text-zinc-500">
                {meta.from}–{meta.to} {t('of')} {meta.total}
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => goTo(current - 1)}
                    disabled={current === 1}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {pageNums.map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className="w-7 h-7 flex items-center justify-center text-zinc-600 text-xs">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => goTo(p as number)}
                            className={`w-7 h-7 rounded-md text-xs font-medium transition ${p === current
                                ? 'bg-emerald-600 text-white'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => goTo(current + 1)}
                    disabled={current === last}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────── main page ──────────────────────── */

export default function Trades({ data, defaultCurrency, advanceFilterOptions = [] }: any) {
    const { t } = useTranslations();

    const trades: any[] = data?.data?.data ?? [];
    const meta = data?.data?.meta ?? data?.meta ?? {};

    const urlParams = new URLSearchParams(window.location.search);
    const [filters, setFilters] = useState<FilterState>({
        crypto_id: urlParams.get('crypto_id') ?? '',
        status: urlParams.get('status') ?? '',
        result: urlParams.get('result') ?? '',
        date_range: urlParams.get('date_range') ?? '',
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (key: string, val: string) => {
        setFilters(prev => ({ ...prev, [key]: val }));
    };

    const applyFilters = useCallback(() => {
        const params: Record<string, any> = { page: 1 };
        (Object.keys(filters) as (keyof FilterState)[]).forEach(k => {
            if (filters[k]) params[k] = filters[k];
        });
        router.get(window.location.pathname, params, { preserveScroll: true, preserveState: true });
    }, [filters]);

    const clearFilters = () => {
        setFilters(EMPTY_FILTERS);
        router.get(window.location.pathname, {}, { preserveScroll: true, preserveState: true });
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    const totalTrades = meta?.total ?? trades.length;
    const wins = trades.filter(t => t.result === 'win').length;
    const losses = trades.filter(t => t.result === 'lose').length;
    const winRate = trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0;

    return (
        <UserLayout title={t('Trades')}>
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen text-gray-900">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-none">{t('My Trades')}</h1>
                            <p className="text-xs text-gray-500 mt-0.5">{totalTrades} {t('total records')}</p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(p => !p)}
                        className="h-8 border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                    >
                        <Filter className="w-3.5 h-3.5 mr-1.5" />
                        {t('Filter')}
                        {activeFilterCount > 0 && (
                            <span className="ml-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatCard label={t('Total')} value={String(totalTrades)} />
                    <StatCard label={t('Win Rate')} value={`${winRate}%`} sub={`${wins}W / ${losses}L`} />
                    <StatCard label={t('Open')} value={String(trades.filter(t => t.status === 'open').length)} />
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card className="bg-white border border-gray-200">
                        <CardContent className="py-4 pb-2">

                            <FilterBar
                                options={advanceFilterOptions}
                                filters={filters}
                                onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
                                onApply={applyFilters}
                                onClear={clearFilters}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Trades */}
                <Card className="bg-white border border-gray-200">
                    <CardHeader className="pb-0 pt-4 px-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                            {t('Trade History')}
                        </p>
                    </CardHeader>

                    <CardContent className="p-0">
                        {trades.length === 0 ? (
                            <div className="text-center text-sm text-gray-400 py-16">
                                <BarChart3 className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                {t('No trades found')}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {trades.map((trade: any, i: number) => (
                                    <div
                                        key={trade.id ?? i}
                                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                                            {trade.crypto?.images?.thumb
                                                ? <img src={trade.crypto.images.thumb} className="w-6 h-6 object-contain" />
                                                : <span className="text-xs font-bold text-gray-500">
                                                    {trade.crypto?.symbol?.slice(0, 2)?.toUpperCase() ?? '??'}
                                                </span>
                                            }
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {trade.crypto?.name ?? '—'}
                                                </span>
                                                <DirectionIcon direction={trade.direction} />
                                                <span className={`text-xs font-medium ${trade.direction?.toLowerCase() === 'up'
                                                    ? 'text-emerald-600'
                                                    : 'text-red-500'
                                                    }`}>
                                                    {trade.direction?.toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                <span className="text-xs text-gray-500">
                                                    {trade.opened_at?.slice(0, 16).replace('T', ' ') ?? '—'}
                                                </span>
                                                <span className="text-gray-300">·</span>
                                                <span className="text-xs text-gray-500">
                                                    {trade.duration_seconds}s
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <StatusBadge status={trade.status} />
                                            <ResultBadge result={trade.result} />
                                        </div>

                                        <div className="text-right shrink-0 hidden sm:block">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {trade.amount}
                                            </p>
                                            {trade.profit_loss && (
                                                <p className={`text-xs font-medium ${trade.result === 'win'
                                                    ? 'text-emerald-600'
                                                    : 'text-red-500'
                                                    }`}>
                                                    {trade.profit_loss}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                <Pagination meta={meta} filters={filters} />
            </div>
        </UserLayout>
    );
}