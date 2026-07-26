import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useKycLogConfig } from '@/Config/crud/useKycLogConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useKycLogConfig(props);
    return <CrudManager config={config} {...props} />;

}