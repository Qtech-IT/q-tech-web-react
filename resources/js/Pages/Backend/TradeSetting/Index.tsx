import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useTradeSettingConfig } from '@/Config/crud/useTradeSettingConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useTradeSettingConfig(props);
    return (<>

        <CrudManager config={config} {...props} />;


    </>)



}