import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Card, CardContent } from '@/Components/UI/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu';
import EmptyTableState from '@/Components/UI/EmptyTableState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/UI/Table';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import {
  Calendar,
  Database,
  Download,
  FileText,
  HardDrive,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import React from 'react';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface BackupItem {
  id: number | string;
  filename: string;
  size: string;
  size_bytes: number;
  created_at: string;
}

interface BackupTableProps {
  backups?: BackupItem[];
  onDownload: (backup: BackupItem) => void;
  onDelete: (backup: BackupItem) => void;
}

interface BackupTableActionsProps {
  backup: BackupItem;
  onDownload: (backup: BackupItem) => void;
  onDelete: (backup: BackupItem) => void;
}

interface SizeBadgeProps {
  size: string;
  sizeBytes: number;
}

interface BackupTypeIconProps {
  filename: string;
}



const TableActions: React.FC<BackupTableActionsProps> = ({
  backup,
  onDownload,
  onDelete,
}) => {

  const { t } = useTranslations();

  const { can } = usePermission();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="sr-only">
            {t('Open menu')}
          </span>
          <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-900 dark:border-gray-700"
      >
        <DropdownMenuLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t('Actions')}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="dark:bg-gray-700" />

        {
          can('backup.download') &&

          <DropdownMenuItem
            onClick={() => onDownload(backup)}
            className="text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100"
          >
            <Download className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" />
            {t('Download Backup')}
          </DropdownMenuItem>
        }


        <DropdownMenuSeparator className="dark:bg-gray-700" />


        {
          can('backup.delete')
          &&
          (
            <DropdownMenuItem
              onClick={() => onDelete(backup)}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('Delete Backup')}
            </DropdownMenuItem>
          )
        }


      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SizeBadge: React.FC<SizeBadgeProps> = ({ size, sizeBytes }) => {
  const getSizeColor = (bytes: number): string => {
    if (bytes > 100 * 1024 * 1024) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    }
    if (bytes > 10 * 1024 * 1024) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    }
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs  ${getSizeColor(sizeBytes)}`}
    >
      <HardDrive className="w-3 h-3 mr-1" />
      {size}
    </Badge>
  );
};

const BackupTypeIcon: React.FC<BackupTypeIconProps> = ({ filename }) => {
  if (filename.includes('db_')) {
    return <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  }

  if (filename.includes('app_')) {
    return <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />;
  }

  return <Database className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
};

/* ------------------------------------------------------------------ */
/* Main Component */
/* ------------------------------------------------------------------ */

export const BackupTable: React.FC<BackupTableProps> = ({
  backups = [],
  onDownload,
  onDelete,
}) => {

  const { t } = useTranslations();


  if (!backups.length) {
    return (
      <EmptyTableState
        icon={Database}
        title={t("No backups found")}
        description={t("No database backups available. Create your first backup to get started with data protection.")}
      />
    );
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">
                  {t('Serial')}
                </TableHead>
                <TableHead>
                  {t('Backup File')}
                </TableHead>
                <TableHead>
                  {t('Size')}
                </TableHead>
                <TableHead>
                  {t('Created')}
                </TableHead>
                <TableHead className="text-center">
                  {t("Actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {backups.map((backup, index) => (
                <TableRow
                  key={backup.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="px-6 py-4  text-gray-700 dark:text-gray-300">
                    #{index + 1}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg dark:bg-gray-800">
                        <BackupTypeIcon filename={backup.filename} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {backup.filename}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t('Database backup file')}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <SizeBadge
                      size={backup.size}
                      sizeBytes={backup.size_bytes}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-muted-foreground">
                        {backup.created_at}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(backup)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        {t('Download')}
                      </Button>

                      <TableActions
                        backup={backup}
                        onDownload={onDownload}
                        onDelete={onDelete}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupTable;
