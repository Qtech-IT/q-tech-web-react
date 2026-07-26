import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Form } from '@/Components/UI/Form';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CrudPageProps } from '@/Types/crud';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowLeft, QrCode } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const CryptoWalletSaveForm = (props: CrudPageProps) => {
    const { config, item = null } = props;
    const isUpdate = !!item;
    const wallet = item?.data || {};

    const { t } = useTranslations();

    const schema = z.object(config.formValidationRules);
    type FormType = z.infer<typeof schema>;

    const defaultValues: FormType = {
        crypto_id: wallet.crypto?.crypto?.toString() || '',
        network: wallet.network || '',
        address: wallet.address || '',
        notes: wallet.notes || '',
        status: wallet.status || 'active',
    };

    const form = useForm<FormType>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    useEffect(() => {
        if (isUpdate) {
            form.reset(defaultValues);
        }
    }, [isUpdate]);

    const { create, update, isSubmitting, errors: serverErrors } = useCrudManager({
        config,
    });

    const onSubmit = (data: FormType) => {
        isUpdate
            ? update(wallet.id, data)
            : create(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* FORM CARD */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-blue-500" />
                            <CardTitle>
                                {isUpdate ? t('Edit Wallet') : t('Add Wallet')}
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {config.form.fields.map((field: any, index: number) => (
                                <div key={index} className={getGridColSpan(field.gridColumn)}>
                                    <DynamicInputWrapper
                                        field={field}
                                        form={form}
                                        isSubmitting={isSubmitting}
                                        serverErrors={serverErrors}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* QR Preview */}
                        {isUpdate && wallet.qr_code_url && (
                            <div className="mt-6">
                                <p className="text-sm mb-2">{t('QR Preview')}</p>
                                <img
                                    src={wallet.qr_code_url}
                                    className="w-40 border rounded"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                        <ButtonLoader
                            isSubmitting={isSubmitting}
                            btnText={isUpdate ? t('Update') : t('Save')}
                            loaderText={t('Saving...')}
                        />
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit(route(config.routes.index))}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('Back')}
                    </Button>
                </div>

            </form>
        </Form>
    );
};

export default CryptoWalletSaveForm;