import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader } from "@/Components/UI/Card";
import { useTranslations } from "@/Hooks/useTranslations";
import UserLayout from "@/Layouts/FrontendLayout";
import { keyToValue } from "@/Utils/helpers";
import { router } from "@inertiajs/react";
import {
    BadgeCheck,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    ExternalLink,
    Eye,
    FileText,
    Filter,
    ShieldCheck,
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
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${s.cls}`}>
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

type FilterState = { status: string; date_range: string };
const EMPTY: FilterState = { status: '', date_range: '' };

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

function Pagination({ meta, filters }: { meta: any; filters: FilterState }) {
    const { t } = useTranslations();
    if (!meta || meta.last_page <= 1) return null;
    const goTo = (page: number) => {
        const params: Record<string, any> = { page };
        (Object.keys(filters) as (keyof FilterState)[]).forEach(k => { if (filters[k]) params[k] = filters[k]; });
        router.get(window.location.pathname, params, { preserveScroll: true, preserveState: true });
    };
    const cur = meta.current_page, last = meta.last_page;
    const pages: (number | '...')[] = [];
    if (last <= 7) { for (let i = 1; i <= last; i++) pages.push(i); }
    else {
        pages.push(1);
        if (cur > 3) pages.push('...');
        for (let i = Math.max(2, cur - 1); i <= Math.min(last - 1, cur + 1); i++) pages.push(i);
        if (cur < last - 2) pages.push('...');
        pages.push(last);
    }
    return (
        <div className="flex items-center justify-between px-1">
            <p className="text-xs text-zinc-500">{meta.from}–{meta.to} {t('of')} {meta.total}</p>
            <div className="flex items-center gap-1">
                <button onClick={() => goTo(cur - 1)} disabled={cur === 1}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {pages.map((p, i) => p === '...'
                    ? <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-zinc-600 text-xs">…</span>
                    : <button key={p} onClick={() => goTo(p as number)}
                        className={`w-7 h-7 rounded-md text-xs font-medium transition ${p === cur ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                        {p}
                    </button>
                )}
                <button onClick={() => goTo(cur + 1)} disabled={cur === last}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────── data modal ─────────────────────── */

const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
const isImageUrl = (v: string) => IMAGE_EXT.test(v);
const isUrl = (v: string) => { try { return Boolean(new URL(v)); } catch { return false; } };

function DataModal({ log, onClose }: { log: any; onClose: () => void }) {
    const { t } = useTranslations();
    const entries: [string, any][] = Object.entries(log.data ?? {});

    const fmtKey = (k: string) =>
        k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={e => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center">
                            <BadgeCheck className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {t('KYC Submission')}
                            </p>
                            <p className="text-xs text-gray-500">{log.created_at}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <StatusBadge status={log.status} />

                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-3 max-h-[65vh] overflow-y-auto">

                    {/* Note */}
                    {log.note && (
                        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2">
                            <p className="text-xs text-yellow-600 font-medium mb-0.5">
                                {t('Note')}
                            </p>
                            <p className="text-sm text-gray-700">{log.note}</p>
                        </div>
                    )}

                    {/* Entries */}
                    {entries.map(([key, val]) => {
                        const strVal = String(val ?? '');
                        const isImg = typeof val === 'string' && isImageUrl(strVal);
                        const isLink = typeof val === 'string' && !isImg && isUrl(strVal);

                        return (
                            <div
                                key={key}
                                className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3"
                            >
                                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5">
                                    {fmtKey(key)}
                                </p>

                                {isImg ? (
                                    /* Image */
                                    <div className="space-y-2">
                                        <img
                                            src={strVal}
                                            alt={key}
                                            className="w-full max-h-48 object-contain rounded-lg border border-gray-200 bg-white"
                                            onError={e => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />

                                        <a
                                            href={strVal}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            {t('Open original')}
                                        </a>
                                    </div>
                                ) : isLink ? (
                                    /* Link */
                                    <a
                                        href={strVal}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-500 break-all"
                                    >
                                        <FileText className="w-4 h-4 shrink-0" />
                                        <span className="truncate">{strVal}</span>
                                        <ExternalLink className="w-3 h-3 shrink-0" />
                                    </a>
                                ) : (
                                    /* Text */
                                    <p className="text-sm text-gray-800 break-words">
                                        {strVal || '—'}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                        {t('Close')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────── main page ──────────────────────── */

export default function KycLog({ data, advanceFilterOptions = [] }: any) {
    const { t } = useTranslations();

    const logs: any[] = data?.data?.data ?? [];
    const meta = data?.data?.meta ?? data?.meta ?? {};

    const urlParams = new URLSearchParams(window.location.search);
    const [filters, setFilters] = useState<FilterState>({
        status: urlParams.get('status') ?? '',
        date_range: urlParams.get('date_range') ?? '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [viewLog, setViewLog] = useState<any | null>(null);

    const applyFilters = useCallback(() => {
        const params: Record<string, any> = { page: 1 };
        (Object.keys(filters) as (keyof FilterState)[]).forEach(k => { if (filters[k]) params[k] = filters[k]; });
        router.get(window.location.pathname, params, { preserveScroll: true, preserveState: true });
    }, [filters]);

    const clearFilters = () => {
        setFilters(EMPTY);
        router.get(window.location.pathname, {}, { preserveScroll: true, preserveState: true });
    };

    const total = meta?.total ?? logs.length;
    const pending = logs.filter(l => l.status === 'pending').length;
    const approved = logs.filter(l => l.status === 'approved').length;
    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <UserLayout title={t('KYC History')}>
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">


                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{t('KYC History')}</h1>
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
                            <span className="ml-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
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


                {/* List */}
                <Card className="bg-white border border-gray-200">
                    <CardHeader className="pb-0 pt-4 px-4">
                        <p className="text-xs text-gray-500 uppercase">
                            {t('Submissions')}
                        </p>
                    </CardHeader>
                    <CardContent className="p-0">
                        {logs.length === 0 ? (
                            <div className="text-center text-sm text-gray-500 py-16">
                                <ShieldCheck className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                {t('No KYC submissions found')}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {logs.map((log: any, i: number) => {

                                    const previewEntries = Object.entries(log.data ?? {})
                                        .filter(([, v]) =>
                                            typeof v === 'string' &&
                                            !IMAGE_EXT.test(String(v)) &&
                                            !isUrl(String(v))
                                        )
                                        .slice(0, 2);

                                    return (
                                        <div
                                            key={log.id ?? i}
                                            className="px-4 py-3.5 hover:bg-gray-50 transition"
                                        >
                                            <div className="flex gap-3 items-start">

                                                {/* Icon (withdrawal style) */}
                                                <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                                                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0 space-y-1">

                                                    {/* Top row (like withdrawal address + amount style) */}
                                                    <div className="flex items-center justify-between gap-2">

                                                        {/* Preview text */}
                                                        <div className="min-w-0 flex items-center gap-2 flex-wrap">
                                                            {previewEntries.length > 0 ? (
                                                                previewEntries.map(([k, v]) => (
                                                                    <span
                                                                        key={k}
                                                                        className="text-sm font-medium text-gray-900 truncate max-w-[160px]"
                                                                    >
                                                                        {String(v)} ||
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-gray-500">
                                                                    #{log.id}
                                                                </span>
                                                            )}



                                                        </div>

                                                        {/* Status (right side like withdrawal amount/status area) */}
                                                        <div className="shrink-0">
                                                            <StatusBadge status={log.status} />
                                                        </div>
                                                    </div>

                                                    {/* Meta row */}
                                                    <div className="flex items-center justify-between flex-wrap gap-2">

                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>{log.created_at}</span>
                                                        </div>

                                                        {/* View button (same feel as withdrawal note action) */}
                                                        <button
                                                            onClick={() => setViewLog(log)}
                                                            className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition"
                                                            title={t('View Details')}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                <Pagination meta={meta} filters={filters} />

            </div>

            {/* Data modal */}
            {viewLog && <DataModal log={viewLog} onClose={() => setViewLog(null)} />}

        </UserLayout>
    );
}