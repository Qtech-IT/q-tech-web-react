<?php

namespace App\Enums\Cms;

use App\Enums\EnumTrait;

enum PageType: string
{
    use EnumTrait;

    case STANDARD = 'standard';
    case HOME = 'home';
    case LANDING = 'landing';
    case SYSTEM = 'system';

    /*
     * The three below are CLASSIFICATION, not behaviour.
     *
     * Nothing routes on them and nothing renders differently because of them —
     * a service page resolves through the same catch-all, the same
     * `pages_path_unique` probe and the same section registry as every other
     * page. They exist so a listing can ask for "every service" without
     * depending on where in the tree an editor happened to file it, and so the
     * page tree can be filtered by what a page IS.
     *
     * This is the whole reason services are not a separate table: adding a
     * content type is a case here plus content, not a model, a controller, a
     * service, a resource, a policy, a migration and a set of public routes.
     */
    case SERVICE = 'service';
    case TECHNOLOGY = 'technology';
    case LEGAL = 'legal';

    /**
     * Page types an editor may never delete.
     */
    public static function undeletable(): array
    {
        return [
            self::HOME->value,
            self::SYSTEM->value,
        ];
    }

    /**
     * List all values.
     */
    public static function getValues(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}
