import { useMemo } from 'react'
import { Laptop, Moon, Sun } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/Components/UI/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'
import { useTheme } from '@/Contexts/ThemeProvider'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import type { Theme } from '@/Types/theme'
import { isTheme } from '@/Types/theme'

export interface ThemeToggleProps {
  /**
   * `menu` (default) exposes all three choices at once — best when there is
   * room, and the only form that lets a user *see* which mode is active.
   * `cycle` is a single button that steps light → dark → system, for tight
   * spots such as a mobile header row.
   */
  variant?: 'menu' | 'cycle'
  size?: 'default' | 'sm' | 'icon'
  className?: string
  align?: 'start' | 'center' | 'end'
}

const ICONS: Record<Theme, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Laptop,
}

const CYCLE: readonly Theme[] = ['light', 'dark', 'system'] as const

/**
 * Public theme control. Shares the single `useTheme` source of truth with the
 * backend `ThemeSwitch`, so there is one cookie, one class-application path
 * and one set of semantics across the whole product.
 */
export function ThemeToggle({
  variant = 'menu',
  size = 'icon',
  className,
  align = 'end',
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { t } = useTranslations()

  const options = useMemo(
    () =>
      [
        { value: 'light' as const, label: t('Light') },
        { value: 'dark' as const, label: t('Dark') },
        { value: 'system' as const, label: t('System') },
      ] satisfies ReadonlyArray<{ value: Theme; label: string }>,
    [t]
  )

  const activeLabel =
    options.find((option) => option.value === theme)?.label ?? t('System')

  if (variant === 'cycle') {
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length] ?? 'system'
    const Icon = ICONS[theme]

    return (
      <Button
        type="button"
        variant="ghost"
        size={size}
        className={cn('rounded-full', className)}
        onClick={() => setTheme(next)}
        // The control has three states, so `aria-pressed` would be a lie.
        // The label carries both the current state and the outcome instead.
        aria-label={t('Theme: :current. Switch to :next', {
          current: activeLabel,
          next: options.find((option) => option.value === next)?.label ?? next,
        })}
      >
        <Icon aria-hidden="true" className="size-[1.15rem]" />
      </Button>
    )
  }

  // The trigger shows what is *painted*, not what was *chosen* — in `system`
  // mode the sun/moon is the honest signal of the current appearance.
  const TriggerIcon = theme === 'system' ? ICONS.system : ICONS[resolvedTheme]

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={size}
          className={cn('rounded-full', className)}
          aria-label={t('Change theme. Current theme: :current', {
            current: activeLabel,
          })}
        >
          <TriggerIcon aria-hidden="true" className="size-[1.15rem]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="min-w-40">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            if (isTheme(value)) setTheme(value)
          }}
        >
          {options.map((option) => {
            const Icon = ICONS[option.value]
            return (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  <Icon aria-hidden="true" className="size-4" />
                  {option.label}
                </span>
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle
