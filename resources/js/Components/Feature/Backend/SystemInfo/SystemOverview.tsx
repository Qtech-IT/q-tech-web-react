import { Badge } from '@/Components/UI/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { useTranslations } from '@/Hooks/useTranslations';
import { SystemOverviewProps } from '@/Types/User/setting';
import {
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  Server,
  Shield,
  Zap,
} from 'lucide-react';
import React from 'react';

export const SystemOverview: React.FC<SystemOverviewProps> = ({
  systemInfo,
}) => {

  const { t } = useTranslations();


  return (
    <div className="space-y-8">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Environment */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900">
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {t('Environment')}
                </p>
                <p className="text-2xl font-bold text-blue-900 capitalize dark:text-blue-100">
                  {systemInfo?.environment || 'Unknown'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Mode */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  {t("Debug Mode")}
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {systemInfo?.debug_mode ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timezone */}
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {t('Timezone')}
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {systemInfo?.timezone || 'UTC'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Software Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              {t('Software Information')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("PHP Version")}
                </span>
                <Badge variant="outline" className=" text-sm">
                  {systemInfo?.php_version || 'Unknown'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Laravel Version')}
                </span>
                <Badge variant="outline" className=" text-sm">
                  {systemInfo?.laravel_version || 'Unknown'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Server Software')}
                </span>
                <Badge variant="outline" className=" text-sm">
                  {systemInfo?.server_software || 'Unknown'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("Database Version")}
                </span>
                <Badge variant="outline" className=" text-sm">
                  {systemInfo?.database_version || 'Unknown'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-green-500" />
              {t('System Configuration')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("Memory Limit")}
                </span>
                <Badge variant="secondary" className=" text-sm">
                  {systemInfo?.memory_limit || 'Unknown'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("Max Execution Time")}
                </span>
                <Badge variant="secondary" className=" text-sm">
                  {systemInfo?.max_execution_time || 'Unknown'}s
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("Upload Max Filesize")}
                </span>
                <Badge variant="secondary" className=" text-sm">
                  {systemInfo?.upload_max_filesize || 'Unknown'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("Cache Driver")}
                </span>
                <Badge variant="secondary" className=" text-sm capitalize">
                  {systemInfo?.cache_driver || 'Unknown'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("Session Driver")}
                </span>
                <Badge variant="secondary" className=" text-sm capitalize">
                  {systemInfo?.session_driver || 'Unknown'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional System Details */}
      {systemInfo?.additional_info && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-purple-500" />
              {t("Additional System Details")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {systemInfo.additional_info.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <Badge variant="outline" className=" text-sm">
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health Status */}
      {systemInfo?.health_checks && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              {t("System Health")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {systemInfo.health_checks.map((check, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${check.status ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {check.name}
                    </span>
                  </div>
                  <Badge
                    variant={check.status ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {check.status ? 'OK' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemOverview;
