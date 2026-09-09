import { ConfigDrawer } from '@/Components/Common/Backend/ConfigDrawer'
import { LanguageSwitch } from '@/Components/Common/Backend/LanguageSwitch'
import { ProfileDropdown } from '@/Components/Common/Backend/ProfileDropdown'
import { Search } from '@/Components/Common/Backend/Search'
import { SkipToMain } from '@/Components/Common/Backend/SkipToMain'
import { ThemeSwitch } from '@/Components/Common/Backend/ThemeSwitch'
import { AppSidebar } from '@/Components/Navigation/Backend/AppSidebar'
import { Header } from '@/Components/Navigation/Backend/Header'
import { NavGroup } from '@/Components/Navigation/Backend/NavGroup'
import { NavUser } from '@/Components/Navigation/Backend/NavUser'
import { TeamSwitcher } from '@/Components/Navigation/Backend/TeamSwitcher'
import { TopNav } from '@/Components/Navigation/Backend/TopNav'
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/Components/UI/Sidebar'
import { LayoutProvider } from '@/Contexts/Backend/LayoutProvider'
import { SearchProvider } from '@/Contexts/Backend/SearchProvider'
import { sidebarData } from '@/Data/sidebar-data'
import { usePermission } from '@/Hooks/usePermission'
import type { SharedProps } from '@/Types/Inertia'
import type { User } from '@/Types/User'
import { topNav } from '@/Utils/constants'
import { canAccessGroup, cn, getAccessibleItems } from '@/Utils/helpers'
import { usePage } from '@inertiajs/react'
import React from 'react'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {

  const defaultOpen: boolean = true

  const { props } = usePage<SharedProps>()

  const user: User | null = props.auth?.user ?? null
  const themeConfig: any = props?.site_theme_settings
  const languageSettings: any = props?.language_settings
  const reportCounters: any = props?.pending_report_counter;



  const { can } = usePermission()

  const isOnboarding: boolean = (route(undefined as any, undefined, false) as any)
    .current('backend.onboarding.*');




  const getAccessibleGroups = React.useMemo(() => {
    return sidebarData.navGroups
      .filter((group: any) => canAccessGroup(group, can))
      .map((group: any) => ({
        ...group,
        items: getAccessibleItems(group.items, can),
      }))
      .filter((group: any) => group.items.length > 0)
  }, [can])



  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <LayoutProvider themeConfig={themeConfig}>
          <SkipToMain />
          {
            !isOnboarding &&
            <AppSidebar>
              <SidebarHeader>
                <TeamSwitcher
                  siteConfig={themeConfig ?? {}}
                  siteLogo={props?.logos?.company_logo || props?.logos?.favicon || ''}
                />
              </SidebarHeader>
              <SidebarContent>

                {getAccessibleGroups.map((group: any) => {


                  return (

                    <NavGroup
                      key={group.title}
                      reportCounters={reportCounters}
                      {...group}
                    />

                  )
                }

                )}

              </SidebarContent>
              <SidebarFooter>
                {user && <NavUser user={user} />}

                <div className="mt-auto pt-4 border-t text-center text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} {props?.copy_right_text as any}
                </div>
              </SidebarFooter>
              <SidebarRail />
            </AppSidebar>
          }
          <SidebarInset
            className={cn(
              'has-[[data-layout=fixed]]:h-svh',
              'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]',
              '@container/content',
              'min-w-0',
              // 'min-w-0 overflow-x-hidden'
            )}
          >
            <Header>
              {
                !isOnboarding &&
                (
                  <TopNav links={topNav} />
                )
              }



              <div className="flex items-center gap-2 ms-auto min-w-0 overflow-hidden">
                {!isOnboarding && (
                  <>
                    {/* Hide search on very small screens */}
                    <div className="hidden sm:block">
                      <Search />
                    </div>
                    {/* Hide language on mobile */}
                    {can('setting.edit') && (
                      <div className="hidden md:block">
                        <LanguageSwitch languageSettings={languageSettings} />
                      </div>
                    )}
                    {/* The theme switch is a personal, cookie-only preference —
                        it writes nothing to the server, so it needs no
                        `setting.*` permission. Hidden on the smallest screens
                        only for space. */}
                    <div className="hidden sm:block">
                      <ThemeSwitch dbTheme={themeConfig?.theme_mode} />
                    </div>
                  </>
                )}
                {/* Config and profile always visible */}
                {can('setting.view') && <ConfigDrawer themeConfig={themeConfig} />}
                {user && <ProfileDropdown user={user} isOnboarding={isOnboarding} />}
              </div>


            </Header>

            {children}



          </SidebarInset>
        </LayoutProvider>

      </SidebarProvider>

    </SearchProvider>
  )
}
