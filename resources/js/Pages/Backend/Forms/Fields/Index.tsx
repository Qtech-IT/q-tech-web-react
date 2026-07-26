import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useFormFieldConfig } from '@/Config/crud/useFormFieldConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  
  const config = useFormFieldConfig(props);
  return <CrudManager config={config} {...props} />;

}