import { Check, Moon, Sun } from 'lucide-react'
import { cn } from '@/Utils/helpers'
import { useTheme } from '@/Contexts/ThemeProvider'
import type { Theme } from '@/Types/theme'
import { Button } from '@/Components/UI/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'
import { useTranslations } from '@/Hooks/useTranslations'

interface ThemeSwitchProps {
  /**
   * Accepted for call-site compatibility but intentionally unused — see the
   * note below. `ThemeProvider` is the only place the CMS default is applied.
   */
  dbTheme?: string | undefined
}

/**
 * The admin's personal light/dark/system switch.
 *
 * Purely client-side by design: `setTheme()` writes the `qtech_theme` cookie
 * and repaints, and nothing here touches the server. It used to PUT the
 * *site-wide* `theme_mode` setting, so one admin flipping their own toggle
 * changed the public default for every visitor — and, because the response
 * never fed back into the provider, the current theme did not change at all.
 * The site-wide default remains editable in Settings → Appearance, which is a
 * separate concern with its own permission.
 *
 * It also deliberately does NOT push `dbTheme` into the theme on mount. It used
 * to, and because `setTheme` writes the cookie, every admin page load silently
 * overwrote the visitor's own choice with the site-wide default. `ThemeProvider`
 * already applies `dbTheme` as the default for visitors who have made no
 * choice, which is the whole of what the CMS setting is allowed to do.
 *
 * NOTE: this component used to also write `meta[name='theme-color']`. That was
 * a silent no-op — `app.blade.php` renders no such tag — so it has been
 * removed. Adding the tag is a Blade change and is left to that layer.
 */
export function ThemeSwitch(_props: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme()

  const { t } = useTranslations()

  const options: Array<{ value: Theme; label: string }> = [
    { value: 'light', label: t('Light') },
    { value: 'dark', label: t('Dark') },
    { value: 'system', label: t('System') },
  ]

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="scale-95 rounded-full">
          <Sun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">{t('Toggle theme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            data-theme-option={option.value}
            aria-current={theme === option.value ? 'true' : undefined}
            onClick={() => setTheme(option.value)}
          >
            {option.label}
            <Check
              size={14}
              className={cn('ms-auto', theme !== option.value && 'hidden')}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
