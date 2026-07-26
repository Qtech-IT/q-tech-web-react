import { CrudManager } from '@/Components/Core/DynamicCrud/CrudManager';
import LoanRequestStatusUpdateModal from '@/Components/Feature/Backend/User/LoanRequestStatusUpdateModal';
import { useLoanRequest } from '@/Config/crud/useLoanRequest';
import type { CrudPageProps } from '@/Types/crud';

export default function Index(props: CrudPageProps) {

    const config = useLoanRequest(props);

    return (<>

        <CrudManager config={config} {...props} />;


        <LoanRequestStatusUpdateModal />

    </>)

}