import { CrudPageProps } from '@/Types/crud';
import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useRoleConfig } from '@/Config/crud/useRoleConfig';

export default function Save(props: CrudPageProps) {
   
    const config = useRoleConfig(props);
    return <CrudSaveModule config={config} {...props} />;

}