<?php

namespace App\Models;

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\PageType;
use App\Enums\Common\Status;
use App\Traits\Cms\HasAuditUsers;
use App\Traits\Cms\HasMedia;
use App\Traits\Cms\Publishable;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Page extends Model
{
    use Filterable;
    use HasAuditUsers;
    use HasMedia;
    use HasUuid;
    use Publishable;
    use SoftDeletes;
    use UsesUuidRouting;

    /**
     * The attributes that are mass assignable.
     *
     * `publish_status` is intentionally NOT excluded here — it is fillable for
     * PageService, which is the only writer. What protects it is that the
     * config-driven CRUD bulk-action control never exposes it, and
     * ModelAction::validateBulkActonRequest() rejects any value outside
     * Status::getValues() anyway.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'site_id',
        'translation_group_id',
        'locale',
        'parent_id',
        'slug',
        'path',
        'depth',
        'title',
        // Card metadata — what this page looks like when ANOTHER page lists it.
        // See the 000160 migration for why these are columns and not `settings`.
        'excerpt',
        'icon',
        'accent',
        'page_type',
        'template',
        'is_homepage',
        'is_indexable',
        'settings',
        'status',
        'publish_status',
        'published_at',
        'expires_at',
        'sort_order',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'page_type' => PageType::class,
            'status' => Status::class,
            'publish_status' => ContentStatus::class,
            'settings' => 'array',
            'is_homepage' => 'boolean',
            'is_indexable' => 'boolean',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
            'depth' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Assign the translation group on create so a page is always the first
     * member of its own locale set.
     */
    protected static function booted(): void
    {
        static::creating(function (self $page): void {
            if (blank($page->translation_group_id)) {
                $page->translation_group_id = (string) Str::uuid();
            }
        });
    }

    /**
     * Parent page. RESTRICT at the DB level so a live URL tree cannot be
     * orphaned by deleting its root.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Direct children, in sibling order.
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * Every section on this page, in render order.
     *
     * The public render eager-loads this as
     * with(['sections.blocks.media', 'sections.cta', 'seo']) — one batched
     * query per level, never a lazy access inside a loop.
     */
    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class, 'page_id')->orderBy('sort_order');
    }

    /**
     * Only the sections a visitor may see, in order.
     */
    public function visibleSections(): HasMany
    {
        return $this->sections()->published();
    }

    /**
     * Polymorphic SEO record.
     *
     * Deliberately NOT constrained to `$this->locale` inside the relation. A
     * closure-free constraint referencing `$this` is evaluated against the
     * PROTOTYPE instance during an eager load — where `locale` is null — so
     * `->with('seo')` would emit `where locale is null` and silently return
     * nothing for every page. Because `pages` is row-per-locale and
     * seo_meta is UNIQUE (seoable_type, seoable_id, locale), a page has at
     * most one SEO row anyway, which makes the unconstrained relation both
     * correct and eager-loadable.
     *
     * Use seoIn() when a specific locale must be forced.
     */
    public function seo(): MorphOne
    {
        return $this->morphOne(SeoMeta::class, 'seoable');
    }

    /**
     * SEO record for an explicit locale. Safe to eager-load as
     * `with(['seoIn' => fn ($q) => $q->where('locale', $locale)])` is not —
     * pass the locale here instead when reading a single model.
     */
    public function seoIn(string $locale): MorphOne
    {
        return $this->morphOne(SeoMeta::class, 'seoable')->where('locale', $locale);
    }

    /**
     * Buttons pointing at this page. Used by the broken-link report before a
     * delete is allowed.
     */
    public function ctas(): HasMany
    {
        return $this->hasMany(Cta::class, 'page_id');
    }

    /**
     * Navigation entries pointing at this page. Same purpose.
     */
    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'page_id');
    }

    /**
     * Every locale variant of this logical page, including this one.
     *
     * Self-exclusion is left to the caller for the same reason seo() carries
     * no locale filter: `where('id', '!=', $this->id)` resolves against the
     * prototype instance during an eager load, becoming `id != null`, which
     * matches nothing. The language switcher wants the full set anyway and
     * marks the current entry rather than dropping it.
     */
    public function translations(): HasMany
    {
        return $this->hasMany(self::class, 'translation_group_id', 'translation_group_id');
    }

    /**
     * Resolve a page by its public URL — a single unique-index probe against
     * pages_path_unique, which is exactly what `path` denormalization buys.
     */
    public function scopeForPath(Builder $query, string $path, string $locale, int $siteId = 1): Builder
    {
        return $query->where('site_id', $siteId)
            ->where('locale', $locale)
            ->where('path', $path);
    }
}
