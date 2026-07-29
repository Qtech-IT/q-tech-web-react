import { Can } from '@/Components/Can';
import { DeleteDialog } from '@/Components/Core/DynamicCrud/Dialog/DeleteDialog';
import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/UI/Tabs';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import type {
  CmsOption,
  CmsPage,
  CmsPageSection,
  CmsSectionType,
  PageBuilderProps,
} from '@/Types/cms';
import { indexSectionTypes, unwrapItem, unwrapList } from '@/Utils/cms';
import { router } from '@inertiajs/react';
import { Blocks, ExternalLink, Home, Layers, Plus, Radio, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import SeoPanel from '../Seo/SeoPanel';
import { CmsEmpty } from '../Shared/CmsStateBlock';
import PublishDialog from './PublishDialog';
import SectionEditorSheet from './SectionEditorSheet';
import SectionList from './SectionList';
import SectionTypePickerDialog from './SectionTypePickerDialog';

/**
 * The page builder — the CMS centrepiece.
 *
 * Sections are always addressed through their owning page, because a section
 * has no meaning on its own and is never listed globally. Everything on this
 * screen is driven by the section type registry: the picker comes from
 * `sectionTypeGroups`, the editor form from `sectionTypes[].fields`, and the
 * repeaters from `sectionTypes[].block_types`.
 *
 * Reordering is optimistic and rolls back. Persisting the whole uuid order in
 * one request — rather than a call per moved row — is what makes two editors
 * dragging at the same time converge instead of interleaving.
 */
export function PageBuilderWrapper(props: PageBuilderProps) {
  const { t } = useTranslations();
  const { can } = usePermission();

  const { title, sectionTypeGroups, publishStatuses = [] } = props;

  const page = useMemo(() => unwrapItem<CmsPage>(props.page), [props.page]);

  const serverSections = useMemo(
    () => unwrapList<CmsPageSection>(props.data),
    [props.data]
  );

  const sectionTypes = useMemo(
    () => indexSectionTypes(unwrapList<CmsSectionType>(props.sectionTypes)),
    [props.sectionTypes]
  );

  /**
   * Optimistic order. Null means "trust the server", which is the state after
   * every successful reorder and after every fresh page load.
   */
  const [optimistic, setOptimistic] = useState<CmsPageSection[] | null>(null);

  const sections = optimistic ?? serverSections;

  /**
   * The editor tracks a uuid, not a section object. A repeater write inside
   * the sheet triggers a partial reload, and a captured object would keep
   * rendering the pre-reload item list — the new row would save, then vanish
   * from the panel until the sheet was reopened.
   */
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<CmsPageSection | 'page' | null>(null);
  const [deleting, setDeleting] = useState<CmsPageSection | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const editing = useMemo(
    () => sections.find((section) => section.uuid === editingUuid) ?? null,
    [sections, editingUuid]
  );

  const { submit, loading, errors } = useInertiaForm();

  const refresh = useCallback((): void => {
    setOptimistic(null);
    router.reload({ only: ['data', 'page'] });
  }, []);

  /* ---------------------------------------------------------------- */
  /* Reorder                                                          */
  /* ---------------------------------------------------------------- */

  const handleReorder = useCallback(
    (orderedUuids: string[], reordered: CmsPageSection[]): void => {
      const previous = sections;

      setOptimistic(reordered);

      submit({
        method: 'POST',
        url: route('backend.page-sections.reorder'),
        data: { sections: orderedUuids },
        onSuccess: () => setOptimistic(null),
        /* Roll back to exactly what the server last confirmed. Leaving a
           rejected order on screen is worse than never having moved. */
        onError: () => setOptimistic(previous),
      }).catch(() => setOptimistic(previous));
    },
    [sections, submit]
  );

  /* ---------------------------------------------------------------- */
  /* Section writes                                                   */
  /* ---------------------------------------------------------------- */

  const addSection = (sectionType: string): void => {
    const type = sectionTypes[sectionType];

    if (!page) {
      return;
    }

    submit({
      method: 'POST',
      url: route('backend.page-sections.store'),
      data: {
        page_id: page.id,
        section_type: sectionType,
        name: type?.label ?? sectionType,
        /* Seeded from the registry so `data.version` is present from the
           first save — retrofitting it later means guessing which rows
           predate which schema. */
        data: type?.defaults?.data ?? { version: 1 },
        settings: type?.defaults?.settings ?? {},
        status: 'active',
        publish_status: 'draft',
        sort_order: sections.length,
      },
      onSuccess: refresh,
    }).catch(() => undefined);
  };

  const duplicateSection = (section: CmsPageSection): void => {
    submit({
      method: 'POST',
      url: route('backend.page-sections.duplicate', { page_section: section.uuid }),
      data: {
        name: t(':name (copy)', { name: section.name ?? section.section_type }),
      },
      onSuccess: refresh,
    }).catch(() => undefined);
  };

  const deleteSection = (id: number | string): void => {
    const target = sections.find((section) => section.id === id || section.uuid === id);

    if (!target) {
      return;
    }

    submit({
      method: 'DELETE',
      url: route('backend.page-sections.destroy', { page_section: target.uuid }),
      onSuccess: () => {
        setDeleting(null);
        refresh();
      },
    }).catch(() => undefined);
  };

  const toggleStatus = (section: CmsPageSection, active: boolean): void => {
    submit({
      method: 'POST',
      url: route('backend.page-sections.update.status'),
      /* `status` is the kill switch, not the editorial state — publishing
         goes through the publish dialog below. */
      data: { id: section.id, value: active ? 'active' : 'inactive' },
      onSuccess: refresh,
    }).catch(() => undefined);
  };

  const applyPublish = (next: {
    publish_status: string;
    published_at: string | null;
    expires_at: string | null;
  }): void => {
    if (publishing === 'page') {
      if (!page) {
        return;
      }

      submit({
        method: 'POST',
        url: route('backend.pages.publish', { page: page.uuid }),
        data: next,
        onSuccess: () => {
          setPublishing(null);
          refresh();
        },
      }).catch(() => undefined);

      return;
    }

    if (!publishing) {
      return;
    }

    /**
     * Sections have no dedicated publish endpoint — `page-sections.update` is
     * the only writer of `publish_status`, so the full section payload is
     * resubmitted with the new editorial state.
     */
    submit({
      method: 'POST',
      url: `${route('backend.page-sections.update', { page_section: publishing.uuid })}?_method=PATCH`,
      data: {
        page_id: publishing.page_id,
        block_id: publishing.block_id,
        section_type: publishing.section_type,
        name: publishing.name,
        anchor: publishing.anchor,
        eyebrow: publishing.eyebrow,
        heading: publishing.heading,
        subheading: publishing.subheading,
        body: publishing.body,
        media_id: publishing.media?.id ?? null,
        cta_id: publishing.cta?.id ?? null,
        secondary_cta_id: publishing.secondary_cta?.id ?? null,
        data: publishing.data ?? {},
        settings: publishing.settings ?? {},
        status: publishing.status,
        sort_order: publishing.sort_order,
        ...next,
      },
      onSuccess: () => {
        setPublishing(null);
        refresh();
      },
    }).catch(() => undefined);
  };

  const makeHomepage = (): void => {
    if (!page) {
      return;
    }

    submit({
      method: 'POST',
      url: route('backend.pages.make.homepage', { page: page.uuid }),
      onSuccess: refresh,
    }).catch(() => undefined);
  };

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */

  const breadcrumbItems = [
    { label: t('Dashboard'), href: route('backend.dashboard') },
    { label: t('Pages'), href: route('backend.pages.index') },
    { label: page?.title ?? t('Page') },
  ];

  /* The page prop is required by the route, so its absence is a real error. */
  if (!page) {
    return (
      <MainLayout title={title}>
        <CmsEmpty
          icon={Blocks}
          title={t('Page not found')}
          description={t('This page could not be loaded. It may have been deleted.')}
          action={
            <Button type="button" onClick={() => router.visit(route('backend.pages.index'))}>
              {t('Back to pages')}
            </Button>
          }
        />
      </MainLayout>
    );
  }

  const publishTarget =
    publishing === 'page'
      ? {
        publish_status: page.publish_status,
        published_at: page.published_at,
        expires_at: page.expires_at,
      }
      : publishing
        ? {
          publish_status: publishing.publish_status,
          published_at: publishing.published_at,
          expires_at: publishing.expires_at,
        }
        : { publish_status: 'draft', published_at: null, expires_at: null };

  return (
    <MainLayout title={title}>
      <CommonLayoutHeader
        variant="inner"
        breadcrumbItems={breadcrumbItems}
        title={page.title}
        description={t('Arrange, edit and publish the sections that make up this page.')}
        icon={Blocks}
        backUrl={route('backend.pages.index')}
        badges={[
          { label: page.path || '/', variant: 'outline' },
          {
            label: page.is_live ? t('Live') : String(page.publish_status ?? t('Draft')),
            variant: page.is_live ? 'default' : 'secondary',
          },
          ...(page.is_homepage ? [{ label: t('Homepage'), variant: 'outline' }] : []),
        ]}
        primaryAction={
          can('section.create')
            ? {
              label: t('Add Section'),
              icon: Plus,
              onClick: () => setPickerOpen(true),
              variant: 'default',
            }
            : null
        }
        secondaryActions={[
          ...(can('page.publish')
            ? [
              {
                label: t('Publishing'),
                icon: Radio,
                onClick: () => setPublishing('page'),
                variant: 'outline',
              },
            ]
            : []),
          ...(can('page.publish') && !page.is_homepage
            ? [
              {
                label: t('Make Homepage'),
                icon: Home,
                onClick: makeHomepage,
                variant: 'outline',
              },
            ]
            : []),
          ...(page.is_live && page.path
            ? [
              {
                label: t('View Live'),
                icon: ExternalLink,
                onClick: () => window.open(page.path, '_blank', 'noopener'),
                variant: 'outline',
              },
            ]
            : []),
        ]}
      />

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">
            <Layers className="w-4 h-4 mr-2" aria-hidden="true" />
            {t('Content')}
            <Badge variant="secondary" className="ml-2">
              {sections.length}
            </Badge>
          </TabsTrigger>
          <Can permission={['seo-meta.view', 'seo-meta.manage-seo']}>
            <TabsTrigger value="seo">
              <Search className="w-4 h-4 mr-2" aria-hidden="true" />
              {t('SEO')}
            </TabsTrigger>
          </Can>
        </TabsList>

        <TabsContent value="content" className="pt-6">
          {sections.length === 0 ? (
            <CmsEmpty
              icon={Layers}
              title={t('This page has no sections yet')}
              description={t('Add your first section to start building the page.')}
              action={
                can('section.create') ? (
                  <Button type="button" onClick={() => setPickerOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t('Add Section')}
                  </Button>
                ) : null
              }
            />
          ) : (
            <SectionList
              sections={sections}
              canReorder={can('section.reorder')}
              busy={loading}
              onReorder={handleReorder}
              onEdit={(section) => setEditingUuid(section.uuid)}
              onDuplicate={duplicateSection}
              onDelete={setDeleting}
              onToggleStatus={toggleStatus}
              onPublish={setPublishing}
            />
          )}
        </TabsContent>

        <TabsContent value="seo" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('Search & Social')}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Addressed by morph owner and locale, never by a SeoMeta id —
                  the row may not exist yet. */}
              <SeoPanel
                owner={{ type: 'page', id: page.id }}
                locale={page.locale}
                fallbackTitle={page.title}
                fallbackPath={page.path}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SectionTypePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        groups={sectionTypeGroups ?? {}}
        onSelect={addSection}
        busy={loading}
      />

      <SectionEditorSheet
        open={editing !== null}
        onOpenChange={(open) => setEditingUuid(open ? editingUuid : null)}
        section={editing}
        sectionType={editing ? (sectionTypes[editing.section_type] ?? null) : null}
        onSaved={refresh}
        readOnly={!can('section.edit')}
      />

      <PublishDialog
        open={publishing !== null}
        onOpenChange={(open) => setPublishing(open ? publishing : null)}
        title={
          publishing === 'page' ? t('Page publishing') : t('Section publishing')
        }
        description={
          publishing === 'page'
            ? t('Controls whether this page renders on the public site.')
            : t('Controls whether this section renders within the page.')
        }
        publishStatuses={publishStatuses as CmsOption[]}
        value={publishTarget}
        onSubmit={applyPublish}
        busy={loading}
        error={(errors as Record<string, string | undefined>).publish_status}
      />

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open: boolean) => setDeleting(open ? deleting : null)}
        onDelete={deleteSection}
        item={deleting}
        isSubmitting={loading}
        config={{
          title: t('Delete Section'),
          description: t('Are you sure you want to delete this section? Its repeater items go with it.'),
          itemType: 'Section',
          showItemDetails: true,
          itemDisplayFields: [
            { label: t('Name'), key: 'name', className: 'font-semibold' },
            { label: t('Type'), key: 'type_label', className: 'text-muted-foreground' },
          ],
        }}
      />
    </MainLayout>
  );
}

export default PageBuilderWrapper;
