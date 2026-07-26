import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import { keyToValue } from '@/Utils/helpers';
import { router } from '@inertiajs/react';
import {
    Calendar,
    Edit,
    User,
    Wallet
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: any | null;
};

export function ViewWithdrawDetails({ open, onOpenChange, item }: Props) {

    const { t } = useTranslations();
    const { can } = usePermission();

    const [editing, setEditing] = useState(false);
    const [status, setStatus] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (item) {
            setStatus(item.status);
            setNote(item.note || '');
        }
    }, [item]);

    if (!item) return null;

    const handleUpdate = () => {
        router.post(route('backend.withdrawal.update'), {
            id: item.id,
            status,
            note
        }, {
            onSuccess: () => {
                setEditing(false);
                onOpenChange(false);
            }

        });
    };

    return (
        <div className={`${editing ? 'h-[40vh]' : 'h-[80vh]'}   flex flex-col`}>

            {/* HEADER */}
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">
                        {t('Withdraw Details')}
                    </h2>
                </div>

                {can('withdraw.edit') && item.status === 'pending' && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(!editing)}
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        {editing ? t('Cancel') : t('Edit')}
                    </Button>
                )}
            </div>

            {/* SCROLL */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-5">

                {editing ? (
                    /* ================= EDIT MODE ================= */
                    <div className="p-4 border rounded-xl bg-muted/30 space-y-4">

                        {/* STATUS */}
                        <div>
                            <label className="text-sm font-medium">
                                {t('Status')}
                            </label>
                            <select
                                className="w-full mt-1 rounded-md border px-3 py-2 text-sm"
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
                                className="w-full mt-1 rounded-md border px-3 py-2 text-sm"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <Button className="w-full" onClick={handleUpdate}>
                            {t('Update Withdraw')}
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

                        {/* AMOUNT INFO */}
                        <div className="grid grid-cols-1 gap-3">

                            <div className="p-4 rounded-xl border bg-red-50 dark:bg-red-900/20">
                                <p className="text-xs text-muted-foreground">
                                    {t('Requested Amount')}
                                </p>
                                <p className="text-lg font-semibold">
                                    {item.amount}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border bg-yellow-50 dark:bg-yellow-900/20">
                                <p className="text-xs text-muted-foreground">
                                    {t('Fee Charged')}
                                </p>
                                <p className="text-lg font-semibold">
                                    {item.fee_charged}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border bg-green-50 dark:bg-green-900/20">
                                <p className="text-xs text-muted-foreground">
                                    {t('Final Amount')}
                                </p>
                                <p className="text-lg font-semibold">
                                    {item.final_amount}
                                </p>
                            </div>

                        </div>

                        {/* WITHDRAW ADDRESS */}
                        <div className="p-4 rounded-xl border">
                            <p className="text-sm font-medium mb-1">
                                {t('Withdrawal Address')}
                            </p>
                            <p className="text-sm text-muted-foreground break-all">
                                {item.withdrawal_address}
                            </p>
                        </div>

                        {/* STATUS */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {t('Status')}
                            </span>
                            <Badge>{keyToValue(item.status)}</Badge>
                        </div>

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
                        <Alert>
                            <AlertDescription>
                                {item.status === 'approved'
                                    ? t('Withdrawal completed.')
                                    : t('Pending admin approval.')}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
        </div>
    );
}