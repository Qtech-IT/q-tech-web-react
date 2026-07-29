import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useMediaFolderConfig } from '@/Config/crud/useMediaFolderConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  const config = useMediaFolderConfig(props);

  return <CrudManager config={config} {...props} />;
}
