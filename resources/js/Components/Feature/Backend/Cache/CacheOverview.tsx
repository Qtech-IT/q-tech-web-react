import React, { useState } from 'react';
import {
  Trash2,
  RefreshCw,
  Database,
  HardDrive,
  Activity,
  CheckCircle,
  AlertCircle,
  Settings,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import {
  handleClearAllCache,
  handleClearCache,
} from '@/Controllers/Backend/SettingsController';
import { keyToValue } from '@/Utils/helpers';
import { CacheOverviewProps } from '@/Types/User/setting';
import { useTranslations } from '@/Hooks/useTranslations';
import { usePermission } from '@/Hooks/usePermission';

type ClearType = 'application' | 'route' | 'config' | 'all' | null;


const CacheOverview: React.FC<CacheOverviewProps> = ({ cacheInfo , routePrefix }) => {
  const { loading: isSubmitting, submit } = useInertiaForm();
  const [lastClearType, setLastClearType] = useState<ClearType>(null);
  const {t} = useTranslations();

  const formatBytes = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'Never';
    const hours   = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs    = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getCacheStatusColor = (status?: string): string => {

    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'unsupported':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const {can} = usePermission();

  const cacheActions = [
      {
        id: 'application',
        label: 'Clear Application Cache',
        icon: Database,
        variant: 'outline' as const,
        permission: 'cache.clear',
        clearType: 'application' as const,
      },
      {
        id: 'route',
        label: 'Clear Route Cache',
        icon: RefreshCw,
        variant: 'outline' as const,
        permission: 'cache.clear',
        clearType: 'route' as const,
      },
      {
        id: 'config',
        label: 'Clear Config Cache',
        icon: Settings,
        variant: 'outline' as const,
        permission: 'cache.clear',
        clearType: 'config' as const,
      },
      {
        id: 'all',
        label: 'Clear All Cache',
        icon: Trash2,
        variant: 'destructive' as const,
        permission: 'cache.clear',
        clearType: 'all' as const,
      },
  ];



  return (
    <div className="space-y-8">
      {/* Overview cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex gap-4">
            <Database />
            <div>
              <p className="text-sm">
                 {t('Cache Driver')}
              </p>
              <p className="text-2xl font-bold capitalize">
                {cacheInfo?.driver ?? 'Unknown'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4">
            <Activity />
            <div>
              <p className="text-sm">
                 {t('Status')}
              </p>
              <p className="text-2xl font-bold">
                {cacheInfo?.status ?? 'Unknown'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4">
            <HardDrive />
            <div>
              <p className="text-sm">
                 {t('Total Size')}
              </p>
              <p className="text-2xl font-bold">
                {formatBytes(cacheInfo?.total_size)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4">
            <CheckCircle />
            <div>
              <p className="text-sm">
                 {t('Hit Rate')}
              </p>
              <p className="text-2xl font-bold">
                {cacheInfo?.hit_rate ?? 0}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Settings className="text-red-500" />
             {t('Quick Cache Actions')}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6">
            <AlertCircle />
            <AlertDescription>
              <strong>{t('Warning')}:</strong> {t('Clearing cache may temporarily slow down')}
             {t(" the application.")}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

             {cacheActions.map((action) => {
                  const Icon          = action.icon;
                  const hasPermission = can(action.permission);

                  if (!hasPermission) {
                    return (
                      <Button
                        key={action.id}
                        variant={action.variant}
                        disabled={true}
                        title={`You don't have permission to ${action.label}`}
                        className="opacity-50 cursor-not-allowed"
                      >
                        <Icon />
                      </Button>
                    );
                  }

                  return (
                    <Button
                      key={action.id}
                      variant={action.variant}
                      onClick={() => {
                        if (action.clearType === 'all') {
                          handleClearAllCache(setLastClearType, submit,routePrefix!);
                        } else {
                          handleClearCache(setLastClearType, action.clearType, submit ,routePrefix!);
                        }
                      }}
                      disabled={isSubmitting}
                      title={action.label}
                    >
                      <Icon />
                      <ButtonLoader
                        isSubmitting={isSubmitting && lastClearType === action.clearType}
                        initialIcon={false}
                        showButtonText={false}
                      />
                    </Button>
                  );
                })}

          </div>
        </CardContent>
      </Card>

      {/* Stores */}
      {cacheInfo?.stores?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>
               {t('Cache Stores Status')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {cacheInfo.stores.map((store, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted">
                  <div className="flex justify-between mb-2">
                    <span>{store.name}</span>
                    <Badge className={getCacheStatusColor(store.status)}>
                      {keyToValue(store.status)}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>{t("Driver")}: {store.driver}</div>
                    <div>{t("Size")}: {formatBytes(store.size)}</div>
                    <div>{t('Keys')}: {store.keys ?? 0}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default CacheOverview;
