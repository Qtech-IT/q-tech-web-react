import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useCmsPageConfig } from '@/Config/crud/useCmsPageConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  const config = useCmsPageConfig(props);

  return <CrudManager config={config} {...props} />;
}
