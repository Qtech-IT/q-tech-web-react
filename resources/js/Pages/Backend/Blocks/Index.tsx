import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useBlockConfig } from '@/Config/crud/useBlockConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  const config = useBlockConfig(props);

  return <CrudManager config={config} {...props} />;
}
