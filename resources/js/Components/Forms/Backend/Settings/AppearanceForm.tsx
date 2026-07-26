

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
import { RadioGroup, RadioGroupItem } from '@/Components/UI/RadioGroup'
import { onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { fonts } from '@/Utils/constants'
import { cn } from '@/Utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const actionOptions = [
  { label: "Recharge", value: "recharge" },
  { label: "Withdraw", value: "withdraw" },
  { label: "Customer service", value: "customer_service" },
  { label: "Flash swap", value: "flash_swap" },
  { label: "Boost loan", value: "boost_loan" },
  { label: "Transfer", value: "transfer" },
];

const appearanceFormSchema: any = z.object({
  site_settings: z.object({
    theme_mode: z.enum(['light', 'dark']),
    font: z.enum(fonts as [string, ...string[]]),
    quick_actions: z.array(z.string()).optional()

  })
})

type AppearanceFormProps = {
  props: {
    site_theme_settings?: {
      theme_mode?: 'light' | 'dark' | 'system'
      font?: string,


    },
    quick_actions?: any
  }
}

export function AppearanceForm({ props }: AppearanceFormProps) {

  const {
    site_theme_settings,
    quick_actions
  } = props;

  const themeMode = site_theme_settings?.theme_mode;


  const defaultValues: any = {
    theme_mode: themeMode == 'system' ? "light" as const : themeMode as 'light' | 'dark',
    font: site_theme_settings?.font || fonts[0],
    quick_actions: quick_actions || []
  }



  const form = useForm({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      site_settings: defaultValues
    }
  })

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

  const { t } = useTranslations();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((e) => onSettingsUpdate(e, submit))} className='space-y-8'>
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

        <FormField
          control={form.control}
          name="site_settings.quick_actions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("User Quick Actions")}</FormLabel>
              <FormDescription>
                {t("Select which actions will be visible to users")}
              </FormDescription>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {actionOptions.map((action) => {
                  const checked = field.value?.includes(action.value);

                  return (
                    <label
                      key={action.value}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition
                ${checked
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:bg-gray-50"}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...(field.value || []), action.value]);
                          } else {
                            field.onChange(
                              field.value.filter((v: string) => v !== action.value)
                            );
                          }
                        }}
                      />
                      <span className="text-sm">{action.label}</span>
                    </label>
                  );
                })}
              </div>

              <FormMessage />
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
