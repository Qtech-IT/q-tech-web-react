import React from 'react';
import {
  Database,
  Plus,
  Trash2,
  Shield,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Button } from '@/Components/UI/Button';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { useTranslations } from '@/Hooks/useTranslations';
import { usePermission } from '@/Hooks/usePermission';

interface BackupResponse {
  data?: unknown[];
}

interface QuickActionProps {
  backups?: BackupResponse;
  handleCreateBackup: () => void;
  handleDeleteAllBackups: () => void;
  isSubmitting: boolean;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  backups,
  handleCreateBackup,
  handleDeleteAllBackups,
  isSubmitting,
}) => {

  const {t}   = useTranslations();
  const {can} = usePermission()


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
            {t("Quick Actions")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>{t('Backup Recommendations')}:</strong> {t('Create regular backups to protect your data')}.
            {t('Store backups in multiple locations for better security')}.
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleCreateBackup}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText="Create New Backup"
              loaderText="Creating Backup..."
              icon={<Plus className="w-4 h-4" />}
            />
          </Button>

          {((backups?.data ?? []).length > 0 && can('backup.delete')) && (
            <Button
              variant="destructive"
              onClick={handleDeleteAllBackups}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t('Delete All Backups')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
