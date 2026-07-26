import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
import { cn } from '@/Utils/helpers'

// Root
export const DropdownMenu: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Root>> = (props) => (
  <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
)

export const DropdownMenuPortal: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Portal>> = (props) => (
  <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
)

export const DropdownMenuTrigger: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>> = (props) => (
  <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
)

export const DropdownMenuContent: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Content> & { className?: string; sideOffset?: number }> = ({
  className,
  sideOffset = 4,
  ...props
}) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      data-slot="dropdown-menu-content"
      sideOffset={sideOffset}
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
)

export const DropdownMenuGroup: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Group>> = (props) => (
  <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
)

export const DropdownMenuItem: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { className?: string; inset?: boolean; variant?: 'default' | 'destructive' }> = ({
  className,
  inset,
  variant = 'default',
  ...props
}) => (
  <DropdownMenuPrimitive.Item
    data-slot="dropdown-menu-item"
    data-inset={inset}
    data-variant={variant}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:ps-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  />
)

// Checkbox Item
export interface DropdownMenuCheckboxItemProps
  extends React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> {
  className?: string
  checked?: boolean
}

export const DropdownMenuCheckboxItem: React.FC<{
  className?: string
  checked?: boolean
  children?: React.ReactNode
  [key: string]: any
}> = ({ className, children, checked, ...props }) => (
  <DropdownMenuPrimitive.CheckboxItem
    data-slot="dropdown-menu-checkbox-item"
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    checked={checked}
    {...(props as any)}
  >
    <span className="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
)


// Radio Group & Item
export const DropdownMenuRadioGroup: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>> = (props) => (
  <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
)

export const DropdownMenuRadioItem: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & { className?: string }> = ({
  className,
  children,
  ...props
}) => (
  <DropdownMenuPrimitive.RadioItem
    data-slot="dropdown-menu-radio-item"
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    <span className="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CircleIcon className="size-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
)

// Label, Separator, Shortcut
export const DropdownMenuLabel: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }> = ({ className, inset, ...props }) => (
  <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" data-inset={inset} className={cn('px-2 py-1.5 text-sm font-medium data-[inset]:ps-8', className)} {...props} />
)

export const DropdownMenuSeparator: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Separator>> = ({ className, ...props }) => (
  <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />
)

export const DropdownMenuShortcut: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span data-slot="dropdown-menu-shortcut" className={cn('text-muted-foreground ms-auto text-xs tracking-widest', className)} {...props} />
)

// Sub menu
export const DropdownMenuSub: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.Sub>> = (props) => (
  <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
)

export const DropdownMenuSubTrigger: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }> = ({ className, inset, children, ...props }) => (
  <DropdownMenuPrimitive.SubTrigger
    data-slot="dropdown-menu-sub-trigger"
    data-inset={inset}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:ps-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ms-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
)

export const DropdownMenuSubContent: React.FC<React.ComponentProps<typeof DropdownMenuPrimitive.SubContent> & { className?: string }> = ({
  className,
  ...props
}) => (
  <DropdownMenuPrimitive.SubContent
    data-slot="dropdown-menu-sub-content"
    className={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
      className
    )}
    {...props}
  />
)
