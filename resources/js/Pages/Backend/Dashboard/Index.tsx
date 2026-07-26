
import { AuthenticatedLayout } from '@/Layouts/User/AuthenticatedLayout'
import BaseLayout from '@/Layouts/User/BaseLayout'
import { MainContainer } from '@/Layouts/User/MainContainer'

import { Head } from '@inertiajs/react'





// ─── main page ────────────────────────────────────────────────────────────────

export default function Dashboard({ props }: any) {


  return (
    <BaseLayout>
      <AuthenticatedLayout>
        <Head title="Dashboard" />
        <MainContainer>



          DASHBOARD


        </MainContainer>
      </AuthenticatedLayout>
    </BaseLayout>
  )
}