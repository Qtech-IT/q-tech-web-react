<?php

namespace App\Jobs\Cms;

use App\Enums\Cms\ContentStatus;
use App\Http\Services\Backend\Cms\BlockService;
use App\Http\Services\Backend\Cms\PageSectionService;
use App\Http\Services\Backend\Cms\PageService;
use App\Models\Block;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * The janitor.
 *
 * IT IS NOT ON THE CRITICAL PATH. The `->published()` scope already admits a
 * `scheduled` row the moment its published_at passes, so content goes live
 * whether or not this job ever runs. What the job actually buys is keeping
 * publish_status honest — so admin filters, the sitemap, and any notification
 * side effects are accurate — and firing the cache invalidation that a pure
 * query-time check cannot.
 *
 * That ordering matters: if this job were the thing that published content, a
 * stuck queue would be an outage.
 */
class PublishScheduledContentJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(
        PageService $pages,
        PageSectionService $sections,
        BlockService $blocks,
    ): void {
        $published = $this->publishDue($pages, $sections, $blocks);
        $archived = $this->archiveExpired($pages, $sections, $blocks);

        if ($published > 0 || $archived > 0) {
            Log::info('CMS janitor swept scheduled content.', [
                'published' => $published,
                'archived' => $archived,
            ]);
        }
    }

    /**
     * Flip due `scheduled` rows to `published`.
     */
    protected function publishDue(PageService $pages, PageSectionService $sections, BlockService $blocks): int
    {
        $count = 0;

        // lazyById(100) matches the chunking ModelAction::handleBulkAction()
        // already uses, and writes go THROUGH THE MODEL rather than a mass
        // update() so casts and events behave and invalidation happens on the
        // normal path.
        Page::scheduledDue()->lazyById(100)->each(function (Page $page) use ($pages, &$count): void {
            $page->publish_status = ContentStatus::PUBLISHED;
            $page->save();

            $pages->forgetPage($page);
            $count++;
        });

        PageSection::scheduledDue()->lazyById(100)->each(function (PageSection $section) use ($sections, &$count): void {
            $section->publish_status = ContentStatus::PUBLISHED;
            $section->save();

            $sections->forgetSection($section);
            $count++;
        });

        Block::scheduledDue()->lazyById(100)->each(function (Block $block) use ($blocks, &$count): void {
            $block->publish_status = ContentStatus::PUBLISHED;
            $block->save();

            $blocks->forgetBlock($block);
            $count++;
        });

        return $count;
    }

    /**
     * Flip expired `published` rows to `archived`.
     */
    protected function archiveExpired(PageService $pages, PageSectionService $sections, BlockService $blocks): int
    {
        $count = 0;

        Page::expired()->lazyById(100)->each(function (Page $page) use ($pages, &$count): void {
            $page->publish_status = ContentStatus::ARCHIVED;
            $page->save();

            $pages->forgetPage($page);
            $count++;
        });

        PageSection::expired()->lazyById(100)->each(function (PageSection $section) use ($sections, &$count): void {
            $section->publish_status = ContentStatus::ARCHIVED;
            $section->save();

            $sections->forgetSection($section);
            $count++;
        });

        Block::expired()->lazyById(100)->each(function (Block $block) use ($blocks, &$count): void {
            $block->publish_status = ContentStatus::ARCHIVED;
            $block->save();

            $blocks->forgetBlock($block);
            $count++;
        });

        return $count;
    }
}
