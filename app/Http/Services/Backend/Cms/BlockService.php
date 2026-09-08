<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Models\Block;
use App\Models\Page;
use App\Models\PageSection;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BlockService
{
    use CacheInvalidation;

    public function __construct(
        protected PageSectionService $sections,
        protected MediaService $media,
    ) {}

    /**
     * The admin block list.
     *
     * @return Collection<int, Block>|LengthAwarePaginator|CursorPaginator
     */
    public function getBlocks(): Collection|LengthAwarePaginator|CursorPaginator
    {
        return Block::query()
            ->withCount('usages')
            ->with(['createdBy', 'updatedBy'])
            ->where('site_id', config('cms.site_id'))
            ->search(['name', 'key'])
            ->filter(['section_type', 'publish_status', 'status'])
            ->recycle()
            ->date()
            ->sortDefault('sort_order', 'asc')
            ->fetch();
    }

    /**
     * Create or update a global block, creating its body section on first save.
     */
    public function save(Request $request, ?Block $block = null): Block
    {
        return DB::transaction(function () use ($request, $block): Block {
            $isNew = ! ($block?->exists);
            $block ??= new Block;

            $block->site_id = (int) config('cms.site_id');
            $block->key = $request->input('key') ? value_to_key($request->input('key')) : $block->key;
            $block->name = $request->input('name');
            $block->description = $request->input('description');
            $block->section_type = $request->input('section_type', $block->section_type);
            $block->status = $request->input('status', Status::ACTIVE->value);
            $block->sort_order = (int) $request->input('sort_order', $block->sort_order ?? 0);

            $block->publish_status = $request->input(
                'publish_status',
                $block->publish_status?->value ?? ContentStatus::PUBLISHED->value
            );
            $block->published_at = $request->input('published_at', $block->published_at ?? now());
            $block->expires_at = $request->input('expires_at');

            $block->save();

            if ($isNew) {
                $this->createBody($block);
            }

            $this->forgetBlock($block);

            return $block;
        });
    }

    /**
     * Soft delete a block.
     *
     * `is_locked` blocks are the ones a hard-coded layout slot resolves by key,
     * so deleting one breaks a template rather than a page. The FK is SET NULL,
     * which degrades a referencing section to a local copy — deliberate, but
     * still not something to do by accident.
     */
    public function destroy(Block $block): bool
    {
        if ($block->is_locked) {
            throw ValidationException::withMessages([
                'id' => translate('This block is locked because a layout depends on it.'),
            ]);
        }

        $deleted = (bool) $block->delete();

        $this->forgetBlock($block);

        return $deleted;
    }

    /**
     * Restore a soft-deleted block.
     *
     * The block's body row is a separate `page_sections` record and was never
     * soft-deleted by destroy(), so it is already there waiting.
     */
    public function restore(Block $block): bool
    {
        return DB::transaction(function () use ($block): bool {
            $restored = (bool) $block->restore();

            $this->forgetBlock($block);

            return $restored;
        });
    }

    /**
     * Permanently delete a block.
     *
     * `page_sections.block_id` is SET NULL, which is right for a *page's*
     * section — it degrades to a local copy of the content rather than
     * vaporizing the page. It is wrong for the block's own body row, which has
     * `page_id` NULL as well: nulling its `block_id` leaves a section owned by
     * nothing at all, unreachable from every screen and invisible to every
     * query. The body is therefore force-deleted here, with its repeater tree
     * and pivot rows, before the block itself goes.
     */
    public function forceDestroy(Block $block): bool
    {
        if ($block->is_locked) {
            throw ValidationException::withMessages([
                'id' => translate('This block is locked because a layout depends on it.'),
            ]);
        }

        return DB::transaction(function () use ($block): bool {
            $bodyIds = PageSection::withTrashed()
                ->where('block_id', $block->id)
                ->whereNull('page_id')
                ->pluck('id')
                ->all();

            $this->sections->purgeDependents($bodyIds);

            PageSection::withTrashed()
                ->whereIn('id', $bodyIds)
                ->forceDelete();

            // Blocks carry no library media today — the model does not use
            // HasMedia — but `block` is a permitted mediable_type, so any row
            // that does exist is cleared rather than orphaned.
            $this->media->purgeAttachments(Block::class, [$block->id]);

            // Before the delete, not after: forgetBlock() resolves the pages
            // embedding this block through page_sections.block_id, and that is
            // exactly the column the SET NULL is about to wipe.
            $this->forgetBlock($block);

            return (bool) $block->forceDelete();
        });
    }

    /**
     * A block's content IS a page_sections row with page_id NULL.
     *
     * This is what avoids a parallel `block_sections` table duplicating every
     * column and index on page_sections.
     */
    protected function createBody(Block $block): PageSection
    {
        $registry = app(SectionTypeRegistry::class);
        $defaults = $registry->get($block->section_type)?->defaults() ?? ['data' => [], 'settings' => []];

        $body = new PageSection;

        $body->site_id = $block->site_id;
        $body->page_id = null;
        $body->block_id = $block->id;
        $body->section_type = $block->section_type;
        $body->name = $block->name;
        $body->data = $defaults['data'] ?: null;
        $body->settings = $defaults['settings'] ?: null;
        $body->status = Status::ACTIVE->value;
        $body->publish_status = ContentStatus::PUBLISHED->value;
        $body->published_at = now();

        $body->save();

        return $body;
    }

    /**
     * Invalidate the block's own key plus every page embedding it.
     *
     * The page set is resolved through IDX page_sections_block — that index
     * exists for exactly this write path.
     */
    public function forgetBlock(Block $block): void
    {
        $keys = [CacheKey::CMS_BLOCK->for($block->site_id, null, $block->key)];

        PageSection::where('block_id', $block->id)
            ->whereNotNull('page_id')
            ->with('page:id,site_id,locale,path')
            ->each(function (PageSection $section) use (&$keys): void {
                $page = $section->page;

                if ($page instanceof Page) {
                    $keys[] = CacheKey::CMS_PAGE->for($page->site_id, $page->locale, $page->path);
                }
            });

        $this->forgetKeys($keys);
    }
}
