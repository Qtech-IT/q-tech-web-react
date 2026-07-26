import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { usePageConfig } from '@/Config/crud/usePageConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = usePageConfig(props);
    return <CrudManager config={config} {...props} />;

}