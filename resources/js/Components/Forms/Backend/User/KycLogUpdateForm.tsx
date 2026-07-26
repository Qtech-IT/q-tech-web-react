import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Form } from '@/Components/UI/Form';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const KycLogUpdateForm = ({ config, item, onOpenChange = null,
}: any) => {

    const { t } = useTranslations();

    const kyc = item || {};
    const schema = z.object(config.formValidationRules);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            id: kyc.id,
            value: kyc.status,
            note: kyc.note || '',
        }
    });

    useEffect(() => {
        form.reset({
            id: kyc.id,
            value: kyc.status,
            note: kyc.note || '',
        });
    }, [kyc]);

    const { update, isSubmitting, errors } =
        useCrudManager({
            config,
            onSuccess: (action) => {
                if (onOpenChange) {
                    onOpenChange(false);
                } else {
                    form.reset();
                }
            },
        });

    const onSubmit = (data: any) => {
        update(kyc.id, data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                            <CardTitle>{t('Update KYC Status')}</CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        {config.form.fields.map((field: any, i: number) => (
                            <DynamicInputWrapper
                                key={i}
                                field={field}
                                form={form}
                                isSubmitting={isSubmitting}
                                serverErrors={errors}
                            />
                        ))}

                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Button type="submit" disabled={isSubmitting}>
                        <ButtonLoader
                            isSubmitting={isSubmitting}
                            btnText={t('Update')}
                            loaderText={t('Updating...')}
                        />
                    </Button>


                </div>

            </form>
        </Form>
    );
};