import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useTransactionConfig } from '@/Config/crud/useTransactionConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useTransactionConfig(props);


    return <>
        <CrudManager config={config} {...props} />;


    </>

}