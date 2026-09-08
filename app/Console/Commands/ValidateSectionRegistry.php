<?php

namespace App\Console\Commands;

use App\Contracts\Cms\SectionTypeContract;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use App\Models\PageSection;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;

/**
 * Wire this into CI. It is the enforcement half of the §4.2 rule: the rule is
 * only a rule if something rejects a violation, and a code review is not that
 * something.
 */
class ValidateSectionRegistry extends Command
{
    /**
     * @var string
     */
    protected $signature = 'cms:validate-registry';

    /**
     * @var string
     */
    protected $description = 'Validate the CMS section type registry and the schema invariants it depends on';

    /**
     * Execute the console command.
     */
    public function handle(SectionTypeRegistry $registry): int
    {
        $errors = [
            ...$registry->validate(),
            ...$this->validateRelationAliases($registry),
            ...$this->validateSectionOwnership(),
        ];

        $missingComponents = $this->missingPreviewComponents($registry);

        // Until the public section components exist, a missing file is a
        // not-built-yet, not a drift. Once the directory appears, the same
        // finding becomes a hard failure — which is the case this check is
        // actually for: a component renamed out from under its section type.
        $componentsAreExpected = is_dir(resource_path('js/Components/Frontend/Sections'));

        if ($componentsAreExpected) {
            $errors = [...$errors, ...$missingComponents];
        }

        if ($errors !== []) {
            $this->components->error(count($errors).' registry problem(s) found:');

            foreach ($errors as $error) {
                $this->components->twoColumnDetail('<fg=red>FAIL</>', $error);
            }

            return self::FAILURE;
        }

        if (! $componentsAreExpected && $missingComponents !== []) {
            $this->components->warn(
                'resources/js/Components/Frontend/Sections does not exist yet, so preview components were not verified. '
                .'This check becomes a hard failure once the directory is created.'
            );
        }

        $this->components->info(sprintf(
            '%d section type(s) valid: %s',
            count($registry->keys()),
            implode(', ', $registry->keys())
        ));

        return self::SUCCESS;
    }

    /**
     * Every previewComponent() must resolve to a real file, so the admin
     * preview and the public render cannot silently diverge.
     *
     * @return array<int, string>
     */
    protected function missingPreviewComponents(SectionTypeRegistry $registry): array
    {
        $errors = [];

        foreach ($registry->all() as $key => $type) {
            /** @var SectionTypeContract $type */
            $component = $type->previewComponent();

            $exists = collect(['.tsx', '.jsx'])
                ->contains(fn (string $ext): bool => file_exists(resource_path('js/Components/'.$component.$ext)));

            if (! $exists) {
                $errors[] = "[{$key}]: previewComponent `{$component}` does not resolve to a file under resources/js/Components.";
            }
        }

        return $errors;
    }

    /**
     * Every relations() entry must name an alias the morph map knows.
     *
     * @return array<int, string>
     */
    protected function validateRelationAliases(SectionTypeRegistry $registry): array
    {
        $errors = [];
        $aliases = array_keys((array) config('morph-map.aliases', []));

        foreach ($registry->all() as $key => $type) {
            /** @var SectionTypeContract $type */
            foreach (array_keys($type->relations()) as $alias) {
                if (! in_array($alias, $aliases, true)) {
                    $errors[] = "[{$key}]: relation `{$alias}` is not a registered morph alias.";
                }
            }
        }

        return $errors;
    }

    /**
     * The page_sections dual-owner invariant is service-enforced, not
     * DB-enforced (a MySQL CHECK failure produces an opaque error the
     * AppResponse path cannot translate), so a bad migration or a tinker
     * session can violate it. This is where that gets caught.
     *
     * Note what is NOT a violation: a page-local section that references a
     * global block legitimately carries both page_id and block_id — page_id is
     * the owner, block_id is the reference. The only illegal state is a row
     * that has neither, which belongs to nothing and renders nowhere.
     *
     * @return array<int, string>
     */
    protected function validateSectionOwnership(): array
    {
        if (! Schema::hasTable('page_sections')) {
            return [];
        }

        $orphans = PageSection::withTrashed()
            ->whereNull('page_id')
            ->whereNull('block_id')
            ->count();

        if ($orphans > 0) {
            return ["page_sections: {$orphans} row(s) have neither page_id nor block_id — the dual-owner invariant is violated."];
        }

        return [];
    }
}
