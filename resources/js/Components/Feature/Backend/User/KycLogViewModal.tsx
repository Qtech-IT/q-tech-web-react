import { useTranslations } from '@/Hooks/useTranslations';
import { Calendar, User } from 'lucide-react';

export function KycLogViewModal({ open, onOpenChange, item }: any) {

    if (!item) return null;

    const log = item;

    const data = log?.data || {};


    const { t } = useTranslations();

    return (
        <div className="space-y-5">

            {/* USER */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold">
                        {t('User Information')}
                    </span>
                </div>

                <p className="font-medium">{log.user?.name}</p>
                <p className="text-xs text-gray-500">{log.user?.email}</p>
            </div>

            {/* STATUS */}
            <div className="p-3 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">
                    {t('Status')}
                </p>
                <p className="font-semibold capitalize">{log.status}</p>
            </div>

            {/* KYC DATA (IMPORTANT PART) */}
            <div>
                <h3 className="font-semibold mb-2">
                    {t('KYC Data')}
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(data).map(([key, value]: any) => (
                        <div
                            key={key}
                            className="p-3 border rounded bg-white dark:bg-gray-900"
                        >
                            <p className="text-xs text-gray-500 capitalize">
                                {key.replace(/_/g, ' ')}
                            </p>

                            {/* handle image url */}
                            {typeof value === 'string' && value.startsWith('http') ? (
                                <a
                                    href={value}
                                    target="_blank"
                                    className="text-blue-600 text-xs underline break-all"
                                >
                                    View File
                                </a>
                            ) : (
                                <p className="font-medium break-all">
                                    {String(value)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* NOTE */}
            {log.note && (
                <div className="p-3 rounded border">
                    <p className="text-xs text-gray-500 mb-1">
                        {t('Note')}
                    </p>
                    <p className="text-sm">{log.note}</p>
                </div>
            )}

            {/* DATE */}
            <div className="text-xs text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {log.created_at}
            </div>

        </div>
    );
}