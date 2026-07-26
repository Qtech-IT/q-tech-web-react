import { Badge } from '@/Components/UI/Badge';
import { useTranslations } from '@/Hooks/useTranslations';
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    Clock,
    User
} from 'lucide-react';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: any;
};

export function ViewTradeDetails({ item = null }: Props) {

    const { t } = useTranslations();

    if (!item) return null;

    const isLong = item.direction === 'long';
    const isProfit = !item.profit_loss?.includes('-');
    const isWin = item.result === 'win';

    return (
        <div className="flex-1 overflow-y-auto px-2">

            <div className="space-y-5 py-4">

                {/* ───────────────── HEADER ───────────────── */}
                <div className="p-4 rounded-xl border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">

                    <div className="flex items-center justify-between">

                        {/* LEFT */}
                        <div className="flex items-center gap-3">

                            <img
                                src={item.crypto?.images?.thumb}
                                className="w-9 h-9 rounded-full"
                                alt="crypto"
                            />

                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {item.crypto?.name} ({item.crypto?.symbol})
                                </p>

                                <div className="flex items-center gap-2 mt-1">

                                    <Badge className={
                                        isLong
                                            ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                    }>
                                        {isLong ? 'LONG' : 'SHORT'}
                                    </Badge>

                                    <Badge className={
                                        isWin
                                            ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                    }>
                                        {item.result?.toUpperCase()}
                                    </Badge>

                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="text-right">

                            <div className="flex items-center justify-end gap-1">

                                {isLong ? (
                                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="w-5 h-5 text-red-500" />
                                )}

                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    {item.amount}
                                </span>

                            </div>

                            <p className="text-xs text-gray-500 dark:text-zinc-400">
                                {t('Trade Amount')}
                            </p>

                        </div>

                    </div>
                </div>

                {/* ───────────────── USER ───────────────── */}
                <div className="p-4 rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">

                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {t('User')}
                        </span>
                    </div>

                    <p className="text-sm text-gray-900 dark:text-white">
                        {item.user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                        {item.user?.email}
                    </p>

                </div>

                {/* ───────────────── TRADE DETAILS ───────────────── */}
                <div className="grid grid-cols-2 gap-3">

                    <div className="p-3 rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                        <p className="text-xs text-gray-500 dark:text-zinc-400">{t('Open Price')}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {item.open_price}
                        </p>
                    </div>

                    <div className="p-3 rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                        <p className="text-xs text-gray-500 dark:text-zinc-400">{t('Close Price')}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {item.close_price}
                        </p>
                    </div>

                    <div className="p-3 rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                        <p className="text-xs text-gray-500 dark:text-zinc-400">{t('Win % Applied')}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {item.win_pct_applied}%
                        </p>
                    </div>

                    <div className="p-3 rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                        <p className="text-xs text-gray-500 dark:text-zinc-400">{t('Duration')}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {item.duration_seconds}s
                        </p>
                    </div>

                </div>

                {/* ───────────────── PROFIT / LOSS ───────────────── */}
                <div className={`p-5 rounded-xl border text-center ${isProfit
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20'
                    : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
                    }`}>

                    <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
                        {t('Profit / Loss')}
                    </p>

                    <p className={`text-2xl font-bold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                        {item.profit_loss}
                    </p>

                </div>

                {/* ───────────────── TIME INFO ───────────────── */}
                <div className="p-4 rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 space-y-3">

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        {t('Opened At')}
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                        {item.opened_at}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
                        <Clock className="w-3 h-3" />
                        {t('Closed At')}
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                        {item.closed_at}
                    </p>

                </div>

            </div>
        </div>
    );
}