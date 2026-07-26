import { SignOutDialog } from '@/Components/Common/Backend/SignOutDialog'
import { Avatar, AvatarImage } from '@/Components/UI/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/Components/UI/Sidebar'
import useDialogState from '@/Hooks/use-dialog-state'
import { usePermission } from '@/Hooks/usePermission'
import { useTranslations } from '@/Hooks/useTranslations'
import type { User } from '@/Types/User'
import { Link } from '@inertiajs/react'
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  Settings,
} from 'lucide-react'
import { route } from 'ziggy-js'



interface NavUserProps {
  user: User
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const [open, setOpen] = useDialogState()

  const { can } = usePermission();
  const { t } = useTranslations();



  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="w-8 h-8 rounded-lg">
                  <AvatarImage src={user.img_url!} alt={user.name} />
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight text-start">
                  <span className="font-semibold truncate">{user.name}</span>
                  <span className="text-xs truncate">{user.email}</span>
                </div>
                <ChevronsUpDown className="ms-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar className="w-8 h-8 rounded-lg">
                    <AvatarImage src={user.img_url!} alt={user.name} />
                  </Avatar>
                  <div className="grid flex-1 text-sm leading-tight text-start">
                    <span className="font-semibold truncate">{user.name}</span>
                    <span className="text-xs truncate">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={route('backend.profile.index')}>
                    <BadgeCheck />
                    {t('Account')}
                  </Link>
                </DropdownMenuItem>

                {
                  can('setting.view') && (

                    <>
                      <DropdownMenuItem asChild>
                        <Link href={route('backend.settings.index')}>
                          <Settings />
                          {t('Settings')}
                        </Link>
                      </DropdownMenuItem>
                    </>

                  )
                }

              </DropdownMenuGroup>


              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setOpen(true)}>
                <LogOut />
                {t('Sign out')}
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
