<?php

namespace App\Policies;

/**
 * Repeater items have no permission surface of their own — an editor who may
 * edit a section may edit the items inside it, and a separate `block.*` set
 * would be a distinction the admin UI could not meaningfully express.
 *
 * This subclass exists purely so Laravel's policy auto-discovery
 * (App\Models\SectionBlock -> App\Policies\SectionBlockPolicy) resolves
 * without an explicit Gate::policy() registration.
 */
class SectionBlockPolicy extends PageSectionPolicy {}
