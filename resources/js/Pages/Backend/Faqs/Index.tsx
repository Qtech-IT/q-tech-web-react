import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useFaqConfig } from '@/Config/crud/useFaqConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useFaqConfig(props);
    return <CrudManager config={config} {...props} />;

}