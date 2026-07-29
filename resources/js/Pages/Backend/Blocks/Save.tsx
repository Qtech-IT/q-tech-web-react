import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useBlockConfig } from '@/Config/crud/useBlockConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Save(props: CrudPageProps) {
  const config = useBlockConfig(props);

  return <CrudSaveModule config={config} {...props} />;
}
