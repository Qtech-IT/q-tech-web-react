<?php

namespace Database\Seeders;

use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\MenuVisibility;
use App\Enums\Common\Status;
use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

/**
 * The menus the site layout mounts by key.
 *
 * `social` is a menu rather than a set of SettingKey cases on purpose: social
 * links are ordered, they carry icons, there are five to eight of them, and a
 * new network must not require a code change. That is the settings-vs-table
 * boundary rule applied — a singular site-wide scalar is a setting, a
 * collection with ordering and icons is a table. It is also why `menu_items`
 * carries an `icon` column.
 *
 * All four are seeded `is_locked` because the layout resolves them by key: a
 * deleted `header` menu is a broken site, not a missing menu.
 */
class CoreMenusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->menus() as $definition) {
            $menu = Menu::firstOrNew([
                'site_id' => config('cms.site_id'),
                'key' => $definition['key'],
            ]);

            if ($menu->exists) {
                continue;
            }

            $menu->name = $definition['name'];
            $menu->location = $definition['location'];
            $menu->max_depth = $definition['max_depth'];
            $menu->is_locked = true;
            $menu->status = Status::ACTIVE;
            $menu->save();

            $this->seedItems($menu, $definition['items'] ?? []);
        }

        $this->command?->info('✅ Core menus seeded.');
    }

    /**
     * Seed top-level placeholder items.
     *
     * `path` is '/' and `depth` 0 for every root node — the materialized path
     * format is /ancestorId/ancestorId/, so a root's own path is just the
     * separator.
     *
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function seedItems(Menu $menu, array $items): void
    {
        foreach ($items as $position => $item) {
            $menuItem = new MenuItem;

            $menuItem->menu_id = $menu->id;
            $menuItem->parent_id = null;
            $menuItem->path = '/';
            $menuItem->depth = 0;
            $menuItem->label = $item['label'];
            $menuItem->icon = $item['icon'] ?? null;
            $menuItem->link_type = $item['link_type'] ?? MenuLinkType::URL;
            $menuItem->url = $item['url'] ?? null;
            $menuItem->visibility = MenuVisibility::ALWAYS;
            $menuItem->status = Status::ACTIVE;
            $menuItem->sort_order = $position;

            $menuItem->save();
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function menus(): array
    {
        return [
            [
                'key' => 'header',
                'name' => 'Header Navigation',
                'location' => 'header',
                'max_depth' => 3,
                'items' => [
                    ['label' => 'Services', 'link_type' => MenuLinkType::HEADING],
                    ['label' => 'Work', 'link_type' => MenuLinkType::HEADING],
                    ['label' => 'Company', 'link_type' => MenuLinkType::HEADING],
                ],
            ],

            [
                'key' => 'footer',
                'name' => 'Footer Navigation',
                'location' => 'footer',
                'max_depth' => 2,
                'items' => [],
            ],

            [
                'key' => 'legal',
                'name' => 'Legal Links',
                'location' => 'footer_legal',
                'max_depth' => 1,
                'items' => [],
            ],

            [
                'key' => 'social',
                'name' => 'Social Links',
                'location' => 'social',
                'max_depth' => 1,
                'items' => [],
            ],
        ];
    }
}
