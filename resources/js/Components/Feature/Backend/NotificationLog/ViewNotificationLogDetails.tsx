import React, { useState } from 'react';
import { Badge } from '@/Components/UI/Badge';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  Check,
  Mail,
  Send,
  User,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useTranslations } from '@/Hooks/useTranslations';

type NotificationLogViewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: any | null;
  config?: any;
};

export function ViewNotificationLogDetails({
  open,
  onOpenChange,
  item = null,
  config
}: NotificationLogViewDialogProps) {

  const { t } = useTranslations();

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      processing: {
        badge: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
        icon: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/10'
      },
      success: {
        badge: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
        icon: 'text-green-600',
        bg: 'bg-green-50 dark:bg-green-900/10'
      },
      failed: {
        badge: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
        icon: 'text-red-600',
        bg: 'bg-red-50 dark:bg-red-900/10'
      }
    };
    return colors[status] || colors.failed;
  };

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

  const statusColor = getStatusColor(item.status);
  const customData = item.custom_data ? (typeof item.custom_data === 'string' ? JSON.parse(item.custom_data) : item.custom_data) : null;

  return (
    <div className="flex-1 overflow-y-auto px-1">
      <div className="space-y-6 py-4">

        {/* Status Section */}
        <div className={`p-4 rounded-lg ${statusColor.bg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${statusColor.icon}`} />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('Status')}
                </p>
                <Badge className={`mt-1 ${statusColor.badge}`}>
                  {item.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.channel === 'email' ? (
                <Mail className="w-5 h-5 text-blue-600" />
              ) : (
                <Send className="w-5 h-5 text-green-600" />
              )}
              <span className="text-sm font-medium capitalize">{item.channel}</span>
            </div>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
         

          {item.receiver && (
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                <User className="w-3 h-3" />
                {t('Receiver')}
              </p>
              <p className="font-semibold text-purple-700 dark:text-purple-300">
                {item?.receiver?.name}
              </p>
              {item?.receiver?.email && (
                <p className="text-xs text-gray-500 mt-1">{t('Email')}: {item.receiver.email}</p>
              )}
            </div>
          )}

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 md:col-span-2">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t('Sent At')}
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {item.created_at}
            </p>
          </div>
        </div>

        {/* Message Section */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {t('Message')}
          </h3>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded max-h-96 overflow-y-auto">
            <div 
              className="text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.message }}
            />
          </div>
        </div>

        {/* Gateway Response */}
        {item.gateway_response && (
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('Gateway Response')}
            </h3>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-48">
                {typeof item.gateway_response === 'string' 
                  ? item.gateway_response 
                  : JSON.stringify(item.gateway_response, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Custom Data */}
        {customData && Object.keys(customData).length > 0 && (
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('Custom Data')}
            </h3>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {Object.entries(customData).map(([key, value]: any, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {key}:
                    </span>
                    <span className="text-gray-900 dark:text-white break-all">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {item.status === 'success' && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {t('Notification sent successfully!')}
            </AlertDescription>
          </Alert>
        )}

        {/* Failed Message */}
        {item.status === 'failed' && item.gateway_response && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <strong>{t('Error')}:</strong> {t('Notification delivery failed. Check gateway response for details.')}
            </AlertDescription>
          </Alert>
        )}

      </div>
    </div>
  );
}