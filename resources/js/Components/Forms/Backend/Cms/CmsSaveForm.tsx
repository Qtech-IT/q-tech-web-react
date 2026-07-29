import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Form } from '@/Components/UI/Form';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CrudConfig, FormField } from '@/Types/crud';
import { unwrapItem } from '@/Utils/cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowLeft, Save, Settings2, SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/** A `section` key a config may assign to a field. Unknown keys fall into `basic`. */
type SectionKey = 'basic' | 'grid';

interface CmsSaveFormProps {
  config: CrudConfig;
  item?: unknown;
  /** Supplied by `DynamicDialog` in modal mode; absent on a full page. */
  onOpenChange?: ((open: boolean) => void) | null;
  [key: string]: unknown;
}

/**
 * The save form every config-driven CMS screen shares.
 *
 * `DynamicForm` renders one flat grid and derives its schema from per-field
 * `validation`, which cannot express the conditional rules the CMS requests
 * use — `CtaSaveRequest` requires `url` only for `url`/`anchor` link types,
 * `MenuItemSaveRequest` *prohibits* it for structural items. Rendering a
 * required field that the server will reject, or hiding one it demands, is
 * the failure mode this component exists to prevent.
 *
 * It adds exactly three things over `DynamicForm` and reuses everything else:
 *   1. schema from `config.formValidationRules` (as `RoleSaveForm` does),
 *   2. `section` grouping into a full-width block and a two-column grid,
 *   3. `showWhen` / `dependsOn` conditional visibility driven by `watch`.
 */
export function CmsSaveForm(props: CmsSaveFormProps) {
  const { config, item = null, onOpenChange = null } = props;

  const { t } = useTranslations();

  /** Modal mode closes the dialog; page mode resets or navigates back. */
  const isModal = typeof onOpenChange === 'function';

  const record = useMemo(
    () => unwrapItem<Record<string, unknown>>(item) ?? null,
    [item]
  );

  const isUpdate = Boolean(record?.id ?? record?.uuid);

  const fields: FormField[] = useMemo(
    () => config?.form?.fields ?? [],
    [config]
  );

  const schema = useMemo(
    () => z.object((config?.formValidationRules ?? {}) as z.ZodRawShape),
    [config]
  );

  /**
   * Seed from the record, then the field default, then a type-appropriate
   * empty. Booleans must seed `false` and numbers `0` — seeding `''` makes a
   * switch uncontrolled on first render and React warns for the life of the
   * form.
   */
  const defaultValues = useMemo(() => {
    const values: Record<string, unknown> = {};

    for (const field of fields) {
      const stored = record?.[field.name];

      const fallback =
        field.defaultValue ??
        (field.type === 'number'
          ? 0
          : field.type === 'switch' || field.type === 'checkbox'
            ? false
            : '');

      values[field.name] = stored ?? fallback;
    }

    return values;
  }, [fields, record]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const watched = form.watch();

  const { create, update, isSubmitting, errors: serverErrors } = useCrudManager({
    config,
    onSuccess: (action) => {
      if (isModal) {
        onOpenChange?.(false);

        return;
      }

      if (action === 'create') {
        form.reset(defaultValues);
      }
    },
  });

  /**
   * A field is visible unless its `showWhen` predicate rejects the value its
   * `dependsOn` field currently holds.
   */
  const isVisible = useMemo(
    () =>
      (field: FormField): boolean => {
        if (!field.dependsOn || typeof field.showWhen !== 'function') {
          return true;
        }

        return field.showWhen(watched[field.dependsOn]);
      },
    [watched]
  );

  const visibleFields = useMemo(
    () => fields.filter(isVisible),
    [fields, isVisible]
  );

  const bySection = useMemo(() => {
    const groups: Record<SectionKey, FormField[]> = { basic: [], grid: [] };

    for (const field of visibleFields) {
      groups[field.section === 'grid' ? 'grid' : 'basic'].push(field);
    }

    return groups;
  }, [visibleFields]);

  const onSubmit = (data: Record<string, unknown>): void => {
    /**
     * A hidden conditional field keeps whatever the record held, which the
     * server would then re-validate against the *new* link type and reject.
     * Nulling it is what makes switching a CTA from URL to page succeed.
     */
    const payload: Record<string, unknown> = { ...data };

    for (const field of fields) {
      if (!isVisible(field)) {
        payload[field.name] = null;
      }
    }

    if (isUpdate) {
      update(record?.uuid ?? record?.id, payload);

      return;
    }

    create(payload);
  };

  if (fields.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-sm text-center text-muted-foreground">
          {t('This screen has no editable fields configured.')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {bySection.basic.length > 0 ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" aria-hidden="true" />
                <CardTitle>{t('Details')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {bySection.basic.map((field) => (
                <DynamicInputWrapper
                  key={field.name}
                  field={field}
                  form={form}
                  isSubmitting={isSubmitting}
                  serverErrors={serverErrors}
                />
              ))}
            </CardContent>
          </Card>
        ) : null}

        {bySection.grid.length > 0 ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" aria-hidden="true" />
                <CardTitle>{t('Configuration')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {bySection.grid.map((field) => (
                  <DynamicInputWrapper
                    key={field.name}
                    field={field}
                    form={form}
                    isSubmitting={isSubmitting}
                    serverErrors={serverErrors}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div
          className={
            isModal
              ? 'flex flex-col gap-3 pt-4 border-t sm:flex-row'
              : 'flex flex-col gap-3 py-4 border-t sm:flex-row sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          }
        >
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText={isUpdate ? t('Update') : t('Create')}
              loaderText={`${isUpdate ? t('Updating') : t('Creating')}...`}
              icon={<Save className="w-4 h-4" />}
            />
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() =>
              isModal
                ? onOpenChange?.(false)
                : router.visit(route(config.routes.index as string))
            }
          >
            {isModal ? null : <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />}
            {isModal ? t('Cancel') : t('Back')}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CmsSaveForm;
