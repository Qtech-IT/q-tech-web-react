import { Head } from '@inertiajs/react'
import React from 'react'
import { AuthenticatedLayout } from './AuthenticatedLayout'
import BaseLayout from './BaseLayout'
import { MainContainer } from './MainContainer'


export function MainLayout({ children, title }: {
  children: React.ReactNode
  title: string
}) {

  return (
    <BaseLayout>
      <AuthenticatedLayout>
        <Head title={title} />
        <MainContainer className="space-y-8">
          {children}
        </MainContainer>
      </AuthenticatedLayout>
    </BaseLayout>
  )
}