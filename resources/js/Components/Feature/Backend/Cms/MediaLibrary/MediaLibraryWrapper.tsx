import { Can } from '@/Components/Can';
import { DeleteDialog } from '@/Components/Core/DynamicCrud/Dialog/DeleteDialog';
import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import Pagination from '@/Components/UI/Pagination';
import { SafeImage } from '@/Components/UI/SafeImage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import type {
  CmsMedia,
  CmsMediaFolder,
  MediaLibraryProps,
} from '@/Types/cms';
import { unwrapList, unwrapMeta } from '@/Utils/cms';
import { router } from '@inertiajs/react';
import {
  FileText,
  Folder,
  FolderTree,
  ImageIcon,
  Images,
  RotateCcw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { CmsEmpty } from '../Shared/CmsStateBlock';
import MediaDetailsPanel from './MediaDetailsPanel';
import MediaUploadDialog from './MediaUploadDialog';

/**
 * The media library.
 *
 * The folder sidebar ships alongside the grid in one response rather than the
 * client issuing a second request for it — the library is opened constantly
 * and by every other module through the picker, so halving its request count
 * is worth shipping the tree eagerly.
 *
 * Deleting soft-deletes: the file survives on disk so a restore from trash can
 * bring it back. Permanent deletion is a separate, separately-permissioned
 * action.
 */
export function MediaLibraryWrapper(props: MediaLibraryProps) {
  const { t } = useTranslations();
  const { can } = usePermission();

  const { title, mediaTypes = [], statuses = [] } = props;

  const media = useMemo(() => unwrapList<CmsMedia>(props.data), [props.data]);
  const meta = useMemo(() => unwrapMeta<CmsMedia>(props.data), [props.data]);
  const folders = useMemo(
    () => unwrapList<CmsMediaFolder>(props.folders),
    [props.folders]
  );

  const [search, setSearch] = useState('');
  const [folderId, setFolderId] = useState<number | null>(null);
  const [mediaType, setMediaType] = useState<string>('all');
  const [selected, setSelected] = useState<number[]>([]);
  const [active, setActive] = useState<CmsMedia | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleting, setDeleting] = useState<CmsMedia | null>(null);
  const [moveTarget, setMoveTarget] = useState<string>('');

  const { submit, loading } = useInertiaForm();

  /**
   * Trash mode is a SERVER concern, driven by `?is_trash=1`.
   *
   * `MediaService::getMedia()` applies `Filterable::recycle()`, which swaps the
   * query to `onlyTrashed()` when that key is present — so the toggle is a
   * navigation, not a client-side filter. Reading it from the URL rather than
   * from state means a reload, a back button, or a shared link all land in the
   * same view the user was looking at.
   */
  const isTrash = useMemo(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('is_trash') === '1',
    // `props.data` changes on every visit, which is the signal the URL moved.
    [props.data]
  );

  const refresh = useCallback((): void => {
    setSelected([]);
    router.reload({ only: ['data', 'folders'] });
  }, []);

  const setTrashMode = useCallback((next: boolean): void => {
    setSelected([]);
    setActive(null);
    setDeleting(null);

    router.get(
      route('backend.media.index'),
      next ? { is_trash: 1 } : {},
      { preserveScroll: true, preserveState: false }
    );
  }, []);

  /** Bring one trashed asset back. The file was never unlinked. */
  const restoreMedia = (item: CmsMedia): void => {
    submit({
      method: 'POST',
      url: route('backend.media.restore', { media: item.uuid }),
      onSuccess: () => {
        setActive(null);
        refresh();
      },
    }).catch(() => undefined);
  };

  /**
   * Filtering is client-side over the current page only. The server owns
   * pagination, so this narrows what is visible without a request per
   * keystroke — and the folder chips below re-query properly.
   */
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return media.filter((item) => {
      if (folderId !== null && item.folder_id !== folderId) {
        return false;
      }

      if (mediaType !== 'all' && item.media_type !== mediaType) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [item.original_name, item.title, item.alt_text, item.caption]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [media, search, folderId, mediaType]);

  const toggleSelected = (id: number): void =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );

  const moveSelected = (): void => {
    if (selected.length === 0) {
      return;
    }

    submit({
      method: 'POST',
      url: route('backend.media.move'),
      data: {
        ids: selected,
        folder_id: moveTarget === '' || moveTarget === 'root' ? null : Number(moveTarget),
      },
      onSuccess: refresh,
    }).catch(() => undefined);
  };

  const deleteMedia = (id: number | string): void => {
    const target = media.find((item) => item.id === id || item.uuid === id);

    if (!target) {
      return;
    }

    submit({
      method: 'DELETE',
      // In trash the row is already soft-deleted, so `destroy` would be a
      // no-op — the only meaningful delete left is the permanent one.
      url: isTrash
        ? route('backend.media.force.destroy', { media: target.uuid })
        : route('backend.media.destroy', { media: target.uuid }),
      onSuccess: () => {
        setDeleting(null);
        setActive(null);
        refresh();
      },
    }).catch(() => undefined);
  };

  const withoutAlt = useMemo(
    () =>
      media.filter((item) => item.media_type === 'image' && !item.alt_text).length,
    [media]
  );

  return (
    <MainLayout title={title}>
      <CommonLayoutHeader
        variant="index"
        breadcrumbItems={[
          { label: t('Dashboard'), href: route('backend.dashboard') },
          { label: t('Media Library') },
        ]}
        title={isTrash ? t('Media Library — Trash') : t('Media Library')}
        description={
          isTrash
            ? t('Deleted files. Restore them, or delete them permanently.')
            : t('Every image, video and document the site uses.')
        }
        icon={isTrash ? Trash2 : Images}
        badges={isTrash ? [{ label: t('Trash'), variant: 'destructive' }] : []}
        primaryAction={
          // Uploading into the trash makes no sense, so the action is the way
          // out of it instead.
          isTrash
            ? {
              label: t('Back to Library'),
              icon: Images,
              onClick: () => setTrashMode(false),
              variant: 'default',
            }
            : can('media.create')
              ? {
                label: t('Upload'),
                icon: Upload,
                onClick: () => setUploadOpen(true),
                variant: 'default',
              }
              : null
        }
        secondaryActions={[
          ...(isTrash
            ? []
            : can('media.delete')
              ? [
                {
                  label: t('Trash'),
                  icon: Trash2,
                  onClick: () => setTrashMode(true),
                  variant: 'outline' as const,
                },
              ]
              : []),
          ...(can('folder.view') && !isTrash
            ? [
              {
                label: t('Manage Folders'),
                icon: FolderTree,
                onClick: () => router.visit(route('backend.media-folders.index')),
                variant: 'outline' as const,
              },
            ]
            : []),
        ]}
      />

      {/* An image with no alt text is an accessibility defect waiting to ship,
          so the count is surfaced rather than buried per-asset. */}
      {withoutAlt > 0 ? (
        <div className="flex items-center gap-2 p-3 text-sm border rounded-xl border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <ImageIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
          {t(':count images on this page have no alt text.', { count: withoutAlt })}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-2" aria-label={t('Folders')}>
          <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            {t('Folders')}
          </h2>

          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setFolderId(null)}
              aria-current={folderId === null ? 'true' : undefined}
              className={`flex items-center w-full gap-2 px-3 py-2 text-sm text-left rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${folderId === null
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted text-muted-foreground'
                }`}
            >
              <Images className="w-4 h-4 shrink-0" aria-hidden="true" />
              {t('All files')}
            </button>

            {folders.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                {t('No folders yet.')}
              </p>
            ) : null}

            {folders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => setFolderId(folder.id)}
                aria-current={folderId === folder.id ? 'true' : undefined}
                style={{ paddingInlineStart: `${0.75 + folder.depth * 0.75}rem` }}
                className={`flex items-center w-full gap-2 px-3 py-2 text-sm text-left rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${folderId === folder.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted text-muted-foreground'
                  }`}
              >
                <Folder className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="flex-1 truncate">{folder.name}</span>
                {folder.media_count !== undefined ? (
                  <span className="text-xs tabular-nums opacity-70">
                    {folder.media_count}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </aside>

        <div className="space-y-4 min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('Search by name, alt text or caption')}
                aria-label={t('Search media')}
                className="pl-10"
              />
            </div>

            <Select value={mediaType} onValueChange={setMediaType}>
              <SelectTrigger className="sm:w-48" aria-label={t('Filter by type')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All types')}</SelectItem>
                {mediaTypes.map((option) => (
                  <SelectItem key={String(option.value)} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3 p-3 border rounded-xl border-border bg-muted/40">
              <span className="text-sm font-medium">
                {t(':count selected', { count: selected.length })}
              </span>

              <Can permission="media.edit">
                <div className="flex items-center gap-2">
                  <Select value={moveTarget} onValueChange={setMoveTarget}>
                    <SelectTrigger className="w-48" aria-label={t('Move to folder')}>
                      <SelectValue placeholder={t('Move to folder…')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">{t('Library root')}</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={String(folder.id)}>
                          {folder.path || folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    size="sm"
                    disabled={loading || moveTarget === ''}
                    onClick={moveSelected}
                  >
                    {t('Move')}
                  </Button>
                </div>
              </Can>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setSelected([])}
              >
                <X className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                {t('Clear')}
              </Button>
            </div>
          ) : null}

          {visible.length === 0 ? (
            isTrash ? (
              <CmsEmpty
                icon={Trash2}
                title={t('Trash is empty')}
                description={t('Deleted files appear here until you remove them permanently.')}
                action={
                  <Button type="button" variant="outline" onClick={() => setTrashMode(false)}>
                    <Images className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t('Back to Library')}
                  </Button>
                }
              />
            ) : (
              <CmsEmpty
                icon={Images}
                title={search || folderId !== null ? t('Nothing matches') : t('The library is empty')}
                description={
                  search || folderId !== null
                    ? t('Try a different search or folder.')
                    : t('Upload your first file to get started.')
                }
                action={
                  can('media.create') ? (
                    <Button type="button" onClick={() => setUploadOpen(true)}>
                      <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t('Upload')}
                    </Button>
                  ) : null
                }
              />
            )
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visible.map((item) => {
                const isSelected = selected.includes(item.id);
                const isImage = item.media_type === 'image';

                return (
                  <li key={item.id} className="relative">
                    <button
                      type="button"
                      onClick={() => setActive(item)}
                      className={`w-full overflow-hidden text-left transition border rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isSelected
                        ? 'border-primary ring-2 ring-primary/40'
                        : 'border-border hover:border-primary/50'
                        }`}
                    >
                      <div className="flex items-center justify-center overflow-hidden aspect-square bg-muted">
                        {isImage ? (
                          <SafeImage
                            src={item.url}
                            alt={item.alt_text ?? item.original_name}
                            /* Intrinsic size reserves the box, so the grid
                               does not reflow as thumbnails decode. */
                            width={item.width ?? undefined}
                            height={item.height ?? undefined}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <FileText
                            className="w-10 h-10 text-muted-foreground"
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <div className="p-2 space-y-1">
                        <p className="text-xs font-medium truncate text-foreground">
                          {item.original_name}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {item.extension}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {item.size_human}
                          </span>
                        </div>
                        {isImage && !item.alt_text ? (
                          <p className="text-[10px] text-amber-600 dark:text-amber-400">
                            {t('No alt text')}
                          </p>
                        ) : null}
                      </div>
                    </button>

                    <label className="absolute flex items-center gap-1 px-1.5 py-1 rounded-md cursor-pointer top-2 left-2 bg-background/90 backdrop-blur">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelected(item.id)}
                        className="size-3.5 accent-primary"
                      />
                      <span className="sr-only">
                        {t('Select :name', { name: item.original_name })}
                      </span>
                    </label>

                    {/* Trash actions live on the card, not in the details panel:
                        a trashed asset is not editable, so opening the panel to
                        restore it would be a detour. */}
                    {isTrash ? (
                      <div className="absolute flex items-center gap-1 top-2 right-2">
                        {can('media.restore') ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-7 px-2"
                            disabled={loading}
                            onClick={() => restoreMedia(item)}
                            title={t('Restore')}
                          >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span className="sr-only">
                              {t('Restore :name', { name: item.original_name })}
                            </span>
                          </Button>
                        ) : null}

                        {/* `media.force-delete` — hyphen, matching both the
                            seeder and MediaPolicy::forceDelete(). An underscore
                            here silently hides the button. */}
                        {can('media.force-delete') ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="h-7 px-2"
                            disabled={loading}
                            onClick={() => setDeleting(item)}
                            title={t('Delete Permanently')}
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span className="sr-only">
                              {t('Permanently delete :name', { name: item.original_name })}
                            </span>
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}

          {meta && meta.last_page > 1 ? (
            <Pagination
              meta={{
                total: meta.total,
                current_page: meta.current_page,
                last_page: meta.last_page,
                ...(meta.from !== null ? { from: meta.from } : {}),
                ...(meta.to !== null ? { to: meta.to } : {}),
              }}
              {...(props.data.links
                ? {
                  links: props.data.links as NonNullable<
                    Parameters<typeof Pagination>[0]['links']
                  >,
                }
                : {})}
            />
          ) : null}
        </div>
      </div>

      <MediaUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        folderId={folderId}
        onUploaded={refresh}
      />

      <MediaDetailsPanel
        media={active}
        open={active !== null}
        onOpenChange={(open) => setActive(open ? active : null)}
        folders={folders}
        statuses={statuses}
        onSaved={refresh}
        onDelete={setDeleting}
      />

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open: boolean) => setDeleting(open ? deleting : null)}
        onDelete={deleteMedia}
        item={deleting}
        isSubmitting={loading}
        config={{
          title: isTrash ? t('Delete Permanently') : t('Move To Trash'),
          description: isTrash
            ? t('The file and its row are removed for good. This cannot be undone.')
            : t('The file is moved to trash. It can be restored, or permanently deleted later.'),
          itemType: 'File',
          warningMessage: isTrash
            ? t('The file is unlinked from disk. Any page still referencing it cannot recover it.')
            : t('Anything currently using this file will lose its image.'),
          showWarningAlert: true,
          showItemDetails: true,
          itemDisplayFields: [
            { label: t('File'), key: 'original_name', className: 'font-semibold' },
            { label: t('Size'), key: 'size_human', className: 'text-muted-foreground' },
          ],
        }}
      />
    </MainLayout>
  );
}

export default MediaLibraryWrapper;
