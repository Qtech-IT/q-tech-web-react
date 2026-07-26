import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useJobConfig } from '@/Config/crud/useJobConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  
  const config = useJobConfig(props);
  return <CrudManager config={config} {...props} />;

}