

import { Button } from '@/Components/UI/Button'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { zodResolver } from '@hookform/resolvers/zod'
import { DollarSign, Globe } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const currencySettingsSchema = z.object({
    site_settings: z.object({

        minimum_deposit_amount: z.coerce.number()
            .min(0.000000000000000001, "Minimum deposit amount must be at least 0.1")
            .max(999999999, "Deposit amount cannot exceed 999999999"),

        maximum_deposit_amount: z.coerce.number()
            .min(1, "Maximum deposit amount must be at least 1")
            .max(999999999, "Deposit amount cannot exceed 999999999"),

        minimum_withdrawal_amount: z.coerce.number()
            .min(1, "Minimum withdrawal amount must be at least 1"),

        maximum_withdrawal_amount: z.coerce.number()
            .min(1, "Maximum withdrawal amount must be at least 1"),

        withdrawal_fee: z.coerce.number()
            .min(0, "Withdrawal fee cannot be negative"),

        deposit_fee: z.coerce.number()
            .min(0, "Deposit fee cannot be negative"),

    })
});

export function WithdrawDepositConfigurationForm({ props }: any) {


    let {
        title: title,
        currency_symbol: currencySymbol,
        minimum_deposit_amount: minimumDepositAmount,
        maximum_deposit_amount: maximumDepositAmount,
        minimum_withdrawal_amount: minimumWithdrawalAmount,
        maximum_withdrawal_amount: maximumWithdrawalAmount,
        withdrawal_fee: withdrawalFee,
        deposit_fee: depositFee,
        modelProperty


    } = props;


    const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm();

    const form = useForm({
        resolver: zodResolver(currencySettingsSchema),
        defaultValues: {
            site_settings: {
                minimum_deposit_amount: minimumDepositAmount || 0,
                maximum_deposit_amount: maximumDepositAmount || 0,
                minimum_withdrawal_amount: minimumWithdrawalAmount || 0,
                maximum_withdrawal_amount: maximumWithdrawalAmount || 0,
                withdrawal_fee: withdrawalFee || 0,
                deposit_fee: depositFee || 0,

            }
        }
    });

    const { t } = useTranslations();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">
                    {t('Money management settings')}
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit((e) => onSettingsUpdate(e, submit))} className='space-y-6'>



                    {/* Base Currency Settings */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-green-500" />
                                <CardTitle>
                                    {t('Withdraw & Deposit Settings')}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <FormField
                                control={form.control as any}
                                name='site_settings.minimum_deposit_amount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('Minimum Deposit Amount') + ' '} ({currencySymbol})
                                        </FormLabel>
                                        <div className='relative w-full max-w-xs'>
                                            <FormControl>

                                                <Input
                                                    min={0}
                                                    placeholder="1000"
                                                    {...field}
                                                    className="max-w-xs"
                                                />

                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control as any}
                                name='site_settings.maximum_deposit_amount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('Maximum Deposit Amount') + ' '} ({currencySymbol})
                                        </FormLabel>
                                        <div className='relative w-full max-w-xs'>
                                            <FormControl>

                                                <Input
                                                    min={0}
                                                    placeholder="1000"
                                                    {...field}
                                                    className="max-w-xs"
                                                />

                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control as any}
                                name='site_settings.minimum_withdrawal_amount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('Minimum Withdrawal Amount') + ' '} ({currencySymbol})
                                        </FormLabel>
                                        <div className='relative w-full max-w-xs'>
                                            <FormControl>

                                                <Input
                                                    min={0}
                                                    placeholder="1000"
                                                    {...field}
                                                    className="max-w-xs"
                                                />

                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control as any}
                                name='site_settings.maximum_withdrawal_amount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('Maximum Withdrawal Amount') + ' '} ({currencySymbol})
                                        </FormLabel>
                                        <div className='relative w-full max-w-xs'>
                                            <FormControl>

                                                <Input
                                                    min={0}
                                                    placeholder="1000"
                                                    {...field}
                                                    className="max-w-xs"
                                                />

                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control as any}
                                name='site_settings.withdrawal_fee'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('Withdrawal Fee') + ' '} %
                                        </FormLabel>
                                        <div className='relative w-full max-w-xs'>
                                            <FormControl>

                                                <Input
                                                    min={0}
                                                    placeholder="1000"
                                                    {...field}
                                                    className="max-w-xs"
                                                />

                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            <FormField
                                control={form.control as any}
                                name='site_settings.deposit_fee'
                                render={({ field }) => (
                                    <FormItem style={{ gridColumn: 'span 3' }}>

                                        <FormLabel>
                                            {t('Deposit Fee') + ' '} %
                                        </FormLabel>
                                        <div className='relative w-full max-w-xs'>
                                            <FormControl>

                                                <Input
                                                    min={0}
                                                    placeholder="1000"
                                                    {...field}
                                                    className="max-w-xs"
                                                />

                                            </FormControl>
                                        </div>

                                        <FormMessage />
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