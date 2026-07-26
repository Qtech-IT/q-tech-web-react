import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader } from "@/Components/UI/Card";
import { useTranslations } from "@/Hooks/useTranslations";
import UserLayout from "@/Layouts/FrontendLayout";
import { keyToValue } from "@/Utils/helpers";
import { router } from "@inertiajs/react";
import {
    ArrowDownToLine,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    ExternalLink,
    Filter,
    Receipt,
    X,
    XCircle
} from "lucide-react";
import { useCallback, useState } from "react";

/* ─────────────────────────── badges ──────────────────────── */

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { cls: string; icon: React.ReactNode }> = {
        pending: { cls: 'bg-amber-100 text-amber-700 border-amber-300', icon: <Clock className="w-3 h-3" /> },
        approved: { cls: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: <CheckCircle2 className="w-3 h-3" /> },
        declined: { cls: 'bg-rose-100 text-rose-700 border-rose-300', icon: <XCircle className="w-3 h-3" /> },
    };

    const s: any = map[status] ?? map.pending;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-medium border ${s.cls}`}>
            {s.icon}{keyToValue(status)}
        </span>
    );
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

/* ─────────────────── date-range picker ───────────────────── */

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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 w-full sm:w-auto">
            <input
                type="date"
                value={toInputDate(fromRaw)}
                onChange={e => {
                    const f = toDisplay(e.target.value);
                    onChange(f && toRaw ? `${f} - ${toRaw}` : f);
                }}
                className="h-8 w-full sm:w-auto px-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-500"
            />

            <span className="text-gray-400 text-xs hidden sm:block">—</span>

            <input
                type="date"
                value={toInputDate(toRaw)}
                onChange={e => {
                    const t2 = toDisplay(e.target.value);
                    onChange(fromRaw && t2 ? `${fromRaw} - ${t2}` : t2);
                }}
                className="h-8 w-full sm:w-auto px-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-500"
            />
        </div>
    );
}

/* ─────────────────────── filter bar ─────────────────────── */

type FilterState = { crypto_id: string; status: string; date_range: string };
const EMPTY: FilterState = { crypto_id: '', status: '', date_range: '' };

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
                        <label className="text-[12px] text-gray-500 uppercase tracking-wider">{opt.label}</label>
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
                        <label className="text-[12px] text-gray-500 uppercase tracking-wider">{opt.label}</label>
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

export default function DepositHistory({ data, advanceFilterOptions = [] }: any) {
    const { t } = useTranslations();

    const deposits: any[] = data?.data?.data ?? [];
    const meta = data?.data?.meta ?? data?.meta ?? {};

    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<FilterState>({
        crypto_id: urlParams.get('crypto_id') ?? '',
        status: urlParams.get('status') ?? '',
        date_range: urlParams.get('date_range') ?? '',
    });

    const [showFilters, setShowFilters] = useState(false);

    const applyFilters = useCallback(() => {
        const params: Record<string, any> = { page: 1 };
        (Object.keys(filters) as (keyof FilterState)[]).forEach(k => {
            if (filters[k]) params[k] = filters[k];
        });

        router.get(window.location.pathname, params, { preserveScroll: true, preserveState: true });
    }, [filters]);

    const clearFilters = () => {
        setFilters(EMPTY);
        router.get(window.location.pathname, {}, { preserveScroll: true, preserveState: true });
    };

    const total = meta?.total ?? deposits.length;
    const pending = deposits.filter(d => d.status === 'pending').length;
    const approved = deposits.filter(d => d.status === 'approved').length;
    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <UserLayout title={t('Deposit History')}>
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
                            <ArrowDownToLine className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{t('Deposit History')}</h1>
                            <p className="text-xs text-gray-500">{total} {t('total records')}</p>
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
                            <span className="ml-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatCard label={t('Total')} value={String(total)} />
                    <StatCard label={t('Pending')} value={String(pending)} />
                    <StatCard label={t('Approved')} value={String(approved)} />
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card className="bg-white border border-gray-200">
                        <CardContent className="py-4">
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

                <Card className="bg-white border border-gray-200">
                    <CardHeader className="pb-0 pt-4 px-4">
                        <p className="text-xs text-gray-500 uppercase">{t('Deposits')}</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        {deposits.length === 0 ? (
                            <div className="text-center text-sm text-gray-500 py-16">
                                <Receipt className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                {t('No deposits found')}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {deposits.map((dep: any, i: number) => (
                                    <div
                                        key={dep.id ?? i}
                                        className="px-4 py-3.5 hover:bg-gray-50"
                                    >
                                        <div className="flex gap-3">

                                            {/* Icon */}
                                            <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                                                {dep.crypto?.images?.thumb
                                                    ? <img src={dep.crypto.images.thumb} className="w-6 h-6" />
                                                    : <span className="text-xs text-gray-500">
                                                        {dep.crypto?.symbol?.slice(0, 2)}
                                                    </span>
                                                }
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 space-y-1">

                                                {/* Top row */}
                                                <div className="flex items-center justify-between gap-2">

                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="text-sm font-semibold text-gray-900 truncate">
                                                            {dep.crypto?.name ?? '—'}
                                                        </span>

                                                        {dep.network && (
                                                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 ">
                                                                {dep.network}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Amount (always visible now) */}
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {dep.amount}{' '}
                                                            <span className="text-xs text-gray-500">
                                                                {dep.crypto?.symbol}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Meta row */}
                                                <div className="flex items-center justify-between flex-wrap gap-2">

                                                    <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                                                        <span>
                                                            {dep.created_at?.slice(0, 16).replace('T', ' ') ?? '—'}
                                                        </span>

                                                        {dep.reviewed_at && (
                                                            <>
                                                                <span>·</span>
                                                                <span>{t('Reviewed')}: {dep.reviewed_at}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Status */}
                                                    <StatusBadge status={dep.status} />
                                                </div>

                                                {/* Extra info */}
                                                {(dep.usd_amount || dep.fee_charged) && (
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        {dep.usd_amount && <span>≈ ${dep.usd_amount}</span>}
                                                        {dep.fee_charged && dep.fee_charged !== '0' && (
                                                            <span>{t('Fee')}: {dep.fee_charged}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Voucher */}
                                            {dep.deposit_voucher_file && (
                                                <a
                                                    href={dep.deposit_voucher_file}
                                                    target="_blank"
                                                    className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-700 transition"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card >

                {/* Pagination */}
                < Pagination meta={meta} filters={filters} />

            </div >
        </UserLayout >
    );
}