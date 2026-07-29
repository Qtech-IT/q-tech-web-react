<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\MenuVisibility;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MenuService
{
    use CacheInvalidation;

    public function __construct(
        protected MenuTreeService $tree,
    ) {}

    /**
     * The admin menu list.
     *
     * @return Collection<int, Menu>
     */
    public function getMenus(): Collection
    {
        return Menu::query()
            ->withCount('items')
            ->where('site_id', config('cms.site_id'))
            ->search(['name', 'key'])
            ->filter(['location', 'status'])
            ->recycle()
            ->orderBy('name')
            ->get();
    }

    /**
     * Every item of a menu, flat and ordered — one query for the whole tree.
     *
     * @return Collection<int, MenuItem>
     */
    public function getItems(Menu $menu): Collection
    {
        return $menu->items()
            ->with(['page:id,uuid,title,path', 'media'])
            ->get();
    }

    /**
     * Create or update a menu.
     */
    public function save(Request $request, ?Menu $menu = null): Menu
    {
        $menu ??= new Menu;

        $menu->site_id = (int) config('cms.site_id');
        $menu->key = $request->input('key') ? value_to_key($request->input('key')) : $menu->key;
        $menu->name = $request->input('name');
        $menu->location = $request->input('location');
        $menu->max_depth = (int) $request->input('max_depth', $menu->max_depth ?? 3);
        $menu->settings = $request->input('settings');
        $menu->status = $request->input('status', Status::ACTIVE->value);

        $menu->save();

        $this->forgetMenu($menu);

        return $menu;
    }

    /**
     * Create or update a menu item, maintaining path and depth.
     */
    public function saveItem(Request $request, ?MenuItem $item = null): MenuItem
    {
        return DB::transaction(function () use ($request, $item): MenuItem {
            $item ??= new MenuItem;

            $menu = $item->exists
                ? $item->menu
                : Menu::findOrFail($request->input('menu_id'));

            $parent = $request->filled('parent_id')
                ? MenuItem::findOrFail($request->input('parent_id'))
                : null;

            $this->tree->guardAgainstCycle($item, $parent);

            $depth = $this->tree->depthFor($parent);
            $this->tree->guardAgainstDepth($menu, $depth);

            $pathChanged = $item->exists && $item->parent_id !== $parent?->id;

            $linkType = $request->input('link_type', MenuLinkType::URL->value);

            $item->menu_id = $menu->id;
            $item->parent_id = $parent?->id;
            $item->path = $this->tree->buildPath($parent);
            $item->depth = $depth;

            $item->label = $request->input('label');
            $item->aria_label = $request->input('aria_label');
            $item->description = $request->input('description');
            $item->icon = $request->input('icon');
            $item->media_id = $request->input('media_id');

            $item->link_type = $linkType;

            // Clear whatever the chosen strategy does not use, so a heading or
            // separator can never carry a stale href from a previous type.
            $item->url = in_array($linkType, [MenuLinkType::URL->value, MenuLinkType::ANCHOR->value], true)
                ? $request->input('url') : null;
            $item->route_name = $linkType === MenuLinkType::ROUTE->value ? $request->input('route_name') : null;
            $item->route_params = $linkType === MenuLinkType::ROUTE->value ? $request->input('route_params') : null;
            $item->page_id = $linkType === MenuLinkType::PAGE->value ? $request->input('page_id') : null;
            $item->target_type = $linkType === MenuLinkType::ENTITY->value ? $request->input('target_type') : null;
            $item->target_id = $linkType === MenuLinkType::ENTITY->value ? $request->input('target_id') : null;

            $item->opens_in_new_tab = $request->boolean('opens_in_new_tab');
            $item->rel = $request->input('rel');
            $item->badge_label = $request->input('badge_label');
            $item->badge_variant = $request->input('badge_variant');
            $item->visibility = $request->input('visibility', MenuVisibility::ALWAYS->value);
            $item->settings = $request->input('settings');
            $item->status = $request->input('status', Status::ACTIVE->value);
            $item->sort_order = (int) $request->input('sort_order', $item->sort_order ?? $this->nextSortOrder($menu, $parent));

            $item->save();

            if ($pathChanged) {
                $this->tree->rebuildSubtree($item);
            }

            $this->forgetMenu($menu);

            return $item;
        });
    }

    /**
     * Move an item to a new parent and position in one operation.
     *
     * @param  array<int, string>  $siblingUuids  The full new sibling order.
     */
    public function moveItem(MenuItem $item, ?MenuItem $parent, array $siblingUuids): MenuItem
    {
        return DB::transaction(function () use ($item, $parent, $siblingUuids): MenuItem {
            $menu = $item->menu;

            $this->tree->guardAgainstCycle($item, $parent);

            $depth = $this->tree->depthFor($parent);
            $this->tree->guardAgainstDepth($menu, $depth + $this->subtreeHeight($item));

            $item->parent_id = $parent?->id;
            $item->path = $this->tree->buildPath($parent);
            $item->depth = $depth;
            $item->save();

            $this->tree->rebuildSubtree($item);
            $this->reorderItems($siblingUuids);

            $this->forgetMenu($menu);

            return $item;
        });
    }

    /**
     * Persist a sibling order.
     *
     * @param  array<int, string>  $uuids
     */
    public function reorderItems(array $uuids): int
    {
        $items = MenuItem::whereIn('uuid', $uuids)->get()->keyBy('uuid');
        $updated = 0;

        foreach (array_values($uuids) as $position => $uuid) {
            $item = $items->get($uuid);

            if (! $item instanceof MenuItem) {
                continue;
            }

            $item->sort_order = $position;
            $item->save();
            $updated++;
        }

        return $updated;
    }

    /**
     * Delete a menu. Locked menus are the ones a layout mounts by key.
     */
    public function destroy(Menu $menu): bool
    {
        if ($menu->is_locked) {
            throw ValidationException::withMessages([
                'id' => translate('This menu is locked because the site layout depends on it.'),
            ]);
        }

        $deleted = (bool) $menu->delete();

        $this->forgetMenu($menu);

        return $deleted;
    }

    /**
     * Delete an item. Children cascade at the DB level on force delete; the
     * soft delete is cascaded here so the tree stays consistent in the admin.
     */
    public function destroyItem(MenuItem $item): bool
    {
        return DB::transaction(function () use ($item): bool {
            $menu = $item->menu;

            MenuItem::descendantsOf($item)->each(fn (MenuItem $child) => $child->delete());

            $deleted = (bool) $item->delete();

            if ($menu instanceof Menu) {
                $this->forgetMenu($menu);
            }

            return $deleted;
        });
    }

    /**
     * How many levels the item's own subtree adds, so a move cannot push
     * descendants past max_depth.
     */
    protected function subtreeHeight(MenuItem $item): int
    {
        $deepest = MenuItem::descendantsOf($item)->max('depth');

        return $deepest === null ? 0 : (int) $deepest - $item->depth;
    }

    /**
     * Append a new item to the end of its sibling list.
     */
    protected function nextSortOrder(Menu $menu, ?MenuItem $parent): int
    {
        return (int) MenuItem::where('menu_id', $menu->id)
            ->where('parent_id', $parent?->id)
            ->max('sort_order') + 1;
    }

    /**
     * Forget a menu's cached tree across every locale.
     *
     * A menu is cached per locale, so the whole family goes — a menu write is
     * rare and the alternative is enumerating live languages on every save.
     */
    public function forgetMenu(Menu $menu): void
    {
        $this->forgetKeys(
            collect(site_languages())
                ->pluck('code')
                ->push(get_system_locale())
                ->unique()
                ->map(fn (string $locale): string => CacheKey::CMS_MENU->for($menu->site_id, $locale, $menu->key))
                ->all()
        );

        $this->forgetFamily(CacheKey::CMS_MENU->value);
    }
}
