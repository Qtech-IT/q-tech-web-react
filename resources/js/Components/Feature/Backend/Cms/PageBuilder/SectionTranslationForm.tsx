import { Alert, AlertDescription, AlertTitle } from '@/Components/UI/Alert';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Input } from '@/Components/UI/Input';
import { Label } from '@/Components/UI/Label';
import { Textarea } from '@/Components/UI/Textarea';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import type {
  CmsPageSection,
  CmsSectionBlock,
  CmsSectionField,
  CmsSectionType,
} from '@/Types/cms';
import { AlertTriangle, Languages, Save } from 'lucide-react';
import { useMemo, useState } from 'react';

/**
 * Edits ONE non-default locale for a section — the non-routable translation
 * overlay (schema doc §8.2).
 *
 * Structure (which sections, in what order, with which repeater items) is
 * locale-neutral and edited on the default locale through `SectionEditorForm`.
 * This form only ever writes translated TEXT: the section's translatable
 * `column` / `data` fields, and the same for each repeater item. Everything
 * else — presentation settings, media, CTAs, links — is greyed out because it
 * cannot differ per locale.
 *
 * The English value is shown under every input as a reference. An emptied
 * field deletes its overlay row on save, so the public site falls back to
 * English for it.
 */
export interface SectionTranslationFormProps {
  section: CmsPageSection;
  sectionType: CmsSectionType | null;
  locale: string;
  localeLabel: string;
  onSaved: () => void;
  readOnly?: boolean;
}

/** A translatable text field: `column` or `data`, never `settings`. */
const isTranslatable = (field: CmsSectionField): boolean =>
  field.translatable && field.store !== 'settings' && field.store !== 'block';

/** The dotted path an overlay row is keyed by. */
const fieldPath = (field: CmsSectionField): string =>
  field.store === 'data' ? `data.${field.name}` : field.name;

/** The default-locale (English) value for a field, read off the section/block. */
const baseValue = (
  source: Record<string, unknown> & { data?: Record<string, unknown> | null },
  field: CmsSectionField
): string => {
  const raw =
    field.store === 'data'
      ? (source.data ?? {})[field.name]
      : source[field.name];

  return typeof raw === 'string' ? raw : raw == null ? '' : String(raw);
};

interface RowGroup {
  title: string;
  ownerType: 'section' | 'block';
  ownerUuid: string;
  fields: CmsSectionField[];
  source: Record<string, unknown> & { data?: Record<string, unknown> | null };
  existing: Record<string, string>;
}

export function SectionTranslationForm({
  section,
  sectionType,
  locale,
  localeLabel,
  onSaved,
  readOnly = false,
}: SectionTranslationFormProps) {
  const { t } = useTranslations();
  const { submit, loading, errors } = useInertiaForm();

  /** Pending edits, keyed `${ownerType}:${ownerUuid}` -> { path -> value }. */
  const [draft, setDraft] = useState<Record<string, Record<string, string>>>({});

  const sectionFields = useMemo(
    () => (sectionType?.fields ?? []).filter(isTranslatable),
    [sectionType]
  );

  const blockGroups = useMemo<RowGroup[]>(() => {
    const defs = sectionType?.block_types ?? {};
    const items = section.blocks ?? [];

    return items.flatMap((block: CmsSectionBlock) => {
      const def = defs[block.block_type];
      const fields = (def?.fields ?? []).filter(isTranslatable);

      if (fields.length === 0) {
        return [];
      }

      return [
        {
          title: block.label || def?.label || t('Item'),
          ownerType: 'block' as const,
          ownerUuid: block.uuid,
          fields,
          source: block as unknown as RowGroup['source'],
          existing: block.translations?.[locale] ?? {},
        },
      ];
    });
  }, [sectionType, section.blocks, locale, t]);

  const groups = useMemo<RowGroup[]>(() => {
    const list: RowGroup[] = [];

    if (sectionFields.length > 0) {
      list.push({
        title: t('Section text'),
        ownerType: 'section',
        ownerUuid: section.uuid,
        fields: sectionFields,
        source: section as unknown as RowGroup['source'],
        existing: section.translations?.[locale] ?? {},
      });
    }

    return [...list, ...blockGroups];
  }, [sectionFields, blockGroups, section, locale, t]);

  const draftKey = (group: RowGroup): string =>
    `${group.ownerType}:${group.ownerUuid}`;

  const readValue = (group: RowGroup, path: string): string => {
    const pending = draft[draftKey(group)];

    if (pending && path in pending) {
      return pending[path] ?? '';
    }

    return group.existing[path] ?? '';
  };

  const setValue = (group: RowGroup, path: string, value: string): void => {
    setDraft((current) => ({
      ...current,
      [draftKey(group)]: { ...(current[draftKey(group)] ?? {}), [path]: value },
    }));
  };

  const routeFor = (group: RowGroup): string =>
    group.ownerType === 'section'
      ? route('backend.cms.translations.section', { page_section: group.ownerUuid })
      : route('backend.cms.translations.block', { section_block: group.ownerUuid });

  const saveGroup = (group: RowGroup): void => {
    // Send every translatable field so an emptied one deletes its row.
    const values: Record<string, string> = {};

    for (const field of group.fields) {
      values[fieldPath(field)] = readValue(group, fieldPath(field));
    }

    submit({
      method: 'POST',
      url: `${routeFor(group)}?_method=PUT`,
      data: { locale, values },
      onSuccess: () => {
        setDraft((current) => {
          const next = { ...current };
          delete next[draftKey(group)];

          return next;
        });
        onSaved();
      },
    }).catch(() => undefined);
  };

  if (!sectionType) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>{t('Unknown section type')}</AlertTitle>
        <AlertDescription>
          {t('This section’s type is no longer registered, so it cannot be translated.')}
        </AlertDescription>
      </Alert>
    );
  }

  if (groups.length === 0) {
    return (
      <Alert>
        <Languages className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>{t('Nothing to translate')}</AlertTitle>
        <AlertDescription>
          {t('This section type has no translatable text fields.')}
        </AlertDescription>
      </Alert>
    );
  }

  const errorMap = errors as Record<string, string | undefined>;

  return (
    <div className="space-y-6">
      <Alert>
        <Languages className="h-4 w-4" aria-hidden="true" />
        <AlertDescription>
          {t('Editing the :locale translation. Layout, images and links are set once on the default language. Leave a field blank to fall back to it.', {
            locale: localeLabel,
          })}
        </AlertDescription>
      </Alert>

      {groups.map((group) => {
        const dirty = Boolean(draft[draftKey(group)]);

        return (
          <Card key={draftKey(group)}>
            <CardHeader>
              <CardTitle className="text-base">{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {group.fields.map((field) => {
                const path = fieldPath(field);
                const reference = baseValue(group.source, field);
                const multiline =
                  field.type === 'textarea' ||
                  field.type === 'html_text' ||
                  field.type === 'code';

                return (
                  <div key={path} className="space-y-1.5">
                    <Label htmlFor={`${draftKey(group)}-${path}`}>
                      {field.label}
                    </Label>
                    {multiline ? (
                      <Textarea
                        id={`${draftKey(group)}-${path}`}
                        rows={3}
                        disabled={readOnly || loading}
                        value={readValue(group, path)}
                        onChange={(event) =>
                          setValue(group, path, event.target.value)
                        }
                      />
                    ) : (
                      <Input
                        id={`${draftKey(group)}-${path}`}
                        disabled={readOnly || loading}
                        value={readValue(group, path)}
                        onChange={(event) =>
                          setValue(group, path, event.target.value)
                        }
                      />
                    )}
                    {reference ? (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">{t('Default')}:</span>{' '}
                        {reference}
                      </p>
                    ) : null}
                    {errorMap[`values.${path}`] || errorMap.values ? (
                      <p className="text-xs text-destructive">
                        {errorMap[`values.${path}`] ?? errorMap.values}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              <Button
                type="button"
                size="sm"
                disabled={readOnly || loading || !dirty}
                onClick={() => saveGroup(group)}
              >
                <ButtonLoader
                  isSubmitting={loading}
                  btnText={t('Save :title', { title: group.title })}
                  loaderText={`${t('Saving')}…`}
                  icon={<Save className="h-4 w-4" />}
                />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default SectionTranslationForm;
