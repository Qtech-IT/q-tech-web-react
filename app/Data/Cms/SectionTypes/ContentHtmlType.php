<?php

namespace App\Data\Cms\SectionTypes;

use App\Contracts\Cms\SectionTypeContract;
use App\Data\Cms\SectionField;
use App\Enums\Cms\FieldStore;
use App\Enums\Cms\FieldType;
use App\Enums\Settings\InputEnum;

/**
 * Raw HTML, rendered exactly as written.
 *
 * WHY THIS EXISTS
 * ---------------
 * `content.prose` is a rich text band, and a rich text band is opinionated by
 * design: it strips classes, normalises headings, and paints links, lists and
 * quotes in the site's own styles. That is right for a passage of argument and
 * wrong for a design somebody built elsewhere and wants reproduced. Pasted into
 * the rich editor, such a design comes back as the editor's interpretation of
 * it — the structure survives, the appearance does not.
 *
 * By default this band applies NOTHING. No typography, no measure, no link
 * colours, no heading demotion. What an editor pastes is what a visitor sees.
 *
 * The `styling` setting opts INTO the site's look: `site` adds the `.fx-prose`
 * stylesheet — one token-driven rule per tag, shared with `content.prose` — so
 * markup pasted without any CSS of its own picks up the site's type scale,
 * spacing and colours. A pasted `<style>` block, scoped to this section, still
 * wins wherever it sets a property. This is for the common case: an editor
 * drops in bare HTML and expects it to look designed, not unstyled.
 *
 * WHAT IS STILL ENFORCED, AND WHY IT CANNOT BE OPTIONAL
 * ----------------------------------------------------
 * Scripts, event handlers and `javascript:` URLs are removed on render. This is
 * not a styling opinion; it is the difference between a CMS field and a stored
 * XSS on every page that renders it. An admin account is authenticated, not
 * trusted — it can be phished, and a payload written today still executes for
 * every visitor next year. `ContentHtml.tsx` documents the exact allowlist.
 *
 * A `<style>` block inside the markup is kept and its selectors are rewritten
 * to apply only within this section. Unscoped, one pasted `.row { … }` would
 * restyle every other page on the site, and the editor who pasted it would have
 * no way to know.
 *
 * WHEN NOT TO USE THIS
 * --------------------
 * For anything the site owns. A band that will be edited more than once, needs
 * translating, or has to stay on-brand belongs in a real section type where it
 * is structured, responsive and safe by construction. This is the escape hatch
 * for content that comes from outside — and an escape hatch that becomes the
 * default is a site with no design system.
 */
class ContentHtmlType implements SectionTypeContract
{
    public function key(): string
    {
        return 'content.html';
    }

    public function label(): string
    {
        return translate('Raw HTML');
    }

    public function description(): string
    {
        return translate('Your markup, rendered exactly as written. No site styling is applied to it.');
    }

    public function icon(): string
    {
        return 'code';
    }

    public function group(): string
    {
        return translate('Content');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function fields(): array
    {
        return [
            SectionField::make(
                name: 'body',
                label: translate('HTML'),
                type: FieldType::CODE->value,
                store: FieldStore::COLUMN,
                translatable: true,
                required: true,
                rules: ['max:120000'],
                help: translate('Paste your markup. Include a <style> block if the design needs one — its rules are rewritten to apply only inside this section. Scripts and event handlers are removed.'),
            ),

            SectionField::make(
                name: 'styling',
                label: translate('Styling'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'raw', 'label' => translate('None (raw markup)')],
                    ['value' => 'site', 'label' => translate('Site styling')],
                ],
                default: 'raw',
                group: 'Layout',
                help: translate('Site styling paints every tag your markup uses — headings, text, lists, tables, quotes, code — in the site\'s type scale, spacing and colours, while any <style> block you paste still wins where it applies. Use None to reproduce a design exactly as built.'),
            ),

            SectionField::make(
                name: 'width',
                label: translate('Width'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'page', 'label' => translate('Page Width')],
                    ['value' => 'wide', 'label' => translate('Wide')],
                    ['value' => 'prose', 'label' => translate('Prose (narrow)')],
                    ['value' => 'full', 'label' => translate('Full Bleed (edge to edge)')],
                ],
                default: 'page',
                group: 'Layout',
                help: translate('Full bleed removes the page gutters entirely, for a design that manages its own.'),
            ),

            SectionField::make(
                name: 'theme',
                label: translate('Section Theme'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'default', 'label' => translate('Default')],
                    ['value' => 'subtle', 'label' => translate('Subtle Band')],
                    ['value' => 'inverted', 'label' => translate('Inverted')],
                ],
                default: 'default',
                group: 'Layout',
                help: translate('The band behind your markup. Leave on Default if the design paints its own background.'),
            ),

            SectionField::make(
                name: 'spacing',
                label: translate('Vertical Spacing'),
                type: InputEnum::SELECT->value,
                store: FieldStore::SETTINGS,
                options: [
                    ['value' => 'none', 'label' => translate('None')],
                    ['value' => 'sm', 'label' => translate('Compact')],
                    ['value' => 'default', 'label' => translate('Default')],
                    ['value' => 'lg', 'label' => translate('Generous')],
                ],
                default: 'default',
                group: 'Layout',
                help: translate('None butts the design against its neighbours, for a block that carries its own padding.'),
            ),
        ];
    }

    /**
     * No repeater, and no heading, eyebrow or CTA fields either.
     *
     * Every one of those would render in the SITE's styles above markup that
     * is deliberately rendered in nobody's — a band that is half designed
     * system and half not is worse than either. The heading belongs in the
     * pasted markup, where it will match the rest of it.
     *
     * @return array<string, array<string, mixed>>
     */
    public function blockTypes(): array
    {
        return [];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function relations(): array
    {
        return [];
    }

    public function previewComponent(): string
    {
        return 'Frontend/Sections/ContentHtml';
    }

    /**
     * @return array{data: array<string, mixed>, settings: array<string, mixed>}
     */
    public function defaults(): array
    {
        return [
            'data' => [
                'version' => 1,
            ],
            'settings' => [
                'styling' => 'raw',
                'width' => 'page',
                'theme' => 'default',
                'spacing' => 'default',
            ],
        ];
    }
}
