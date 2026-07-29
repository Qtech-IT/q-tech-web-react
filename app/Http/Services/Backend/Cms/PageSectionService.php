<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\FieldStore;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Models\Block;
use App\Models\Page;
use App\Models\PageSection;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PageSectionService
{
    use CacheInvalidation;

    public function __construct(
        protected SectionTypeRegistry $registry,
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
     * Soft delete a section.
     */
    public function destroy(PageSection $section): bool
    {
        $deleted = (bool) $section->delete();

        $this->forgetSection($section);

        return $deleted;
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
        return (int) PageSection::query()
            ->when($section->page_id, fn ($q) => $q->where('page_id', $section->page_id))
            ->when($section->block_id && ! $section->page_id, fn ($q) => $q->where('block_id', $section->block_id))
            ->max('sort_order') + 1;
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
