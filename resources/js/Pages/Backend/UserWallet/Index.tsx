import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import WalletHandleModal from '@/Components/Feature/Backend/User/WalletHandleModal';
import { useUserBalanceConfig } from '@/Config/crud/useUserBalanceConfig';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useUserBalanceConfig(props);


    return <>
        <CrudManager config={config} {...props} />;

        <WalletHandleModal config={config} />

    </>

}