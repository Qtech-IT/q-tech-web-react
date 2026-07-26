import { CrudSaveModule } from '@/Components/Core/DynamicCrud/CrudSaveModule';
import { useCryptoWalletAddressConfig } from '@/Config/crud/useCryptoWalletAddressConfig';
import { CrudPageProps } from '@/Types/crud';

export default function Save(props: CrudPageProps) {

    const config = useCryptoWalletAddressConfig(props);
    return <CrudSaveModule config={config} {...props} />;

}