<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Cms\SectionLinkType;
use App\Enums\Common\Status;
use App\Models\PageSection;
use App\Models\SectionBlock;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Repeater items. Rows, not a JSON array — see SectionBlock's docblock and the
 * schema doc §1.3 for the four independent reasons.
 */
class SectionBlockService
{
    use CacheInvalidation;

    public function __construct(
        protected SectionTypeRegistry $registry,
        protected PageSectionService $sections,
        protected RichTextService $richText,
    ) {}

    /**
     * Create or update a repeater item.
     */
    public function save(Request $request, ?SectionBlock $block = null): SectionBlock
    {
        return DB::transaction(function () use ($request, $block): SectionBlock {
            $block ??= new SectionBlock;

            $section = $block->exists && $block->page_section_id
                ? $block->section
                : PageSection::findOrFail($request->input('page_section_id'));

            $parent = $request->filled('parent_id')
                ? SectionBlock::findOrFail($request->input('parent_id'))
                : null;

            $this->guardDepth($parent);
            $this->guardCount($section, $request->input('block_type', 'item'), $block, $parent);

            $block->page_section_id = $section->id;
            $block->parent_id = $parent?->id;
            $block->block_type = $request->input('block_type', $block->block_type ?? 'item');

            $block->label = $request->input('label');
            $block->value = $request->input('value');
            $block->description = $request->input('description');
            // A repeater row's `body` is rich text on the types that use it —
            // an FAQ answer, a checklist note — so it takes the same base64
            // absorb as a section's. See `RichTextService`.
            $block->body = $this->richText->absorbInlineImages($request->input('body'));
            $block->icon = $request->input('icon');
            $block->media_id = $request->input('media_id');
            $block->cta_id = $request->input('cta_id');

            $block->link_type = $request->input('link_type', SectionLinkType::NONE->value);
            $block->link_target_type = $request->input('link_target_type');
            $block->link_target_id = $request->input('link_target_id');
            $block->link_url = $request->input('link_url');

            $block->data = $this->whitelistBlockData($section, $block->block_type, $request->input('data', []));
            $block->settings = $request->input('settings');

            $block->status = $request->input('status', Status::ACTIVE->value);
            $block->sort_order = (int) $request->input('sort_order', $block->sort_order ?? $this->nextSortOrder($section, $parent));

            $block->save();

            $this->sections->forgetSection($section);

            return $block;
        });
    }

    /**
     * Persist a new item order.
     *
     * One UPDATE per row, which is the primary reason this is a table: it is
     * the only shape that survives two editors dragging at once.
     *
     * @param  array<int, string>  $uuids  Item uuids in their new order.
     */
    public function reorder(array $uuids): int
    {
        return DB::transaction(function () use ($uuids): int {
            $blocks = SectionBlock::whereIn('uuid', $uuids)->get()->keyBy('uuid');
            $updated = 0;

            foreach (array_values($uuids) as $position => $uuid) {
                $block = $blocks->get($uuid);

                if (! $block instanceof SectionBlock) {
                    continue;
                }

                $block->sort_order = $position;
                $block->save();
                $updated++;
            }

            if ($blocks->isNotEmpty() && $blocks->first()->section !== null) {
                $this->sections->forgetSection($blocks->first()->section);
            }

            return $updated;
        });
    }

    /**
     * Soft delete an item and its children.
     */
    public function destroy(SectionBlock $block): bool
    {
        return DB::transaction(function () use ($block): bool {
            $section = $block->section;

            $block->children()->each(fn (SectionBlock $child) => $child->delete());
            $deleted = (bool) $block->delete();

            if ($section instanceof PageSection) {
                $this->sections->forgetSection($section);
            }

            return $deleted;
        });
    }

    /**
     * Cap nesting at one level of children.
     */
    protected function guardDepth(?SectionBlock $parent): void
    {
        if ($parent !== null && $parent->parent_id !== null) {
            throw ValidationException::withMessages([
                'parent_id' => translate('Repeater items can only be nested one level deep.'),
            ]);
        }
    }

    /**
     * Enforce the registry's `max` for this block type, **per level**.
     *
     * The count is of siblings only: items of this block type sharing this
     * section AND this parent. Nested children are counted against their own
     * parent, never against the top level. Without that, `max: 8` on an
     * accordion rejected 3 parents plus 6 children — 9 rows, but only 3 at
     * the level the editor was adding to.
     *
     * The failure mode this prevents is an editor pasting a 500-row table into
     * a repeater, which is unbounded row growth with no natural ceiling.
     */
    protected function guardCount(PageSection $section, string $blockType, SectionBlock $block, ?SectionBlock $parent): void
    {
        if ($block->exists) {
            return;
        }

        $max = $this->registry->get($section->section_type)?->blockTypes()[$blockType]['max'] ?? null;

        if ($max === null) {
            return;
        }

        $current = SectionBlock::where('page_section_id', $section->id)
            ->where('block_type', $blockType)
            ->where('parent_id', $parent?->id)
            ->count();

        if ($current >= $max) {
            throw ValidationException::withMessages([
                'block_type' => translate('This section cannot hold any more items of this type.'),
            ]);
        }
    }

    /**
     * Strip per-item JSON down to what the block type declares.
     *
     * @param  array<string, mixed>|null  $payload
     * @return array<string, mixed>|null
     */
    protected function whitelistBlockData(PageSection $section, string $blockType, ?array $payload): ?array
    {
        if (blank($payload)) {
            return null;
        }

        $fields = $this->registry->get($section->section_type)?->blockTypes()[$blockType]['fields'] ?? [];
        $allowed = array_column($fields, 'name');

        $filtered = Arr::only($payload, $allowed);

        return $filtered === [] ? null : $filtered;
    }

    /**
     * Append a new item to the end of its list.
     */
    protected function nextSortOrder(PageSection $section, ?SectionBlock $parent): int
    {
        return (int) SectionBlock::where('page_section_id', $section->id)
            ->where('parent_id', $parent?->id)
            ->max('sort_order') + 1;
    }
}
