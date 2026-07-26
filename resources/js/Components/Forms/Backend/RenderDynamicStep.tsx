import DynamicInputWrapper from "@/Components/Core/DynamicCrud/DynamicInputWrapper";
import { useTranslations } from "@/Hooks/useTranslations";
import { getGridColSpan } from "@/Utils/helpers";
import { ClipboardList } from "lucide-react";


const renderField = (fieldDef: any, form: any, currentStep: any, isSubmitting: boolean) => {
    if (fieldDef?.is_hidden) return null;

    if (fieldDef?.is_hidden) return null;

    const fieldName = fieldDef.name ?? fieldDef.field_name;
    const isSelectType = ['select', 'radio', 'checkbox', 'multi-select', 'multiselect'].includes(fieldDef.type);

    // For selects: include current RHF value in key so Radix remounts
    // when form.reset() gives it a new value (text inputs don't need this)
    const currentVal = isSelectType ? form.getValues(fieldName) : '';
    const fieldKey = isSelectType
        ? `${currentStep?.code}-${fieldName}-${currentVal}`
        : fieldName;
    return (
        <div key={fieldKey} className={getGridColSpan(fieldDef.gridColumn)}>
            <DynamicInputWrapper
                key={fieldDef.name}
                field={fieldDef}
                form={form as any}
                isSubmitting={isSubmitting}

            />
        </div >
    );
};


export const renderDynamicStep = (formFields: any, form: any, currentStep: any, isSubmitting: boolean) => {

    const { t } = useTranslations();


    if (!formFields.length) {
        return (
            <div className="py-12 text-center text-muted-foreground">
                <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">{t('No fields configured for this step.')}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...formFields]
                .sort((a, b) => (a.order_level ?? 0) - (b.order_level ?? 0))
                .filter(f => !f.is_hidden)
                .map(f => renderField({
                    name: f.name,
                    label: f.label,
                    type: f.input_type,
                    placeholder: f.placeholder || '',
                    description: f.description || f.hint_text || '',
                    required: f.is_required,
                    is_read_only: f.is_read_only,
                    options: f.values && typeof f.values === 'object'
                        ? Object.entries(f.values).map(([label, value]) => ({ value, label }))
                        : []

                },
                    form,
                    currentStep,
                    isSubmitting
                ))}
        </div>
    );
};