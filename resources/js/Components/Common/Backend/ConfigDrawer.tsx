import * as React from 'react'
import { Root as Radio, Item as RadioItem } from '@radix-ui/react-radio-group'
import { CircleCheck, Loader2, RotateCcw, Settings } from 'lucide-react'
import { cn } from '@/Utils/helpers'
import { useDirection } from '@/Contexts/Backend/DirectionProvider'
import { useLayout } from '@/Contexts/Backend/LayoutProvider'
import { useTheme } from '@/Contexts/ThemeProvider'
import type { Theme } from '@/Types/theme'
import { Button } from '@/Components/UI/Button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/Components/UI/Sheet'
import { useSidebar } from '@/Components/UI/Sidebar'


import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { onSettingsChange, onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import { useTranslations } from '@/Hooks/useTranslations'
import { IconDir } from '@/Assets/icons/custom/icon-dir'
import { IconThemeSystem } from '@/Assets/icons/custom/icon-theme-system'
import { IconThemeLight } from '@/Assets/icons/custom/icon-theme-light'
import { IconThemeDark } from '@/Assets/icons/custom/icon-theme-dark'
import { IconSidebarSidebar } from '@/Assets/icons/custom/icon-sidebar-sidebar'
import { IconSidebarInset } from '@/Assets/icons/custom/icon-sidebar-inset'
import { IconSidebarFloating } from '@/Assets/icons/custom/icon-sidebar-floating'

interface ConfigDrawerProps {
  themeConfig?: any
}

export function ConfigDrawer({ themeConfig: themeSetting }: ConfigDrawerProps) {
  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()
  const { loading: isReseting, submit: submitFn } = useInertiaForm()
  const { setOpen } = useSidebar()
  const { resetTheme } = useTheme()

  const {t} = useTranslations();

  /**
   * Layout and direction are site configuration and stay on the server; the
   * theme is this admin's own cookie, so it is reset locally and deliberately
   * left out of the payload — resetting a personal preference must not rewrite
   * the public site's default.
   */
  const handleReset = async () => {
    setOpen(true)
    resetTheme()
    const postData = {
      site_settings: {
        direction: 'ltr',
        sidebar: 'inset',
      },
    }
    onSettingsUpdate(postData, submitFn)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Open theme settings"
          className="rounded-full"
        >
          <Settings aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pb-0 text-start">
          <SheetTitle>
             {t('Theme Settings')}
          </SheetTitle>
          <SheetDescription>
             {t('Adjust the appearance and layout to suit your preferences.')}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-6 overflow-y-auto">
          <ThemeConfig submit={submit} />
          <SidebarConfig themeSetting={themeSetting} submit={submit} />
          <DirConfig themeSetting={themeSetting} submit={submit} />
        </div>
        <SheetFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={isSubmitting || isReseting}
            aria-label="Reset all settings to default values"
          >
            {isReseting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
             {t('Reset')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

interface SectionTitleProps {
  title: string
  showReset?: boolean
  onReset?: () => void
  className?: string
}

function SectionTitle({ title, showReset = false, onReset, className }: SectionTitleProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold',
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full size-4"
          onClick={onReset}
        >
          <RotateCcw className="size-3" />
        </Button>
      )}
    </div>
  )
}

interface RadioItemType {
  value: string
  label: string
  icon: React.ElementType
}

interface RadioGroupItemProps {
  item: RadioItemType & { icon: React.ElementType }
  isTheme?: boolean
}

function RadioGroupItem({ item, isTheme = false }: RadioGroupItemProps) {
  const Icon = item.icon
  return (
    <RadioItem
      value={item.value}
      className={cn('group outline-none transition duration-200 ease-in')}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          'ring-border relative rounded-[6px] ring-[1px]',
          'group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-2xl',
          'group-focus-visible:ring-2'
        )}
        role="img"
        aria-hidden="false"
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn(
            'fill-primary size-6 stroke-white',
            'group-data-[state=unchecked]:hidden',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
          aria-hidden="true"
        />
        <Icon
          className={cn(
            !isTheme &&
              'stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground'
          )}
          aria-hidden="true"
        />
      </div>
      <div className="mt-1 text-xs" id={`${item.value}-description`} aria-live="polite">
        {item.label}
      </div>
    </RadioItem>
  )
}

interface ConfigSectionProps {
  themeSetting?: any
  submit: (data: any) => void
}

/**
 * The theme picker is the one control in this drawer that is *personal*, not
 * site configuration: it writes the `qtech_theme` cookie through `setTheme()`
 * and never contacts the server. Pushing it to `site_settings.theme_mode` — as
 * it used to — changed the public default for every visitor and, since nothing
 * fed the response back into the provider, did not repaint the current session.
 */
function ThemeConfig({ }: ConfigSectionProps) {
  const { defaultTheme, theme, setTheme, resetTheme } = useTheme()

  const {t} = useTranslations();

  return (
    <div>
      <SectionTitle
        title="Theme"
        showReset={theme !== defaultTheme}
        onReset={resetTheme}
      />
      <Radio
        value={theme}
        onValueChange={(next) => setTheme(next as Theme)}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select theme preference"
        aria-describedby="theme-description"
      >
        {[
          { value: 'system', label: 'System', icon: IconThemeSystem },
          { value: 'light', label: 'Light', icon: IconThemeLight },
          { value: 'dark', label: 'Dark', icon: IconThemeDark },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
      <div id="theme-description" className="sr-only">
          {t(' Choose between system preference, light mode, or dark mode')}
      </div>
    </div>
  )
}

function SidebarConfig({ themeSetting, submit }: ConfigSectionProps) {
  const { defaultVariant, variant, setVariant } = useLayout()

  const {t} = useTranslations()

  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Sidebar"
        showReset={defaultVariant !== variant}
        onReset={() => {
          setVariant(defaultVariant)
          onSettingsChange('sidebar', defaultVariant, submit as any)
        }}
      />
      <Radio
        value={variant}
        onValueChange={(variant) => onSettingsChange('sidebar', variant, submit as any)}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select sidebar style"
        aria-describedby="sidebar-description"
      >
        {[
          { value: 'inset', label: 'Inset', icon: IconSidebarInset },
          { value: 'floating', label: 'Floating', icon: IconSidebarFloating },
          { value: 'sidebar', label: 'Sidebar', icon: IconSidebarSidebar },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id="sidebar-description" className="sr-only">
         {t('Choose between inset, floating, or standard sidebar layout')}
      </div>
    </div>
  )
}

function DirConfig({ themeSetting, submit }: ConfigSectionProps) {
  const { defaultDir, dir, setDir } = useDirection()
  const {t} = useTranslations()

  return (
    <div>
      <SectionTitle
        title="Direction"
        showReset={defaultDir !== dir}
        onReset={() => onSettingsChange('direction', defaultDir, submit as any)}
      />
      <Radio
        value={dir}
        onValueChange={(dir) => onSettingsChange('direction', dir, submit as any)}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select site direction"
        aria-describedby="direction-description"
      >
        {[
          { value: 'ltr', label: 'Left to Right', icon: (props: React.SVGProps<SVGSVGElement>) => <IconDir dir="ltr" {...props} /> },
          { value: 'rtl', label: 'Right to Left', icon: (props: React.SVGProps<SVGSVGElement>) => <IconDir dir="rtl" {...props} /> },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id="direction-description" className="sr-only">
          {t('Choose between left-to-right or right-to-left site direction')}
      </div>
    </div>
  )
}
