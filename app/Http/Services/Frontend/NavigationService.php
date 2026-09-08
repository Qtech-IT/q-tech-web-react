<?php

namespace App\Http\Services\Frontend;

use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\MenuVisibility;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Http\Services\Backend\Cms\MenuTreeService;
use App\Http\Services\Cms\ContentTranslator;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Support\Facades\Cache;

/**
 * Builds the public navigation payload.
 *
 * The header, mega menu, mobile drawer and footer are already written and
 * prop-driven; they consume the shape declared in `resources/js/Types/navigation.ts`.
 * This service is the only thing that produces that shape, so the contract lives
 * in exactly two places rather than being reassembled per page.
 *
 * Menus change rarely and are read on every single page load, so the built tree
 * is cached per location. `MenuService::forgetMenu()` busts it on any write.
 */
class NavigationService
{
    // Supplies rememberTracked()/forgetFamily(), so the nav cache participates
    // in the same key registry every other CMS cache uses.
    use CacheInvalidation;

    /** Menu `location` values, as seeded. Not user-editable strings. */
    private const LOCATION_HEADER = 'header';

    private const LOCATION_FOOTER = 'footer';

    private const LOCATION_LEGAL = 'footer_legal';

    private const LOCATION_SOCIAL = 'social';

    public function __construct(
        protected MenuTreeService $tree,
        protected ContentTranslator $translator,
    ) {}

    /**
     * The whole `SiteNavigation` object the public layout expects.
     *
     * Every region resolves independently: a site with a header menu but no
     * social menu still renders, because the frontend falls back per region
     * rather than all-or-nothing.
     *
     * @return array<string, mixed>
     */
    public function siteNavigation(): array
    {
        $header = $this->forLocation(self::LOCATION_HEADER);

        return [
            // A CTA is a header item the editor flagged as one. Splitting them
            // out here keeps the button row out of the nav list without needing
            // a second menu the editor has to remember to maintain.
            'primary' => array_values(array_filter($header, fn (array $node): bool => ! $this->isCta($node))),
            // A CTA with no destination is dropped, not rendered with href="#".
            // The model's resolveHref() returns null deliberately; substituting
            // '#' here would re-introduce the WCAG failure it exists to prevent.
            'ctas' => array_values(array_map(
                fn (array $node): array => [
                    'label' => $node['label'],
                    'href' => $node['href'],
                    'variant' => $node['settings']['variant'] ?? 'default',
                    'newTab' => $node['newTab'],
                ],
                array_filter(
                    $header,
                    fn (array $node): bool => $this->isCta($node) && ($node['href'] ?? null) !== null
                )
            )),
            'footerColumns' => $this->footerColumns(),
            'legal' => $this->flatten($this->forLocation(self::LOCATION_LEGAL)),
            'social' => $this->socialLinks(),
        ];
    }

    /**
     * One location's tree, cached and already nested.
     *
     * @return array<int, array<string, mixed>>
     */
    public function forLocation(string $location): array
    {
        /*
         * `rememberTracked`, not `Cache::rememberForever`. Invalidation goes
         * through `forgetFamily(CMS_MENU)`, which can only forget keys that
         * were recorded in the family's key registry — `Cache::forget()` cannot
         * glob and `Cache::tags()` throws on the `database` store this app
         * defaults to. An untracked key here would survive every menu write and
         * the public nav would never update again.
         */
        return $this->rememberTracked(
            CacheKey::CMS_MENU->value,
            CacheKey::CMS_MENU->for('nav', $location, app()->getLocale()),
            60 * 24,
            function () use ($location): array {
                $menu = Menu::query()
                    ->where('location', $location)
                    ->where('site_id', (int) config('cms.site_id'))
                    ->where('status', Status::ACTIVE->value)
                    ->first();

                if (! $menu) {
                    return [];
                }

                // One ordered query for the whole menu; nesting happens in
                // memory. A query per level here would be an N+1 on every page.
                $items = $menu->items()
                    ->with(['page:id,uuid,title,path', 'media'])
                    ->where('status', Status::ACTIVE->value)
                    ->get();

                // Overlay the visitor's locale onto label / description /
                // aria before the tree is shaped. The default locale is a
                // no-op; a non-default locale with no overlay row keeps the
                // English text. This cache entry is already keyed per locale.
                $this->translator->hydrate($items, app()->getLocale());

                return $this->present($this->tree->nest($items));
            }
        );
    }

    /**
     * Map the nested MenuItem tree onto the frontend `NavNode` contract.
     *
     * `href` is resolved server-side by the model; the client never derives a
     * URL, so a route rename cannot silently produce a dead link in the browser.
     *
     * @param  array<int, array<string, mixed>>  $nodes
     * @return array<int, array<string, mixed>>
     */
    private function present(array $nodes): array
    {
        $isGuest = ! auth()->check();

        return array_values(array_filter(array_map(function (array $node) use ($isGuest): ?array {
            /** @var MenuItem $item */
            $item = $node['item'];

            // Auth-scoped visibility is enforced here, not in the browser: a
            // hidden-by-CSS link is still in the DOM and still discoverable.
            $visibility = $item->visibility instanceof MenuVisibility
                ? $item->visibility->value
                : (string) $item->visibility;

            if ($visibility === MenuVisibility::GUEST->value && ! $isGuest) {
                return null;
            }

            if ($visibility === MenuVisibility::AUTH->value && $isGuest) {
                return null;
            }

            $settings = is_array($item->settings) ? $item->settings : [];
            $children = $this->present($node['children']);

            $href = $item->resolveHref();

            // Only CMS-page links get the locale prefix. A named-route link
            // (`/contact`) resolves to an unprefixed application route and
            // must be left alone; an external URL and an anchor already are.
            $linkType = $item->link_type instanceof MenuLinkType
                ? $item->link_type
                : MenuLinkType::tryFrom((string) $item->link_type);

            if ($linkType === MenuLinkType::PAGE) {
                $href = localize_path($href);
            }

            return [
                'id' => $item->uuid,
                'label' => $item->label,
                'href' => $href,
                'type' => $this->linkType($item),
                'icon' => $item->icon,
                'description' => $item->description,
                /*
                 * `menu_items.media_id`, already eager-loaded above. Emitted so
                 * a mega panel's featured card can show the client mark an
                 * editor attached in the menu builder; without it the column
                 * exists, the picker writes to it, and nothing ever reads it.
                 *
                 * Width and height travel with the URL because the panel opens
                 * on hover — an image of unknown size there is the easiest
                 * layout shift in the header to cause.
                 */
                'media' => $item->media
                    ? [
                        'url' => $item->media->url,
                        'alt' => (string) ($item->media->alt_text ?? ''),
                        'width' => $item->media->width,
                        'height' => $item->media->height,
                    ]
                    : null,
                'newTab' => (bool) $item->opens_in_new_tab,
                'badge' => $item->badge_label
                    ? ['label' => $item->badge_label, 'variant' => $item->badge_variant ?? 'secondary']
                    : null,
                // `display` decides mega vs dropdown vs plain link. Derived
                // from the editor's setting, but a node with no children can
                // never be a panel regardless of what the setting says.
                'display' => $children === []
                    ? 'link'
                    : ($settings['display'] ?? 'dropdown'),
                'columns' => isset($settings['columns']) ? (int) $settings['columns'] : null,
                'hideOn' => $settings['hide_on'] ?? null,
                'settings' => $settings,
                'children' => $children,
            ];
        }, $nodes)));
    }

    /**
     * Translate the CMS link type to the vocabulary the frontend understands.
     *
     * `heading` and `separator` are deliberately preserved: a mega-menu column
     * title rendered as `href="#"` is an accessibility defect, so the frontend
     * needs to know it is not a link.
     */
    private function linkType(MenuItem $item): string
    {
        $type = $item->link_type instanceof MenuLinkType
            ? $item->link_type->value
            : (string) $item->link_type;

        return match ($type) {
            MenuLinkType::HEADING->value => 'heading',
            MenuLinkType::SEPARATOR->value => 'separator',
            MenuLinkType::ANCHOR->value => 'anchor',
            MenuLinkType::URL->value => 'external',
            default => 'internal',
        };
    }

    /** @param  array<string, mixed>  $node */
    private function isCta(array $node): bool
    {
        return (bool) ($node['settings']['is_cta'] ?? false);
    }

    /**
     * Footer columns: each top-level item is a column heading, its children the
     * links beneath it.
     *
     * @return array<int, array<string, mixed>>
     */
    private function footerColumns(): array
    {
        return array_values(array_map(
            fn (array $node): array => [
                'id' => $node['id'],
                'title' => $node['label'],
                'items' => $this->flatten($node['children']),
            ],
            $this->forLocation(self::LOCATION_FOOTER)
        ));
    }

    /**
     * Social links need a resolvable icon; one without is not renderable, so it
     * is dropped rather than shipped as an empty focusable anchor.
     *
     * @return array<int, array<string, mixed>>
     */
    private function socialLinks(): array
    {
        return array_values(array_map(
            fn (array $node): array => [
                'id' => $node['id'],
                'label' => $node['label'],
                // Already filtered to non-null below, so no '#' fallback needed.
                'href' => $node['href'],
                'icon' => $node['icon'] ?? '',
            ],
            array_filter(
                $this->forLocation(self::LOCATION_SOCIAL),
                fn (array $node): bool => ($node['href'] ?? null) !== null
            )
        ));
    }

    /**
     * Strip a level to its renderable link fields.
     *
     * @param  array<int, array<string, mixed>>  $nodes
     * @return array<int, array<string, mixed>>
     */
    private function flatten(array $nodes): array
    {
        return array_values(array_map(fn (array $node): array => [
            'id' => $node['id'],
            'label' => $node['label'],
            'href' => $node['href'],
            'type' => $node['type'],
            'icon' => $node['icon'],
            'newTab' => $node['newTab'],
            'badge' => $node['badge'],
        ], $nodes));
    }

    /** Drop every cached location. Called on any menu write. */
    public function forget(): void
    {
        foreach ([self::LOCATION_HEADER, self::LOCATION_FOOTER, self::LOCATION_LEGAL, self::LOCATION_SOCIAL] as $location) {
            Cache::forget(CacheKey::CMS_MENU->for('nav', $location, app()->getLocale()));
        }
    }
}
