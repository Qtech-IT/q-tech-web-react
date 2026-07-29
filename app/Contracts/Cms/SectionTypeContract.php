<?php

namespace App\Contracts\Cms;

/**
 * A section type declares the editable shape of one kind of page section.
 *
 * Section types live in PHP, not a table. The React component that renders a
 * section must know the same field names, and a DB-driven schema lets the
 * component and the row drift with no failure until render. Keeping the schema
 * in code makes it versioned in the same commit as the component, diffable in
 * review, and checkable by `cms:validate-registry`.
 *
 * `page_sections.section_type` is therefore a plain VARCHAR with no FK: an
 * unknown key renders the missing-section fallback rather than throwing, which
 * is exactly the "survive missing CMS data" requirement.
 */
interface SectionTypeContract
{
    /**
     * Registry key, namespaced by family: `hero.split`, `stats.counter`.
     * The family is also the admin picker group.
     */
    public function key(): string;

    /**
     * Editor-facing name. Must go through translate().
     */
    public function label(): string;

    /**
     * Editor-facing explanation of when to use this section.
     */
    public function description(): string;

    /**
     * Icon registry key (lucide name) for the section picker.
     */
    public function icon(): string;

    /**
     * Admin picker grouping: Hero, Content, Social Proof, Conversion.
     */
    public function group(): string;

    /**
     * Ordered field descriptors. Each is an array carrying at minimum `name`,
     * `label`, `type` and `store`. See App\Data\Cms\SectionField.
     *
     * @return array<int, array<string, mixed>>
     */
    public function fields(): array;

    /**
     * Descriptor sets per block_type this section accepts, keyed by block_type,
     * each with `label`, `fields`, and `min`/`max` counts.
     *
     * `max` is not decorative: it is what stops an editor pasting a 500-row
     * table into a repeater, and SectionSaveRequest enforces it.
     *
     * @return array<string, array<string, mixed>>
     */
    public function blockTypes(): array;

    /**
     * Permitted content_relations types and cardinality, keyed by morph alias.
     * Phase 1 has no content_relations table, so this returns [] for now and
     * the shape is reserved so later phases add nothing to the contract.
     *
     * @return array<string, array<string, mixed>>
     */
    public function relations(): array;

    /**
     * React component key, so admin preview and public render cannot diverge.
     */
    public function previewComponent(): string;

    /**
     * Seeded `data` / `settings` for a newly added section.
     *
     * MUST include a `version` key inside `data`. Retrofitting it later means
     * guessing which rows predate which schema — see schema doc §16.2.
     *
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array;
}
