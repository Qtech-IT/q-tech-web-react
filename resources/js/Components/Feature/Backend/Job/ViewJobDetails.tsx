import React, { useState } from 'react';
import { Badge } from '@/Components/UI/Badge';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { 
  Activity, 
  Clock, 
  Copy,
  Check,
  Layers,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { useTranslations } from '@/Hooks/useTranslations';

type JobViewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: any | null;
  config?: any;
};

export function ViewJobDetails({
  open,
  onOpenChange,
  item = null,
  config
}: JobViewDialogProps) {

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
            className="flex-shrink-0 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Copy text"
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

  const jobData = item.job_data ? (typeof item.job_data === 'string' ? JSON.parse(item.job_data) : item.job_data) : null;

  return (
    <div className="flex-1 overflow-y-auto px-1">
      <div className="space-y-6 py-4">

        {/* Status Section */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.command_name}
                </p>
                <Badge className="mt-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                  {item.reserved_at ? 'RESERVED' : 'PENDING'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium capitalize">{item.queue}</span>
            </div>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t('Job ID')}
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {item.id}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t('Queue')}
            </p>
            <p className="font-semibold text-gray-900 dark:text-white capitalize">
              {item.queue}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              {t('Attempts')}
            </p>
            <p className="font-semibold text-purple-700 dark:text-purple-300">
              {item.attempts}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t('Reserved At')}
            </p>
            <p className="font-semibold text-orange-700 dark:text-orange-300">
              {item.reserved_at || 'Not Reserved'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {t('Available At')}
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {item.available_at}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {t('Created At')}
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {item.created_at}
            </p>
          </div>
        </div>

        {/* Job Display Name */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            {t('Job Class')}
          </h3>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
            <code className="text-sm text-gray-700 dark:text-gray-300">
              {item.display_name}
            </code>
          </div>
        </div>

        {/* Job Data */}
        {jobData && Object.keys(jobData).length > 0 && (
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('Job Data')}
            </h3>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-900">
              <div className="grid grid-cols-1 gap-3 text-sm">
                {Object.entries(jobData).map(([key, value]: any, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {key}:
                    </span>
                    <span className="text-gray-900 dark:text-white break-all">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full Payload */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            {t('Full Payload')}
          </h3>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-96">
              {JSON.stringify(JSON.parse(item.payload), null, 2)}
            </pre>
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900">
          <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            {item.reserved_at 
              ? t('This job is currently being processed.')
              : t('This job is queued and waiting to be processed.')}
          </AlertDescription>
        </Alert>

      </div>
    </div>
  );
}