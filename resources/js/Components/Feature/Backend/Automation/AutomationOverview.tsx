import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  Copy,
  ExternalLink,
  FileText,
  Play,
  RefreshCw,
  Server,
  Settings,
  Terminal,
} from 'lucide-react';
import React, { useState } from 'react';

import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import {
  clearAutomationCache,
  handleRunCommand,
} from '@/Controllers/Backend/SettingsController';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import { AutomationOverviewProps } from '@/Types/User/setting';
import { keyToValue } from '@/Utils/helpers';


type CopiedType = string | number | null;

/* ------------------------------------------------------------------ */

const AutomationOverview: React.FC<AutomationOverviewProps> = ({
  automationData,
  routePrefix
}) => {
  const { loading: isSubmitting, submit } = useInertiaForm();
  const [copiedCommand, setCopiedCommand] = useState<CopiedType>(null);
  const { t } = useTranslations();

  /* ------------------------------------------------------------------ */
  /* Helpers */
  /* ------------------------------------------------------------------ */

  const copyToClipboard = (text?: string, key?: CopiedType): void => {
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedCommand(key ?? null);
      setTimeout(() => setCopiedCommand(null), 2000);
    });
  };

  const getStatusColor = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remaining}s` : `${seconds}s`;
  };

  /* ------------------------------------------------------------------ */

  return (
    <div className="space-y-8">
      {/* System Status */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex gap-4">
            <Clock />
            <div>
              <p className="text-sm">
                {t('Cron Status')}
              </p>
              <p className="text-2xl font-bold">
                {automationData?.cron_status ?? 'Unknown'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4">
            <Activity />
            <div>
              <p className="text-sm">
                {t('Active Jobs')}
              </p>
              <p className="text-2xl font-bold">
                {automationData?.active_jobs ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4">
            <RefreshCw />
            <div>
              <p className="text-sm">
                {t('Last Run')}
              </p>
              <p className="text-2xl font-bold">
                {automationData?.last_run ?? 'Never'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4">
            <CheckCircle />
            <div>
              <p className="text-sm">
                {t('Success Rate')}
              </p>
              <p className="text-2xl font-bold">
                {automationData?.success_rate ?? 0}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cron Command */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="text-blue-500" />
            {t("Cron Job Setup Instructions")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Settings />
            <AlertDescription>
              {t('Add this cron job to enable automation.')}
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="flex items-center gap-2 text-white">
                <Server className="w-4 h-4" /> {t('Server Cron Command')}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  copyToClipboard(automationData?.cron_command, 'server')
                }
              >
                {copiedCommand === 'server' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <code className="block text-green-400  break-all">
              {automationData?.cron_command ??
                '* * * * * php artisan schedule:run'}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="text-green-500" />
            {t('Available Artisan Commands')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {automationData?.commands?.length ? (
            automationData.commands.map((command) => (
              <div key={command.id} className="p-4 border rounded-lg">
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{command.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {command.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(command.status)}
                    >
                      {keyToValue(command.status)}
                    </Badge>

                    <Button
                      size="sm"
                      onClick={() => handleRunCommand(command.id, submit, routePrefix)}
                      disabled={isSubmitting}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      {t('Run')}
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-900 p-3 rounded flex justify-between">
                  <code className="text-green-400  break-all">
                    php artisan {command.command}
                  </code>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      copyToClipboard(command.command, command.id)
                    }
                  >
                    {copiedCommand === command.id ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                  <div>{t('Schedule')}: {command.schedule ?? '—'}</div>
                  <div>{t('Last Run')}: {command.last_run ?? 'Never'}</div>
                  <div>{t('Duration')}: {formatDuration(command.duration)}</div>
                  <div>{t('Next Run')}: {command.next_run ?? 'N/A'}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-6">
              {t('No scheduled commands configured')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      {automationData?.history?.length ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-purple-500" />
              {t('Execution History')}
            </CardTitle>

            <Button
              size="sm"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => clearAutomationCache(submit, routePrefix)}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {t('Clear History')}
            </Button>
          </CardHeader>

          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {automationData.history.map((entry, i) => (
              <div
                key={i}
                className="flex justify-between p-3 rounded bg-muted"
              >
                <div>
                  <div className="font-medium">{entry.command}</div>
                  <div className="text-xs text-muted-foreground">
                    {entry.timestamp}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getStatusColor(entry.status)}
                  >
                    {keyToValue(entry.status)}
                  </Badge>
                  <span className="text-xs">
                    {formatDuration(entry.duration)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {/* Docs */}
      <Card className="border-dashed">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-500" />
            <h3 className="text-lg font-semibold">
              {t('Documentation')}
            </h3>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              window.open('https://laravel.com/docs/scheduling', '_blank')
            }
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {t('Laravel Scheduling')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationOverview;
