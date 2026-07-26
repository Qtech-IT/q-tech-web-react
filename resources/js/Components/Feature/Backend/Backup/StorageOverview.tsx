import React from 'react';
import { HardDrive, FileText, Shield } from 'lucide-react';

import { Card, CardContent } from '@/Components/UI/Card';
import { useTranslations } from '@/Hooks/useTranslations';

interface StorageInfo {
  total_backups?: number;
  total_size?: string;
  backup_path?: string;
}

interface StorageOverviewProps {
  storage_info?: StorageInfo;
}

export const StorageOverview: React.FC<StorageOverviewProps> = ({ storage_info }) => {

  const {t} = useTranslations();
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                 {t('Total Backups')}
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {storage_info?.total_backups ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900">
              <HardDrive className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                {t('Storage Used')}
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {storage_info?.total_size ?? '0 B'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                 {t('Backup Path')}
              </p>
              <p className="text-sm font-bold text-purple-900 truncate dark:text-purple-100">
                {storage_info?.backup_path ?? 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
