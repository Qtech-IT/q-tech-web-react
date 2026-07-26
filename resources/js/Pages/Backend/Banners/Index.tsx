import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useBannerConfig } from '@/Config/crud/useBannerConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useBannerConfig(props);
    return <CrudManager config={config} {...props} />;

}