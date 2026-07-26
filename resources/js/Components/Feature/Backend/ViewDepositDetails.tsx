import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import { keyToValue } from '@/Utils/helpers';
import { router } from '@inertiajs/react';
import {
    Calendar,
    Download,
    Edit,
    Eye,
    User,
    Wallet
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: any | null;
};

export function ViewDepositDetails({ open, onOpenChange, item }: Props) {

    const { t } = useTranslations();

    const [editing, setEditing] = useState(false);
    const [status, setStatus] = useState('');
    const [note, setNote] = useState('');
    const [usdAmount, setUsdAmount] = useState('');

    useEffect(() => {
        if (item) {
            setStatus(item.status);
            setUsdAmount(item.usd_amount);
            setNote(item.note || '');
        }
    }, [item]);

    if (!item) return null;

    const handleUpdate = () => {
        router.post(route('backend.deposit.update'), {
            id: item.id,
            status,
            note,
            amount: item.amount,
            usd_amount: usdAmount
        }, {
            onSuccess: () => {
                setEditing(false);
                onOpenChange(false);
            }
        });
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = item.deposit_voucher_file;
        link.download = '';
        link.click();
    };

    const { can } = usePermission();

    return (
        <div className={`${editing ? 'h-[45vh]' : 'h-[80vh]'}   flex flex-col`}>

            {/* HEADER */}
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">
                        {t('Deposit Details')}
                    </h2>
                </div>


                {
                    can('deposit.edit') &&
                    item.status === 'pending' &&
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(!editing)}
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        {editing ? t('Cancel') : t('Edit')}
                    </Button>
                }



            </div>

            {/* SCROLL AREA */}
            <div className="flex-1 mb-5 overflow-y-auto pr-2 space-y-5">

                {editing ? (
                    /* ================= EDIT MODE ================= */
                    <div className="p-4 border rounded-xl bg-muted/30 space-y-4">

                        {/* USD AMOUNT */}
                        <div>
                            <label className="text-sm font-medium">
                                {t('USD Amount')}
                            </label>
                            <input
                                type="number"
                                className="w-full mt-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={usdAmount}
                                onChange={(e) => setUsdAmount(e.target.value)}
                            />
                        </div>

                        {/* STATUS */}
                        <div>
                            <label className="text-sm font-medium">
                                {t('Status')}
                            </label>
                            <select
                                className="w-full mt-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="declined">Declined</option>
                            </select>
                        </div>

                        {/* NOTE */}
                        <div>
                            <label className="text-sm font-medium">
                                {t('Note')}
                            </label>
                            <textarea
                                rows={3}
                                className="w-full mt-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <Button className="w-full" onClick={handleUpdate}>
                            {t('Update Deposit')}
                        </Button>
                    </div>

                ) : (
                    /* ================= VIEW MODE ================= */
                    <div className="space-y-5">

                        {/* USER */}
                        <div className="p-4 rounded-xl border bg-muted/30">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    {t('User')}
                                </span>
                            </div>

                            <p className="font-semibold">
                                {item.user?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {item.user?.email}
                            </p>
                        </div>

                        {/* AMOUNTS */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-xl border bg-green-50 dark:bg-green-900/20">
                                <p className="text-xs text-muted-foreground">
                                    {t('Amount')}
                                </p>
                                <p className="text-lg font-semibold">
                                    {item.amount} {item.crypto?.symbol}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border bg-blue-50 dark:bg-blue-900/20">
                                <p className="text-xs text-muted-foreground">
                                    {t('USD')}
                                </p>
                                <p className="text-lg font-semibold">
                                    {item.usd_amount}
                                </p>
                            </div>
                        </div>

                        {/* STATUS */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {t('Status')}
                            </span>
                            <Badge>{keyToValue(item.status)}</Badge>
                        </div>

                        {/* VOUCHER */}
                        {item.deposit_voucher_file && (
                            <div className="p-4 rounded-xl border space-y-3">
                                <p className="text-sm font-medium">
                                    {t('Voucher')}
                                </p>

                                {/* PREVIEW */}
                                <div className="rounded-lg overflow-hidden border bg-muted">
                                    {item.deposit_voucher_file.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                                        <img
                                            src={item.deposit_voucher_file}
                                            className="w-full max-h-64 object-contain"
                                        />
                                    ) : item.deposit_voucher_file.endsWith('.pdf') ? (
                                        <iframe
                                            src={item.deposit_voucher_file}
                                            className="w-full h-64"
                                        />
                                    ) : (
                                        <div className="p-6 text-center text-sm text-muted-foreground">
                                            {t('Preview not available')}
                                        </div>
                                    )}
                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            window.open(item.deposit_voucher_file, '_blank')
                                        }
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        {t('View')}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={handleDownload}
                                    >
                                        <Download className="w-4 h-4 mr-1" />
                                        {t('Download')}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* NOTE */}
                        {item.note && (
                            <div className="p-4 rounded-xl border">
                                <p className="text-sm font-medium mb-1">
                                    {t('Note')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {item.note}
                                </p>
                            </div>
                        )}

                        {/* DATE */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {item.created_at}
                        </div>

                        {/* ALERT */}
                        <Alert className='mb-3'>
                            <AlertDescription>
                                {item.status === 'approved'
                                    ? t('Balance already credited.')
                                    : t('Pending approval from admin.')}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
        </div>
    );
}