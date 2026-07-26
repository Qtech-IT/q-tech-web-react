import DynamicInputWrapper from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/Components/UI/Dialog';
import { Form } from '@/Components/UI/Form';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Crown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
    is_winner: z.any(),
    win_until: z.preprocess(
        (val) => val === '' ? null : val,
        z.string().nullable()
    ),
});

export default function WinnerHandleModal() {

    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const { t } = useTranslations();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            is_winner: 0,
            win_until: '',
        }
    });

    useEffect(() => {
        const handler = (e: any) => {

            console.log(e.detail);

            setOpen(true);
            setUserId(e.detail.user_id);

            form.setValue('is_winner', e.detail.is_winner ? 1 : 0);
            form.setValue(
                'win_until',
                e.detail.row_win_until ?? null
            );
        };

        window.addEventListener('open-winner-modal', handler);
        return () => window.removeEventListener('open-winner-modal', handler);
    }, []);

    const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm();

    const onSubmit = (data: any) => {
        submit({
            method: 'POST',
            url: route('backend.users.update-winner'),
            data: {
                ...data,
                user_id: userId
            }
        });

        setOpen(false);
        form.reset();
    };

    const formFields = [
        {
            name: 'is_winner',
            label: 'Is Winner',
            type: 'select',
            required: true,
            options: [
                { value: 1, label: 'Yes' },
                { value: 0, label: 'No' },
            ],
        },
        {
            name: 'win_until',
            label: 'Win Until',
            type: 'datetime-local',
            disabled: !form.watch('is_winner'),

        }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        {t('Winner Setup')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('Configure winner status and duration')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {formFields.map((field: any, index: number) => (
                            <div key={index} className={getGridColSpan(field.gridColumn)}>
                                <DynamicInputWrapper
                                    field={field}
                                    form={form}
                                    isSubmitting={isSubmitting}
                                    serverErrors={serverErrors}
                                />
                            </div>
                        ))}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type='button' variant="outline" onClick={() => setOpen(false)}>
                                {t('Cancel')}
                            </Button>

                            <Button type="submit" disabled={isSubmitting}>
                                <ButtonLoader
                                    isSubmitting={isSubmitting}
                                    btnText="Save"
                                    loaderText="Saving..."
                                />
                            </Button>
                        </div>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}