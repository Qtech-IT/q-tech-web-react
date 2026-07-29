import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useCtaConfig } from '@/Config/crud/useCtaConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Save(props: CrudPageProps) {
  const config = useCtaConfig(props);

  return <CrudSaveModule config={config} {...props} />;
}
