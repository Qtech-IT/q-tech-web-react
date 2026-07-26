import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useFormConfig } from '@/Config/crud/useFormConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  
  const config = useFormConfig(props);
  return <CrudManager config={config} {...props} />;

}