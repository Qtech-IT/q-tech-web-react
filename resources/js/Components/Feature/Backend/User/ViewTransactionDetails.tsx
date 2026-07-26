import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { Badge } from '@/Components/UI/Badge';
import { useTranslations } from '@/Hooks/useTranslations';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Calendar,
    Check,
    Copy,
    User,
    Wallet
} from 'lucide-react';
import { useState } from 'react';

type TransactionViewDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: any | null;
};

export function ViewTransactionDetails({
    open,
    onOpenChange,
    item = null
}: TransactionViewDialogProps) {

    const { t } = useTranslations();

    function CopyableText({ text, label }: { text: string; label: string }) {
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <div className="flex flex-col gap-2 my-2">
                <span className="text-gray-600 dark:text-gray-400">
                    {label}:
                </span>
                <div className="flex items-start gap-2">
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300 break-all flex-1">
                        {text}
                    </code>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                    </button>
                </div>
            </div>
        );
    }

    if (!item) return null;

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'deposit':
            case 'trade_win':
                return 'bg-green-100 text-green-700';
            case 'withdraw':
            case 'trade_lose':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const isCredit = ['deposit', 'trade_win'].includes(item.type);

    return (
        <div className="flex-1 overflow-y-auto px-1">
            <div className="space-y-6 py-4">

                {/* HEADER */}
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">
                            <Wallet className="w-5 h-5 text-blue-600" />

                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {t('Transaction')}
                                </p>

                                <Badge className={`mt-1 ${getTypeBadge(item.type)}`}>
                                    {item.type.replace('_', ' ').toUpperCase()}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isCredit ? (
                                <ArrowDownCircle className="w-5 h-5 text-green-600" />
                            ) : (
                                <ArrowUpCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="text-sm font-medium">
                                {item.amount}
                            </span>
                        </div>

                    </div>
                </div>

                {/* COPYABLE TXN NUMBER */}
                <CopyableText
                    text={item.transaction_no}
                    label={t('Transaction No')}
                />

                {/* USER INFO */}
                {item.user && (
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">{t('User Info')}</span>
                        </div>

                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p>{item.user.name}</p>
                            <p className="text-xs text-gray-500">{item.user.email}</p>
                        </div>
                    </div>
                )}

                {/* BALANCE INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <p className="text-xs text-gray-600 mb-1">
                            {t('Balance Before')}
                        </p>
                        <p className="font-semibold text-green-700">
                            {item.balance_before}
                        </p>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <p className="text-xs text-gray-600 mb-1">
                            {t('Balance After')}
                        </p>
                        <p className="font-semibold text-blue-700">
                            {item.balance_after}
                        </p>
                    </div>

                </div>

                {/* NOTE */}
                {item.note && (
                    <div className="p-4 rounded-lg border">
                        <h3 className="font-semibold mb-2">{t('Note')}</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {item.note}
                        </p>
                    </div>
                )}

                {/* DATE */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t('Created At')}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                        {item.created_at}
                    </p>
                </div>

                {/* ALERT */}
                <Alert>
                    <AlertDescription>
                        {isCredit
                            ? t('This transaction increased the wallet balance.')
                            : t('This transaction decreased the wallet balance.')}
                    </AlertDescription>
                </Alert>

            </div>
        </div>
    );
}