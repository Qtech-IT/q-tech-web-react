import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useNotificationTemplateConfig } from '@/Config/crud/useNotificationTemplateConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  
  const config = useNotificationTemplateConfig(props);
  return <CrudManager config={config} {...props} />;

}