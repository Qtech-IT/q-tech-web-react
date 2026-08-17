<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\FieldStore;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Models\Block;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\SectionBlock;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PageSectionService
{
    use CacheInvalidation;

    public function __construct(
        protected SectionTypeRegistry $registry,
        protected MediaService $media,
    ) {}

    /**
     * Every section on a page, with the relations the editor needs.
     *
     * The eager-load list is the whole point: `blocks.primaryMedia` in one
     * batched query per level is the difference between 5 queries and one per
     * repeater item.
     *
     * @return Collection<int, PageSection>
     */
    public function getForPage(Page $page): Collection
    {
        return $page->sections()
            ->with([
                'primaryMedia',
                'cta',
                'secondaryCta',
                'block:id,uuid,key,name',
                'blocks.primaryMedia',
                'blocks.cta',
                'blocks.children',

                // Without these two, a nested child's media and CTA are simply
                // absent from SectionBlockResource (whenLoaded omits rather
                // than lazy-loads) — the editor would open a tab item and find
                // its image silently missing.
                'blocks.children.primaryMedia',
                'blocks.children.cta',
            ])
            ->get();
    }

    /**
     * The public render payload for a page: sections filtered to what a
     * visitor may see, in order, fully eager-loaded.
     *
     * @return Collection<int, PageSection>
     */
    public function getPublished(Page $page): Collection
    {
        return $page->visibleSections()
            ->with([
                'primaryMedia',
                'cta',
                'secondaryCta',
                'media',

                // Nested repeater children must carry their OWN media and CTA
                // eager-loads. Loading bare `children` here would resolve the
                // rows in one query but then hit the database once per child
                // the moment a template touched its image — an N+1 that only
                // appears on section types that actually nest (tabs,
                // accordions), which is exactly the kind that survives review.
                'blocks' => fn ($query) => $query->active()->with([
                    'primaryMedia',
                    'cta',
                    'children' => fn ($child) => $child->active(),
                    'children.primaryMedia',
                    'children.cta',
                ]),
            ])
            ->get();
    }

    /**
     * Create or update a section.
     */
    public function save(Request $request, ?PageSection $section = null): PageSection
    {
        return DB::transaction(function () use ($request, $section): PageSection {
            $section ??= new PageSection;

            $sectionType = $request->input('section_type', $section->section_type);

            $owner = $this->resolveOwner($request, $section);

            $section->site_id = (int) config('cms.site_id');
            $section->page_id = $owner['page_id'];
            $section->block_id = $owner['block_id'];
            $section->section_type = $sectionType;
            $section->name = $request->input('name');
            $section->anchor = $request->filled('anchor') ? make_slug($request->input('anchor')) : null;

            // The six universal scalars, as columns.
            $section->eyebrow = $request->input('eyebrow');
            $section->heading = $request->input('heading');
            $section->subheading = $request->input('subheading');
            $section->body = $request->input('body');
            $section->media_id = $request->input('media_id');
            $section->cta_id = $request->input('cta_id');
            $section->secondary_cta_id = $request->input('secondary_cta_id');

            // Registry-whitelisted JSON. Validation alone is not enough — the
            // strip is what stops a crafted payload writing arbitrary keys into
            // `data`, which would then flow into the React renderer.
            $section->data = $this->whitelist($sectionType, FieldStore::DATA, $request->input('data', []));
            $section->settings = $this->whitelist($sectionType, FieldStore::SETTINGS, $request->input('settings', []));

            $section->status = $request->input('status', Status::ACTIVE->value);
            $section->sort_order = (int) $request->input('sort_order', $section->sort_order ?? $this->nextSortOrder($section));

            $section->publish_status = $request->input(
                'publish_status',
                $section->publish_status?->value ?? ContentStatus::PUBLISHED->value
            );
            $section->published_at = $request->input('published_at', $section->published_at ?? now());
            $section->expires_at = $request->input('expires_at');

            $section->save();

            $this->forgetSection($section);

            return $section;
        });
    }

    /**
     * Persist a new order for a page's sections.
     *
     * A per-row UPDATE, which is exactly what a JSON array of items cannot
     * give you: two editors dragging in the same section produce a lost update
     * under read-modify-write, and MySQL's JSON_SET on an array index has no
     * row lock granular enough to prevent it.
     *
     * @param  array<int, string>  $uuids  Section uuids in their new order.
     */
    public function reorder(array $uuids): int
    {
        return DB::transaction(function () use ($uuids): int {
            $sections = PageSection::whereIn('uuid', $uuids)->get()->keyBy('uuid');
            $updated = 0;

            foreach (array_values($uuids) as $position => $uuid) {
                $section = $sections->get($uuid);

                if (! $section instanceof PageSection) {
                    continue;
                }

                $section->sort_order = $position;
                $section->save();
                $updated++;
            }

            if ($sections->isNotEmpty()) {
                // One invalidation after the loop, not one per row.
                $this->forgetSection($sections->first());
            }

            return $updated;
        });
    }

    /**
     * Deep-copy a section: the row, every repeater item beneath it at every
     * level, and every media attachment.
     *
     * Four properties this guarantees, each of which is a bug if dropped:
     *
     *  - The copy lands as `draft`, never inheriting `published`/`scheduled`.
     *    Duplicating a live section to experiment on it must not push a second
     *    copy of that section onto the live page.
     *  - Every row gets a fresh uuid. The uuid is the stable translation
     *    address (§1.3) and the route key; reusing one would make the copy and
     *    the source the same object to the translation overlay.
     *  - The copy sits immediately after the source, with later siblings
     *    shifted down, so it appears where the editor clicked rather than at
     *    the bottom of a forty-section page.
     *  - Media associations are copied, the `media` rows are not. The library
     *    is shared by design; duplicating the assets would fill it with
     *    byte-identical uploads.
     *
     * @param  string|null  $name  Optional label for the copy.
     */
    public function duplicate(PageSection $section, ?string $name = null): PageSection
    {
        return DB::transaction(function () use ($section, $name): PageSection {
            $sourceBlocks = SectionBlock::where('page_section_id', $section->id)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get();

            // Before writing anything: a cap lowered after the source was
            // authored means the source itself is now over-quota, and the copy
            // must be refused rather than silently truncated to fit.
            $this->guardDuplicateCaps($section, $sourceBlocks);

            // Make room at sort_order + 1. Strict `>` leaves any existing tie
            // with the source where it is, which is the conservative choice —
            // the copy still lands after its source either way.
            $this->ownerScope($section)
                ->where('sort_order', '>', $section->sort_order)
                ->increment('sort_order');

            // uuid is omitted so HasUuid mints a new one; the audit columns are
            // omitted so HasAuditUsers stamps whoever clicked duplicate rather
            // than inheriting the original author.
            $copy = $section->replicate(['uuid', 'created_by', 'updated_by']);

            $copy->name = $this->copyName($section, $name);

            // The anchor is a DOM id. Copying it would put two identical ids on
            // one page — invalid HTML, a WCAG failure, and it silently breaks
            // every menu item and in-page link targeting that anchor. The
            // editor re-assigns it if the copy needs one.
            $copy->anchor = null;

            $copy->publish_status = ContentStatus::DRAFT;
            $copy->published_at = null;
            $copy->expires_at = null;
            $copy->sort_order = $section->sort_order + 1;

            $copy->save();

            $this->copyBlocks($sourceBlocks, $copy);

            $this->media->copyAttachments($section, $copy);

            $this->forgetSection($copy);

            return $copy;
        });
    }

    /**
     * Recreate a section's repeater tree under a new section.
     *
     * Walks parents before children off an in-memory grouping rather than
     * re-querying per level, so the whole tree costs one SELECT plus one
     * INSERT per row regardless of depth.
     *
     * @param  \Illuminate\Support\Collection<int, SectionBlock>|Collection<int, SectionBlock>  $sourceBlocks
     */
    protected function copyBlocks(iterable $sourceBlocks, PageSection $copy): void
    {
        $byParent = collect($sourceBlocks)->groupBy(fn (SectionBlock $block): int => (int) $block->parent_id);

        $copyLevel = function (int $sourceParentId, ?int $newParentId) use (&$copyLevel, $byParent, $copy): void {
            foreach ($byParent->get($sourceParentId, []) as $source) {
                /** @var SectionBlock $source */
                $child = $source->replicate(['uuid']);

                $child->page_section_id = $copy->id;
                $child->parent_id = $newParentId;

                // sort_order is carried over verbatim: sibling order is part of
                // what "duplicate" means.
                $child->sort_order = $source->sort_order;

                $child->save();

                $this->media->copyAttachments($source, $child);

                $copyLevel((int) $source->id, (int) $child->id);
            }
        };

        // parent_id NULL groups under key 0 — the top level.
        $copyLevel(0, null);
    }

    /**
     * Refuse a duplicate that would exceed a registry cap.
     *
     * `max` is a PER-LEVEL sibling cap, so the count is grouped by
     * (parent, block_type) exactly as SectionBlockService::guardCount() counts
     * it — a nested child is counted against its own parent, never against the
     * top level.
     *
     * This fires when a cap has been lowered since the source was authored.
     * Truncating to fit is the wrong failure mode: it silently discards
     * editorial content and the editor has no way to know which items went.
     *
     * @param  \Illuminate\Support\Collection<int, SectionBlock>|Collection<int, SectionBlock>  $sourceBlocks
     */
    protected function guardDuplicateCaps(PageSection $section, iterable $sourceBlocks): void
    {
        $blockTypes = $this->registry->get($section->section_type)?->blockTypes() ?? [];

        if ($blockTypes === []) {
            return;
        }

        $counts = collect($sourceBlocks)
            ->groupBy(fn (SectionBlock $block): string => ((int) $block->parent_id).'|'.$block->block_type);

        foreach ($counts as $key => $siblings) {
            $blockType = Str::after((string) $key, '|');
            $max = $blockTypes[$blockType]['max'] ?? null;

            if (! is_int($max) || $siblings->count() <= $max) {
                continue;
            }

            throw ValidationException::withMessages([
                'block_type' => translate('This section holds more items than its type now allows, so it cannot be duplicated. Remove some items first.'),
            ]);
        }
    }

    /**
     * Label for a copy, clamped to the column width.
     */
    protected function copyName(PageSection $section, ?string $name): ?string
    {
        if (filled($name)) {
            return Str::limit($name, 191, '');
        }

        $base = $section->name ?? $section->section_type;

        return Str::limit($base.' ('.translate('Copy').')', 191, '');
    }

    /**
     * Sections sharing this section's owner — the sibling set that sort_order
     * is meaningful within.
     *
     * Exactly one of page_id / block_id owns a row (§1.2), so the two branches
     * are mutually exclusive and never both applied.
     */
    protected function ownerScope(PageSection $section): \Illuminate\Database\Eloquent\Builder
    {
        return PageSection::query()
            ->when($section->page_id, fn ($query) => $query->where('page_id', $section->page_id))
            ->when(! $section->page_id && $section->block_id, fn ($query) => $query->where('block_id', $section->block_id));
    }

    /**
     * Soft delete a section.
     */
    public function destroy(PageSection $section): bool
    {
        $deleted = (bool) $section->delete();

        $this->forgetSection($section);

        return $deleted;
    }

    /**
     * Restore a soft-deleted section.
     */
    public function restore(PageSection $section): bool
    {
        return DB::transaction(function () use ($section): bool {
            $restored = (bool) $section->restore();

            $this->forgetSection($section);

            return $restored;
        });
    }

    /**
     * Permanently delete a section, after clearing the dependents the database
     * cannot reach.
     */
    public function forceDestroy(PageSection $section): bool
    {
        return DB::transaction(function () use ($section): bool {
            $this->purgeDependents([(int) $section->id]);

            // Before the delete: forgetSection() resolves the block's page
            // usages through page_sections.block_id, and page_sections.block_id
            // is SET NULL on the block FK.
            $this->forgetSection($section);

            return (bool) $section->forceDelete();
        });
    }

    /**
     * Clear the dependents of a set of sections that are about to be
     * permanently deleted.
     *
     * Deletes no `section_blocks` rows: `section_blocks_page_section_id_foreign`
     * and `section_blocks_parent_id_foreign` are both CASCADE, so the whole
     * repeater tree — nested children included — is removed by InnoDB. What
     * InnoDB cannot remove is `mediables`, whose `mediable_id` is polymorphic
     * and carries no foreign key, so those pivot rows are cleared here for the
     * sections and for every repeater item under them.
     *
     * Reused by PageService and BlockService, which force-delete sections
     * indirectly through a CASCADE they never see.
     *
     * @param  array<int, int>  $sectionIds
     */
    public function purgeDependents(array $sectionIds): void
    {
        if ($sectionIds === []) {
            return;
        }

        // withTrashed(): a soft-deleted repeater item is still a live row that
        // the CASCADE will take, so its pivot rows still need clearing.
        $blockIds = SectionBlock::withTrashed()
            ->whereIn('page_section_id', $sectionIds)
            ->pluck('id')
            ->all();

        $this->media->purgeAttachments(SectionBlock::class, $blockIds);
        $this->media->purgeAttachments(PageSection::class, $sectionIds);
    }

    /**
     * Resolve which of page_id / block_id owns this row.
     *
     * The invariant — exactly one owner — is enforced here rather than by a
     * MySQL CHECK constraint, because a CHECK failure produces an opaque
     * driver error the AppResponse error path cannot translate into something
     * an editor can act on.
     *
     * @return array{page_id: int|null, block_id: int|null}
     */
    protected function resolveOwner(Request $request, PageSection $section): array
    {
        $pageId = $request->input('page_id', $section->page_id);
        $blockId = $request->input('block_id', $section->block_id);

        if (blank($pageId) && blank($blockId)) {
            throw ValidationException::withMessages([
                'page_id' => translate('A section must belong to either a page or a global block.'),
            ]);
        }

        if (filled($pageId)) {
            Page::findOrFail($pageId);
        }

        if (filled($blockId)) {
            Block::findOrFail($blockId);
        }

        return [
            'page_id' => filled($pageId) ? (int) $pageId : null,
            'block_id' => filled($blockId) ? (int) $blockId : null,
        ];
    }

    /**
     * Strip a JSON payload down to the keys the section type actually declares.
     *
     * @param  array<string, mixed>|null  $payload
     * @return array<string, mixed>|null
     */
    protected function whitelist(?string $sectionType, FieldStore $store, ?array $payload): ?array
    {
        if (blank($payload)) {
            return null;
        }

        $allowed = $this->registry->allowedKeys($sectionType, $store);

        // The `version` key is written by the registry defaults and read by the
        // lazy data-migration hook, so it is never an editor field but must
        // survive a save.
        if ($store === FieldStore::DATA) {
            $allowed[] = 'version';
        }

        $filtered = Arr::only($payload, $allowed);

        return $filtered === [] ? null : $filtered;
    }

    /**
     * Append a new section to the end of its owner's list.
     */
    protected function nextSortOrder(PageSection $section): int
    {
        return (int) $this->ownerScope($section)->max('sort_order') + 1;
    }

    /**
     * Invalidate the owning page's cached payload.
     *
     * When the section is a global block's body, every page embedding that
     * block is stale — resolved through IDX page_sections_block, which is why
     * that index exists.
     */
    public function forgetSection(PageSection $section): void
    {
        /*
         * FIRST, and unconditionally — this method has early returns on both
         * the page-owned and block-owned branches, so anything placed at the
         * bottom is unreachable for the common case.
         *
         * The public renderer caches under `CMS_PAGE->for('render', $uuid,
         * $locale)`, which none of the `(site_id, locale, path)` keys below
         * match. Without this, a section edit saved successfully and the live
         * page kept serving the previous copy — the worst failure this cache
         * can produce, because nothing about it looks broken from the admin.
         */
        $this->forgetFamily(CacheKey::CMS_PAGE->value);

        if ($section->page_id !== null) {
            $page = $section->relationLoaded('page') ? $section->page : Page::find($section->page_id);

            if ($page instanceof Page) {
                $this->forgetKeys([
                    CacheKey::CMS_PAGE->for($page->site_id, $page->locale, $page->path),
                ]);
            }

            return;
        }

        if ($section->block_id === null) {
            return;
        }

        $keys = [CacheKey::CMS_BLOCK->for($section->site_id, null, $section->block_id)];

        PageSection::where('block_id', $section->block_id)
            ->whereNotNull('page_id')
            ->with('page:id,site_id,locale,path')
            ->each(function (PageSection $usage) use (&$keys): void {
                if ($usage->page !== null) {
                    $keys[] = CacheKey::CMS_PAGE->for($usage->page->site_id, $usage->page->locale, $usage->page->path);
                }
            });

        $this->forgetKeys($keys);
    }
}
