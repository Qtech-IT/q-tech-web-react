import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import { useCryptoWalletAddressConfig } from '@/Config/crud/useCryptoWalletAddressConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useCryptoWalletAddressConfig(props);
    return <CrudManager config={config} {...props} />;

}