import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useLoanProduct } from '@/Config/crud/useLoanProduct';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useLoanProduct(props);
    return <CrudManager config={config} {...props} />;

}