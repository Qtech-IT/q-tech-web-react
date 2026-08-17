import type { ReactElement } from 'react'

import { HomePage } from '@/Components/Frontend/Pages/HomePage'
import type { HomePageProps } from '@/Components/Frontend/Pages/HomePage'
import PublicLayout from '@/Layouts/Public/PublicLayout'

export type HomeProps = HomePageProps

/**
 * Public homepage.
 *
 * Thin by convention: props from `Frontend\HomeController` go straight to the
 * wrapper. Every section on this page comes from the CMS through the section
 * registry — there is no content here to edit.
 */
export default function Home(props: HomeProps) {
  return <HomePage {...props} />
}

Home.layout = (page: ReactElement) => <PublicLayout>{page}</PublicLayout>
