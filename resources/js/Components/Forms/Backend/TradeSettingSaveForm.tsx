// resources/js/Components/Forms/Backend/TradeSetting/TradeSettingSaveForm.tsx

import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/Components/UI/Card';
import { Form } from '@/Components/UI/Form';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CrudPageProps } from '@/Types/crud';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calculator,
    Clock,
    Layers,
    Percent,
    Plus,
    Save,
    Settings,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────

export const TradeSettingSaveForm: React.FC<CrudPageProps> = (props) => {
    const { config, item: settingProp = null } = props;


    let site_theme_settings = props?.site_theme_settings;

    let default_currency = props?.default_currency;




    const isUpdate = !!settingProp;
    const setting = settingProp?.data || {};
    const { t } = useTranslations();

    // Split fields by section — mirrors CryptoSaveForm
    const basicFields = config?.form?.fields.filter((f: any) => f.section === 'basic');
    const winFields = config?.form?.fields.filter((f: any) => f.section === 'win');
    const limitFields = config?.form?.fields.filter((f: any) => f.section === 'limits');

    // ── Amount presets state ──────────────────────────────────────────────────
    // Managed outside react-hook-form so we can have a dynamic list UI
    const [presets, setPresets] = useState<number[]>(
        Array.isArray(setting.amount_presets) ? setting.amount_presets : [10, 100, 1000, 10000]
    );
    const [presetInput, setPresetInput] = useState('');
    const [presetError, setPresetError] = useState('');

    // ── Form setup — mirrors CryptoSaveForm exactly ───────────────────────────
    const schema = z.object(config?.formValidationRules);
    type FormType = z.infer<typeof schema>;

    const defaultValues: FormType = {
        crypto_id: String(setting.crypto_id || ''),
        label: setting.label || '',
        duration_seconds: setting.duration_seconds ?? 30,
        status: setting?.status || 'active',
        win_pct_option_a: setting.win_pct_option_a ?? 85,
        win_pct_option_b: setting.win_pct_option_b ?? 80,
        win_pct_option_c: setting.win_pct_option_c ?? 75,
        display_yield_pct: setting.display_yield_pct ?? 85,
        min_trade_amount: setting.min_trade_amount ?? 10,
        max_trade_amount: setting.max_trade_amount ?? 100000,
        amount_presets: presets,
    };

    const form = useForm<FormType>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    useEffect(() => {
        if (setting && isUpdate) {
            form.reset(defaultValues);
            if (Array.isArray(setting.amount_presets)) {
                setPresets(setting.amount_presets);
            }
        }
    }, [isUpdate]);

    // Keep amount_presets field in sync with local state
    useEffect(() => {
        form.setValue('amount_presets', presets);
    }, [presets]);

    const { create, update, isSubmitting, errors: serverErrors } = useCrudManager({
        config,
        onSuccess: (action) => {
            if (action === 'create') {
                form.reset({
                    crypto_id: '', label: '', duration_seconds: 30, is_active: '1',
                    win_pct_option_a: 85, win_pct_option_b: 80, win_pct_option_c: 75,
                    display_yield_pct: 85, min_trade_amount: 10, max_trade_amount: 100000,
                    amount_presets: [10, 100, 1000, 10000],
                });
                setPresets([10, 100, 1000, 10000]);
                setPresetInput('');
                form.clearErrors();
            }
        },
    });

    const onSubmit = (data: FormType) => {
        const payload = { ...data, amount_presets: presets };
        isUpdate
            ? update(setting?.uuid || setting?.id, payload)
            : create(payload);
    };

    // ── Preset management ─────────────────────────────────────────────────────
    const addPreset = () => {
        const val = Number(presetInput);
        if (!presetInput || isNaN(val) || val <= 0) {
            setPresetError(t('Enter a valid positive number'));
            return;
        }
        if (presets.includes(val)) {
            setPresetError(t('This amount is already in the list'));
            return;
        }
        setPresets(prev => [...prev, val].sort((a, b) => a - b));
        setPresetInput('');
        setPresetError('');
    };

    const removePreset = (val: number) => {
        setPresets(prev => prev.filter(p => p !== val));
    };

    const handlePresetKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); addPreset(); }
    };

    // ── Watch duration for quick-fill helper ──────────────────────────────────
    const watchedDuration = form.watch('duration_seconds');
    const quickDurations = [20, 30, 60, 90, 120, 180, 300];

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* ── Basic Information ─────────────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-blue-500" />
                            <CardTitle>{t('Basic Information')}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {basicFields?.map((field: any, index: number) => (
                                <div key={field.name || index} className={getGridColSpan(field.gridColumn)}>
                                    <DynamicInputWrapper
                                        field={field}
                                        form={form}
                                        isSubmitting={isSubmitting}
                                        serverErrors={serverErrors}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* ── Quick duration picker ── */}
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                                {t('Quick Duration Presets')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {quickDurations.map(d => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => {
                                            form.setValue('duration_seconds', d);
                                            // auto-fill label if empty
                                            const currentLabel = form.getValues('label');
                                            if (!currentLabel) {
                                                form.setValue('label', d < 60 ? `${d}s` : `${d / 60}m`);
                                            }
                                        }}
                                        className={`
                                            flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm  font-semibold transition-colors
                                            ${Number(watchedDuration) === d
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:border-primary/50 hover:bg-muted'
                                            }
                                        `}
                                    >
                                        <Clock className="w-3.5 h-3.5" />
                                        {d < 60 ? `${d}s` : `${d / 60}m`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Win Percentages ───────────────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Percent className="w-5 h-5 text-green-500" />
                            <CardTitle>{t('Win Percentages')}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('Option A is used by default. Options B and C are used when admin overrides are applied to specific users.')}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {winFields?.map((field: any, index: number) => (
                                <div key={field.name || index} className={getGridColSpan(field.gridColumn)}>
                                    <DynamicInputWrapper
                                        field={field}
                                        form={form}
                                        isSubmitting={isSubmitting}
                                        serverErrors={serverErrors}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* ── Live preview ── */}
                        <WinPercentPreview form={form} t={t} default_currency={default_currency} />
                    </CardContent>
                </Card>

                {/* ── Amount Limits ─────────────────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-orange-500" />
                            <CardTitle>{t('Amount Limits')}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {limitFields?.map((field: any, index: number) => (
                                <div key={field.name || index} className={getGridColSpan(field.gridColumn)}>
                                    <DynamicInputWrapper
                                        field={field}
                                        form={form}
                                        isSubmitting={isSubmitting}
                                        serverErrors={serverErrors}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* ── Amount Presets ────────────────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-purple-500" />
                            <CardTitle>{t('Amount Preset Buttons')}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('These appear as quick-pick buttons on the trade page. Users tap them to auto-fill the trade amount.')}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {/* Current presets */}
                        {presets.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {presets.map(p => (
                                    <div key={p} className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-muted rounded-md border group">
                                        <span className=" text-sm font-semibold">
                                            {p.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-muted-foreground">USDT</span>
                                        <button
                                            type="button"
                                            onClick={() => removePreset(p)}
                                            className="ml-1 p-0.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                {t('No presets added yet. Add at least one preset button below.')}
                            </p>
                        )}

                        {/* Add preset input */}
                        <div className="flex gap-2">
                            <div className="relative flex-1 max-w-xs">
                                <input
                                    type="number"
                                    value={presetInput}
                                    onChange={e => { setPresetInput(e.target.value); setPresetError(''); }}
                                    onKeyDown={handlePresetKeyDown}
                                    placeholder={t('e.g. 500')}
                                    min={1}
                                    className="w-full px-3 py-2 text-sm border rounded-md bg-background outline-none focus:ring-2 focus:ring-ring pr-16"
                                    disabled={isSubmitting}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs  text-muted-foreground">
                                    USDT
                                </span>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addPreset}
                                disabled={isSubmitting || !presetInput}
                                className="gap-1.5"
                            >
                                <Plus className="w-4 h-4" />
                                {t('Add')}
                            </Button>
                        </div>

                        {presetError && (
                            <p className="text-sm text-destructive">{presetError}</p>
                        )}

                        {/* Quick bulk presets */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">{t('Quick add:')}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {[10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000].map(quick => (
                                    <button
                                        key={quick}
                                        type="button"
                                        onClick={() => {
                                            if (!presets.includes(quick)) {
                                                setPresets(prev => [...prev, quick].sort((a, b) => a - b));
                                            }
                                        }}
                                        disabled={presets.includes(quick)}
                                        className={`
                                            px-2.5 py-1 rounded text-xs  font-medium border transition-colors
                                            ${presets.includes(quick)
                                                ? 'opacity-40 cursor-not-allowed border-border bg-muted'
                                                : 'border-border hover:border-primary hover:bg-primary/5 cursor-pointer'
                                            }
                                        `}
                                    >
                                        {quick >= 1000 ? `${quick / 1000}K` : quick}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Sticky submit bar — mirrors CryptoSaveForm ─────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        <ButtonLoader
                            isSubmitting={isSubmitting}
                            btnText={isUpdate ? t('Update Setting') : t('Create Setting')}
                            loaderText={isUpdate ? t('Updating…') : t('Creating…')}
                            icon={<Save className="w-4 h-4" />}
                        />
                    </Button>
                    <Button
                        type="button"
                        className="w-full sm:w-auto"
                        variant="outline"
                        onClick={() => router.visit(route(config.routes.index))}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('Back')}
                    </Button>
                </div>

            </form>
        </Form>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Win % live preview sub-component
// ─────────────────────────────────────────────────────────────────────────────

function WinPercentPreview({ form, t, default_currency }: { form: any; t: (s: string) => string, default_currency: string }) {
    const a = Number(form.watch('win_pct_option_a') || 0);
    const b = Number(form.watch('win_pct_option_b') || 0);
    const c = Number(form.watch('win_pct_option_c') || 0);
    const d = Number(form.watch('display_yield_pct') || 0);
    const exampleAmount = 1000;

    return (
        <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{t('Payout Preview')} — {t('example')}: {exampleAmount.toLocaleString()} USDT</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: t('Option A'), pct: a, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800' },
                    { label: t('Option B'), pct: b, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800' },
                    { label: t('Option C'), pct: c, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800' },
                    { label: t('Display'), pct: d, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800' },
                ].map(({ label, pct, color, bg, border }) => (
                    <div key={label} className={`rounded-md border p-3 ${bg} ${border}`}>
                        <div className={`text-xs font-medium mb-1 ${color}`}>{label}</div>
                        <div className={`text-lg font-bold  ${color}`}>{pct.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            +{((exampleAmount * pct) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })} {default_currency}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TradeSettingSaveForm;
