import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useSystemUserConfig } from '@/Config/crud/useSystemUserConfig';
import { CrudPageProps } from '@/Types/crud';

export default function Save(props: CrudPageProps) {

   const config = useSystemUserConfig(props);
   return <CrudSaveModule config={config} {...props} />;

}