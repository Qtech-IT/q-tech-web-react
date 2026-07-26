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
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
    status: z.string(),
    note: z.string().optional(),
});

export default function LoanRequestStatusUpdateModal() {

    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const { t } = useTranslations();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            status: 'peding',
            note: '',
        }
    });

    useEffect(() => {
        const handler = (e: any) => {
            setOpen(true);
            setUserId(e.detail.id);

            form.setValue('status', e.detail.status);
            form.setValue('note', e.detail.note);
        };

        window.addEventListener('open-status-modal', handler);
        return () => window.removeEventListener('open-status-modal', handler);
    }, []);

    const { loading: isSubmitting, submit } = useInertiaForm();

    const onSubmit = (data: any) => {
        submit({
            method: 'PATCH',
            url: route('backend.loan-requests.update', { id: userId }),
            data: {
                ...data,
                id: userId
            }
        });

        setOpen(false);
        form.reset();
    };

    const formFields = [
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
            ],
            required: true,
        },
        {
            name: 'note',
            label: 'Note',
            type: 'textarea',
            placeholder: 'Optional note (reason for change)',
        }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                        {t('Update Status')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('Change status with optional note')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {formFields.map((field, i) => (
                            <DynamicInputWrapper
                                key={i}
                                field={field}
                                form={form}
                                isSubmitting={isSubmitting}
                            />
                        ))}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                {t('Cancel')}
                            </Button>

                            <Button type="submit" disabled={isSubmitting}>
                                <ButtonLoader
                                    isSubmitting={isSubmitting}
                                    btnText="Update"
                                    loaderText="Updating..."
                                />
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}