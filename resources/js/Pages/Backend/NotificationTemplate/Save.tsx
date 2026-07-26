import { CrudPageProps } from '@/Types/crud';
import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useNotificationTemplateConfig } from '@/Config/crud/useNotificationTemplateConfig';

export default function Save(props: CrudPageProps) {
   
   const config = useNotificationTemplateConfig(props);
   return <CrudSaveModule config={config} {...props} />;

}