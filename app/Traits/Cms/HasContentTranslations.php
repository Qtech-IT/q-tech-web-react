<?php

namespace App\Traits\Cms;

use App\Models\ContentTranslation;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Collection;

/**
 * Adds the non-routable translation overlay (schema doc §8.2) to a model.
 *
 * The owner row always stores the DEFAULT locale's text. For any other locale,
 * a translated value lives in `content_translations` keyed by a dotted `field`
 * path — a scalar column name (`heading`) or `data.<key>`.
 *
 * Reads go through `ContentTranslator`, which bulk-loads the overlay for a
 * whole collection and calls `applyTranslations()` on each model so the rest
 * of the code (Resources, Blade) reads translated attributes transparently.
 * Writes go through `ContentTranslationService`. The two helpers here
 * (`setTranslation` / `forgetTranslation`) are the low-level primitives those
 * use — do not call them from a controller.
 */
trait HasContentTranslations
{
    /**
     * Cascade the overlay on force-delete. A soft delete keeps it, so a
     * restore brings the translations back with the row.
     */
    public static function bootHasContentTranslations(): void
    {
        static::deleting(function ($model): void {
            $forcing = method_exists($model, 'isForceDeleting')
                ? $model->isForceDeleting()
                : true;

            if ($forcing) {
                $model->translations()->delete();
            }
        });
    }

    public function translations(): MorphMany
    {
        return $this->morphMany(ContentTranslation::class, 'translatable');
    }

    /**
     * Overlay the given locale's translations onto this model's attributes,
     * in memory. Nothing is persisted and nothing is queried when `$rows` is
     * supplied — `ContentTranslator` passes the pre-grouped rows so a page of
     * N sections costs one query, not N.
     *
     * A missing field is left untouched, which IS the fallback: the attribute
     * keeps the owner row's default-locale value.
     *
     * @param  Collection<int, ContentTranslation>|EloquentCollection<int, ContentTranslation>|null  $rows
     */
    public function applyTranslations(string $locale, Collection|EloquentCollection|null $rows = null): void
    {
        if (is_default_locale($locale)) {
            return;
        }

        $rows ??= $this->translations()->where('locale', $locale)->get();

        if ($rows->isEmpty()) {
            return;
        }

        $data = (array) ($this->data ?? []);
        $touchedData = false;

        foreach ($rows as $row) {
            if ($row->value === null || $row->value === '') {
                continue;
            }

            if (str_starts_with((string) $row->field, 'data.')) {
                data_set($data, substr((string) $row->field, 5), $row->value);
                $touchedData = true;

                continue;
            }

            // A scalar column. The write path already validated the field name
            // against the registry, so setting it directly is safe; a row for
            // a field since removed from the model just sets an attribute
            // nothing reads.
            $this->setAttribute((string) $row->field, $row->value);
        }

        if ($touchedData) {
            $this->setAttribute('data', $data);
        }

        // These stay in sync with the DB row; mark clean so a stray save()
        // downstream never writes the overlaid value back onto the base row.
        $this->syncOriginal();
    }

    /**
     * Upsert one overlay row. A null / empty value deletes it instead, so the
     * field falls back to the owner's default-locale text.
     */
    public function setTranslation(string $locale, string $field, ?string $value): void
    {
        if (is_default_locale($locale)) {
            return;
        }

        if ($value === null || trim($value) === '') {
            $this->forgetTranslation($locale, $field);

            return;
        }

        $this->translations()->updateOrCreate(
            ['locale' => $locale, 'field' => $field],
            ['value' => $value],
        );
    }

    public function forgetTranslation(string $locale, string $field): void
    {
        $this->translations()
            ->where('locale', $locale)
            ->where('field', $field)
            ->delete();
    }
}
