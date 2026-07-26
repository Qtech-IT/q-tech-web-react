import DynamicInputWrapper from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/UI/Dialog';
import { Form } from '@/Components/UI/Form';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { CurrencyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


const schema = z.object({
    amount: z.string(),
    type: z.any(),
    note: z.string().optional(),
});

export default function WalletHandleModal({ config }: any) {

    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'deposit' | 'withdraw'>('deposit');
    const [userId, setUserId] = useState<number | null>(null);

    const { t } = useTranslations();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: 0 as any,
            type: 'deposit',
            note: '',
        }
    });


    useEffect(() => {
        const handler = (e: any) => {
            setOpen(true);
            setType(e.detail.type);
            setUserId(e.detail.user_id);

            // form.setValue('user_id', e.detail.user_id);
            form.setValue('type', e.detail.type);
        };

        window.addEventListener('open-wallet-modal', handler);
        return () => window.removeEventListener('open-wallet-modal', handler);
    }, []);

    const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()


    const onSubmit = (data: any) => {

        try {
            submit({
                method: 'POST',
                url: route(`backend.user-wallet.handle`),
                data: {
                    ...data,
                    user_id: userId
                },
            })

            setOpen(false)


        } catch (error) {

        }
        form.reset();
    };


    let formFields: any = config?.form?.fields || [];


    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CurrencyIcon className="w-5 h-5" />
                        {t('Wallet Balance Handle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('Manage user wallet balance manually.')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {formFields.map((field: any, index: number) => (
                            <div key={field.name || index} className={getGridColSpan(field.gridColumn)}>
                                <DynamicInputWrapper
                                    field={field}
                                    form={form}
                                    isSubmitting={isSubmitting}
                                    serverErrors={serverErrors}
                                />
                            </div>
                        ))}


                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isSubmitting}
                            >
                                {t('Cancel')}
                            </Button>

                            <Button type="submit" disabled={isSubmitting}>
                                <ButtonLoader
                                    isSubmitting={isSubmitting}
                                    btnText={t('Save')}
                                    loaderText={t('Saving') + '...'}
                                />
                            </Button>
                        </div>
                    </form>
                </Form>

            </DialogContent>

        </Dialog >
    );
}