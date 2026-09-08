

import { Button, buttonVariants } from '@/Components/UI/Button'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { RadioGroup, RadioGroupItem } from '@/Components/UI/RadioGroup'
import { onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { fonts } from '@/Utils/constants'
import { CHECKERBOARD_STYLE, isTransparentColor, toHexApprox } from '@/Utils/color'
import { cn } from '@/Utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

/**
 * Public brand tokens.
 *
 * Stored as raw CSS colour values, so any syntax the browser accepts is valid
 * (`#2f6df6`, `oklch(0.55 0.19 258)`, `hsl(220 90% 56%)`, `transparent`). They
 * are validated server-side only for characters that could break out of a
 * declaration — anything else is passed to the browser as-is.
 *
 * Each field is therefore a PAIR: a picker swatch (the primary affordance) and
 * the text input that remains the source of truth. The picker can only speak
 * `#rrggbb`, so it is *fed* a hex approximation of whatever is stored and only
 * writes back when the user actually changes it — mounting the form can never
 * rewrite an `oklch()` value to hex. See `Utils/color.ts`.
 *
 * The fallbacks mirror `HandleInertiaRequests::getBrandTokens()` exactly, so an
 * empty field previews the colour the site is actually rendering rather than
 * nothing at all.
 */
const BRAND_PAIRS = [
  {
    theme: 'Light',
    legend: 'Light theme',
    accent: 'brand_accent',
    ink: 'brand_accent_ink',
    fallbackAccent: 'oklch(0.55 0.19 258)',
    fallbackInk: 'oklch(0.99 0 0)',
  },
  {
    theme: 'Dark',
    legend: 'Dark theme',
    accent: 'brand_accent_dark',
    ink: 'brand_accent_ink_dark',
    fallbackAccent: 'oklch(0.72 0.15 258)',
    fallbackInk: 'oklch(0.16 0.03 258)',
  },
] as const

/**
 * Public-site button skins.
 *
 * Fill and text colour are authored together and previewed together, because
 * the failure mode here is a pairing — a fill an editor likes with text that
 * disappears on it. Showing a real button in the chosen colours is the only
 * way that is obvious before saving.
 *
 * Defaults mirror `HandleInertiaRequests::getBrandTokens()`. The secondary
 * fill defaults to `transparent`, which is why every swatch below has to
 * survive a value that paints nothing.
 */
const BRAND_BUTTONS = [
  {
    key: 'primary',
    legend: 'Primary button',
    description:
      'The main call to action — hero buttons, the header CTA, form submits.',
    fill: 'brand_button_primary',
    ink: 'brand_button_primary_ink',
    fillLabel: 'Primary button colour',
    inkLabel: 'Primary button text colour',
    fallbackFill: '#111827',
    fallbackInk: '#ffffff',
    bordered: false,
  },
  {
    key: 'secondary',
    legend: 'Secondary button',
    description:
      'The supporting action beside it — outlined by default, so its fill may be transparent.',
    fill: 'brand_button_secondary',
    ink: 'brand_button_secondary_ink',
    fillLabel: 'Secondary button colour',
    inkLabel: 'Secondary button text colour',
    fallbackFill: 'transparent',
    fallbackInk: '#111827',
    bordered: true,
  },
] as const

const BRAND_RADIUS_FALLBACK = '0.5rem'

/** Empty means "unset", and an unset token renders as the shipped default. */
function previewValue(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : fallback
}

/**
 * The picker swatch.
 *
 * The visible square is a plain element painted with the *real* stored value,
 * so `oklch()`, `hsl()` and alpha all preview exactly as the browser will
 * render them. The `<input type="color">` is laid transparently over it purely
 * as the click target — it is fed a hex approximation so the OS picker opens on
 * roughly the right colour, and it only reports upward on a real change.
 *
 * That split is the whole trick: the approximation is never a value, only a
 * starting position, so mounting the form cannot rewrite an `oklch()` setting.
 */
function ColorSwatchPicker({
  value,
  fallback,
  label,
  onPick,
}: {
  value: string
  fallback: string
  label: string
  onPick: (hex: string) => void
}) {
  const shown = previewValue(value, fallback)
  const empty = isTransparentColor(shown)

  return (
    <span
      className={cn(
        'relative inline-flex size-9 shrink-0 overflow-hidden rounded-md border border-border',
        'has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/50'
      )}
    >
      {/* Checkerboard under everything, so a translucent or fully transparent
          value reads as "no fill" instead of as opaque black. */}
      <span aria-hidden='true' className='absolute inset-0' style={CHECKERBOARD_STYLE} />
      {empty ? null : (
        <span
          aria-hidden='true'
          className='absolute inset-0'
          style={{ backgroundColor: shown }}
        />
      )}
      <input
        type='color'
        aria-label={label}
        /* Display-only: a lossy hex read of whatever is stored, used solely as
           the position the OS picker opens on. A value that paints nothing has
           no hex at all, so the picker opens on white rather than on the black
           `#000000` would imply. Neither is ever saved on its own. */
        value={empty ? '#ffffff' : toHexApprox(shown, toHexApprox(fallback, '#000000'))}
        onChange={(event) => onPick(event.target.value)}
        className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
      />
    </span>
  )
}

const appearanceFormSchema: any = z.object({
  site_settings: z.object({
    theme_mode: z.enum(['light', 'dark']),
    font: z.enum(fonts as [string, ...string[]]),
    quick_actions: z.array(z.string()).optional(),
    brand_accent: z.string().optional(),
    brand_accent_ink: z.string().optional(),
    brand_accent_dark: z.string().optional(),
    brand_accent_ink_dark: z.string().optional(),
    brand_button_primary: z.string().optional(),
    brand_button_primary_ink: z.string().optional(),
    brand_button_secondary: z.string().optional(),
    brand_button_secondary_ink: z.string().optional(),
    brand_radius: z.string().optional(),
  })
})

type AppearanceFormProps = {
  props: {
    site_theme_settings?: {
      theme_mode?: 'light' | 'dark' | 'system'
      font?: string,
    },
    /* `SettingsController@appearance` ships these flat, alongside the legacy
       nested shape above. Both are read so neither source silently wins. */
    theme_mode?: 'light' | 'dark' | 'system' | null,
    font?: string | null,
    quick_actions?: any,
    /* Public-site brand tokens, passed through by `SettingsController@appearance`. */
    brand_accent?: string | null,
    brand_accent_ink?: string | null,
    brand_accent_dark?: string | null,
    brand_accent_ink_dark?: string | null,
    /* Public-site button skins. Seeded, so these arrive populated. */
    brand_button_primary?: string | null,
    brand_button_primary_ink?: string | null,
    brand_button_secondary?: string | null,
    brand_button_secondary_ink?: string | null,
    brand_radius?: string | null,
  }
}

export function AppearanceForm({ props }: AppearanceFormProps) {

  const {
    site_theme_settings,
    quick_actions
  } = props;

  /* `theme_mode` and `font` are required by the schema, so a missing default
     fails validation before `handleSubmit` ever calls the submit handler —
     which would take every other field on this form down with it, including
     the brand tokens below. */
  const themeMode = props.theme_mode ?? site_theme_settings?.theme_mode;
  const storedFont = props.font ?? site_theme_settings?.font;

  const defaultValues: any = {
    theme_mode: themeMode === 'dark' ? ('dark' as const) : ('light' as const),
    font: storedFont && (fonts as string[]).includes(storedFont) ? storedFont : fonts[0],
    quick_actions: quick_actions || [],
    brand_accent: props.brand_accent ?? '',
    brand_accent_ink: props.brand_accent_ink ?? '',
    brand_accent_dark: props.brand_accent_dark ?? '',
    brand_accent_ink_dark: props.brand_accent_ink_dark ?? '',
    brand_button_primary: props.brand_button_primary ?? '',
    brand_button_primary_ink: props.brand_button_primary_ink ?? '',
    brand_button_secondary: props.brand_button_secondary ?? '',
    brand_button_secondary_ink: props.brand_button_secondary_ink ?? '',
    brand_radius: props.brand_radius ?? '',
  }



  const form = useForm({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      site_settings: defaultValues
    }
  })

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

  const { t } = useTranslations();

  /* Only the four button tokens are watched, so typing an accent does not
     re-render the previews — and typing a button colour repaints only this
     section, never the theme or font controls. */
  const [previewPrimaryFill, previewPrimaryInk, previewSecondaryFill, previewSecondaryInk] =
    useWatch({
      control: form.control,
      name: [
        'site_settings.brand_button_primary',
        'site_settings.brand_button_primary_ink',
        'site_settings.brand_button_secondary',
        'site_settings.brand_button_secondary_ink',
      ] as never,
    }) as Array<string | undefined>

  const buttonPreviewValues: Record<string, [string | undefined, string | undefined]> = {
    primary: [previewPrimaryFill, previewPrimaryInk],
    secondary: [previewSecondaryFill, previewSecondaryInk],
  }

  /**
   * One brand token: a picker swatch and the raw value, side by side.
   *
   * Called as a function rather than mounted as a component so the inputs are
   * not remounted (and focus lost) on every keystroke — the swatch re-reads
   * `field.value`, which changes on each character.
   */
  const brandColorField = (
    name: string,
    label: string,
    description: string,
    fallback: string,
    options?: { allowTransparent?: boolean }
  ) => (
    <FormField
      key={name}
      control={form.control}
      name={`site_settings.${name}` as never}
      render={({ field }) => {
        const current = typeof field.value === 'string' ? field.value : ''

        return (
          <FormItem>
            <FormLabel>{t(label)}</FormLabel>
            <div className='flex items-center gap-3'>
              <ColorSwatchPicker
                value={current}
                fallback={fallback}
                label={t('Pick a colour for :field', { field: t(label) })}
                onPick={field.onChange}
              />
              <FormControl>
                <Input
                  {...field}
                  autoComplete='off'
                  spellCheck={false}
                  value={current}
                  placeholder={fallback}
                  className='font-mono'
                />
              </FormControl>
              {options?.allowTransparent ? (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='shrink-0'
                  onClick={() => field.onChange('transparent')}
                >
                  {t('No fill')}
                </Button>
              ) : null}
            </div>
            <FormDescription>{t(description)}</FormDescription>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((e) => onSettingsUpdate(e, submit))} className='space-y-8'>
        {/* First block on the screen, not last. These are the only settings on
            this page that change something a visitor sees, and they were
            previously unreachable — the constants existed but nothing rendered
            them. */}
        <section
          aria-labelledby='brand-tokens-heading'
          className='p-4 space-y-6 border rounded-xl border-border sm:p-5'
        >
          <div className='space-y-1'>
            <h4 id='brand-tokens-heading' className='text-base font-semibold'>
              {t('Public website appearance')}
            </h4>
            <p className='text-sm text-muted-foreground'>
              {t('These settings change the public marketing website only — its accent colour, its buttons and its corner radius. Nothing here touches this admin panel, which has its own separate design system.')}
            </p>
            <p className='text-xs text-muted-foreground'>
              {t('Click a swatch to pick a colour. The field beside it accepts any CSS colour the browser understands — hex, hsl(), oklch() or transparent — and an empty field falls back to the shipped default shown as the placeholder.')}
            </p>
          </div>

          {/* ---- Accent --------------------------------------------------- */}
          <div className='space-y-4'>
            <h5 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
              {t('Accent')}
            </h5>

            {BRAND_PAIRS.map((pair) => (
              <fieldset key={pair.theme} className='space-y-4'>
                <legend className='pb-2 text-sm font-medium'>{t(pair.legend)}</legend>

                {brandColorField(
                  pair.accent,
                  'Accent',
                  'Links, underlines, focus outlines and the small accent marks in the header panels.',
                  pair.fallbackAccent
                )}

                {brandColorField(
                  pair.ink,
                  'Text on accent',
                  'The text colour used on top of the accent — it must stay legible against it.',
                  pair.fallbackInk
                )}
              </fieldset>
            ))}
          </div>

          {/* ---- Buttons -------------------------------------------------- */}
          <div className='space-y-4'>
            <h5 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
              {t('Buttons')}
            </h5>

            <div className='grid gap-4 lg:grid-cols-2'>
              {BRAND_BUTTONS.map((group) => {
                const [rawFill, rawInk] = buttonPreviewValues[group.key] ?? []
                const fill = previewValue(rawFill, group.fallbackFill)
                const ink = previewValue(rawInk, group.fallbackInk)

                return (
                  <fieldset
                    key={group.key}
                    className='p-4 space-y-4 border rounded-lg border-border'
                  >
                    <legend className='px-1 text-sm font-medium'>{t(group.legend)}</legend>

                    <p className='text-xs text-muted-foreground'>{t(group.description)}</p>

                    {/* The pairing, not the two colours in isolation: an editor
                        sees the contrast they just chose before they save it. */}
                    <div
                      className='flex items-center justify-center px-4 py-6 rounded-md bg-muted'
                      role='img'
                      aria-label={t('Preview of the :name in the chosen colours', {
                        name: t(group.legend).toLowerCase(),
                      })}
                    >
                      {/* Checkerboard so a transparent fill is visibly a
                          transparent fill, not a white one. */}
                      <span className='relative inline-flex overflow-hidden rounded-full'>
                        <span
                          aria-hidden='true'
                          className='absolute inset-0'
                          style={CHECKERBOARD_STYLE}
                        />
                        <span
                          aria-hidden='true'
                          className={cn(
                            'relative inline-flex h-11 items-center justify-center px-6',
                            'rounded-full text-sm font-medium'
                          )}
                          style={{
                            backgroundColor: fill,
                            color: ink,
                            ...(group.bordered ? { border: `1px solid ${ink}` } : {}),
                          }}
                        >
                          {t('Example button')}
                        </span>
                      </span>
                    </div>

                    {brandColorField(
                      group.fill,
                      group.fillLabel,
                      'The fill of the button.',
                      group.fallbackFill,
                      group.bordered ? { allowTransparent: true } : undefined
                    )}

                    {brandColorField(
                      group.ink,
                      group.inkLabel,
                      'The label colour. Check it against the fill in the preview above.',
                      group.fallbackInk
                    )}
                  </fieldset>
                )
              })}
            </div>
          </div>

          {/* ---- Radius --------------------------------------------------- */}
          <div className='space-y-4'>
            <h5 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
              {t('Radius')}
            </h5>

            <FormField
              control={form.control}
              name='site_settings.brand_radius'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Corner radius')}</FormLabel>
                  <div className='flex items-center gap-3'>
                    <span
                      aria-hidden='true'
                      className='border size-9 shrink-0 border-border bg-muted'
                      style={{
                        borderRadius: previewValue(field.value, BRAND_RADIUS_FALLBACK),
                      }}
                    />
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete='off'
                        spellCheck={false}
                        value={typeof field.value === 'string' ? field.value : ''}
                        placeholder={BRAND_RADIUS_FALLBACK}
                        className='font-mono'
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    {t('A CSS length such as 0.5rem or 0px. Cards, buttons and inputs on the public site derive their rounding from it.')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <FormField
          control={form.control}
          name='site_settings.font'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('Font')}
              </FormLabel>
              <div className='relative w-max'>
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-[200px] appearance-none font-normal capitalize',
                      'dark:bg-background dark:hover:bg-background'
                    )}
                    {...field}
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <ChevronDownIcon className='absolute end-3 top-2.5 h-4 w-4 opacity-50' />
              </div>
              <FormDescription className='font-manrope'>
                {t('Set the font you want to use in the dashboard.')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='site_settings.theme_mode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('Theme')}
              </FormLabel>
              <FormDescription>
                {t('Select the theme for the dashboard.')}
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className='grid max-w-md grid-cols-2 gap-8 pt-2'
              >
                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='light' className='sr-only' />
                    </FormControl>
                    <div className='items-center p-1 border-2 rounded-md border-muted hover:border-accent'>
                      <div className='space-y-2 rounded-sm bg-[#ecedef] p-2'>
                        <div className='p-2 space-y-2 bg-white rounded-md shadow-xs'>
                          <div className='h-2 w-[80px] rounded-lg bg-[#ecedef]' />
                          <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                        </div>
                        <div className='flex items-center p-2 space-x-2 bg-white rounded-md shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                          <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                        </div>
                        <div className='flex items-center p-2 space-x-2 bg-white rounded-md shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                          <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                        </div>
                      </div>
                    </div>
                    <span className='block w-full p-2 font-normal text-center'>
                      {t('Light')}
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='dark' className='sr-only' />
                    </FormControl>
                    <div className='items-center p-1 border-2 rounded-md border-muted bg-popover hover:bg-accent hover:text-accent-foreground'>
                      <div className='p-2 space-y-2 rounded-sm bg-slate-950'>
                        <div className='p-2 space-y-2 rounded-md shadow-xs bg-slate-800'>
                          <div className='h-2 w-[80px] rounded-lg bg-slate-400' />
                          <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                        </div>
                        <div className='flex items-center p-2 space-x-2 rounded-md shadow-xs bg-slate-800'>
                          <div className='w-4 h-4 rounded-full bg-slate-400' />
                          <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                        </div>
                        <div className='flex items-center p-2 space-x-2 rounded-md shadow-xs bg-slate-800'>
                          <div className='w-4 h-4 rounded-full bg-slate-400' />
                          <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                        </div>
                      </div>
                    </div>
                    <span className='block w-full p-2 font-normal text-center'>
                      {t('Dark')}
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />


        <Button type='submit'>
          <ButtonLoader isSubmitting={isSubmitting} />
        </Button>
      </form>
    </Form>
  )
}
