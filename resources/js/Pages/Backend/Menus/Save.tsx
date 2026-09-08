import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useMenuConfig } from '@/Config/crud/useMenuConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Save(props: CrudPageProps) {
  const config = useMenuConfig(props);

  return <CrudSaveModule config={config} {...props} />;
}
