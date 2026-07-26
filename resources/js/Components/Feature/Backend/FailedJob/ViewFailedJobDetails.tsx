import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { Badge } from '@/Components/UI/Badge';
import { useTranslations } from '@/Hooks/useTranslations';
import {
  AlertTriangle,
  Calendar,
  Check,
  Code,
  Copy,
  FileText,
  Layers,
  XCircle
} from 'lucide-react';
import { useState } from 'react';

type FailedJobViewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: any | null;
  config?: any;
};

export function ViewFailedJobDetails({
  open,
  onOpenChange,
  item = null,
  config
}: FailedJobViewDialogProps) {

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
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.command_name}
                </p>
                <Badge className="mt-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                  {t('Failed')}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-600" />
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
            <p className="font-semibold text-gray-900 dark:text-white text-sm break-all">
              {item.id}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t('UUID')}
            </p>
            <p className="font-semibold text-gray-900 dark:text-white text-xs break-all">
              {item.uuid}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t('Connection')}
            </p>
            <p className="font-semibold text-purple-700 dark:text-purple-300 capitalize">
              {item.connection}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t('Queue')}
            </p>
            <p className="font-semibold text-orange-700 dark:text-orange-300 capitalize">
              {item.queue}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 md:col-span-2">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {t('Failed At')}
            </p>
            <p className="font-semibold text-red-700 dark:text-red-300">
              {item.failed_at}
            </p>
          </div>
        </div>

        {/* Exception Details */}
        <div className="p-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            {t('Exception Details')}
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {t('Exception Class')}:
              </p>
              <code className="text-sm text-red-700 dark:text-red-300 bg-white dark:bg-gray-900 px-2 py-1 rounded block break-all">
                {item.exception_class}
              </code>
            </div>

            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {t('Error Message')}:
              </p>
              <div className="p-3 bg-white dark:bg-gray-900 rounded border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap break-all">
                  {item.exception_message}
                </p>
              </div>
            </div>

            {item.exception_file && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {t('File & Line')}:
                </p>
                <code className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 px-2 py-1 rounded block break-all">
                  {item.exception_file}:{item.exception_line}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Job Class */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" />
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

        {/* Stack Trace */}
        {item.exception_trace && (
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('Stack Trace')}
            </h3>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap">
                {item.exception_trace}
              </pre>
            </div>
          </div>
        )}

        {/* Full Exception */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            {t('Full Exception')}
          </h3>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap">
              {item.exception}
            </pre>
          </div>
        </div>

        {/* Warning Alert */}
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            {t('This job failed during execution. Review the exception details above and retry if the issue has been resolved.')}
          </AlertDescription>
        </Alert>

      </div>
    </div>
  );
}