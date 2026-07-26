import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useCryptoConfig } from '@/Config/crud/useCryptoConfig';
import { CrudPageProps } from '@/Types/crud';

export default function Save(props: CrudPageProps) {

    const config = useCryptoConfig(props);
    return <CrudSaveModule config={config} {...props} />;

}