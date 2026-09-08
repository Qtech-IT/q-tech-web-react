import { Alert, AlertDescription, AlertTitle } from '@/Components/UI/Alert';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent } from '@/Components/UI/Card';
import { Input } from '@/Components/UI/Input';
import { Label } from '@/Components/UI/Label';
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
import type { ReactElement, ReactNode } from 'react';

import CmsDynamicField from '../Shared/CmsDynamicField';
import SectionRepeater from './SectionRepeater';

export interface SectionEditorFormProps {
  section: CmsPageSection;
  sectionType: CmsSectionType | null;
  /** Called after a successful save and after every repeater write. */
  onSaved: () => void;
  /** Rendered beside the save button — a "Back to page" link, typically. */
  actions?: ReactNode;
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
 * The section editor form.
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
 *
 * It owns no chrome of its own — no dialog, no sheet, no page header. It was
 * extracted from a drawer precisely so the surface around it could change
 * without the form knowing, and it must stay that way.
 */
export function SectionEditorForm({
  section,
  sectionType,
  onSaved,
  actions,
  readOnly = false,
}: SectionEditorFormProps) {
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
    const current = sectionRef.current;

    const columns: Record<string, unknown> = {};

    for (const field of fields) {
      if (field.store !== 'column') {
        continue;
      }

      columns[field.name] =
        field.name === 'media_id'
          ? (current.media?.id ?? null)
          : field.name === 'cta_id'
            ? (current.cta?.id ?? null)
            : ((current as unknown as Record<string, unknown>)[field.name] ?? '');
    }

    setState({
      name: current.name ?? '',
      anchor: current.anchor ?? '',
      columns,
      data: { ...(current.data ?? {}) },
      settings: { ...(current.settings ?? {}) },
    });

    setMedia({ media_id: current.media ?? null });
    setCtas({ cta_id: current.cta ?? null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.uuid, fields]);

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
      onSuccess: onSaved,
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

  /* A section whose type left the registry has no schema to render a form
     from. Say so instead of showing an empty screen. */
  if (!sectionType) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="w-4 h-4" aria-hidden="true" />
        <AlertTitle>{t('Unknown section type')}</AlertTitle>
        <AlertDescription>
          {t('“:type” is no longer registered, so its fields cannot be edited. Delete the section or restore the type in code.', {
            type: section.section_type,
          })}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="section-name">{t('Internal Name')}</Label>
              <Input
                id="section-name"
                value={state.name}
                disabled={readOnly || loading}
                placeholder={sectionType.label}
                onChange={(event) => setState({ ...state, name: event.target.value })}
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
        </CardContent>
      </Card>

      {groups.length > 0 ? (
        <Tabs defaultValue={groups[0] ?? ''}>
          {/* `overflow-x-auto` + `w-max` inside: a type with six field groups
              otherwise pushes the whole admin into a horizontal scroll on a
              phone. Wrapping instead would reflow the tab strip to three rows
              and bury the save button below the fold. */}
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <TabsList className="w-max">
              {groups.map((group) => (
                <TabsTrigger key={group} value={group}>
                  {group}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {groups.map((group) => (
            <TabsContent key={group} value={group} className="pt-4">
              {group === t('Items') ? (
                <div className="space-y-6">
                  {repeaterFields.map((field) => {
                    /* CONTRACT: a repeater field's `name` IS the `block_types`
                       key it owns — exact string match, nothing else. The
                       definition found under that key carries the per-level
                       min/max the service enforces.

                       There is deliberately no fallback. This used to fall
                       back to the first declared block type, which turned a
                       naming mistake into a silent mis-binding rather than an
                       absent field: with `stats`/`badges` named against
                       `stat`/`badge` keys, BOTH repeaters bound to `stat`, so
                       the "Trust Badges" editor created statistics and badges
                       could never be authored at all. A repeater that renders
                       nothing is a bug an editor reports in a minute; one that
                       writes the wrong rows is a bug that ships. */
                    const blockType = Object.keys(sectionType.block_types ?? {}).find(
                      (key) => key === field.name
                    );

                    if (!blockType) {
                      return null;
                    }

                    return (
                      <SectionRepeater
                        key={field.name}
                        pageSectionId={section.id}
                        blockType={blockType}
                        definition={
                          sectionType.block_types[blockType] ?? { label: field.label }
                        }
                        items={section.blocks ?? []}
                        onChanged={onSaved}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">{renderGroup(group)}</CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p className="text-sm text-muted-foreground">
          {t('This section type declares no editable fields.')}
        </p>
      )}

      {/* Pinned to the bottom of the viewport: the form is tall enough on most
          section types that a static save button sits below the fold, and
          "I scrolled past it" is indistinguishable from "it did not save". */}
      <div className="sticky bottom-0 z-10 flex flex-wrap gap-2 border-t bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Button type="button" onClick={handleSave} disabled={readOnly || loading}>
          <ButtonLoader
            isSubmitting={loading}
            btnText={t('Save section')}
            loaderText={`${t('Saving')}…`}
            icon={<Save className="w-4 h-4" />}
          />
        </Button>

        {actions}
      </div>
    </div>
  );
}

export default SectionEditorForm;
