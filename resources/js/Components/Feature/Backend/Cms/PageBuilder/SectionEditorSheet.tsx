import { Alert, AlertDescription, AlertTitle } from '@/Components/UI/Alert';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Input } from '@/Components/UI/Input';
import { Label } from '@/Components/UI/Label';
import { ScrollArea } from '@/Components/UI/ScrollArea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/Components/UI/Sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/UI/Tabs';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import type {
  CmsCta,
  CmsMedia,
  CmsPageSection,
  CmsSectionField,
  CmsSectionType,
} from '@/Types/cms';
import { fieldGroups, isFieldVisible, toSlug } from '@/Utils/cms';
import { AlertTriangle, Save } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';

import CmsDynamicField from '../Shared/CmsDynamicField';
import SectionRepeater from './SectionRepeater';

interface SectionEditorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: CmsPageSection | null;
  sectionType: CmsSectionType | null;
  onSaved: () => void;
  readOnly?: boolean;
}

/** Values the form holds, split by where each one is persisted. */
interface EditorState {
  name: string;
  anchor: string;
  columns: Record<string, unknown>;
  data: Record<string, unknown>;
  settings: Record<string, unknown>;
}

/**
 * The section editor.
 *
 * Every field on screen comes from `sectionType.fields` — this component
 * contains no knowledge of any specific section type, and adding
 * `testimonial.carousel` to the PHP registry makes it editable here with no
 * frontend change at all. That is the whole point of the descriptor carrying
 * a `store` per field: the editor groups by `store` to decide *where* a value
 * goes, and by `group` to decide which tab it appears on.
 *
 *   store: 'column'   -> a real column on `page_sections`
 *   store: 'data'     -> a key in the translatable `data` JSON bag
 *   store: 'settings' -> a key in the non-translatable `settings` JSON bag
 *   store: 'block'    -> not a value at all; a repeater of `section_blocks`
 */
export function SectionEditorSheet({
  open,
  onOpenChange,
  section,
  sectionType,
  onSaved,
  readOnly = false,
}: SectionEditorSheetProps) {
  const { t } = useTranslations();

  const { submit, loading, errors } = useInertiaForm();

  const [state, setState] = useState<EditorState>({
    name: '',
    anchor: '',
    columns: {},
    data: {},
    settings: {},
  });

  /** Resolved relations, so a picker can show what the id points at. */
  const [media, setMedia] = useState<Record<string, CmsMedia | null>>({});
  const [ctas, setCtas] = useState<Record<string, CmsCta | null>>({});

  const fields = useMemo<CmsSectionField[]>(
    () => sectionType?.fields ?? [],
    [sectionType]
  );

  const valueFields = useMemo(
    () => fields.filter((field) => field.store !== 'block'),
    [fields]
  );

  const repeaterFields = useMemo(
    () => fields.filter((field) => field.store === 'block'),
    [fields]
  );

  const groups = useMemo(() => {
    const names = fieldGroups(valueFields);

    return repeaterFields.length > 0 ? [...names, t('Items')] : names;
  }, [valueFields, repeaterFields, t]);

  /**
   * Seed only when a *different* section is opened.
   *
   * The parent re-resolves `section` from fresh props after every repeater
   * write, so depending on the object itself would reset the form — and
   * discard unsaved edits — every time an editor added a repeater item.
   * Keying on the uuid re-seeds on a genuine change of subject and nothing
   * else.
   */
  const sectionRef = useRef(section);
  sectionRef.current = section;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const columns: Record<string, unknown> = {};

    for (const field of fields) {
      if (field.store !== 'column') {
        continue;
      }

      columns[field.name] =
        field.name === 'media_id'
          ? (section.media?.id ?? null)
          : field.name === 'cta_id'
            ? (section.cta?.id ?? null)
            : ((section as unknown as Record<string, unknown>)[field.name] ?? '');
    }

    setState({
      name: section.name ?? '',
      anchor: section.anchor ?? '',
      columns,
      data: { ...(section.data ?? {}) },
      settings: { ...(section.settings ?? {}) },
    });

    setMedia({ media_id: section.media ?? null });
    setCtas({ cta_id: section.cta ?? null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section?.uuid, fields]);

  /**
   * Conditional visibility reads across every store, because a `settings`
   * toggle routinely gates a `data` field. Merging once here keeps the
   * predicate honest.
   */
  const allValues = useMemo(
    () => ({ ...state.columns, ...state.data, ...state.settings }),
    [state]
  );

  const setFieldValue = (field: CmsSectionField, value: unknown): void => {
    setState((current) => {
      if (field.store === 'column') {
        return { ...current, columns: { ...current.columns, [field.name]: value } };
      }

      if (field.store === 'settings') {
        return { ...current, settings: { ...current.settings, [field.name]: value } };
      }

      return { ...current, data: { ...current.data, [field.name]: value } };
    });
  };

  const readFieldValue = (field: CmsSectionField): unknown => {
    if (field.store === 'column') {
      return state.columns[field.name];
    }

    if (field.store === 'settings') {
      return state.settings[field.name];
    }

    return state.data[field.name];
  };

  /**
   * Errors arrive keyed as the request validates them — `data.consent_note`,
   * `settings.tone`, or a bare column name.
   */
  const errorFor = (field: CmsSectionField): string | undefined => {
    const key = field.store === 'column' ? field.name : `${field.store}.${field.name}`;

    return (errors as Record<string, string | undefined>)[key];
  };

  const handleSave = (): void => {
    if (!section) {
      return;
    }

    submit({
      method: 'POST',
      url: `${route('backend.page-sections.update', { page_section: section.uuid })}?_method=PATCH`,
      data: {
        page_id: section.page_id,
        block_id: section.block_id,
        section_type: section.section_type,
        name: state.name || null,
        anchor: state.anchor || null,
        ...state.columns,
        secondary_cta_id: section.secondary_cta?.id ?? null,
        data: state.data,
        settings: state.settings,
        /* Editorial state is owned by the publish control, not this form —
           saving content must never silently publish a draft. */
        status: section.status,
        publish_status: section.publish_status,
        published_at: section.published_at,
        expires_at: section.expires_at,
        sort_order: section.sort_order,
      },
      onSuccess: () => {
        onSaved();
        onOpenChange(false);
      },
    }).catch(() => undefined);
  };

  const renderGroup = (group: string): ReactElement => (
    <div className="space-y-5">
      {valueFields
        .filter((field) => (field.group || 'Content') === group)
        .filter((field) => isFieldVisible(field, allValues))
        .map((field) => (
          <CmsDynamicField
            key={`${field.store}.${field.name}`}
            field={field}
            value={readFieldValue(field)}
            error={errorFor(field)}
            disabled={readOnly || loading}
            media={media[field.name] ?? null}
            cta={ctas[field.name] ?? null}
            onChange={(value) => setFieldValue(field, value)}
            onMediaChange={(picked) =>
              setMedia((current) => ({ ...current, [field.name]: picked }))
            }
            onCtaChange={(picked) =>
              setCtas((current) => ({ ...current, [field.name]: picked }))
            }
          />
        ))}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col gap-0 p-0"
      >
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle>{section?.name || sectionType?.label || t('Section')}</SheetTitle>
          <SheetDescription>
            {sectionType?.description ?? t('Edit this section’s content.')}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* A section whose type left the registry has no schema to render
                a form from. Say so instead of showing an empty panel. */}
            {section && !sectionType ? (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                <AlertTitle>{t('Unknown section type')}</AlertTitle>
                <AlertDescription>
                  {t('“:type” is no longer registered, so its fields cannot be edited. Delete the section or restore the type in code.', {
                    type: section.section_type,
                  })}
                </AlertDescription>
              </Alert>
            ) : null}

            {section && sectionType ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="section-name">{t('Internal Name')}</Label>
                    <Input
                      id="section-name"
                      value={state.name}
                      disabled={readOnly || loading}
                      placeholder={sectionType.label}
                      onChange={(event) =>
                        setState({ ...state, name: event.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('Only shown to editors, to tell similar sections apart.')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="section-anchor">{t('Anchor')}</Label>
                    <Input
                      id="section-anchor"
                      value={state.anchor}
                      disabled={readOnly || loading}
                      placeholder="pricing"
                      onChange={(event) =>
                        setState({ ...state, anchor: toSlug(event.target.value) })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('Lets a menu item or CTA link straight to this section.')}
                    </p>
                  </div>
                </div>

                {groups.length > 0 ? (
                  <Tabs defaultValue={groups[0] ?? ''}>
                    <TabsList className="flex-wrap w-full h-auto">
                      {groups.map((group) => (
                        <TabsTrigger key={group} value={group}>
                          {group}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {groups.map((group) => (
                      <TabsContent key={group} value={group} className="pt-4">
                        {group === t('Items') ? (
                          <div className="space-y-6">
                            {repeaterFields.map((field) => {
                              /* Each repeater field names the block_type it
                                 owns; the definition carries the per-level
                                 min/max the service enforces. */
                              const blockType =
                                Object.keys(sectionType.block_types ?? {}).find(
                                  (key) => key === field.name
                                ) ?? Object.keys(sectionType.block_types ?? {})[0];

                              if (!blockType) {
                                return null;
                              }

                              return (
                                <SectionRepeater
                                  key={field.name}
                                  pageSectionId={section.id}
                                  blockType={blockType}
                                  definition={
                                    sectionType.block_types[blockType] ?? {
                                      label: field.label,
                                    }
                                  }
                                  items={section.blocks ?? []}
                                  onChanged={onSaved}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          renderGroup(group)
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t('This section type declares no editable fields.')}
                  </p>
                )}
              </>
            ) : null}
          </div>
        </ScrollArea>

        <SheetFooter className="flex-row gap-2 p-6 pt-4 border-t">
          <Button
            type="button"
            onClick={handleSave}
            disabled={readOnly || loading || !sectionType}
            className="flex-1 sm:flex-none"
          >
            <ButtonLoader
              isSubmitting={loading}
              btnText={t('Save section')}
              loaderText={`${t('Saving')}…`}
              icon={<Save className="w-4 h-4" />}
            />
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('Cancel')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default SectionEditorSheet;
