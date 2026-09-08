<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Cms\CtaLinkType;
use App\Enums\Cms\IconPosition;
use App\Enums\Common\Status;
use App\Models\Cta;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * One table, one resource, one resolveHref() — which is the entire argument
 * for `ctas` being a table rather than ~17 columns inlined four times.
 */
class CtaService
{
    /**
     * The admin CTA list.
     *
     * @return Collection<int, Cta>|LengthAwarePaginator|CursorPaginator
     */
    public function getCtas(): Collection|LengthAwarePaginator|CursorPaginator
    {
        return Cta::query()
            ->with(['page:id,uuid,title,path'])
            ->where('site_id', config('cms.site_id'))
            ->search(['label', 'url', 'tracking_id'])
            ->filter(['link_type', 'variant', 'status'])
            ->recycle()
            ->date()
            ->sortDefault('created_at', 'desc')
            ->fetch();
    }

    /**
     * Create or update a button.
     */
    public function save(Request $request, ?Cta $cta = null): Cta
    {
        $cta ??= new Cta;

        $linkType = $request->input('link_type', CtaLinkType::URL->value);

        $cta->site_id = (int) config('cms.site_id');
        $cta->label = $request->input('label');
        $cta->aria_label = $request->input('aria_label');
        $cta->link_type = $linkType;

        // Clear the fields the chosen strategy does not use, so a link never
        // carries stale state from a previous type and resolveHref() has a
        // single unambiguous source.
        $cta->url = in_array($linkType, [CtaLinkType::URL->value, CtaLinkType::ANCHOR->value], true)
            ? $request->input('url') : null;
        $cta->route_name = $linkType === CtaLinkType::ROUTE->value ? $request->input('route_name') : null;
        $cta->route_params = $linkType === CtaLinkType::ROUTE->value ? $request->input('route_params') : null;
        $cta->page_id = $linkType === CtaLinkType::PAGE->value ? $request->input('page_id') : null;
        $cta->target_type = $linkType === CtaLinkType::ENTITY->value ? $request->input('target_type') : null;
        $cta->target_id = $linkType === CtaLinkType::ENTITY->value ? $request->input('target_id') : null;

        $cta->variant = $request->input('variant', 'primary');
        $cta->size = $request->input('size', 'md');
        $cta->icon = $request->input('icon');
        $cta->icon_position = $request->input('icon_position', IconPosition::NONE->value);

        $cta->opens_in_new_tab = $request->boolean('opens_in_new_tab');
        $cta->is_download = $request->boolean('is_download');
        $cta->rel = $request->input('rel');
        $cta->tracking_id = $request->input('tracking_id');
        $cta->status = $request->input('status', Status::ACTIVE->value);

        $cta->save();

        return $cta;
    }

    /**
     * Soft delete a button. Every referencing FK is SET NULL, so this never
     * takes content with it.
     */
    public function destroy(Cta $cta): bool
    {
        return (bool) $cta->delete();
    }

    /**
     * Restore a soft-deleted button.
     *
     * The FKs that pointed at it were SET NULL on delete and are not
     * reconstructible, so the button returns to the library and an editor
     * re-picks it where it is wanted.
     */
    public function restore(Cta $cta): bool
    {
        return (bool) $cta->restore();
    }

    /**
     * Permanently delete a button.
     *
     * Nothing to clean up by hand: `page_sections.cta_id`,
     * `page_sections.secondary_cta_id` and `section_blocks.cta_id` are all SET
     * NULL, and a CTA owns neither library media nor an SEO record — it is not
     * a permitted `mediable_type` or `seoable_type`.
     */
    public function forceDestroy(Cta $cta): bool
    {
        return (bool) $cta->forceDelete();
    }

    /**
     * The single link-resolution implementation.
     *
     * Returns null for `none` and `modal` — the component decides what to
     * render for those, and a null href is honest about there being no
     * destination rather than emitting href="#", which is a focusable dead
     * link and a WCAG failure.
     */
    public function resolveHref(Cta $cta): ?string
    {
        return match ($cta->link_type) {
            CtaLinkType::URL, CtaLinkType::ANCHOR => $cta->url,
            CtaLinkType::PAGE => $cta->page?->path,
            CtaLinkType::ROUTE => $this->resolveRoute($cta),
            CtaLinkType::ENTITY => $this->resolveEntity($cta),
            default => null,
        };
    }

    /**
     * Named-route resolution, guarded: a route removed by a refactor must
     * degrade to a dead button in the admin report, not a 500 on the homepage.
     */
    protected function resolveRoute(Cta $cta): ?string
    {
        if (blank($cta->route_name) || ! app('router')->has($cta->route_name)) {
            return null;
        }

        try {
            return route($cta->route_name, (array) $cta->route_params, false);
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Entity link resolution through the morph map. Unknown aliases and
     * missing rows both return null rather than throwing.
     */
    protected function resolveEntity(Cta $cta): ?string
    {
        $target = $cta->target;

        if ($target === null) {
            return null;
        }

        return $target->path ?? null;
    }
}
