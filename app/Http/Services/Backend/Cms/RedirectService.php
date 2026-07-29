<?php

namespace App\Http\Services\Backend\Cms;

use App\Enums\Cms\RedirectSource;
use App\Enums\Common\Status;
use App\Enums\System\CacheKey;
use App\Models\Redirect;
use App\Traits\Cms\CacheInvalidation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class RedirectService
{
    use CacheInvalidation;

    /**
     * The admin redirect list.
     *
     * @return Collection<int, Redirect>|LengthAwarePaginator|CursorPaginator
     */
    public function getRedirects(): Collection|LengthAwarePaginator|CursorPaginator
    {
        return Redirect::query()
            ->where('site_id', config('cms.site_id'))
            ->search(['from_path', 'to_path'])
            ->filter(['source', 'status', 'status_code'])
            ->booleanFilters(['is_regex'], [])
            ->recycle()
            ->date()
            ->sortDefault('created_at', 'desc')
            ->fetch();
    }

    /**
     * Create or update a redirect.
     */
    public function save(Request $request, ?Redirect $redirect = null): Redirect
    {
        $redirect ??= new Redirect;

        $siteId = (int) config('cms.site_id');
        $fromPath = Redirect::normalizePath($request->input('from_path'));

        $redirect->site_id = $siteId;
        $redirect->from_path = $fromPath;
        $redirect->from_hash = Redirect::hashFor($fromPath, $siteId);
        $redirect->to_path = $request->input('to_path');
        $redirect->status_code = (int) $request->input('status_code', 301);
        $redirect->is_regex = $request->boolean('is_regex');
        $redirect->preserve_query = $request->boolean('preserve_query', true);
        $redirect->source = $request->input('source', RedirectSource::MANUAL->value);
        $redirect->status = $request->input('status', Status::ACTIVE->value);

        $redirect->save();

        $this->forgetRedirects($siteId);

        return $redirect;
    }

    /**
     * Delete a redirect and drop the resolver cache for its site.
     *
     * The invalidation is the whole reason this is not a bare $model->delete()
     * in the controller: a deleted rule that is still cached keeps redirecting.
     */
    public function destroy(Redirect $redirect): bool
    {
        $siteId = (int) $redirect->site_id;

        $deleted = (bool) $redirect->delete();

        $this->forgetRedirects($siteId);

        return $deleted;
    }

    /**
     * Record a redirect for a path that just moved.
     *
     * Called from PageService inside the same transaction as the slug change,
     * which is the only way it can never be forgotten.
     *
     * Two behaviours worth stating:
     *  - An existing rule for the same source wins. A curated redirect must not
     *    be silently overwritten by an automatic one.
     *  - Any rule pointing AT the new path is retargeted, so a slug renamed
     *    twice does not leave a redirect chain (A->B, B->C) that costs two
     *    round trips and loses link equity.
     */
    public function createForMovedPath(
        ?string $fromPath,
        string $toPath,
        int $siteId = 1,
        RedirectSource $source = RedirectSource::SLUG_CHANGE,
    ): ?Redirect {
        if (blank($fromPath)) {
            return null;
        }

        $fromPath = Redirect::normalizePath($fromPath);
        $toPath = Redirect::normalizePath($toPath);

        if ($fromPath === $toPath) {
            return null;
        }

        // Collapse chains: anything that pointed at the old path now points at
        // the new one.
        Redirect::where('site_id', $siteId)
            ->where('to_path', $fromPath)
            ->update(['to_path' => $toPath]);

        $hash = Redirect::hashFor($fromPath, $siteId);

        $redirect = Redirect::firstOrNew(['from_hash' => $hash]);

        if ($redirect->exists) {
            $redirect->to_path = $toPath;
            $redirect->save();
            $this->forgetRedirects($siteId);

            return $redirect;
        }

        $redirect->site_id = $siteId;
        $redirect->from_path = $fromPath;
        $redirect->to_path = $toPath;
        $redirect->status_code = 301;
        $redirect->source = $source;
        $redirect->preserve_query = true;
        $redirect->status = Status::ACTIVE->value;
        $redirect->save();

        $this->forgetRedirects($siteId);

        return $redirect;
    }

    /**
     * Resolve an incoming path.
     *
     * Exact matches go straight to the unique from_hash index — one probe, no
     * cache needed. Only the regex set is cached, because it must be scanned
     * linearly and could otherwise be a full table read per 404.
     */
    public function resolve(string $path, int $siteId = 1): ?Redirect
    {
        $exact = Redirect::where('from_hash', Redirect::hashFor($path, $siteId))
            ->active()
            ->first();

        if ($exact instanceof Redirect) {
            return $exact;
        }

        $normalized = Redirect::normalizePath($path);

        foreach ($this->regexRules($siteId) as $rule) {
            if (@preg_match('#'.$rule->from_path.'#', $normalized) === 1) {
                return $rule;
            }
        }

        return null;
    }

    /**
     * Record a hit without a full model save, so the counter cannot become a
     * write-amplification problem on a hot redirect.
     */
    public function recordHit(Redirect $redirect): void
    {
        Redirect::whereKey($redirect->id)->update([
            'hits' => DB::raw('hits + 1'),
            'last_hit_at' => now(),
        ]);
    }

    /**
     * The cached regex candidate set.
     *
     * @return Collection<int, Redirect>
     */
    protected function regexRules(int $siteId): Collection
    {
        return Cache::rememberForever(
            CacheKey::CMS_REDIRECTS->for($siteId),
            fn (): Collection => Redirect::where('site_id', $siteId)
                ->where('is_regex', true)
                ->active()
                ->get()
        );
    }

    /**
     * Invalidate the cached regex set.
     */
    public function forgetRedirects(int $siteId): void
    {
        $this->forgetKeys([CacheKey::CMS_REDIRECTS->for($siteId)]);
    }
}
