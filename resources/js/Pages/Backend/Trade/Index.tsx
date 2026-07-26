import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useTradeConfig } from '@/Config/crud/useTradeConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useTradeConfig(props);

    return <CrudManager config={config} {...props} />;

}