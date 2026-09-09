<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Settings\SettingKey;
use App\Enums\System\CacheKey;
use App\Models\SeoMeta;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SeoService
{
    use CacheInvalidation;

    /**
     * The SEO record for an entity in a locale, or null when the editor has
     * never customised it — the fallback chain in resolve() handles that.
     */
    public function forOwner(Model $owner, ?string $locale = null): ?SeoMeta
    {
        return SeoMeta::query()
            ->with(['ogMedia', 'twitterMedia'])
            ->where('seoable_type', $this->aliasFor($owner))
            ->where('seoable_id', $owner->getKey())
            ->where('locale', $locale ?? $owner->locale ?? get_system_locale())
            ->first();
    }

    /**
     * Create or update the SEO record for an entity.
     *
     * updateOrCreate keyed on the same triple as
     * UNIQUE seo_meta_owner_unique, so a concurrent double-save is a
     * constraint violation rather than two competing rows.
     */
    public function save(Request $request, Model $owner, ?string $locale = null): SeoMeta
    {
        return DB::transaction(function () use ($request, $owner, $locale): SeoMeta {
            $alias = $this->aliasFor($owner);
            $locale = $locale ?? $request->input('locale') ?? $owner->locale ?? get_system_locale();

            $seo = SeoMeta::updateOrCreate(
                [
                    'seoable_type' => $alias,
                    'seoable_id' => $owner->getKey(),
                    'locale' => $locale,
                ],
                [
                    'site_id' => (int) config('cms.site_id'),
                    'meta_title' => $request->input('meta_title'),
                    'meta_description' => $request->input('meta_description'),
                    'meta_keywords' => $request->input('meta_keywords'),
                    'canonical_url' => $request->input('canonical_url'),
                    'robots_index' => $request->boolean('robots_index', true),
                    'robots_follow' => $request->boolean('robots_follow', true),
                    'robots_advanced' => $request->input('robots_advanced'),
                    'og_title' => $request->input('og_title'),
                    'og_description' => $request->input('og_description'),
                    'og_type' => $request->input('og_type', 'website'),
                    'og_media_id' => $request->input('og_media_id'),
                    'twitter_card' => $request->input('twitter_card', 'summary_large_image'),
                    'twitter_title' => $request->input('twitter_title'),
                    'twitter_description' => $request->input('twitter_description'),
                    'twitter_media_id' => $request->input('twitter_media_id'),
                    'schema_type' => $request->input('schema_type'),
                    'schema_data' => $request->input('schema_data'),
                    'focus_keyword' => $request->input('focus_keyword'),
                ]
            );

            $this->forgetSeo($alias, $owner->getKey(), $locale);

            return $seo;
        });
    }

    /**
     * The fully resolved head payload, with every fallback applied.
     *
     * Cached as the RESULT, not the row: the fallback chain is where the cost
     * is, and caching the row would leave it to be recomputed per request.
     *
     * @return array<string, mixed>
     */
    public function resolve(Model $owner, ?string $locale = null): array
    {
        $locale = $locale ?? $owner->locale ?? get_system_locale();
        $alias = $this->aliasFor($owner);

        return $this->rememberTracked(
            family: CacheKey::CMS_SEO->value,
            key: CacheKey::CMS_SEO->for($alias, $owner->getKey(), $locale),
            ttlMinutes: (int) config('cms.ttl.seo'),
            callback: function () use ($owner, $locale, $alias): array {
                $seo = $this->forOwner($owner, $locale);
                $suffix = site_settings(SettingKey::COMPANY_NAME->value);

                $title = $seo?->meta_title
                    ?: ($owner->title ?? $owner->name ?? null);

                // is_indexable on the owner is duplicated from seo_meta on
                // purpose, so the robots decision survives a missing SEO row.
                $ownerIndexable = $owner->is_indexable ?? true;

                return [
                    'title' => $title,
                    'title_full' => $title && $suffix ? $title.' | '.$suffix : $title,
                    'description' => $seo?->meta_description ?: ($owner->excerpt ?? null),
                    'keywords' => $seo?->meta_keywords,
                    'canonical' => $seo?->canonical_url ?: ($owner->path ?? null),
                    'robots_index' => $ownerIndexable && ($seo?->robots_index ?? true),
                    'robots_follow' => $seo?->robots_follow ?? true,
                    'robots_advanced' => $seo?->robots_advanced,
                    'og_title' => $seo?->og_title ?: $title,
                    'og_description' => $seo?->og_description ?: $seo?->meta_description,
                    'og_type' => $seo?->og_type ?: 'website',
                    'og_image' => $seo?->ogMedia?->url,
                    'twitter_card' => $seo?->twitter_card ?: 'summary_large_image',
                    'twitter_title' => $seo?->twitter_title ?: $title,
                    'twitter_image' => $seo?->twitterMedia?->url ?: $seo?->ogMedia?->url,
                    'schema_type' => $seo?->schema_type,
                    'schema_data' => $seo?->schema_data,
                    'locale' => $locale,
                    'alias' => $alias,
                ];
            }
        );
    }

    /**
     * Delete the SEO records of owners that are being permanently deleted.
     *
     * `seo_meta.seoable_id` is polymorphic and carries no foreign key, and the
     * table does not soft-delete, so absolutely nothing removes these rows when
     * their owner is force-deleted. They then hold `seo_meta_owner_unique`
     * against any future row that lands on the same id.
     *
     * The cached payloads go first, while the rows are still readable — the
     * cache key is built from each row's own `locale`, which cannot be
     * reconstructed once the row is gone.
     *
     * @param  class-string<Model>  $ownerClass
     * @param  array<int, int|string>  $ownerIds
     * @return int SEO rows deleted.
     */
    public function purgeForOwners(string $ownerClass, array $ownerIds): int
    {
        if ($ownerIds === []) {
            return 0;
        }

        $alias = Relation::getMorphAlias($ownerClass);
        $ownerIds = array_map('intval', $ownerIds);

        // Hits IDX seo_meta_owner_unique on (seoable_type, seoable_id).
        $scope = fn () => SeoMeta::query()
            ->where('seoable_type', $alias)
            ->whereIn('seoable_id', $ownerIds);

        $scope()->get(['seoable_id', 'locale'])
            ->each(fn (SeoMeta $meta) => $this->forgetSeo($alias, $meta->seoable_id, $meta->locale));

        return $scope()->delete();
    }

    /**
     * Forget a resolved SEO payload.
     */
    public function forgetSeo(string $alias, int|string $id, string $locale): void
    {
        $this->forgetKeys([
            CacheKey::CMS_SEO->for($alias, $id, $locale),
        ]);

        // Sitemap entries are keyed per (site, locale-part); flush the family.
        $this->forgetFamily(CacheKey::CMS_SITEMAP->value);
    }

    /**
     * Resolve an owner from the morph alias + id an SEO request carries.
     *
     * The alias has already been constrained by SeoMetaSaveRequest against
     * config('morph-map.columns.seoable'), so this cannot be pointed at an
     * arbitrary class — but it resolves through Relation::getMorphedModel()
     * rather than a local map so the permitted set stays declared in exactly
     * one place.
     *
     * @return Model The owning entity.
     */
    public function resolveOwner(string $alias, int|string $id): Model
    {
        $class = Relation::getMorphedModel($alias);

        if ($class === null || ! is_subclass_of($class, Model::class)) {
            throw ValidationException::withMessages([
                'seoable_type' => translate('That content type cannot carry SEO settings.'),
            ]);
        }

        /** @var Model $model */
        $model = new $class;

        return $model->newQuery()->findOrFail($id);
    }

    /**
     * The owner's morph alias.
     *
     * Goes through Relation::getMorphAlias() so the stored value is always the
     * short alias, never an FQCN — the whole reason seoable_type is
     * VARCHAR(60) rather than VARCHAR(255).
     */
    protected function aliasFor(Model $owner): string
    {
        return Relation::getMorphAlias($owner::class);
    }
}
