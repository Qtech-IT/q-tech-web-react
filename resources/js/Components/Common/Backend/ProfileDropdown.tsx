import useDialogState from '@/Hooks/use-dialog-state'
import { Avatar, AvatarImage } from '@/Components/UI/Avatar'
import { Button } from '@/Components/UI/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'

import { Link } from '@inertiajs/react'
import { useTranslations } from '@/Hooks/useTranslations'
import type { User } from '@/Types/User'
import { SignOutDialog } from './SignOutDialog'
import { route } from 'ziggy-js'
import { usePermission } from '@/Hooks/usePermission'

interface ProfileDropdownProps {
  user?: User | null
  isOnboarding?:boolean
}

export function ProfileDropdown({ user , isOnboarding  }: ProfileDropdownProps) {
  const [open, setOpen] = useDialogState()
  const { t } = useTranslations()

  const {can} = usePermission();

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative w-8 h-8 rounded-full'>
            <Avatar className='w-8 h-8'>
              <AvatarImage src={user?.img_url!} alt='profile image' />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm font-medium leading-none'>{user?.name}</p>
              <p className='text-xs leading-none text-muted-foreground'>{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={route('backend.profile.index')}>{t('profile')}</Link>
            </DropdownMenuItem>
            
            {
              (!isOnboarding && can('setting.view')) && (
                <DropdownMenuItem asChild>
                  <Link href={route('backend.settings.index')}>{t('settings')}</Link>
                </DropdownMenuItem>
              )
            }
     
            
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
             {t('Sign out')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
