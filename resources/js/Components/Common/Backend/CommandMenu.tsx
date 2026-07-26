

import React, { type JSX } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { router } from '@inertiajs/react'
import { useSearch } from '@/Contexts/Backend/SearchProvider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/Components/UI/Command'
import { sidebarData } from '@/Data/sidebar-data'
import { ScrollArea } from '@/Components/UI/ScrollArea'
import { useTranslations } from '@/Hooks/useTranslations'
import { usePermission } from '@/Hooks/usePermission'
import { canAccessGroup, getAccessibleItems } from '@/Utils/helpers'

export function CommandMenu(): JSX.Element {
  const { open, setOpen } = useSearch() as { open: boolean; setOpen: (v: boolean) => void }

  const { can , isSuperAdmin} = usePermission();
  const { t }                = useTranslations();

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  const navigateToPage = React.useCallback((url: string) => {
    router.visit(url)
  }, [])


  /**
   * Get filtered groups with only accessible items
   */
  const getAccessibleGroups = React.useMemo(() => {
    return sidebarData.navGroups
      .filter((group: any) => canAccessGroup(group,can))
      .map((group: any) => ({
        ...group,
        items: getAccessibleItems(group.items,can),
      }))
      .filter((group: any) => group.items.length > 0)
  }, [can])

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pe-1">
          <CommandEmpty>
            {t('No results found')}.
          </CommandEmpty>

          {getAccessibleGroups.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              {t('No accessible menu items')}.
            </div>
          ) : (
            getAccessibleGroups.map((group: any) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.items.map((navItem: any, i: number) => {
                  // Single item with direct URL (no subitems)
                  if (navItem.url && (!navItem.items || navItem.items.length === 0)) {
                    return (
                      <CommandItem
                        key={`${navItem.url}-${i}`}
                        value={navItem.title}
                        onSelect={() => runCommand(() => navigateToPage(navItem.url))}
                      >
                        <div className="flex items-center justify-center size-4">
                          <ArrowRight className="text-muted-foreground/80 size-2" />
                        </div>
                        {navItem.title}
                      </CommandItem>
                    )
                  }

                  // Item with subitems
                  if (navItem.items && Array.isArray(navItem.items) && navItem.items.length > 0) {
                    return navItem.items.map((subItem: any, j: number) => (
                      <CommandItem
                        key={`${navItem.title}-${subItem.url}-${j}`}
                        value={`${navItem.title} ${subItem.title}`}
                        onSelect={() => runCommand(() => navigateToPage(subItem.url))}
                      >
                        <div className="flex items-center justify-center size-4">
                          <ArrowRight className="text-muted-foreground/80 size-2" />
                        </div>
                        {navItem.title}
                        <ChevronRight className="mx-1 size-3" />
                        {subItem.title}
                      </CommandItem>
                    ))
                  }

                  return null
                })}
              </CommandGroup>
            ))
          )}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}