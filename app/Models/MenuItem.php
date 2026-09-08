<?php

namespace App\Models;

use App\Enums\Cms\MenuLinkType;
use App\Enums\Cms\MenuVisibility;
use App\Enums\Common\Status;
use App\Traits\Cms\HasContentTranslations;
use App\Traits\Common\Filterable;
use App\Traits\Common\HasUuid;
use App\Traits\Common\UsesUuidRouting;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuItem extends Model
{
    use Filterable;
    use HasContentTranslations;
    use HasUuid;
    use SoftDeletes;
    use UsesUuidRouting;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'menu_id',
        'parent_id',
        'path',
        'depth',
        'label',
        'aria_label',
        'description',
        'icon',
        'media_id',
        'link_type',
        'url',
        'route_name',
        'route_params',
        'page_id',
        'target_type',
        'target_id',
        'opens_in_new_tab',
        'rel',
        'badge_label',
        'badge_variant',
        'visibility',
        'settings',
        'status',
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
            'link_type' => MenuLinkType::class,
            'visibility' => MenuVisibility::class,
            'status' => Status::class,
            'route_params' => 'array',
            'settings' => 'array',
            'opens_in_new_tab' => 'boolean',
            'depth' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Owning menu.
     */
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }

    /**
     * Parent item.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Child items, in order.
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * Destination page when link_type = 'page'.
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'page_id');
    }

    /**
     * Mega-menu thumbnail.
     */
    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id');
    }

    /**
     * Destination entity when link_type = 'entity'.
     */
    public function target(): MorphTo
    {
        return $this->morphTo('target', 'target_type', 'target_id');
    }

    /**
     * Every descendant of this node, in one query. This is what the
     * materialized `path` column buys over a plain adjacency list.
     */
    public function scopeDescendantsOf(Builder $query, self $node): Builder
    {
        return $query->where('menu_id', $node->menu_id)
            ->where('path', 'like', $node->path.$node->id.'/%');
    }

    /**
     * Destination for this item, or null when it has none.
     *
     * Null rather than `'#'`: an anchor with `href="#"` is focusable, announced
     * as a link, and goes nowhere — a WCAG failure the CMS must not be able to
     * author. Callers render a non-link element instead.
     *
     * Lives on the MODEL, not on `MenuItemResource`, because both the admin
     * resource and the public `NavigationService` need it. It was resource-only,
     * so the public navigation read a non-existent `$item->href`, got null, and
     * every menu link on the site was dead.
     */
    public function resolveHref(): ?string
    {
        return match ($this->link_type) {
            MenuLinkType::URL, MenuLinkType::ANCHOR => $this->url,
            MenuLinkType::PAGE => $this->relationLoaded('page') ? $this->page?->path : null,
            MenuLinkType::ROUTE => $this->route_name && app('router')->has($this->route_name)
                ? route($this->route_name, (array) $this->route_params, false)
                : null,
            default => null,
        };
    }
}
