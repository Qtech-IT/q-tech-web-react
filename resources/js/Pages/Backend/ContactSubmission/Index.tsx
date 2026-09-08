import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useContactSubmissionConfig } from '@/Config/crud/useContactSubmissionConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  const config = useContactSubmissionConfig(props);

  return <CrudManager config={config} {...props} />;
}
