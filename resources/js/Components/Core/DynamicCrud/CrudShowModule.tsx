import {
  ArrowLeft,
  View
} from 'lucide-react';

import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import { CrudConfig, CrudPageProps } from '@/Types/crud';
import { router } from '@inertiajs/react';

interface CrudShowModuleProps extends CrudPageProps {
    config: CrudConfig;
}

export function CrudShowModule(props: CrudShowModuleProps) {
  let { config, title, item = null } = props;

  item = item?.data || null;

  const label = config?.labels?.singular;
  const labelPlural = config?.labels?.plural;
  const { t } = useTranslations();


  const breadcrumbItems = config?.breadcrumbs?.show

  const ComponentFormToRender = config?.viewComponent;

  return (

    <MainLayout title={title}>

      <CommonLayoutHeader
        variant="inner"
        breadcrumbItems={breadcrumbItems}
        title={item ? item?.name : `${label} Details`}
        description={
          'View and manage ' + label + ' information '
        }
        icon={View}
        primaryAction={{
          label: `Back to ${labelPlural}`,
          icon: ArrowLeft,
          onClick: () => router.visit(route(config?.routes?.index!, config?.routeParams?.index || null)),
          variant: 'outline'
        }}

      />


      <div>
        <ComponentFormToRender
          {...props}
        />
      </div>

    </MainLayout>

  );
}
