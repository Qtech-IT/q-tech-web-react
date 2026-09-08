import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useRedirectConfig } from '@/Config/crud/useRedirectConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Save(props: CrudPageProps) {
  const config = useRedirectConfig(props);

  return <CrudSaveModule config={config} {...props} />;
}
