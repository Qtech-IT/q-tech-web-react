
import { CacheConfigurationWrapper } from '@/Components/Feature/Backend/Cache/CacheConfigurationWrapper';
import { CachePageProps } from '@/Types/User/setting';

export default function Index(props : CachePageProps) {
  return <CacheConfigurationWrapper {...props} />;
}
