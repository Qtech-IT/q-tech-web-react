import { useLayout } from '@/Contexts/Backend/LayoutProvider'
import { Sidebar } from '@/Components/UI/Sidebar'

interface AppSidebarProps {
  [key: string]: any
}

export function AppSidebar(props: AppSidebarProps) {
  const { collapsible, variant } = useLayout()
  return <Sidebar {...props} collapsible={collapsible} variant={variant} />
}
