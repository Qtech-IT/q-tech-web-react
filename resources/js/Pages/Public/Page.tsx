import type { ReactElement } from 'react'

import type { ContentPageProps } from '@/Components/Frontend/Pages/ContentPage'
import { ContentPage } from '@/Components/Frontend/Pages/ContentPage'
import PublicLayout from '@/Layouts/Public/PublicLayout'

export type PageProps = ContentPageProps

/**
 * Every public URL except the homepage.
 *
 * Thin by convention: props from `Frontend\PageController` go straight to the
 * wrapper. One file serves services, technologies, legal pages and anything an
 * editor creates later — a page's identity is the sections on it, not the React
 * file that renders it.
 */
export default function Page(props: PageProps) {
  return <ContentPage {...props} />
}

Page.layout = (page: ReactElement) => <PublicLayout>{page}</PublicLayout>
