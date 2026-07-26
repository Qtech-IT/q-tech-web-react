import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useCryptoConfig } from '@/Config/crud/useCryptoConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useCryptoConfig(props);
    return <CrudManager config={config} {...props} />;

}