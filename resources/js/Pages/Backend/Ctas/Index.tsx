import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useCtaConfig } from '@/Config/crud/useCtaConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  const config = useCtaConfig(props);

  return <CrudManager config={config} {...props} />;
}
