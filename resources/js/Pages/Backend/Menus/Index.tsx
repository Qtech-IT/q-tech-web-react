import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useMenuConfig } from '@/Config/crud/useMenuConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  const config = useMenuConfig(props);

  return <CrudManager config={config} {...props} />;
}
