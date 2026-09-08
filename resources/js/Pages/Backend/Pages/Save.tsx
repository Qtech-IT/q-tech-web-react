import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useCmsPageConfig } from '@/Config/crud/useCmsPageConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Save(props: CrudPageProps) {
  const config = useCmsPageConfig(props);

  return <CrudSaveModule config={config} {...props} />;
}
