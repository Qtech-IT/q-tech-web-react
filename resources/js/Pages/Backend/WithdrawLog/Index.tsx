import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useWithdrawConfig } from '@/Config/crud/useWithdrawConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useWithdrawConfig(props);
    return <CrudManager config={config} {...props} />;

}