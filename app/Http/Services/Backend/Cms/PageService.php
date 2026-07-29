<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\PageType;
use App\Enums\Cms\RedirectSource;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Models\Page;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PageService
{
    use CacheInvalidation;

    public function __construct(
        protected PageTreeService $tree,
        protected RedirectService $redirects,
    ) {}

    /**
     * The admin page list.
     *
     * `->recycle()` is called so the trash view works: every CMS model uses
     * SoftDeletes, which finally activates Filterable::scopeRecycle() and the
     * RESTORE / PERMANENT_DELETE branches of handleBulkAction().
     *
     * @return Collection<int, Page>|LengthAwarePaginator|CursorPaginator
     */
    public function getPages(): Collection|LengthAwarePaginator|CursorPaginator
    {
        return Page::query()
            ->with(['parent:id,title,path', 'createdBy', 'updatedBy'])
            ->where('site_id', config('cms.site_id'))
            ->search(['title', 'slug', 'path'])
            ->filter(['locale', 'page_type', 'publish_status', 'status', 'template'])
            ->recycle()
            ->date()
            ->sortDefault('created_at', 'desc')
            ->fetch();
    }

    /**
     * Create or update a page.
     *
     * Everything that can go wrong here is transactional: the slug collision
     * loop, the subtree path rewrite, and the redirect creation must all
     * succeed or none of them may.
     */
    public function save(Request $request, ?Page $page = null): Page
    {
        return DB::transaction(function () use ($request, $page): Page {
            $page ??= new Page;

            $parent = $request->filled('parent_id')
                ? Page::findOrFail($request->input('parent_id'))
                : null;

            $this->tree->guardAgainstCycle($page, $parent);

            $locale = $request->input('locale', get_system_locale());
            $siteId = (int) config('cms.site_id');
            $oldPath = $page->exists ? $page->path : null;

            $slug = $this->uniqueSlug(
                slug: make_slug($request->input('slug') ?: $request->input('title')),
                siteId: $siteId,
                locale: $locale,
                parentId: $parent?->id,
                ignoreId: $page->id,
            );
            $depth = $this->tree->depthFor($parent);

            $this->tree->guardAgainstDepth($depth);

            $page->site_id = $siteId;
            $page->translation_group_id = $page->translation_group_id
                ?: ($request->input('translation_group_id') ?: (string) Str::uuid());
            $page->locale = $locale;
            $page->parent_id = $parent?->id;
            $page->slug = $slug;
            $page->path = $this->tree->buildPath($parent, $slug);
            $page->depth = $depth;
            $page->title = $request->input('title');
            $page->page_type = $request->input('page_type', PageType::STANDARD->value);
            $page->template = $request->input('template', 'default');
            $page->is_indexable = $request->boolean('is_indexable', true);
            $page->settings = $request->input('settings');
            $page->status = $request->input('status', Status::ACTIVE->value);
            $page->sort_order = (int) $request->input('sort_order', $page->sort_order ?? 0);

            $this->applyPublishing($request, $page);

            $page->save();

            if ($request->boolean('is_homepage')) {
                $this->makeHomepage($page);
            }

            // A slug edit is the single most common CMS-driven SEO regression.
            // Creating the redirect here — inside the same transaction as the
            // move — is why it can never be forgotten.
            $movedDescendants = new Collection;

            if ($oldPath !== null && $oldPath !== $page->path) {
                $this->redirects->createForMovedPath($oldPath, $page->path, $siteId, RedirectSource::SLUG_CHANGE);
                $movedDescendants = $this->tree->rebuildSubtree($page);

                foreach ($movedDescendants as $descendant) {
                    $this->redirects->createForMovedPath(
                        $descendant->getAttribute('previous_path'),
                        $descendant->path,
                        $siteId,
                        RedirectSource::SLUG_CHANGE,
                    );
                }
            }

            $this->forgetPage($page, $oldPath, $movedDescendants);

            return $page;
        });
    }

    /**
     * Apply the editorial state transition.
     *
     * `publish_status` is written ONLY here and by the janitor, never through
     * ModelAction::handleBulkAction() — that path does a mass update() keyed
     * literally on the column `status`, bypasses model events and enum casts,
     * and on a non-strict MySQL connection would coerce an out-of-range value
     * to '' rather than erroring. That is silent content loss, which is the
     * whole reason publish_status is a separate column.
     */
    protected function applyPublishing(Request $request, Page $page): void
    {
        $publishStatus = $request->input('publish_status', $page->publish_status?->value ?? ContentStatus::DRAFT->value);
        $publishedAt = $request->input('published_at');

        // Choosing a future date IS the act of scheduling; the editor should
        // not have to set both fields consistently.
        if ($publishStatus === ContentStatus::PUBLISHED->value && $publishedAt && now()->lt($publishedAt)) {
            $publishStatus = ContentStatus::SCHEDULED->value;
        }

        if ($publishStatus === ContentStatus::PUBLISHED->value && blank($publishedAt) && blank($page->published_at)) {
            $publishedAt = now();
        }

        $page->publish_status = $publishStatus;
        $page->published_at = $publishedAt ?: $page->published_at;
        $page->expires_at = $request->input('expires_at');
    }

    /**
     * Apply an editorial state transition on its own, without touching content.
     *
     * The publish button is not a save: it carries only publish_status,
     * published_at and expires_at (PagePublishRequest), so routing it through
     * save() would null out every field the payload omits. It reuses
     * applyPublishing() so the "a future date IS scheduling" coercion cannot
     * drift between the two entry points.
     *
     * Still one page at a time and still through PagePolicy::publish() — see
     * PagePublishRequest's docblock for why this never becomes a bulk action.
     */
    public function publish(Request $request, Page $page): Page
    {
        return DB::transaction(function () use ($request, $page): Page {
            $this->applyPublishing($request, $page);

            $page->save();

            $this->forgetPage($page);

            return $page;
        });
    }

    /**
     * Enforce the single-homepage invariant.
     *
     * Not expressible as a unique index — UNIQUE (site_id, locale, is_homepage)
     * permits only one `false` per locale too, which is wrong — so it lives
     * here, in a transaction.
     */
    public function makeHomepage(Page $page): Page
    {
        return DB::transaction(function () use ($page): Page {
            Page::where('site_id', $page->site_id)
                ->where('locale', $page->locale)
                ->where('id', '!=', $page->id)
                ->where('is_homepage', true)
                ->update(['is_homepage' => false]);

            $page->is_homepage = true;
            $page->page_type = PageType::HOME;
            $page->save();

            $this->forgetPage($page);

            return $page;
        });
    }

    /**
     * Soft delete a page.
     *
     * System and home pages are undeletable, and a page still referenced by
     * navigation is blocked — the menu_items_page index exists precisely so
     * this check is a single probe rather than a scan.
     */
    public function destroy(Page $page): bool
    {
        if (in_array($page->page_type->value, PageType::undeletable(), true)) {
            throw ValidationException::withMessages([
                'id' => translate('System pages cannot be deleted.'),
            ]);
        }

        if ($page->children()->exists()) {
            throw ValidationException::withMessages([
                'id' => translate('Re-parent or delete the child pages first.'),
            ]);
        }

        if ($page->menuItems()->exists()) {
            throw ValidationException::withMessages([
                'id' => translate('This page is still linked from a menu. Remove those links first.'),
            ]);
        }

        $deleted = (bool) $page->delete();

        $this->forgetPage($page);

        return $deleted;
    }

    /**
     * Resolve a slug that does not collide with a sibling.
     *
     * Guards the UNIQUE (site_id, locale, parent_id, slug) index in
     * application space so the editor gets `about-2` rather than a driver
     * exception.
     */
    protected function uniqueSlug(string $slug, int $siteId, string $locale, ?int $parentId, ?int $ignoreId): string
    {
        $base = $slug !== '' ? $slug : 'page';
        $slug = $base;
        $suffix = 1;

        while (
            Page::withTrashed()
                ->where('site_id', $siteId)
                ->where('locale', $locale)
                ->where('parent_id', $parentId)
                ->where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base.'-'.(++$suffix);
        }

        return $slug;
    }

    /**
     * Invalidate every cache key a page write touches.
     *
     * Called explicitly from the service, after the write — never from a model
     * observer. An observer fires inside handleBulkAction()'s lazyById() loop
     * and would issue N invalidations per bulk operation; a service
     * invalidates once, after the loop.
     *
     * @param  Collection<int, Page>  $movedDescendants
     */
    public function forgetPage(Page $page, ?string $oldPath = null, ?Collection $movedDescendants = null): void
    {
        $keys = [
            CacheKey::CMS_PAGE->for($page->site_id, $page->locale, $page->path),
            CacheKey::CMS_PAGE_IDS->for($page->site_id, $page->locale),
            CacheKey::CMS_SITEMAP->for($page->site_id),
        ];

        if ($oldPath !== null && $oldPath !== $page->path) {
            $keys[] = CacheKey::CMS_PAGE->for($page->site_id, $page->locale, $oldPath);
        }

        foreach ($movedDescendants ?? [] as $descendant) {
            $keys[] = CacheKey::CMS_PAGE->for($descendant->site_id, $descendant->locale, $descendant->path);
            $keys[] = CacheKey::CMS_PAGE->for($descendant->site_id, $descendant->locale, $descendant->getAttribute('previous_path'));
        }

        $this->forgetKeys($keys);

        // Menus embed page paths, so any page write can stale a menu tree.
        $this->forgetFamily(CacheKey::CMS_MENU->value);
    }
}
