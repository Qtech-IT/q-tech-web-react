import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import UserStatusUpdateModal from '@/Components/Feature/Backend/User/UserStatusUpdateModal';
import WinnerHandleModal from '@/Components/Feature/Backend/User/WinnerHandleModal';
import { useSystemUserConfig } from '@/Config/crud/useSystemUserConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

  const config = useSystemUserConfig(props);
  return (<>

    <CrudManager config={config} {...props} />;

    <WinnerHandleModal />

    <UserStatusUpdateModal />

  </>)



}