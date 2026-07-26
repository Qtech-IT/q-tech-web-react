import {
  Zap
} from 'lucide-react';

import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import { AutomationPageProps } from '@/Types/User/setting';
import { BreadcrumbProps } from '@/Types';
import AutomationOverview from './AutomationOverview';

export function AutomationWrapper({title,modelProperty,automationData}:AutomationPageProps) {

    const {t}         = useTranslations();
    const routePrefix = modelProperty?.routePrefix;

    const breadcrumbItems : BreadcrumbProps = [
        { label: t('Dashboard'), href: route('backend.dashboard')},
        { label: t('Automation & Cron'), href: null }
    ];
    return (
        <MainLayout title={title}>
            <CommonLayoutHeader
                variant="index"
                breadcrumbItems={breadcrumbItems}
                title={t("Automation & Cron Jobs")}
                description={t("Manage scheduled tasks and automated processes")}
                icon={Zap}
            />
            <AutomationOverview  automationData = {automationData} routePrefix={routePrefix}/>
            
        </MainLayout>
    );
}
