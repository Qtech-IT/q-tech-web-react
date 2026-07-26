import {
    Database
} from 'lucide-react';

import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import { BackupPageProps } from '@/Types/User/setting';
import { BreadcrumbProps } from '@/Types';
import { useEffect, useState } from 'react';
import { confirmDeleteAllBackups, confirmDeleteBackup, getDeleteBackupDialogContent, handleCreateBackup } from '@/Controllers/Backend/SettingsController';
import { StorageOverview } from './StorageOverview';
import { QuickAction } from './QuickAction';
import CommonSimpleSearchBox from '../CommonSimpleSearchBox';
import BackupTable from '@/Components/Table/Backend/BackupTable';
import { DeleteDialog } from '@/Components/Core/DynamicCrud/Dialog/DeleteDialog';
import { useForm as useInertiaForm } from '@/Hooks/useForm';

export function BackupWrapper({title,backups ,storageInfo ,modelProperty}:BackupPageProps) {

    const {t}         = useTranslations();
    const routePrefix = modelProperty?.routePrefix;

    const breadcrumbItems : BreadcrumbProps = [
        { label: t('Dashboard'), href: route('backend.dashboard')},
        { label: t('Database Backup'), href: null }
    ];

    const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm();
    const [searchTerm, setSearchTerm]                             = useState('');
    const [filteredBackups, setFilteredBackups]                   = useState(backups?.data || []);

    // Dialog states
    const [showDeleteDialog, setShowDeleteDialog]       = useState(false);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
    const [selectedBackup, setSelectedBackup]           = useState(null);

    useEffect(() => {
        if (searchTerm.trim() === '') {
        setFilteredBackups(backups?.data || []);
        } else {
        const filtered = (backups?.data || [] as any).filter((backup : any)   =>
            backup?.filename.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBackups(filtered);
        }
    }, [searchTerm, backups]);

    const handleSearch = (searchValue :any) => {
        setSearchTerm(searchValue);
    };


    const handleDownloadBackup = (backup : any) => {
      window.location.href = route(`${routePrefix}.download`,{id:backup.id})
    };

    const handleDeleteBackup = (backup : any) => {
      setSelectedBackup(backup);
      setShowDeleteDialog(true);
    };

    const handleDeleteAllBackups = () => {
      setShowDeleteAllDialog(true);
    };


    const deleteBackup = (id : string) => {
      confirmDeleteBackup(id,submit,routePrefix)
      setShowDeleteDialog(false);
    }

    const deleteAllBackup = () => {
      confirmDeleteAllBackups(submit ,routePrefix)
      setShowDeleteAllDialog(false)
    }

    const deleteDialogConfig    = getDeleteBackupDialogContent(false,selectedBackup);
    const deleteAllDialogConfig = getDeleteBackupDialogContent(true,storageInfo);


    return (
        <MainLayout title={title}>
           
            <CommonLayoutHeader
                variant="index"
                breadcrumbItems={breadcrumbItems}
                title={t("Database Backup Management")}
                description={t("Create, manage and restore database backups")}
                icon={Database}
            />

            {/* Storage Overview */}
            <StorageOverview storage_info={storageInfo} />

            <QuickAction
                backups={backups}
                handleCreateBackup={()=>handleCreateBackup(submit,routePrefix)}
                handleDeleteAllBackups={handleDeleteAllBackups}
                isSubmitting={isSubmitting}
            />


            <CommonSimpleSearchBox
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                placeholder="Search backup files..."
            />

          <div className="space-y-6">
              <BackupTable
                  backups={filteredBackups}
                  onDownload={handleDownloadBackup}
                  onDelete={handleDeleteBackup}
              />
          </div>

          {/* Delete Single Backup Dialog */}
          <DeleteDialog
            open={showDeleteDialog || showDeleteAllDialog}
            onOpenChange={showDeleteDialog ? setShowDeleteDialog : setShowDeleteAllDialog}
            item={showDeleteDialog ? selectedBackup : { total_backups: storageInfo?.total_backups, total_size: storageInfo?.total_size } }
            config={showDeleteDialog ? deleteDialogConfig as any : deleteAllDialogConfig as any}
            onDelete={showDeleteDialog ? deleteBackup : deleteAllBackup}
            isSubmitting={isSubmitting}
          />

        </MainLayout>
    );
}
