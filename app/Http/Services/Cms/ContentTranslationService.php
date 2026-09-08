<?php

namespace App\Http\Services\Cms;

use App\Enums\Cms\FieldStore;
use App\Enums\System\CacheKey;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use App\Models\Block;
use App\Models\Cta;
use App\Models\Media;
use App\Models\MenuItem;
use App\Models\PageSection;
use App\Models\SectionBlock;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * The write side of the non-routable translation overlay (schema doc §8.2).
 *
 * Every method takes an owner, a target locale and a `field => value` map,
 * validates each field against the SAME source of truth the section editor
 * renders from — the `translatable: true` descriptors in the section-type
 * registry — then upserts (or, for an emptied value, deletes) one
 * `content_translations` row per field and invalidates the affected caches.
 *
 * A field that is not translatable, or the default locale, is rejected: the
 * default locale's text belongs on the owner row and goes through the normal
 * section-save path.
 */
class ContentTranslationService
{
    use CacheInvalidation;

    /** Non-registry owners: a fixed, small set of translatable columns. */
    private const MENU_ITEM_FIELDS = ['label', 'aria_label', 'description', 'badge_label'];

    private const CTA_FIELDS = ['label', 'aria_label'];

    private const MEDIA_FIELDS = ['alt_text', 'caption'];

    public function __construct(
        private readonly SectionTypeRegistry $registry,
    ) {}

    /**
     * @param  array<string, string|null>  $values  dotted field path => translated value
     */
    public function saveSection(PageSection $section, string $locale, array $values): void
    {
        $this->guardLocale($locale);

        $allowed = $this->sectionFields($section->section_type);
        $this->write($section, $locale, $this->filter($values, $allowed));

        $this->forgetForSection($section);
    }

    /**
     * @param  array<string, string|null>  $values
     */
    public function saveBlock(SectionBlock $block, string $locale, array $values): void
    {
        $this->guardLocale($locale);

        $section = $block->section()->first();
        $allowed = $section
            ? $this->blockFields($section->section_type, (string) $block->block_type)
            : [];

        $this->write($block, $locale, $this->filter($values, $allowed));

        if ($section) {
            $this->forgetForSection($section);
        }
    }

    /**
     * @param  array<string, string|null>  $values
     */
    public function saveMenuItem(MenuItem $item, string $locale, array $values): void
    {
        $this->guardLocale($locale);

        $this->write($item, $locale, $this->filter($values, self::MENU_ITEM_FIELDS));

        $this->forgetFamily(CacheKey::CMS_MENU->value);
    }

    /**
     * @param  array<string, string|null>  $values
     */
    public function saveCta(Cta $cta, string $locale, array $values): void
    {
        $this->guardLocale($locale);

        $this->write($cta, $locale, $this->filter($values, self::CTA_FIELDS));

        // A CTA can sit on any page or block; the cheap correct move is to
        // drop every rendered page, exactly as PageSectionService does.
        $this->forgetFamily(CacheKey::CMS_PAGE->value);
        $this->forgetFamily(CacheKey::CMS_BLOCK->value);
    }

    /**
     * @param  array<string, string|null>  $values
     */
    public function saveMedia(Media $media, string $locale, array $values): void
    {
        $this->guardLocale($locale);

        $this->write($media, $locale, $this->filter($values, self::MEDIA_FIELDS));

        $this->forgetFamily(CacheKey::CMS_PAGE->value);
        $this->forgetFamily(CacheKey::CMS_BLOCK->value);
    }

    public function saveGlobalBlock(Block $block, string $locale, array $values): void
    {
        $this->guardLocale($locale);

        // A global block's body IS a page_sections row; its translatable
        // fields come from that row's section_type.
        $body = $block->body()->first();
        $allowed = $body ? $this->sectionFields($body->section_type) : [];

        $this->write($block, $locale, $this->filter($values, $allowed));

        $this->forgetFamily(CacheKey::CMS_BLOCK->value);
        $this->forgetFamily(CacheKey::CMS_PAGE->value);
    }

    /**
     * Completion figures for one page in one locale: filled vs total
     * translatable fields across its sections and repeater items.
     *
     * @return array{filled: int, total: int}
     */
    public function coverageForSection(PageSection $section, string $locale): array
    {
        $total = count($this->sectionFields($section->section_type));
        $filled = $section->translations()->where('locale', $locale)->whereNotNull('value')->count();

        foreach ($section->allBlocks()->get() as $block) {
            $total += count($this->blockFields($section->section_type, (string) $block->block_type));
            $filled += $block->translations()->where('locale', $locale)->whereNotNull('value')->count();
        }

        return ['filled' => min($filled, $total), 'total' => $total];
    }

    /**
     * The translatable dotted paths for a section type: a translatable
     * `column` field is its own name, a translatable `data` field is
     * `data.<name>`. `settings` is never translatable (registry invariant).
     *
     * @return array<int, string>
     */
    public function sectionFields(?string $sectionType): array
    {
        return [
            ...$this->paths($this->registry->fieldsFor($sectionType, FieldStore::COLUMN)),
            ...$this->paths($this->registry->fieldsFor($sectionType, FieldStore::DATA), 'data.'),
        ];
    }

    /**
     * The translatable dotted paths for one repeater block type.
     *
     * @return array<int, string>
     */
    public function blockFields(?string $sectionType, ?string $blockType): array
    {
        $type = $this->registry->get($sectionType);
        $definition = $type?->blockTypes()[$blockType] ?? null;

        if ($definition === null) {
            return [];
        }

        $fields = $definition['fields'] ?? [];

        return [
            ...$this->paths(array_filter($fields, fn ($f): bool => ($f['store'] ?? null) === FieldStore::COLUMN->value)),
            ...$this->paths(array_filter($fields, fn ($f): bool => ($f['store'] ?? null) === FieldStore::DATA->value), 'data.'),
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $fields
     * @return array<int, string>
     */
    private function paths(array $fields, string $prefix = ''): array
    {
        return array_values(array_map(
            fn (array $field): string => $prefix.$field['name'],
            array_filter($fields, fn (array $field): bool => (bool) ($field['translatable'] ?? false)),
        ));
    }

    /**
     * Keep only keys that are in the allowed set; a stray key is a client bug
     * or a probe, so fail loudly rather than silently dropping it.
     *
     * @param  array<string, string|null>  $values
     * @param  array<int, string>  $allowed
     * @return array<string, string|null>
     */
    private function filter(array $values, array $allowed): array
    {
        $unknown = array_diff(array_keys($values), $allowed);

        if ($unknown !== []) {
            throw ValidationException::withMessages([
                'values' => 'Not translatable: '.implode(', ', $unknown),
            ]);
        }

        return $values;
    }

    /**
     * @param  array<string, string|null>  $values
     */
    private function write(object $owner, string $locale, array $values): void
    {
        DB::transaction(function () use ($owner, $locale, $values): void {
            foreach ($values as $field => $value) {
                $owner->setTranslation($locale, $field, $value === null ? null : (string) $value);
            }
        });
    }

    private function guardLocale(string $locale): void
    {
        if (is_default_locale($locale)) {
            throw ValidationException::withMessages([
                'locale' => 'The default locale is edited on the content itself, not as a translation.',
            ]);
        }
    }

    private function forgetForSection(PageSection $section): void
    {
        // Matches PageSectionService::forgetSection — the page render cache has
        // a per-uuid key that Cache::forget() cannot glob, so the family flush
        // is the correct tool.
        $this->forgetFamily(CacheKey::CMS_PAGE->value);

        if ($section->block_id !== null) {
            $this->forgetFamily(CacheKey::CMS_BLOCK->value);
        }
    }
}
