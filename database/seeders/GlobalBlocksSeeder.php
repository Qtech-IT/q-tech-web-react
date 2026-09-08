<?php

namespace Database\Seeders;

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use App\Models\Block;
use App\Models\PageSection;
use Illuminate\Database\Seeder;

/**
 * Bootstraps the registry into the database: for each locked block below, a
 * `blocks` identity row plus the `page_sections` row that IS its content
 * (page_id NULL, block_id set), seeded from the section type's own defaults().
 *
 * Seeding through the registry rather than with literal JSON is the point —
 * the `version` key inside `data` comes from defaults(), so seeded rows carry
 * it from day one exactly like editor-created ones.
 */
class GlobalBlocksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $registry = app(SectionTypeRegistry::class);

        foreach ($this->blocks() as $definition) {
            $type = $registry->get($definition['section_type']);

            if ($type === null) {
                $this->command?->warn("Skipped block [{$definition['key']}]: section type is not registered.");

                continue;
            }

            $block = Block::firstOrNew([
                'site_id' => config('cms.site_id'),
                'key' => $definition['key'],
            ]);

            if ($block->exists) {
                continue;
            }

            $block->name = $definition['name'];
            $block->description = $definition['description'];
            $block->section_type = $definition['section_type'];

            // Locked: a hard-coded layout slot resolves this by key, so
            // deleting it breaks a template rather than a page.
            $block->is_locked = true;

            $block->status = Status::ACTIVE;
            $block->publish_status = ContentStatus::PUBLISHED;
            $block->published_at = now();
            $block->save();

            $defaults = $type->defaults();

            $body = new PageSection;

            $body->site_id = $block->site_id;
            $body->page_id = null;
            $body->block_id = $block->id;
            $body->section_type = $block->section_type;
            $body->name = $block->name;
            $body->heading = $definition['heading'] ?? null;
            $body->subheading = $definition['subheading'] ?? null;
            $body->data = $defaults['data'] ?: null;
            $body->settings = $defaults['settings'] ?: null;
            $body->status = Status::ACTIVE;
            $body->publish_status = ContentStatus::PUBLISHED;
            $body->published_at = now();
            $body->save();
        }

        $this->command?->info('✅ Global blocks seeded.');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function blocks(): array
    {
        return [
            [
                'key' => 'global.cta_band',
                'name' => 'Global CTA Band',
                'description' => 'The conversion band reused at the foot of most pages. Edit once, changes everywhere.',
                'section_type' => 'cta.band',
                'heading' => 'Ready to talk?',
                'subheading' => 'Tell us what you are building and we will show you how we would approach it.',
            ],
        ];
    }
}
