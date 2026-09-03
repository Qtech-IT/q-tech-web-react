<?php

namespace App\Contracts\Cms;

use App\Models\Page;
use App\Models\PageSection;

/**
 * A section type whose content is OTHER PAGES rather than its own rows.
 *
 * WHY THIS IS A SEPARATE INTERFACE AND NOT A METHOD ON `SectionTypeContract`
 * -------------------------------------------------------------------------
 * Exactly one section type in the registry lists other pages; the other
 * twenty-five own every row they render. Adding `resolveCollection()` to the
 * base contract would force twenty-five classes to implement a method that
 * returns an empty array, and would tell every future author that listing other
 * content is a normal thing for a section to do. Interface segregation: a type
 * opts in, `PageRenderService` checks `instanceof`, and nothing that does not
 * list anything changes at all.
 *
 * THE CACHING RULE THIS INTERFACE EXISTS TO MAKE VISIBLE
 * -----------------------------------------------------
 * What comes back from here must NOT be cached inside the owning page's render
 * payload. That cache is keyed on the index page's own uuid and is invalidated
 * when the index page is saved — so a listing stored inside it would keep
 * showing yesterday's services until somebody re-saved `/services`, and
 * publishing a new service would appear to do nothing. `PageRenderService`
 * resolves collections after the page cache is read, under their own key.
 */
interface ResolvesCollection
{
    /**
     * The pages this section lists, already shaped for the card renderer.
     *
     * Returns BOTH the rows and the meta describing them, because a paginated
     * or searched listing is not fully described by its rows: a page showing
     * ten of forty-seven results has to say so, and an empty result set means
     * something different after a search ("nothing matched 'xyz'") than before
     * one ("nothing published yet"). Splitting that into a second contract
     * method would let the two drift out of step for the same request.
     *
     * @param  PageSection  $section  The section row, for its `settings`.
     * @param  Page  $page  The page being rendered — a "children of this page"
     *                      source has no other way to know what to list, and
     *                      resolving it from the page rather than from a stored
     *                      id means renaming or re-parenting never strands it.
     * @return array{items: array<int, array<string, mixed>>, meta: array<string, mixed>}
     */
    public function resolveCollection(PageSection $section, Page $page): array;
}
