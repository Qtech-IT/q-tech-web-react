<?php

namespace App\Http\Services\Backend;

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use App\Enums\Marketing\SubscriberStatus;
use App\Models\Language;
use App\Models\Media;
use App\Models\MediaFolder;
use App\Models\Menu;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Subscriber;
use App\Models\User;
use Illuminate\Support\Number;

/**
 * Read-only aggregates for the admin dashboard.
 *
 * Every figure is a single indexed COUNT/SUM — the dashboard is opened on
 * every login, so it must stay cheap. No model hydration, no N+1.
 */
class DashboardService
{
    /**
     * The headline metric cards.
     *
     * @return array<int, array<string, mixed>>
     */
    public function stats(): array
    {
        $siteId = config('cms.site_id');

        $pages = Page::query()->where('site_id', $siteId)->count();
        $publishedPages = Page::query()
            ->where('site_id', $siteId)
            ->where('publish_status', ContentStatus::PUBLISHED->value)
            ->count();

        $sections = PageSection::query()->count();

        $mediaCount = Media::query()->where('site_id', $siteId)->count();
        $mediaBytes = (int) Media::query()->where('site_id', $siteId)->sum('size');
        $folders = MediaFolder::query()->where('site_id', $siteId)->count();

        $menus = Menu::query()->count();

        $users = User::query()->count();
        $activeUsers = User::query()->where('status', Status::ACTIVE->value)->count();

        $subscribers = Subscriber::query()
            ->where('subscription_status', SubscriberStatus::SUBSCRIBED->value)
            ->count();

        $languages = Language::query()->count();

        return [
            [
                'key' => 'pages',
                'title' => translate('Pages'),
                'value' => $pages,
                'description' => translate(':count published', ['count' => $publishedPages]),
                'icon' => 'FileText',
                'iconColor' => 'text-blue-600',
                'iconBgColor' => 'bg-blue-100 dark:bg-blue-900',
                'href' => route('backend.pages.index'),
            ],
            [
                'key' => 'sections',
                'title' => translate('Page Sections'),
                'value' => $sections,
                'description' => translate('Content blocks across all pages'),
                'icon' => 'LayoutGrid',
                'iconColor' => 'text-indigo-600',
                'iconBgColor' => 'bg-indigo-100 dark:bg-indigo-900',
                'href' => null,
            ],
            [
                'key' => 'media',
                'title' => translate('Media Assets'),
                'value' => $mediaCount,
                'description' => translate(':size in the library', ['size' => Number::fileSize($mediaBytes, precision: 1)]),
                'icon' => 'Images',
                'iconColor' => 'text-purple-600',
                'iconBgColor' => 'bg-purple-100 dark:bg-purple-900',
                'href' => route('backend.media.index'),
            ],
            [
                'key' => 'folders',
                'title' => translate('Media Folders'),
                'value' => $folders,
                'description' => translate('Library organisation'),
                'icon' => 'FolderTree',
                'iconColor' => 'text-amber-600',
                'iconBgColor' => 'bg-amber-100 dark:bg-amber-900',
                'href' => route('backend.media-folders.index'),
            ],
            [
                'key' => 'menus',
                'title' => translate('Navigation Menus'),
                'value' => $menus,
                'description' => translate('Header, footer and custom menus'),
                'icon' => 'Menu',
                'iconColor' => 'text-teal-600',
                'iconBgColor' => 'bg-teal-100 dark:bg-teal-900',
                'href' => route('backend.menus.index'),
            ],
            [
                'key' => 'users',
                'title' => translate('Admin Users'),
                'value' => $users,
                'description' => translate(':count active', ['count' => $activeUsers]),
                'icon' => 'Users',
                'iconColor' => 'text-emerald-600',
                'iconBgColor' => 'bg-emerald-100 dark:bg-emerald-900',
                'href' => route('backend.admin-users.index'),
            ],
            [
                'key' => 'subscribers',
                'title' => translate('Subscribers'),
                'value' => $subscribers,
                'description' => translate('Confirmed newsletter opt-ins'),
                'icon' => 'Mail',
                'iconColor' => 'text-rose-600',
                'iconBgColor' => 'bg-rose-100 dark:bg-rose-900',
                'href' => null,
            ],
            [
                'key' => 'languages',
                'title' => translate('Languages'),
                'value' => $languages,
                'description' => translate('Available site locales'),
                'icon' => 'Languages',
                'iconColor' => 'text-cyan-600',
                'iconBgColor' => 'bg-cyan-100 dark:bg-cyan-900',
                'href' => route('backend.languages.index'),
            ],
        ];
    }

    /**
     * The most recently edited pages, for a quick jump-back-in list.
     *
     * @return array<int, array<string, mixed>>
     */
    public function recentPages(int $limit = 6): array
    {
        return Page::query()
            ->where('site_id', config('cms.site_id'))
            ->latest('updated_at')
            ->limit($limit)
            ->get(['uuid', 'title', 'slug', 'publish_status', 'updated_at'])
            ->map(fn (Page $page): array => [
                'uuid' => $page->uuid,
                'title' => $page->title,
                'slug' => $page->slug,
                'publish_status' => $page->publish_status?->value,
                'updated_at' => $page->updated_at?->diffForHumans(),
            ])
            ->all();
    }
}
