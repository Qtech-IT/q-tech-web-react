import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useUserConfig } from '@/Config/crud/userConfig';
import { CrudPageProps } from '@/Types/crud';

export default function Save(props: CrudPageProps) {

   const config = useUserConfig(props);
   return <CrudSaveModule config={config} {...props} />;

}