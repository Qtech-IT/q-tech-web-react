import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useOtpConfig } from '@/Config/crud/useOtpCodeConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {
  
  const config = useOtpConfig(props);
  return <CrudManager config={config} {...props} />;

}