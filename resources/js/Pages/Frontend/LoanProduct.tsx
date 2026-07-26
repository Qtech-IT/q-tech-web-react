import { Button } from "@/Components/UI/Button";
import { useTranslations } from "@/Hooks/useTranslations";
import UserLayout from "@/Layouts/FrontendLayout";
import { useForm } from "@inertiajs/react";
import {
    Building2,
    Calendar,
    Camera,
    CheckCircle2,
    CreditCard,
    Landmark,
    Minus,
    Percent,
    Plus,
    RotateCcw,
    Upload,
} from "lucide-react";
import { useRef, useState } from "react";

/* ─────────────────── image upload slot ──────────────────── */

function ImageUploadSlot({ label, value, onChange, error }: {
    label: string; value: File | null;
    onChange: (file: File | null) => void; error?: string | undefined;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (file: File | null) => {
        onChange(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <div className="flex flex-col items-center gap-1.5">
            <input ref={inputRef} type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <button type="button" onClick={() => inputRef.current?.click()}
                className={`w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition overflow-hidden ${error ? "border-rose-300 bg-rose-50"
                    : preview ? "border-emerald-300 bg-emerald-50"
                        : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
            >
                {preview ? (
                    <img src={preview} alt={label} className="w-full h-full object-cover" />
                ) : (
                    <Camera className={`w-5 h-5 ${error ? "text-rose-300" : "text-gray-300"}`} />
                )}
            </button>

            {preview && (
                <button type="button" onClick={() => handleFile(null)}
                    className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-rose-500 transition">
                    <RotateCcw className="w-2.5 h-2.5" />
                    {/* Change */}
                </button>
            )}

            <p className={`text-[11px] text-center leading-tight ${error ? "text-rose-500" : "text-gray-500"}`}>
                {label}
            </p>
            {error && <p className="text-[10px] text-rose-500 text-center">{error}</p>}
        </div>
    );
}

/* ─────────────────── info row ──────────────────── */

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
                <span className="text-gray-400 shrink-0">{icon}</span>
                <span className="whitespace-nowrap">{label}</span>
            </div>
            <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
        </div>
    );
}

/* ─────────────────────── main page ──────────────────────── */

export default function LoanProduct({ title, loanProduct }: any) {
    const { t } = useTranslations();
    const p = loanProduct?.data;

    const { data, setData, post, processing, errors } = useForm<{
        loan_product_id: number;
        amount: number;
        id_front: File | null;
        id_back: File | null;
        id_with_holder: File | null;
    }>({
        loan_product_id: p.id,
        amount: Number(p.minimum_amount) || 100,
        id_front: null,
        id_back: null,
        id_with_holder: null,
    });

    const minAmount = Number(p.minimum_amount) || 0;
    const maxAmount = Number(p.maximum_amount) || 999999;
    const step = minAmount >= 1000 ? 100 : 10;

    const adjustAmount = (delta: number) => {
        setData("amount", Math.min(maxAmount, Math.max(minAmount, data.amount + delta)));
    };

    const handleSubmit = () => {
        post(route("user.loan.request"), { forceFormData: true });
    };

    return (
        <UserLayout title={title}>
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen">

                {/* ── Header ── */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                        <Landmark className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl font-bold text-gray-900 truncate">{t("Apply for Loan")}</h1>
                        <p className="text-xs text-gray-500 truncate">{p.name}</p>
                    </div>
                </div>

                {/* ── Product details card ── */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {/* Card header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                            <Landmark className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                            <p className="text-xs text-gray-400 truncate">{p.institution}</p>
                        </div>
                    </div>
                    {/* Info rows */}
                    <div className="px-4">
                        <InfoRow icon={<Building2 className="w-3.5 h-3.5" />} label={t("Lending Institution")} value={p.institution} />
                        <InfoRow icon={<Percent className="w-3.5 h-3.5" />} label={t("Daily Interest Rate")} value={`${p.daily_interest_rate}%`} />
                        <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label={t("Repayment Period")} value={`${p.repayment_period} ${t("Day")}`} />
                        <InfoRow icon={<CreditCard className="w-3.5 h-3.5" />} label={t("Amount")} value={`${p.formatted_minimum_amount} – ${p.formatted_maximum_amount}`} />
                        <InfoRow icon={<RotateCcw className="w-3.5 h-3.5" />} label={t("Repayment Method")} value={p.repayment_method ?? t("One-time")} />
                    </div>
                </div>

                {/* ── Amount stepper ── */}
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <p className="text-sm text-gray-600 shrink-0">{t("Expected Loan Amount")}</p>
                        <div className="flex items-center gap-2 ml-auto">
                            <button type="button" onClick={() => adjustAmount(-step)} disabled={data.amount <= minAmount}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition shrink-0">
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input type="number" value={data.amount}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    if (!isNaN(v)) setData("amount", Math.min(maxAmount, Math.max(minAmount, v)));
                                }}
                                className="w-24 text-center text-base font-bold text-gray-900 border-b border-gray-200 focus:outline-none focus:border-blue-400 bg-transparent pb-0.5"
                            />
                            <button type="button" onClick={() => adjustAmount(step)} disabled={data.amount >= maxAmount}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition shrink-0">
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    {errors.amount && <p className="text-xs text-rose-500 mt-2">{errors.amount}</p>}
                </div>

                {/* ── ID upload ── */}
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                        <Upload className="w-4 h-4 text-gray-400 shrink-0" />
                        <p className="text-sm text-gray-600">
                            {t("Credit lending")}
                            <span className="text-xs text-gray-400 ml-1">({t("ensure images are clear")})</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <ImageUploadSlot label={t("Upload ID front")} value={data.id_front}
                            onChange={(f) => setData("id_front", f)} error={errors.id_front} />
                        <ImageUploadSlot label={t("Upload ID back")} value={data.id_back}
                            onChange={(f) => setData("id_back", f)} error={errors.id_back} />
                        <ImageUploadSlot label={t("Upload ID with holder")} value={data.id_with_holder}
                            onChange={(f) => setData("id_with_holder", f)} error={errors.id_with_holder} />
                    </div>
                </div>

                {/* ── Submit ── */}
                <Button onClick={handleSubmit} disabled={processing}
                    className="w-full h-11 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-200 disabled:opacity-60">
                    {processing ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            {t("Submitting...")}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            {t("Apply for Loan")}
                        </span>
                    )}
                </Button>

            </div>
        </UserLayout>
    );
}