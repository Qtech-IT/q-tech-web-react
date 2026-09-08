<?php

namespace App\Http\Services\Cms;

use App\Models\ContentTranslation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * The read side of the non-routable translation overlay (schema doc §8.2).
 *
 * Given a locale and a set of already-loaded models, it fetches every
 * `content_translations` row for them in ONE query per morph type and overlays
 * the values in memory. Downstream code — Resources, Blade — then reads
 * translated attributes with no knowledge that an overlay exists.
 *
 * Does nothing for the default locale: that text is already on the owner rows.
 */
class ContentTranslator
{
    /**
     * Overlay `$locale` onto every model in `$models` (mixed types allowed).
     *
     * @param  iterable<int, Model>  $models
     */
    public function hydrate(iterable $models, string $locale): void
    {
        if (is_default_locale($locale)) {
            return;
        }

        $collection = $models instanceof Collection ? $models : collect($models);
        $flat = $collection->filter(fn ($m): bool => $m instanceof Model)->values();

        if ($flat->isEmpty()) {
            return;
        }

        $byType = $flat->groupBy(fn (Model $m): string => $m->getMorphClass());

        foreach ($byType as $type => $group) {
            $rows = ContentTranslation::query()
                ->where('translatable_type', $type)
                ->where('locale', $locale)
                ->whereIn('translatable_id', $group->map->getKey()->all())
                ->get()
                ->groupBy('translatable_id');

            if ($rows->isEmpty()) {
                continue;
            }

            foreach ($group as $model) {
                $model->applyTranslations($locale, $rows->get($model->getKey(), collect()));
            }
        }
    }

    /**
     * Raw `field => value` map for one owner in one locale — for callers that
     * are not Eloquent models (a menu tree assembled into arrays).
     *
     * @return array<int|string, array<string, string>> keyed by owner id
     */
    public function for(string $morphType, array $ids, string $locale): array
    {
        if (is_default_locale($locale) || $ids === []) {
            return [];
        }

        return ContentTranslation::query()
            ->where('translatable_type', $morphType)
            ->where('locale', $locale)
            ->whereIn('translatable_id', $ids)
            ->get()
            ->groupBy('translatable_id')
            ->map(fn (Collection $rows): array => $rows
                ->filter(fn (ContentTranslation $r): bool => filled($r->value))
                ->pluck('value', 'field')
                ->all())
            ->all();
    }
}
