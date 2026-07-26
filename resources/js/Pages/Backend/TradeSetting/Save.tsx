import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useTradeSettingConfig } from '@/Config/crud/useTradeSettingConfig';
import { CrudPageProps } from '@/Types/crud';

export default function Save(props: CrudPageProps) {

    const config = useTradeSettingConfig(props);
    return <CrudSaveModule config={config} {...props} />;

}