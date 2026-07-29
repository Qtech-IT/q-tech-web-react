import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useRedirectConfig } from '@/Config/crud/useRedirectConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  const config = useRedirectConfig(props);

  return <CrudManager config={config} {...props} />;
}
