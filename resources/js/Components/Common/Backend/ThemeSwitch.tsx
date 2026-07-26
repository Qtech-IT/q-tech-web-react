import { useEffect } from 'react'
import { Check, Moon, Sun } from 'lucide-react'
import { cn } from '@/Utils/helpers'
import { useTheme } from '@/Contexts/ThemeProvider'
import { Button } from '@/Components/UI/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { onSettingsChange } from '@/Controllers/Backend/SettingsController'
import { useTranslations } from '@/Hooks/useTranslations'

type Theme = 'light' | 'dark' | 'system'

interface ThemeSwitchProps {
  dbTheme?: string
}

export function ThemeSwitch({ dbTheme }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme()
  const { loading: isSubmitting, submit } = useInertiaForm()

  const {t} = useTranslations();

  // Set initial theme from dbTheme if valid
  useEffect(() => {
    if (dbTheme && ['light', 'dark', 'system'].includes(dbTheme)) {
      setTheme(dbTheme as Theme)
    }
  }, [dbTheme, setTheme])

  // Update theme-color meta tag when theme changes
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  }, [theme])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="scale-95 rounded-full">
          <Sun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">
             {t('Toggle theme')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSettingsChange('theme_mode', 'light', submit)}>
          {t('Light')}{' '}
          <Check size={14} className={cn('ms-auto', theme !== 'light' && 'hidden')} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSettingsChange('theme_mode', 'dark', submit)}>
          {t("Dark")}
          <Check size={14} className={cn('ms-auto', theme !== 'dark' && 'hidden')} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSettingsChange('theme_mode', 'system', submit)}>
          {t("System")}
          <Check size={14} className={cn('ms-auto', theme !== 'system' && 'hidden')} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
