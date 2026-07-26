import { Button } from "@/Components/UI/Button";
import { ButtonLoader } from "@/Components/UI/ButtonLoader";
import { Card, CardContent, CardHeader } from "@/Components/UI/Card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/UI/Form";
import { Input } from "@/Components/UI/Input";
import { useForm as useInertiaForm } from "@/Hooks/useForm";
import { useTranslations } from "@/Hooks/useTranslations";
import UserLayout from "@/Layouts/FrontendLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { BadgeCheck, CheckCircle2, FileText, ShieldCheck, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/* ─────────────────── zod schema builder ─────────────────── */

function buildSchema(fields: any[]) {
    const shape: Record<string, z.ZodTypeAny> = {};
    fields.forEach((f: any) => {
        if (f.is_hidden || f.status !== 'active') return;
        if (f.input_type === 'file') {
            let r: z.ZodTypeAny = z.any();
            if (f.is_required) r = r.refine((v: any) => v instanceof File || (typeof v === 'string' && v.length > 0), { message: `${f.label} is required` });
            shape[f.name] = r;
        } else if (f.input_type === 'email') {
            shape[f.name] = f.is_required
                ? z.string().min(1, `${f.label} is required`).email('Enter a valid email')
                : z.string().email('Enter a valid email').optional().or(z.literal(''));
        } else {
            shape[f.name] = f.is_required
                ? z.string().min(1, `${f.label} is required`)
                : z.string().optional().or(z.literal(''));
        }
    });
    return z.object(shape);
}

function buildDefaults(fields: any[]) {
    const d: Record<string, any> = {};
    fields.forEach((f: any) => { d[f.name] = f.default_value ?? (f.input_type === 'file' ? null : ''); });
    return d;
}

/* ─────────────────── dark file input ────────────────────── */

function DarkFileInput({
    field,
    value,
    onChange,
    disabled,
    required,
    error,
}: {
    field: any;
    value: any;
    onChange: (v: any) => void;
    disabled?: boolean;
    required?: boolean;
    error?: string;
}) {
    const { t } = useTranslations();
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const isImage = (v: any) => {
        if (v instanceof File) return v.type.startsWith('image/');
        if (typeof v === 'string') return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(v);
        return false;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onChange(file);
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const clear = () => {
        onChange(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const hasFile = value instanceof File || (typeof value === 'string' && value.length > 0);
    const fileName = value instanceof File ? value.name : typeof value === 'string' ? value.split('/').pop() : '';
    const previewSrc = preview ?? (typeof value === 'string' && isImage(value) ? value : null);

    return (
        <div className="space-y-2">
            {/* Hidden native input */}
            <input
                ref={inputRef}
                type="file"
                accept={field.accept}
                onChange={handleChange}
                disabled={disabled}
                className="hidden"
            />

            {!hasFile ? (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                    className={`w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed transition-colors
                               ${error ? 'border-rose-500/50 bg-rose-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'}
                               ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-700 font-medium">{t('Click to upload')}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{field.placeholder || t('Choose a file')}</p>
                    </div>
                </button>
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    {previewSrc ? (
                        <div className="relative">
                            <img src={previewSrc} className="w-full h-40 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs text-gray-800 font-medium truncate max-w-[200px]">{fileName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => inputRef.current?.click()}
                                        disabled={disabled}
                                        className="px-2 py-1 rounded-md bg-gray-200 text-xs text-gray-700 hover:bg-gray-300"
                                    >
                                        {t('Change')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clear}
                                        className="w-6 h-6 rounded-md bg-rose-100 flex items-center justify-center hover:bg-rose-200"
                                    >
                                        <X className="w-3 h-3 text-rose-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 font-medium truncate">{fileName}</p>
                                {value instanceof File && (
                                    <p className="text-xs text-gray-500">{(value.size / 1024).toFixed(1)} KB</p>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="px-2 py-1 rounded-md bg-gray-200 text-xs text-gray-700 hover:bg-gray-300">
                                    {t('Change')}
                                </button>
                                <button className="w-7 h-7 rounded-md bg-rose-100 flex items-center justify-center hover:bg-rose-200">
                                    <X className="w-3.5 h-3.5 text-rose-500" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─────────────────── single field renderer ──────────────── */

function KycField({ f, form, isSubmitting, serverErrors }: {
    f: any; form: any; isSubmitting: boolean; serverErrors: any;
}) {
    const { t } = useTranslations();

    return (
        <FormField
            control={form.control}
            name={f.name}
            render={({ field: formField }) => (
                <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">
                        {f.label}
                        {f.is_required && <span className="text-rose-400 ml-1">*</span>}
                    </FormLabel>

                    <FormControl>
                        {f.input_type === 'file' ? (
                            <DarkFileInput
                                field={f}
                                value={formField.value}
                                onChange={formField.onChange}
                                disabled={isSubmitting || f.is_read_only}
                                required={f.is_required}
                                error={form.formState.errors[f.name]?.message as string}
                            />
                        ) : f.input_type === 'textarea' ? (
                            <textarea
                                value={formField.value ?? ''}
                                onChange={e => formField.onChange(e.target.value)}
                                placeholder={f.placeholder}
                                disabled={isSubmitting || f.is_read_only}
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                            />
                        ) : (
                            <Input
                                type={f.input_type === 'password' ? 'password' : f.input_type === 'email' ? 'email' : f.input_type === 'number' ? 'number' : f.input_type}
                                value={formField.value ?? ''}
                                onChange={e => formField.onChange(e.target.value)}
                                placeholder={f.placeholder}
                                disabled={isSubmitting || f.is_read_only}
                                className="bg-white border-gray-300 text-gray-900"
                            />
                        )}
                    </FormControl>

                    {f.hint_text && !f.description && (
                        <p className="text-xs text-zinc-500">{f.hint_text}</p>
                    )}
                    {f.description && (
                        <p className="text-xs text-zinc-500">{f.description}</p>
                    )}

                    <FormMessage className="text-rose-400 text-xs" />

                    {serverErrors?.[f.name] && (
                        <p className="text-xs text-rose-400">{serverErrors[f.name]}</p>
                    )}
                </FormItem>
            )}
        />
    );
}

/* ─────────────────── main page ──────────────────────────── */

export default function KycApply({ title, form: dynamicForm, formFields = [] }: any) {
    const { t } = useTranslations();
    const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm();

    formFields = formFields?.data ?? [];
    const sortedFields: any[] = [...formFields]
        .filter((f: any) => f.status === 'active' && !f.is_hidden)
        .sort((a: any, b: any) => (a.order_level ?? 0) - (b.order_level ?? 0));

    const schema = buildSchema(sortedFields);
    const defaults = buildDefaults(sortedFields);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaults,
    });

    const [isLoading, setIsloading] = useState(false);

    const onSubmit = (values: any) => {
        setIsloading(true);
        const fd = new FormData();
        fd.append('form_id', String(dynamicForm?.id ?? ''));
        Object.entries(values).forEach(([key, val]) => {
            if (val instanceof File) fd.append(key, val);
            else if (val !== null && val !== undefined) fd.append(key, String(val));
        });
        router.post(route('user.kyc.submit'), fd, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsloading(false);
            },
        });
    };

    return (
        <UserLayout title={title ?? t('KYC Verification')}>
            <div className="max-w-xl mx-auto px-4 py-6 space-y-4">

                {/* Header */}
                <Card className="bg-white border-gray-200">
                    <CardContent className="py-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                {dynamicForm?.name ?? t('KYC Verification')}
                            </h1>
                        </div>
                    </CardContent>
                </Card>


                {/* Form */}
                <Card className="bg-white border-gray-200">

                    <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="w-4 h-4 text-zinc-500" />
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                                {t('Personal Information')}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-2 pb-5 px-4">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                                encType="multipart/form-data"
                            >
                                {sortedFields.map((f: any) => (
                                    <KycField
                                        key={f.id}
                                        f={f}
                                        form={form}
                                        isSubmitting={isSubmitting}
                                        serverErrors={serverErrors}
                                    />
                                ))}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-2"
                                >
                                    <ButtonLoader isSubmitting={isSubmitting} btnText={t('Submit')} loaderText={t('Submitting')} icon={<ShieldCheck className="w-4 h-4" />} />

                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </div>
        </UserLayout>
    );
}