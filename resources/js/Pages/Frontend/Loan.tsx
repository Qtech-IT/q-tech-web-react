import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader } from "@/Components/UI/Card";
import { useTranslations } from "@/Hooks/useTranslations";
import UserLayout from "@/Layouts/FrontendLayout";
import { router, useForm } from "@inertiajs/react";
import {
    BadgeCheck,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    ExternalLink,
    Eye,
    Filter,
    Landmark,
    Percent,
    Trash2,
    TrendingUp,
    X,
    XCircle,
} from "lucide-react";
import { useCallback, useState } from "react";

/* ─────────────────────────── badges ──────────────────────── */

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { cls: string; icon: React.ReactNode }> = {
        pending: { cls: "bg-amber-100 text-amber-700 border-amber-300", icon: <Clock className="w-3 h-3" /> },
        approved: { cls: "bg-emerald-100 text-emerald-700 border-emerald-300", icon: <CheckCircle2 className="w-3 h-3" /> },
        rejected: { cls: "bg-rose-100 text-rose-700 border-rose-300", icon: <XCircle className="w-3 h-3" /> },
    };
    const s: any = map[status] ?? map.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${s.cls}`}>
            {s.icon}{status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl p-4 flex flex-col gap-1 border bg-white border-zinc-200 text-zinc-900">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}

/* ─────────────────── date-range picker ───────────────────── */

function DateRangePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const toInputDate = (s: string) => { if (!s) return ""; const [m, d, y] = s.split("/"); return `${y}-${m}-${d}`; };
    const toDisplay = (s: string) => { if (!s) return ""; const [y, m, d] = s.split("-"); return `${m}/${d}/${y}`; };
    const parts = value?.split(" - ") ?? [];
    const fromRaw = parts[0] ?? "", toRaw = parts[1] ?? "";
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 w-full sm:w-auto">
            <input type="date" value={toInputDate(fromRaw)}
                onChange={e => { const f = toDisplay(e.target.value); onChange(f && toRaw ? `${f} - ${toRaw}` : f); }}
                className="h-8 w-full sm:w-auto px-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-500"
            />
            <span className="text-gray-400 text-xs hidden sm:block">—</span>
            <input type="date" value={toInputDate(toRaw)}
                onChange={e => { const t2 = toDisplay(e.target.value); onChange(fromRaw && t2 ? `${fromRaw} - ${t2}` : t2); }}
                className="h-8 w-full sm:w-auto px-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-500"
            />
        </div>
    );
}

/* ─────────────────────── filter bar ─────────────────────── */

type FilterState = { status: string; date_range: string };
const EMPTY: FilterState = { status: "", date_range: "" };

function FilterBar({ options, filters, onChange, onApply, onClear }: {
    options: any[]; filters: FilterState;
    onChange: (k: string, v: string) => void; onApply: () => void; onClear: () => void;
}) {
    const { t } = useTranslations();
    return (
        <div className="flex flex-wrap items-end gap-3 overflow-x-auto sm:overflow-visible pb-3">
            {options.map((opt: any) => {
                if (opt.type === "select") return (
                    <div key={opt.key} className="flex flex-col gap-1 min-w-[180px] sm:min-w-0">
                        <label className="text-[11px] text-gray-500 uppercase tracking-wider">{opt.label}</label>
                        <select value={(filters as any)[opt.key] ?? ""} onChange={e => onChange(opt.key, e.target.value)}
                            className="h-8 px-3 rounded-lg bg-white border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-500 cursor-pointer">
                            {opt.options?.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                );
                if (opt.type === "daterange") return (
                    <div key={opt.key} className="flex flex-col gap-1 min-w-[220px] sm:min-w-0">
                        <label className="text-[11px] text-gray-500 uppercase tracking-wider">{opt.label}</label>
                        <DateRangePicker value={(filters as any)[opt.key] ?? ""} onChange={v => onChange(opt.key, v)} />
                    </div>
                );
                return null;
            })}
            <Button size="sm" onClick={onApply} className="h-8 bg-blue-600 hover:bg-blue-500 text-white">{t("Apply")}</Button>
            {Object.values(filters).some(Boolean) && (
                <Button variant="ghost" size="sm" onClick={onClear} className="h-8 px-2 text-gray-500 hover:text-black">
                    <X className="w-3.5 h-3.5 mr-1" />{t("Clear")}
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
    const pages: (number | "...")[] = [];
    if (last <= 7) { for (let i = 1; i <= last; i++) pages.push(i); }
    else {
        pages.push(1); if (cur > 3) pages.push("...");
        for (let i = Math.max(2, cur - 1); i <= Math.min(last - 1, cur + 1); i++) pages.push(i);
        if (cur < last - 2) pages.push("..."); pages.push(last);
    }
    return (
        <div className="flex items-center justify-between px-1">
            <p className="text-xs text-zinc-500">{meta.from}–{meta.to} {t("of")} {meta.total}</p>
            <div className="flex items-center gap-1">
                <button onClick={() => goTo(cur - 1)} disabled={cur === 1}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {pages.map((p, i) => p === "..."
                    ? <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-zinc-600 text-xs">…</span>
                    : <button key={p} onClick={() => goTo(p as number)}
                        className={`w-7 h-7 rounded-md text-xs font-medium transition ${p === cur ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}>
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

/* ─────────────────────── loan detail modal ─────────────────────── */

function LoanDetailModal({ order, onClose }: { order: any; onClose: () => void }) {
    const { t } = useTranslations();
    const p = order.loanProduct;

    // image keys coming from LoanRequestResource
    const IMAGE_KEYS = ["id_front", "id_back", "id_with_holder"] as const;
    const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;

    const fmtKey = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">

                {/* ── Modal header ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0">
                            <BadgeCheck className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{t("Loan Request")}</p>
                            <p className="text-xs text-gray-500">#{order.order_id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} />
                        <button onClick={onClose}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Modal body ── */}
                <div className="px-5 py-4 space-y-3 max-h-[65vh] overflow-y-auto">

                    {/* Note */}
                    {order.note && (
                        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2">
                            <p className="text-xs text-yellow-600 font-medium mb-0.5">{t("Note")}</p>
                            <p className="text-sm text-gray-700">{order.note}</p>
                        </div>
                    )}

                    {/* ── Loan info ── */}
                    <div className="rounded-lg bg-gray-50 border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                        {[
                            { key: "order_id", label: t("Order ID"), value: `#${order.order_id}` },
                            { key: "amount", label: t("Amount"), value: order.amount },
                            { key: "status", label: t("Status"), value: order.status },
                            { key: "created_at", label: t("Date"), value: order.created_at },
                        ].map(row => (
                            <div key={row.key} className="flex items-center justify-between px-4 py-2.5 gap-3">
                                <p className="text-xs text-gray-500 shrink-0">{row.label}</p>
                                {row.key === "status"
                                    ? <StatusBadge status={row.value} />
                                    : <p className="text-sm font-medium text-gray-900 text-right">{row.value}</p>
                                }
                            </div>
                        ))}
                    </div>

                    {/* ── Loan product info ── */}
                    {p && (
                        <div className="rounded-lg bg-gray-50 border border-gray-200 overflow-hidden">
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider px-4 pt-3 pb-2">
                                {t("Loan Product")}
                            </p>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { label: t("Name"), value: p.name },
                                    { label: t("Institution"), value: p.institution },
                                    { label: t("Daily Interest Rate"), value: `${p.daily_interest_rate}%` },
                                    { label: t("Repayment Period"), value: `${p.repayment_period} ${t("Day")}` },
                                    { label: t("Amount Range"), value: `${p.formatted_minimum_amount} – ${p.formatted_maximum_amount}` },
                                    { label: t("Repayment Method"), value: p.repayment_method ?? t("One-time") },
                                ].map(row => (
                                    <div key={row.label} className="flex items-center justify-between px-4 py-2.5 gap-3">
                                        <p className="text-xs text-gray-500 shrink-0 whitespace-nowrap">{row.label}</p>
                                        <p className="text-sm font-medium text-gray-900 text-right">{row.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── ID images ── */}
                    {IMAGE_KEYS.some(k => order[k]) && (
                        <div className="space-y-2">
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider">{t("ID Documents")}</p>
                            <div className="grid grid-cols-1 gap-3">
                                {IMAGE_KEYS.filter(k => order[k]).map(k => (
                                    <div key={k} className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">
                                            {fmtKey(k)}
                                        </p>
                                        <div className="space-y-2">
                                            <img
                                                src={order[k]}
                                                alt={k}
                                                className="w-full max-h-48 object-contain rounded-lg border border-gray-200 bg-white"
                                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                                            />
                                            <a href={order[k]} target="_blank" rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500">
                                                <ExternalLink className="w-3 h-3" />
                                                {t("Open original")}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Modal footer ── */}
                <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
                    <Button variant="outline" size="sm" onClick={onClose}
                        className="border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                        {t("Close")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────── loan product row ──────────────────── */

function LoanProductRow({ product }: { product: any }) {
    const { t } = useTranslations();
    return (
        <div className="px-4 py-3.5 hover:bg-gray-50">
            <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                    <Landmark className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{product.institution}</p>
                        </div>
                        <Button size="sm"
                            onClick={() => router.visit(route("user.loan.product", product.id))}
                            className="shrink-0 h-7 px-3 bg-emerald-500 hover:bg-emerald-400 text-white text-[11px] font-medium rounded-lg whitespace-nowrap">
                            {t("Apply for Loan")}
                        </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-gray-400 shrink-0" />
                            {product.formatted_minimum_amount} – {product.formatted_maximum_amount}
                        </span>
                        <span className="flex items-center gap-1">
                            <Percent className="w-3 h-3 text-gray-400 shrink-0" />
                            {product.daily_interest_rate}% {t("Daily")}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                            {product.repayment_period} {t("Day")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────── loan order row ──────────────────── */

function LoanOrderRow({ order, onView }: { order: any; onView: () => void }) {
    const { t } = useTranslations();
    const { processing, delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm(t("Are you sure you want to delete this loan request?"))) {
            destroy(route("user.loan.request.destroy", order.id), { preserveScroll: true });
        }
    };

    return (
        <div className="px-4 py-3.5 hover:bg-gray-50 transition">
            <div className="flex gap-3">
                {/* Icon */}
                <div className="w-9 h-9 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-4 h-4 text-violet-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {order.loanProduct?.name ?? t("Loan Request")}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">#{order.order_id}</p>
                        </div>
                        <div className="shrink-0">
                            <StatusBadge status={order.status} />
                        </div>
                    </div>

                    {/* Meta row: amount · date · actions */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="text-sm font-bold text-gray-900">{order.amount}</span>
                            <span>·</span>
                            <span>{order.created_at}</span>
                        </div>

                        {/* Action buttons — eye + delete (same as KYC log pattern) */}
                        <div className="flex items-center gap-1">
                            {/* View details */}
                            <button onClick={onView}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition"
                                title={t("View Details")}>
                                <Eye className="w-4 h-4" />
                            </button>

                            {/* Delete (pending only) */}
                            {order.status === "pending" && (
                                <button onClick={handleDelete} disabled={processing}
                                    className="w-7 h-7 rounded-md flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                                    title={t("Delete")}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Note pill */}
                    {order.note && (
                        <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-1.5">
                            <p className="text-xs text-amber-700">{order.note}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────── main page ──────────────────────── */

export default function Loan({ title, loanProducts, loanRequest, advanceFilterOptions = [] }: any) {
    const { t } = useTranslations();

    const products: any[] = loanProducts?.data ?? loanProducts ?? [];
    const orders: any[] = loanRequest?.data?.data ?? loanRequest?.data ?? [];
    const meta = loanRequest?.data?.meta ?? loanRequest?.meta ?? {};

    const [tab, setTab] = useState<"products" | "orders">("products");
    const [showFilters, setShowFilters] = useState(false);
    const [viewOrder, setViewOrder] = useState<any | null>(null);

    const urlParams = new URLSearchParams(window.location.search);
    const [filters, setFilters] = useState<FilterState>({
        status: urlParams.get("status") ?? "",
        date_range: urlParams.get("date_range") ?? "",
    });

    const applyFilters = useCallback(() => {
        const params: Record<string, any> = { page: 1 };
        (Object.keys(filters) as (keyof FilterState)[]).forEach(k => { if (filters[k]) params[k] = filters[k]; });
        router.get(window.location.pathname, params, { preserveScroll: true, preserveState: true });
    }, [filters]);

    const clearFilters = () => {
        setFilters(EMPTY);
        router.get(window.location.pathname, {}, { preserveScroll: true, preserveState: true });
    };

    const total = meta?.total ?? orders.length;
    const pending = orders.filter((o: any) => o.status === "pending").length;
    const approved = orders.filter((o: any) => o.status === "approved").length;
    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <UserLayout title={title}>
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
                            <Landmark className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{t("Boost Loan")}</h1>
                            <p className="text-xs text-gray-500">{products.length} {t("products available")}</p>
                        </div>
                    </div>

                    {tab === "orders" && (
                        <Button variant="outline" size="sm" onClick={() => setShowFilters(p => !p)}
                            className="h-8 border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
                            <Filter className="w-3.5 h-3.5 mr-1.5" />
                            {t("Filter")}
                            {activeFilterCount > 0 && (
                                <span className="ml-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    )}
                </div>

                {/* ── Tabs ── */}
                <div className="flex border-b border-gray-200">
                    {([
                        { key: "orders", label: t("Loan Orders") },
                        { key: "products", label: t("Loan Products") },
                    ] as const).map(({ key, label }) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition ${tab === key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* ── Stats (orders tab) ── */}
                {tab === "orders" && (
                    <div className="grid grid-cols-3 gap-3">
                        <StatCard label={t("Total")} value={String(total)} />
                        <StatCard label={t("Pending")} value={String(pending)} />
                        <StatCard label={t("Approved")} value={String(approved)} />
                    </div>
                )}

                {/* ── Filters ── */}
                {tab === "orders" && showFilters && (
                    <Card className="bg-white border border-gray-200">
                        <CardContent className="py-4">
                            <FilterBar options={advanceFilterOptions} filters={filters}
                                onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
                                onApply={applyFilters} onClear={clearFilters} />
                        </CardContent>
                    </Card>
                )}

                {/* ── Products Tab ── */}
                {tab === "products" && (
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-0 pt-4 px-4">
                            <p className="text-xs text-gray-500 uppercase">{t("Products")}</p>
                        </CardHeader>
                        <CardContent className="p-0">
                            {products.length === 0 ? (
                                <div className="text-center text-sm text-gray-500 py-16">
                                    <Landmark className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    {t("No loan products available")}
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {products.map((p: any) => <LoanProductRow key={p.id} product={p} />)}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* ── Orders Tab ── */}
                {tab === "orders" && (
                    <>
                        <Card className="bg-white border border-gray-200">
                            <CardHeader className="pb-0 pt-4 px-4">
                                <p className="text-xs text-gray-500 uppercase">{t("Orders")}</p>
                            </CardHeader>
                            <CardContent className="p-0">
                                {orders.length === 0 ? (
                                    <div className="text-center text-sm text-gray-500 py-16">
                                        <BadgeCheck className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                        {t("No loan requests found")}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200">
                                        {orders.map((o: any) => (
                                            <LoanOrderRow key={o.id} order={o} onView={() => setViewOrder(o)} />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Pagination meta={meta} filters={filters} />
                    </>
                )}

            </div>

            {/* ── Loan detail modal ── */}
            {viewOrder && <LoanDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}

        </UserLayout>
    );
}