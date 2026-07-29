<?php

namespace App\Http\Services\Backend\Cms;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Owns `menu_items.path` and `.depth`.
 *
 * Adjacency list plus materialized path, not nested sets: menu editing is
 * nothing but reordering, so nested sets would pay their write cost (rewrite
 * half the tree under a lock, per move) constantly and their read benefit
 * never, because the assembled tree is cached wholesale and rebuilt only on
 * write.
 */
class MenuTreeService
{
    /**
     * Materialized ancestor id path for a node under the given parent:
     * `/1/14/`. Always leading and trailing slash, so LIKE '/1/14/%' cannot
     * match `/1/140/`.
     */
    public function buildPath(?MenuItem $parent): string
    {
        return $parent === null
            ? '/'
            : $parent->path.$parent->id.'/';
    }

    /**
     * Depth of a node under the given parent.
     */
    public function depthFor(?MenuItem $parent): int
    {
        return $parent === null ? 0 : $parent->depth + 1;
    }

    /**
     * Reject a move into the node's own subtree.
     *
     * O(1) string comparison, which is the second thing `path` buys.
     */
    public function guardAgainstCycle(MenuItem $item, ?MenuItem $parent): void
    {
        if (! $item->exists || $parent === null) {
            return;
        }

        $ownSubtree = $item->path.$item->id.'/';

        if ($parent->id === $item->id || str_starts_with($parent->path, $ownSubtree) || $parent->path === $ownSubtree) {
            throw ValidationException::withMessages([
                'parent_id' => translate('A menu item cannot be moved inside itself.'),
            ]);
        }
    }

    /**
     * Enforce the menu's own max_depth without a recursive query.
     */
    public function guardAgainstDepth(Menu $menu, int $depth): void
    {
        if ($depth > $menu->max_depth) {
            throw ValidationException::withMessages([
                'parent_id' => translate('This menu does not allow items that deep.'),
            ]);
        }
    }

    /**
     * Rewrite path and depth for a moved subtree.
     *
     * The descendants are fetched with one LIKE query against
     * IDX menu_items_path, then rewritten in a transaction.
     */
    public function rebuildSubtree(MenuItem $item): int
    {
        return DB::transaction(function () use ($item): int {
            $descendants = MenuItem::descendantsOf($item)->get();
            $byParent = $descendants->groupBy('parent_id');
            $updated = 0;

            $walk = function (MenuItem $node) use (&$walk, $byParent, &$updated): void {
                foreach ($byParent->get($node->id, []) as $child) {
                    $child->path = $this->buildPath($node);
                    $child->depth = $this->depthFor($node);

                    if ($child->isDirty(['path', 'depth'])) {
                        $child->save();
                        $updated++;
                    }

                    $walk($child);
                }
            };

            $walk($item);

            return $updated;
        });
    }

    /**
     * Nest a flat, ordered item collection into a tree.
     *
     * Takes the single ordered query Menu::items() produces and nests it in
     * memory — no query per level, which is what keeps a header and footer
     * menu at two queries total on a cold render.
     *
     * @param  Collection<int, MenuItem>  $items
     * @return array<int, array<string, mixed>>
     */
    public function nest(Collection $items): array
    {
        $byParent = $items->groupBy('parent_id');

        $build = function (?int $parentId) use (&$build, $byParent): array {
            return $byParent->get($parentId, collect())
                ->map(fn (MenuItem $item): array => [
                    'item' => $item,
                    'children' => $build($item->id),
                ])
                ->values()
                ->all();
        };

        return $build(null);
    }
}
