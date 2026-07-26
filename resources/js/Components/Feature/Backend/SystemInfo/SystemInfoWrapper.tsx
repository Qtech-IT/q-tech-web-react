import {
  Server
} from 'lucide-react';

import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import SystemOverview from './SystemOverview';
import { SyatemInfoPageProps } from '@/Types/User/setting';
import { BreadcrumbProps } from '@/Types';

export function SystemInfoWrapper({title,systemInfo}:SyatemInfoPageProps) {

    const {t} = useTranslations();
    const breadcrumbItems : BreadcrumbProps= [
        { label: t('Dashboard'), href: route('backend.dashboard')},
        { label: t('System Info'), href: null }
    ];
    return (
        <MainLayout title={title}>
            <CommonLayoutHeader
                variant="index"
                breadcrumbItems={breadcrumbItems}
                title={t("System Information")}
                description={t("Overview of your system configuration and environment")}
                icon={Server}
            />
            <SystemOverview systemInfo={systemInfo} />
        </MainLayout>
    );
}
