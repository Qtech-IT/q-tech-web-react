<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The non-routable translation overlay (schema doc §8.2).
 *
 * Routable content (`pages`) is multilingual by row-per-locale: each locale is
 * its own row grouped by `translation_group_id`. Everything a page is built
 * FROM — sections, repeater items, blocks, menu items, CTAs, media alt text —
 * is locale-neutral structure with its editor text overlaid from here, one row
 * per (owner, locale, field).
 *
 * `field` is a DOTTED PATH against a stable identity: `heading`,
 * `data.billing_note`, `label`. This is exactly why §4.2 rule I1 forbids
 * editor text inside a JSON array — `data.items[2].label` has no stable address
 * across a reorder, so repeatable text lives in `section_blocks` rows (each
 * with its own uuid) and is addressed here as that row's `label` / `data.*`.
 *
 * No `site_id`: the owner already carries tenancy and this table is only ever
 * queried by `(translatable_type, translatable_id)`. No soft deletes: an
 * overlay row has no meaning without its owner and is cascaded on force-delete
 * by the HasContentTranslations trait.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_translations', function (Blueprint $table) {
            $table->id();

            // Morph-map ALIAS, not an FQCN. Permitted values are constrained in
            // ContentTranslationRequest against the owner set below.
            $table->string('translatable_type', 60);
            $table->unsignedBigInteger('translatable_id');

            // Matches languages.code. Never the default locale — the default
            // locale's text lives on the owner row itself.
            $table->string('locale', 10);

            // Dotted path into the owner: a scalar column name, or `data.<key>`.
            $table->string('field', 120);

            $table->longText('value')->nullable();

            // Translation QA state. A reviewer flips this; the public render
            // does not care, but the admin completion view and a future
            // export job do.
            $table->boolean('is_reviewed')->default(false);

            $table->timestamps();

            // One row per owner per locale per field, and the upsert target.
            $table->unique(
                ['translatable_type', 'translatable_id', 'locale', 'field'],
                'content_translations_unique'
            );

            // The overlay eager-load: every field for one owner in one locale.
            $table->index(
                ['translatable_type', 'translatable_id', 'locale'],
                'content_translations_owner'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_translations');
    }
};
