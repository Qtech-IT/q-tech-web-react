import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useDepositConfig } from '@/Config/crud/useDepositConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useDepositConfig(props);
    return <CrudManager config={config} {...props} />;

}