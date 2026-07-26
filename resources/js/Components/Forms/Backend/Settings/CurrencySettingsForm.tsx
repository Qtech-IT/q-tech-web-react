

import { Badge } from '@/Components/UI/Badge'
import { Button, buttonVariants } from '@/Components/UI/Button'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card'
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
import { Switch } from '@/Components/UI/Switch'
import { onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { currencies } from '@/Utils/constants'
import { cn } from '@/Utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { DollarSign, Globe, Settings, TrendingUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const currencyPositions = ['left', 'right'] as const
const decimalSeparators = ['.', ','] as const
const thousandSeparators = [',', '.', ' ', ''] as const

const currencySettingsSchema = z.object({
  site_settings: z.object({
    // Base Currency Settings
    default_currency: z.string().min(1, "Default currency is required"),
    currency_symbol: z.string().min(1, "Currency symbol is required"),

    // Display Settings
    currency_position: z.string(),
    decimal_separator: z.string().min(1, "Decimal separator is required"),
    thousand_separator: z.string(),
    decimal_places: z.string()
      .min(1, "Decimal places is required")
      .refine((val) => parseInt(val) >= 0, {
        message: "Decimal places cannot be negative"
      })
      .refine((val) => parseInt(val) <= 4, {
        message: "Decimal places cannot exceed 4"
      }),

    show_currency_code: z.boolean(),

  })
});

type CurrencySettingsFormProps = {
  props: {
    default_currency?: string
    currency_symbol?: string
    currency_position?: 'left' | 'right'
    decimal_separator?: string
    thousand_separator?: string
    decimal_places?: number | string
    show_currency_code?: 'active' | 'inactive'
  }
}

export function CurrencySettingsForm({ props }: CurrencySettingsFormProps) {

  let {
    default_currency: defaultCurrency,
    currency_symbol: currencySymbol,
    currency_position: currencyPosition,
    decimal_separator: decimalSeparator,
    thousand_separator: thousandSeparator,
    decimal_places: decimalPlaces,
    show_currency_code: showCurrencyCode,

  } = props;


  if (!currencySymbol) {

    const currency: any = currencies?.find(c => c.code === defaultCurrency);
    currencySymbol = currency?.symbol || '$';

  }

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm();

  const form = useForm({
    resolver: zodResolver(currencySettingsSchema),
    defaultValues: {
      site_settings: {
        default_currency: defaultCurrency || 'USD',
        currency_symbol: currencySymbol || '$',
        currency_position: currencyPosition || 'left',
        decimal_separator: decimalSeparator || '.',
        thousand_separator: thousandSeparator || ',',
        decimal_places: decimalPlaces?.toString() || '2',
        show_currency_code: showCurrencyCode === 'active',
      }
    }
  });

  // Watch form values for dynamic rendering
  const watchCurrency = form.watch('site_settings.default_currency');
  const watchSymbol = form.watch('site_settings.currency_symbol');
  const watchPosition = form.watch('site_settings.currency_position');
  const watchDecimalSeparator = form.watch('site_settings.decimal_separator');
  const watchThousandSeparator = form.watch('site_settings.thousand_separator');
  const watchDecimalPlaces = form.watch('site_settings.decimal_places');
  const watchShowCode = form.watch('site_settings.show_currency_code');


  const { t } = useTranslations();

  // Update symbol when currency changes
  const handleCurrencyChange = (value: string): void => {
    const selected = currencies?.find(c => c.code === value);
    if (selected) {
      form.setValue('site_settings.currency_symbol', selected.symbol);
    }
  };

  // Generate preview
  const generatePreview = (): string => {
    const amount = 1234567.89;
    const places = parseInt(watchDecimalPlaces) || 2;
    const formattedAmount = amount.toFixed(places);

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = formattedAmount.split('.');

    // Format integer part with thousand separator
    const formattedInteger = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, watchThousandSeparator || '');

    // Combine with decimal separator
    const finalAmount = decimalPart
      ? `${formattedInteger}${watchDecimalSeparator}${decimalPart}`
      : formattedInteger;

    // Position symbol
    const withSymbol = watchPosition === 'left'
      ? `${watchSymbol}${finalAmount}`
      : `${finalAmount}${watchSymbol}`;

    // Add currency code if enabled
    return watchShowCode ? `${withSymbol} ${watchCurrency}` : withSymbol;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">
          {t('Currency Settings')}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((e) => onSettingsUpdate(e, submit))} className='space-y-6'>

          {/* Live Preview */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <CardTitle>
                  {t('Live Preview')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('Example amount formatting')}:</p>
                <div className="p-4 bg-white border-2 border-blue-300 rounded-lg dark:bg-gray-900 dark:border-blue-700">
                  <p className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
                    {generatePreview()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Base Currency Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-500" />
                <CardTitle>
                  {t('Base Currency Configuration')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Default Currency */}
              <FormField
                control={form.control as any}
                name='site_settings.default_currency'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('Default Currency')}
                    </FormLabel>
                    <div className='relative w-full max-w-xs'>
                      <FormControl>

                        <Input
                          placeholder="USDT"
                          {...field}
                          className="max-w-xs"
                        />

                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency Symbol */}
              <FormField
                control={form.control as any}
                name="site_settings.currency_symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('Currency Symbol')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$"
                        {...field}
                        className="max-w-xs"
                      />
                    </FormControl>
                    <FormDescription>
                      {t('Symbol used to represent the currency (e.g., $, €, £)')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </CardContent>
          </Card>

          {/* Number Formatting */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" />
                <CardTitle>
                  {t('Number Formatting')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Decimal Separator */}
              <FormField
                control={form.control as any}
                name='site_settings.decimal_separator'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('Decimal Separator')}
                    </FormLabel>
                    <div className='relative w-full max-w-xs'>
                      <FormControl>
                        <select
                          className={cn(
                            buttonVariants({ variant: 'outline' }),
                            'w-full appearance-none font-normal'
                          )}
                          {...field}
                        >
                          {decimalSeparators.map((separator) => (
                            <option key={separator} value={separator}>
                              {separator === '.' ? 'Period (.)' : 'Comma (,)'}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <ChevronDownIcon className='absolute end-3 top-2.5 h-4 w-4 opacity-50' />
                    </div>
                    <FormDescription>
                      {t('Character used to separate decimal places (e.g., 1.23 or 1,23)')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thousand Separator */}
              <FormField
                control={form.control as any}
                name='site_settings.thousand_separator'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('Thousand Separator')}
                    </FormLabel>
                    <div className='relative w-full max-w-xs'>
                      <FormControl>
                        <select
                          className={cn(
                            buttonVariants({ variant: 'outline' }),
                            'w-full appearance-none font-normal'
                          )}
                          {...field}
                        >
                          {thousandSeparators.map((separator) => (
                            <option key={separator} value={separator}>
                              {separator === ',' ? 'Comma (,)' :
                                separator === '.' ? 'Period (.)' :
                                  separator === ' ' ? 'Space ( )' :
                                    'None'}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <ChevronDownIcon className='absolute end-3 top-2.5 h-4 w-4 opacity-50' />
                    </div>
                    <FormDescription>
                      {t('Character used to separate thousands (e.g., 1,000 or 1.000)')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Decimal Places */}
              <FormField
                control={form.control as any}
                name="site_settings.decimal_places"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {t('Decimal Places')}
                      <Badge variant="secondary" className="text-xs">0-4</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="4"
                        placeholder="2"
                        {...field}
                        className="max-w-xs"
                      />
                    </FormControl>
                    <FormDescription>
                      {t("Number of digits to show after decimal point (0-4)")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-500" />
                <CardTitle>
                  {t('Advanced Currency Options')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Show Currency Code */}
              <FormField
                control={form.control as any}
                name="site_settings.show_currency_code"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center gap-2 text-base">
                        {t('Show Currency Code')}
                        {watchShowCode && (
                          <Badge variant="default" className="text-xs">
                            {t('Enabled')}
                          </Badge>
                        )}
                      </FormLabel>
                      <FormDescription>
                        {t('Display currency code alongside symbol (e.g., $100 USD)')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button disabled={isSubmitting} type='submit'>
            <ButtonLoader isSubmitting={isSubmitting} />
          </Button>
        </form>
      </Form>
    </div>
  );
}