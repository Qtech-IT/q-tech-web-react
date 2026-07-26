import {
  Zap
} from 'lucide-react';

import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import { CachePageProps } from '@/Types/User/setting';
import { BreadcrumbProps } from '@/Types';
import CacheOverview from './CacheOverview';

export function CacheConfigurationWrapper({title,modelProperty,cacheInfo}:CachePageProps) {

    const {t}         = useTranslations();
    const routePrefix = modelProperty?.routePrefix;

    const breadcrumbItems : BreadcrumbProps = [
        { label: t('Dashboard'), href: route('backend.dashboard')},
        { label: t('Cache Configuration'), href: null }
    ];
    return (
        <MainLayout title={title}>
            <CommonLayoutHeader
                variant="index"
                breadcrumbItems={breadcrumbItems}
                title={t("Cache Configuration")}
                description={t("Manage and monitor your application cache settings")}
                icon={Zap}
            />

            <CacheOverview  cacheInfo = {cacheInfo} routePrefix={routePrefix}/>
        </MainLayout>
    );
}
