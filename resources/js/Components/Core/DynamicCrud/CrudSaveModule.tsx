import {
    ArrowLeft,
    Edit,
    Plus
} from 'lucide-react';

import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import CommonSaveAlert from '@/Components/Feature/Backend/CommonSaveAleart';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import { CrudConfig, CrudPageProps } from '@/Types/crud';
import { router } from '@inertiajs/react';

interface CrudSaveModuleProps extends CrudPageProps {
    config: CrudConfig;
}

export function CrudSaveModule(props: CrudSaveModuleProps) {

    const { config, title, item = null } = props;
    const isUpdate = !!item;
    const label = config?.labels?.singular;
    const labelPlural = config?.labels?.plural;
    const { t } = useTranslations();

    const saveAlertInfo = config?.saveAlertInfo;
    const breadcrumbItems = isUpdate
        ? config?.breadcrumbs?.update
        : config?.breadcrumbs?.create;

    const ComponentFormToRender = config?.formComponent;

    return (

        <MainLayout title={title}>

            <CommonLayoutHeader
                variant="inner"
                breadcrumbItems={breadcrumbItems}
                title={isUpdate ? t(`Save  ${label}`) : t(`Create New  ${label}`)}
                description={
                    isUpdate
                        ? t(`Update ${label} information and settings`)
                        : t(`Create a new  ${label}`)
                }
                icon={isUpdate ? Edit : Plus}
                primaryAction={{
                    label: `Back to ${labelPlural}`,
                    icon: ArrowLeft,
                    onClick: () => router.visit(route(config?.routes?.index!, config?.routeParams?.index || null)),
                    variant: 'outline'
                }}

            />

            <CommonSaveAlert
                title={saveAlertInfo?.title}
                description={saveAlertInfo?.description}
            />

            <div>
                <ComponentFormToRender
                    {...props}
                />
            </div>

        </MainLayout>

    );
}
