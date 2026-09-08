import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { Button } from '@/Components/UI/Button';
import { Tabs, TabsList, TabsTrigger } from '@/Components/UI/Tabs';
import { useCmsLocales } from '@/Hooks/useCmsLocales';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import type { SectionEditorProps } from '@/Types/cms';
import type { CmsPage, CmsPageSection, CmsSectionType } from '@/Types/cms';
import { unwrapItem } from '@/Utils/cms';
import { router } from '@inertiajs/react';
import { Blocks, ExternalLink } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { CmsEmpty } from '../Shared/CmsStateBlock';
import SectionEditorForm from './SectionEditorForm';
import SectionTranslationForm from './SectionTranslationForm';

/**
 * The standalone section editor screen.
 *
 * Content editing used to happen in a right-hand drawer. It has a URL now, so
 * a reload keeps the editor where they were, a repeater write can refresh from
 * the server without tearing down the surface around it, and two sections can
 * be open in two tabs — none of which a drawer can do.
 *
 * All the chrome lives here and all the form lives in `SectionEditorForm`, so
 * the form stays reusable from anywhere that needs it (a block body, say).
 */
export function SectionEditorWrapper(props: SectionEditorProps) {
  const { t } = useTranslations();
  const { can } = usePermission();
  const { locales, defaultLocale } = useCmsLocales();

  /** Which locale the editor is working in. Default = structure + English. */
  const [activeLocale, setActiveLocale] = useState<string>(defaultLocale);

  const section = useMemo(
    () => unwrapItem<CmsPageSection>(props.data),
    [props.data]
  );

  const page = useMemo(
    () => (props.page ? unwrapItem<CmsPage>(props.page) : null),
    [props.page]
  );

  const sectionType = useMemo(
    () => (props.sectionType ? unwrapItem<CmsSectionType>(props.sectionType) : null),
    [props.sectionType]
  );

  /**
   * Re-read the section from the server after a write.
   *
   * `only: ['data']` rather than a full visit: a repeater add must not reset
   * the tab an editor is on, and a partial reload leaves the component mounted.
   */
  const refresh = useCallback((): void => {
    router.reload({ only: ['data'] });
  }, []);

  const backUrl = page
    ? route('backend.pages.sections', { page: page.uuid })
    : route('backend.pages.index');

  if (!section) {
    return (
      <MainLayout title={props.title}>
        <CmsEmpty
          icon={Blocks}
          title={t('Section not found')}
          description={t('This section could not be loaded. It may have been deleted.')}
          action={
            <Button type="button" onClick={() => router.visit(route('backend.pages.index'))}>
              {t('Back to pages')}
            </Button>
          }
        />
      </MainLayout>
    );
  }

  const breadcrumbItems = [
    { label: t('Dashboard'), href: route('backend.dashboard') },
    { label: t('Pages'), href: route('backend.pages.index') },
    ...(page ? [{ label: page.title, href: backUrl }] : []),
    { label: section.name || section.type_label || t('Section') },
  ];

  return (
    <MainLayout title={props.title}>
      <CommonLayoutHeader
        variant="inner"
        breadcrumbItems={breadcrumbItems}
        title={section.name || section.type_label || t('Section')}
        description={t('Edit this section’s content.')}
        icon={Blocks}
        backUrl={backUrl}
        badges={[
          ...(section.type_label
            ? [{ label: section.type_label, variant: 'outline' }]
            : []),
          {
            label: String(section.publish_status ?? t('Draft')),
            variant: 'secondary',
          },
        ]}
        secondaryActions={
          page?.is_live && page.path
            ? [
              {
                label: t('View Live'),
                icon: ExternalLink,
                onClick: () => window.open(page.path as string, '_blank', 'noopener'),
                variant: 'outline',
              },
            ]
            : []
        }
      />

      {locales.length > 1 ? (
        <Tabs
          value={activeLocale}
          onValueChange={setActiveLocale}
          className="mb-4"
        >
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <TabsList className="w-max">
              {locales.map((language) => (
                <TabsTrigger key={language.code} value={language.code}>
                  {language.name}
                  {language.code === defaultLocale ? ` · ${t('default')}` : ''}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      ) : null}

      {activeLocale === defaultLocale ? (
        <SectionEditorForm
          section={section}
          sectionType={sectionType}
          onSaved={refresh}
          readOnly={!can('section.edit')}
          actions={
            <Button type="button" variant="outline" onClick={() => router.visit(backUrl)}>
              {page ? t('Back to page') : t('Back')}
            </Button>
          }
        />
      ) : (
        <SectionTranslationForm
          section={section}
          sectionType={sectionType}
          locale={activeLocale}
          localeLabel={
            locales.find((language) => language.code === activeLocale)?.name ??
            activeLocale
          }
          onSaved={refresh}
          readOnly={!can('page.translate')}
        />
      )}
    </MainLayout>
  );
}

export default SectionEditorWrapper;
