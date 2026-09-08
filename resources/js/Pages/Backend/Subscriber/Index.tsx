import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useSubscriberConfig } from '@/Config/crud/useSubscriberConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  const config = useSubscriberConfig(props);

  return <CrudManager config={config} {...props} />;
}
