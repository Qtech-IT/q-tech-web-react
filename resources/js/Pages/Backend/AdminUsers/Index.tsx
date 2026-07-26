import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useUserConfig } from '@/Config/crud/userConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

  const config = useUserConfig(props);
  return <CrudManager config={config} {...props} />;

}