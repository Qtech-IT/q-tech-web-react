import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useFailedJobConfig } from '@/Config/crud/useFailedJobConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  const config = useFailedJobConfig(props);
  return <CrudManager config={config} {...props} />;
}