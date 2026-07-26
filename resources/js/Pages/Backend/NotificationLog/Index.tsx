import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useNotificationLogConfig } from '@/Config/crud/useNotificationLogConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  
  const config = useNotificationLogConfig(props);
  return <CrudManager config={config} {...props} />;

}