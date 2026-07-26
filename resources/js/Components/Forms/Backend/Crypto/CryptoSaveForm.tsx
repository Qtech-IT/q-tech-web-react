// resources/js/Components/Forms/Backend/Crypto/CryptoSaveForm.tsx

import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/Components/UI/Card';
import {
    Form
} from '@/Components/UI/Form';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CrudPageProps } from '@/Types/crud';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    BadgeDollarSign,
    Coins,
    Loader2,
    RefreshCw,
    Save,
    Search,
    X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface CoinGeckoResult {
    coingecko_id: string;
    name: string;
    symbol: string;
    thumb?: string;
}

interface MarketCoin {
    coingecko_id: string;
    name: string;
    symbol: string;
    logo_url?: string;
    usd_price?: number;
    price_change_24h?: number;
    market_cap_usd?: number;
    already_imported: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const CryptoSaveForm: React.FC<CrudPageProps> = (props) => {
    const { config, item: cryptoProp = null } = props;

    const isUpdate = !!cryptoProp;
    const crypto = cryptoProp?.data || {};
    const { t } = useTranslations();

    // Split form fields by section (mirrors UserSaveForm pattern)
    const basicFields = config?.form?.fields.filter((f: any) => f.section === 'basic');
    const feeFields = config?.form?.fields.filter((f: any) => f.section === 'fees');
    const logoFields = config?.form?.fields.filter((f: any) => f.section === 'logo');

    // ── CoinGecko search state ──────────────────────────────────────────────
    const [cgQuery, setCgQuery] = useState('');
    const [cgResults, setCgResults] = useState<CoinGeckoResult[]>([]);
    const [cgLoading, setCgLoading] = useState(false);
    const [cgOpen, setCgOpen] = useState(false);
    const [marketCoins, setMarketCoins] = useState<MarketCoin[]>([]);
    const [marketLoading, setMarketLoading] = useState(false);
    const [marketOpen, setMarketOpen] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [syncMsg, setSyncMsg] = useState<string | null>(null);
    const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ── Form setup (mirrors UserSaveForm exactly) ────────────────────────────
    const cryptoSchema = z.object(config?.formValidationRules);
    type CryptoFormType = z.infer<typeof cryptoSchema>;

    const defaultValues: CryptoFormType = {
        name: crypto.name || '',
        symbol: crypto.symbol || '',
        coingecko_id: crypto.coingecko_id || '',
        binance_symbol: crypto.binance_symbol || '',
        status: crypto.status || 'inactive',
        sort_order: crypto.sort_order ?? 0,
        logo: null,
    };

    const form = useForm<CryptoFormType>({
        resolver: zodResolver(cryptoSchema),
        defaultValues,
    });

    useEffect(() => {
        if (crypto && isUpdate) {
            form.reset(defaultValues);
        }
    }, [isUpdate]);

    const { create, update, isSubmitting, errors: serverErrors } = useCrudManager({
        config,
        onSuccess: (action) => {
            if (action === 'create') {
                form.reset({
                    name: '', symbol: '', coingecko_id: '', binance_symbol: '',
                    status: 'inactive', sort_order: 0,
                    deposit_fee_pct: 1, withdraw_fee_pct: 1,
                    min_deposit: 10, min_withdraw: 10, max_withdraw: null,
                    confirmations_required: 1, logo: null,
                });
                document.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach(i => { if (i) i.value = ''; });
                form.clearErrors();
                setSyncMsg(null);
            }
        },
    });

    const onSubmit = (data: CryptoFormType) => {
        // uppercase symbol automatically
        const payload = { ...data, symbol: (data.symbol as string).toUpperCase() };
        isUpdate ? update(crypto?.uuid || crypto?.id, payload) : create(payload);
    };

    // ── CoinGecko search ────────────────────────────────────────────────────
    const handleSearchInput = (value: string) => {
        setCgQuery(value);
        if (searchDebounce.current) clearTimeout(searchDebounce.current);
        if (!value.trim()) { setCgResults([]); setCgOpen(false); return; }
        searchDebounce.current = setTimeout(async () => {
            setCgLoading(true);
            try {
                const res = await axios.get(route('backend.crypto-currencies.search.coin'), { params: { q: value } });
                setCgResults(res.data || []);
                setCgOpen(true);
            } catch { setCgResults([]); }
            finally { setCgLoading(false); }
        }, 400);
    };

    const applySearchResult = (coin: CoinGeckoResult) => {
        form.setValue('coingecko_id', coin.coingecko_id);
        form.setValue('name', coin.name);
        form.setValue('symbol', coin.symbol.toUpperCase());
        form.setValue('binance_symbol', coin.symbol.toUpperCase() + 'USDT');
        setCgOpen(false);
        setCgQuery('');
        setCgResults([]);
    };

    // ── Market list ─────────────────────────────────────────────────────────
    const loadMarketList = async () => {
        setMarketLoading(true);
        setMarketOpen(true);
        try {
            const res = await axios.get(route('backend.crypto-currencies.get.market'));
            setMarketCoins(res.data || []);
        } catch { setMarketCoins([]); }
        finally { setMarketLoading(false); }
    };

    const applyMarketCoin = (coin: MarketCoin) => {
        if (coin.already_imported) return;
        form.setValue('coingecko_id', coin.coingecko_id);
        form.setValue('name', coin.name);
        form.setValue('symbol', coin.symbol.toUpperCase());
        form.setValue('binance_symbol', coin.symbol.toUpperCase() + 'USDT');
        setMarketOpen(false);
    };

    // ── Sync price now (edit mode only) ─────────────────────────────────────
    const syncPriceNow = async () => {
        if (!isUpdate || !crypto?.id) return;
        setSyncLoading(true);
        setSyncMsg(null);
        try {
            // calls CoinSyncService::syncOne via a dedicated route (add if needed)
            // for now just refreshes the page data
            router.reload({ only: ['item'] });
            setSyncMsg(t('Price synced successfully.'));
        } catch {
            setSyncMsg(t('Sync failed. Check CoinGecko ID.'));
        } finally {
            setSyncLoading(false);
        }
    };

    // Close search dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setCgOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* ── CoinGecko Search card ───────────────────────────────────────── */}
                <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Search className="w-5 h-5 text-blue-500" />
                            <CardTitle className="text-base">{t('Search CoinGecko')}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('Search to auto-fill coin name, symbol, and ID. Or browse top coins by market cap.')}
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {/* Search input with dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={cgQuery}
                                        onChange={e => handleSearchInput(e.target.value)}
                                        placeholder={t('Type coin name or symbol…')}
                                        className="w-full pl-9 pr-9 py-2 text-sm border rounded-md bg-background outline-none focus:ring-2 focus:ring-ring"
                                    />
                                    {cgLoading && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                                    )}
                                    {cgQuery && !cgLoading && (
                                        <button
                                            type="button"
                                            onClick={() => { setCgQuery(''); setCgResults([]); setCgOpen(false); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={loadMarketList}
                                    disabled={marketLoading}
                                    className="gap-1 whitespace-nowrap"
                                >
                                    {marketLoading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <BadgeDollarSign className="w-4 h-4" />
                                    }
                                    {t('Top Coins')}
                                </Button>
                            </div>

                            {/* Search results dropdown */}
                            {cgOpen && cgResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-y-auto">
                                    {cgResults.map(coin => (
                                        <button
                                            key={coin.coingecko_id}
                                            type="button"
                                            onClick={() => applySearchResult(coin)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted transition-colors"
                                        >
                                            {coin.thumb
                                                ? <img src={coin.thumb} alt={coin.name} className="w-6 h-6 rounded-full object-cover" />
                                                : <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"><Coins className="w-3 h-3" /></div>
                                            }
                                            <span className="font-semibold text-sm">{coin.name}</span>
                                            <span className=" text-xs text-muted-foreground">{coin.symbol}</span>
                                            <span className="ml-auto text-xs text-muted-foreground ">{coin.coingecko_id}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Live price info (edit mode) */}
                        {isUpdate && (
                            <div className="flex items-center gap-3 pt-1">
                                <div className="flex-1 text-sm text-muted-foreground">
                                    {crypto.usd_price
                                        ? <span>
                                            {t('Current price')}: <span className=" font-semibold text-foreground">${Number(crypto.usd_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</span>
                                            {' · '}
                                            {t('Updated')}: <span>{crypto.price_updated_at ? new Date(crypto.price_updated_at).toLocaleString() : t('Never')}</span>
                                        </span>
                                        : <span>{t('No price data yet. Set a CoinGecko ID and sync.')}</span>
                                    }
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={syncPriceNow}
                                    disabled={syncLoading}
                                    className="gap-1 shrink-0"
                                >
                                    {syncLoading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <RefreshCw className="w-4 h-4" />
                                    }
                                    {t('Sync Now')}
                                </Button>
                            </div>
                        )}
                        {syncMsg && (
                            <p className="text-xs text-green-600 dark:text-green-400">{syncMsg}</p>
                        )}
                    </CardContent>
                </Card>

                {/* ── Market list modal (full-screen overlay) ─────────────────────── */}
                {marketOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                        <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b">
                                <div>
                                    <h2 className="font-bold text-lg">{t('Top Coins by Market Cap')}</h2>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        {t('Click a coin to auto-fill the form. Grey rows are already imported.')}
                                    </p>
                                </div>
                                <button type="button" onClick={() => setMarketOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto flex-1">
                                {marketLoading ? (
                                    <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t('Loading market data…')}
                                    </div>
                                ) : marketCoins.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">{t('No data available')}</div>
                                ) : (
                                    <>
                                        {/* Header row */}
                                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b bg-muted/30">
                                            <span>{t('Coin')}</span>
                                            <span className="text-right">{t('Price')}</span>
                                            <span className="text-right">{t('24h')}</span>
                                            <span className="text-right">{t('Market Cap')}</span>
                                        </div>

                                        {marketCoins.map(coin => (
                                            <button
                                                key={coin.coingecko_id}
                                                type="button"
                                                onClick={() => applyMarketCoin(coin)}
                                                disabled={coin.already_imported}
                                                className={`w-full grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-3 text-left border-b transition-colors
                          ${coin.already_imported
                                                        ? 'opacity-40 cursor-not-allowed'
                                                        : 'hover:bg-muted cursor-pointer'
                                                    }`}
                                            >
                                                {/* Coin name */}
                                                <div className="flex items-center gap-3">
                                                    {coin.logo_url
                                                        ? <img src={coin.logo_url} alt={coin.name} className="w-7 h-7 rounded-full object-cover" />
                                                        : <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"><Coins className="w-4 h-4" /></div>
                                                    }
                                                    <div>
                                                        <div className="font-semibold text-sm">{coin.name}</div>
                                                        <div className=" text-xs text-muted-foreground">{coin.symbol}</div>
                                                    </div>
                                                    {coin.already_imported && (
                                                        <span className="ml-1 text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded">
                                                            {t('Added')}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Price */}
                                                <div className="text-right  text-sm">
                                                    {coin.usd_price != null
                                                        ? `$${Number(coin.usd_price).toLocaleString('en-US', { maximumFractionDigits: 4 })}`
                                                        : '—'
                                                    }
                                                </div>

                                                {/* Change */}
                                                <div className={`text-right text-sm font-semibold ${Number(coin.price_change_24h) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {coin.price_change_24h != null
                                                        ? `${Number(coin.price_change_24h) >= 0 ? '+' : ''}${Number(coin.price_change_24h).toFixed(2)}%`
                                                        : '—'
                                                    }
                                                </div>

                                                {/* Market cap */}
                                                <div className="text-right text-xs text-muted-foreground">
                                                    {coin?.market_cap_usd != null ? formatBig(coin?.market_cap_usd as any) : '—' as any}
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Basic Information ────────────────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-blue-500" />
                            <CardTitle>{t('Basic Information')}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>



                {/* ── Sticky submit bar (mirrors UserSaveForm) ─────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        <ButtonLoader
                            isSubmitting={isSubmitting}
                            btnText={isUpdate ? t('Update Currency') : t('Add Currency')}
                            loaderText={isUpdate ? t('Updating…') : t('Adding…')}
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBig(n: number): string {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(1) + 'T';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    return '$' + n.toLocaleString();
}

export default CryptoSaveForm;
