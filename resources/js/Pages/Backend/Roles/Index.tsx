import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useRoleConfig } from '@/Config/crud/useRoleConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  
  const config = useRoleConfig(props);
  
  return <CrudManager config={config} {...props} />;

}