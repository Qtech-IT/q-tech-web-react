<?php

use App\Enums\Cms\PageType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Card metadata for a page that appears in a listing.
 *
 * WHY COLUMNS AND NOT `pages.settings`
 * ------------------------------------
 * `settings` is documented in the pages migration as page-level PRESENTATION
 * only — header variant, hide-footer, theme accent — explicitly never content.
 * An excerpt is content: it is translated, it is indexed, it is the sentence a
 * visitor reads on the index page. Putting it in the JSON blob would make it
 * invisible to every query that looks for text and would break the one rule the
 * schema doc is most insistent about.
 *
 * WHY THIS IS ON `pages` AND NOT ON A `services` TABLE
 * ---------------------------------------------------
 * Because it is not about services. Any page can be listed by another page:
 * services under /services, technologies under /technologies, legal pages in a
 * footer index, articles under a blog later. One migration makes all of them
 * listable, and the alternative — a card table per content type — is the same
 * three columns copied as many times as the site has content types.
 *
 * The card IMAGE is deliberately absent here. Media never lives in a column on
 * the owner or in JSON; it goes through the `mediables` pivot, which is what
 * gives it an FK and a reverse index ("what uses this asset?"). A page's card
 * image is `MediaCollection::CARD` on the existing `HasMedia` relation.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table): void {
            // The card summary. TEXT rather than VARCHAR because an editor
            // writing two sentences should not hit a limit they cannot see,
            // and because the render truncates by line clamp, not by length.
            $table->text('excerpt')->nullable()->after('title');

            // Lucide registry key, for icon-led cards. Nullable: an index that
            // uses images has no use for it, and a card must survive both.
            $table->string('icon', 100)->nullable()->after('excerpt');

            // The `--fx-mark-*` hue this page's card spends. A plain string,
            // NOT an enum column: the palette lives in `frontend.css` and in
            // the section types' static class maps, and a DB enum would mean a
            // migration every time the design system gains a colour.
            $table->string('accent', 32)->nullable()->after('icon');
        });

        /*
         * `page_type` is a DB ENUM built from `PageType::getValues()`, so the
         * new `service` / `technology` / `legal` cases do not exist as far as
         * MySQL is concerned until the column itself is widened. Without this
         * the enum case compiles fine and every insert using it fails at
         * runtime with a truncation error — which is exactly the kind of
         * mismatch a DB enum trades for its storage efficiency.
         *
         * Read from the enum rather than a literal list so this migration
         * cannot drift from the cases in code.
         */
        Schema::table('pages', function (Blueprint $table): void {
            $table->enum('page_type', PageType::getValues())
                ->default(PageType::STANDARD->value)
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * The three columns come back off. The `page_type` enum is deliberately
     * NOT narrowed again: MySQL resolves a value outside a narrowed enum to the
     * empty string rather than refusing, so rolling this back on a database
     * that has service pages on it would silently blank their type and leave
     * them unfindable. Widening an enum is safe; narrowing one is not, so the
     * reversal stops at the part that is.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table): void {
            $table->dropColumn(['excerpt', 'icon', 'accent']);
        });
    }
};
