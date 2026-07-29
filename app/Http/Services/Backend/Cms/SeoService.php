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
     * Forget a resolved SEO payload.
     */
    public function forgetSeo(string $alias, int|string $id, string $locale): void
    {
        $this->forgetKeys([
            CacheKey::CMS_SEO->for($alias, $id, $locale),
            CacheKey::CMS_SITEMAP->for(config('cms.site_id')),
        ]);
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
