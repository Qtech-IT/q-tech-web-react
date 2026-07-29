# QTECH CMS — Backend Schema & Architecture

**Status:** Design document. No code exists for anything below.
**Scope:** The complete content-management backend for the QTECH public site, layered onto the
existing admin-panel skeleton (11 migrations, 176 backend routes).
**Reference implementation for all conventions:**
`app/Http/Controllers/Backend/LanguageController.php` + `app/Http/Services/Backend/LanguageService.php`.

**Table count: 33 new tables.** Zero existing tables altered. `files` is superseded, not migrated
(see §3.3). `app_settings` is extended with seeded rows only — no schema change.

---

## 0. Reading the conventions out of the existing code

Everything below is derived from what the repo already does. The relevant facts, verified:

| Fact | Source | Consequence for this schema |
|---|---|---|
| `Filterable::scopeActive()` hard-codes `where('status', Status::ACTIVE)` | `app/Traits/Common/Filterable.php` | The column named `status` must hold `App\Enums\Common\Status`. Nothing else. |
| `ModelAction::handleBulkAction()` writes `[BulkActionType::STATUS->value => $request->input('value')]` — literally the column `status` | `app/Traits/Common/ModelAction.php` | A bulk toggle from any config-driven CRUD screen writes `'active'`/`'inactive'` into `status`. |
| `ModelAction::validateBulkActonRequest()` rejects any value not in `Status::getValues()` | same file | Editorial states can never be bulk-set through the shared path. |
| `BaseResource::getBaseAttributes()` emits `$this->status` when set | `app/Http/Resources/BaseResource.php` | Every resource ships `status` for free; `publish_status` must be added explicitly. |
| `BaseModel::getRouteKeyName()` returns `'uid'` | `app/Models/BaseModel.php` | **Bug.** No `uid` column exists in any of the 11 migrations. See §12.1. |
| `UsesUuidRouting::getRouteKeyName()` returns `'uuid'`; `HasUuid` fills it on `creating` | `app/Traits/Common/HasUuid.php`, `UsesUuidRouting.php` | Correct pair for route binding. Use these, never `BaseModel`. |
| `Filterable::scopeRecycle()` calls `onlyTrashed()` | `app/Traits/Common/Filterable.php` | Currently dead — **zero models use `SoftDeletes`**. See §12.2. |
| No morph map is registered anywhere | verified across `app/`, `config/`, `bootstrap/` | `files.fileable_type` holds raw FQCNs. See §4.1. |
| `config/cache.php:18` → `env('CACHE_STORE', 'database')` | `config/cache.php` | Database store has no tag support. See §7.4. |
| Migrations use `$table->enum('x', SomeEnum::getValues())->default(...)` | `create_languages_table.php`, `create_users_table.php` | Follow exactly. |
| String columns are `varchar(191)`, short codes `varchar(10)`–`varchar(100)` | all 11 migrations | Follow exactly. `191` is the utf8mb4 index-safe legacy width the codebase standardised on. |
| Audit columns are `foreignId('created_by')->nullable()->constrained('users')` | `create_users_table.php` | Follow exactly. |
| Permissions are nested arrays in `app/Data/Seeder/*Permissions.php`, spread into `Permissions::getAll()` | `app/Data/Seeder/Permissions.php` | See §9. |

### 0.1 Decisions carried forward (already argued, adopted here)

1. Two status columns on every content table: `status` (`Status`, owned by the traits) and
   `publish_status` (new `ContentStatus`: draft/scheduled/published/archived).
2. `site_id BIGINT UNSIGNED NOT NULL DEFAULT 1`, no `sites` table yet.
3. Translations split by rule: routable → row-per-locale; non-routable → deferred overlay table.
4. Repeaters → `section_blocks` rows. Presentation → JSON.
5. Generic taxonomy + generic relations.
6. Merges: solutions→`services.service_type`, portfolio→`case_studies.depth`,
   awards/certs/partnerships→`accolades`, contact forms→`form_submissions.form_key`.
   No `statistics`/`timeline_events` tables. Section types live in a PHP registry.
7. Query-time publishing filter is the source of truth; the scheduler is a janitor.
8. `files` → supersede with `media`/`mediables`/`media_folders`. `app_settings` → extend with rows.
9. Menus: adjacency list + denormalized `path`/`depth`.
10. SEO: polymorphic `seo_meta`.
11. Home page budget: ≤12 queries cold, ≤3 warm.
12. No repository layer.

**Nothing found during reconstruction contradicts any of these.** Two refinements are noted
inline and flagged in the reply summary: (a) decision 1's `publish_status` needs a *second*
guard beyond the enum split — the config-driven CRUD `columns` array must not expose
`publish_status` to the bulk-action control, because `handleBulkAction` bypasses the enum cast
entirely by using `->update()` (mass update, no model events, no cast validation at the DB layer
beyond the ENUM constraint itself); MySQL in non-strict mode would coerce an invalid ENUM write
to `''` rather than erroring. (b) decision 8's "extend `app_settings`" is safe only because
`app_settings.title` and `.slug` are both `unique` — new seeded rows must namespace their
titles (`'Site — Default OG Image'`) or they will collide with existing setting titles.

### 0.2 Shared column vocabulary

Three column bundles recur. They are written out in full in each table below (no inheritance
games in the schema), but named here so the tables stay readable.

**`«identity»`** — on every new table:
| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AUTO_INCREMENT | no | — | Primary key. Internal only; never in a URL. |
| `uuid` | `CHAR(36)` | no | — | Public identifier. Route binding key via `UsesUuidRouting`. |

**`«audit»`** — on every editor-writable table:
| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `created_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. Feeds `BaseResource::getBaseAttributes()`. |
| `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. Last editor. |
| `created_at` | `TIMESTAMP` | yes | `NULL` | Laravel timestamp. |
| `updated_at` | `TIMESTAMP` | yes | `NULL` | Laravel timestamp. |
| `deleted_at` | `TIMESTAMP` | yes | `NULL` | Soft delete. Activates `Filterable::scopeRecycle()` (§12.2). |

**`«publishing»`** — on every table that renders publicly:
| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `status` | `ENUM('active','inactive')` | no | `'active'` | Operational enable/disable. **Owned by `Filterable`/`ModelAction`.** Never editorial. |
| `publish_status` | `ENUM('draft','scheduled','published','archived')` | no | `'draft'` | Editorial state. Never touched by the shared bulk-action path. |
| `published_at` | `TIMESTAMP` | yes | `NULL` | Go-live instant. Also the public sort key. |
| `expires_at` | `TIMESTAMP` | yes | `NULL` | Auto-unpublish instant. `NULL` = never expires. |
| `sort_order` | `INT` | no | `0` | Manual ordering within the parent scope. |

---

## 1. Core CMS

### 1.1 `pages`

The routable container. One row per (locale, slug). Owns a URL; owns an ordered list of sections.

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy discriminator. Not nullable — NULL is distinct in MySQL unique indexes and would silently void `UNIQUE (site_id, locale, slug)`. |
| `translation_group_id` | `CHAR(36)` | no | — | Groups the locale variants of one logical page. Self-assigned on create. |
| `locale` | `VARCHAR(10)` | no | — | Matches `languages.code`. Deliberately **not** an FK — see justification. |
| `parent_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `pages.id`. Hierarchy for nested URLs (`/services/cloud`). |
| `slug` | `VARCHAR(191)` | no | — | Last URL segment. Not the full path. |
| `path` | `VARCHAR(500)` | no | — | Denormalized full path, leading slash, no trailing (`/services/cloud`). The public lookup key. |
| `depth` | `TINYINT UNSIGNED` | no | `0` | Denormalized ancestor count. Cheap depth cap + breadcrumb sizing. |
| `title` | `VARCHAR(191)` | no | — | Editorial title. Admin list + breadcrumb label. |
| `page_type` | `ENUM('standard','home','landing','system')` | no | `'standard'` | `home` is the site root; `system` (404, 500, thank-you) is undeletable. |
| `template` | `VARCHAR(100)` | no | `'default'` | Registry key selecting the React layout shell. |
| `is_homepage` | `BOOLEAN` | no | `false` | Fast root lookup. Partial-unique enforced in app + `UNIQUE (site_id, locale, is_homepage)` is *not* usable (multiple falses), so guarded by a service invariant. |
| `is_indexable` | `BOOLEAN` | no | `true` | Editor kill-switch for `noindex`. Duplicated intentionally from `seo_meta` so the robots decision survives a missing SEO row. |
| `settings` | `JSON` | yes | `NULL` | Page-level presentation only (header variant, hide-footer, theme accent). Never content. |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. |
| `publish_status` | `ENUM('draft','scheduled','published','archived')` | no | `'draft'` | Editorial. |
| `published_at` | `TIMESTAMP` | yes | `NULL` | Go-live. |
| `expires_at` | `TIMESTAMP` | yes | `NULL` | Auto-unpublish. |
| `sort_order` | `INT` | no | `0` | Sibling order under `parent_id`. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

**Indexes**

| Index | Columns | Query served |
|---|---|---|
| `UNIQUE pages_path_unique` | `(site_id, locale, path)` | The public request. Also the only real guard against two pages claiming one URL. |
| `UNIQUE pages_slug_unique` | `(site_id, locale, parent_id, slug)` | Prevents duplicate siblings before `path` is computed. |
| `UNIQUE pages_uuid_unique` | `(uuid)` | Route model binding. |
| `IDX pages_group` | `(translation_group_id, locale)` | Language switcher: "same page, other locale". |
| `IDX pages_publish` | `(site_id, locale, publish_status, published_at)` | The `->published()` scope. Leading equality columns, trailing range column — correct B-tree order. |
| `IDX pages_parent` | `(parent_id, sort_order)` | Child listing / nav building. |
| `IDX pages_type` | `(site_id, page_type)` | Homepage and system-page lookup. |
| `IDX pages_deleted` | `(deleted_at)` | Trash view via `scopeRecycle()`. |

**Foreign keys**

| Column | References | ON DELETE | ON UPDATE | Why |
|---|---|---|---|---|
| `parent_id` | `pages.id` | `RESTRICT` | `CASCADE` | Deleting a parent must not silently orphan a live URL tree. Force the editor to re-parent. |
| `created_by`, `updated_by` | `users.id` | `SET NULL` | `CASCADE` | An admin leaving must not delete content. |

**Why this table exists and is not merged.** It is the only thing that owns a URL path with a
hierarchy. Merging it into a generic "content" table would force every content module to carry
`parent_id`/`path`/`depth` it does not use.

**Why `locale` is not an FK to `languages.code`.** `languages.code` is `UNIQUE` so an FK is
technically possible, but `LanguageService::destroy()` hard-deletes language rows and their
translation directories. An FK would either block the delete (`RESTRICT`) or cascade-delete every
page in that locale (`CASCADE`) — both wrong. The correct behaviour is "orphaned locale content
becomes invisible but recoverable", which is exactly what no-FK plus a `->published()` scope
joined against active languages gives you. Documented, deliberate.

**`path` denormalization argued.** The alternative is recursive CTE resolution per request.
`path` makes the public lookup a single unique-index probe, which is the difference between the
12-query and the 25-query home budget. Cost: reparenting a page must rewrite descendants'
`path`/`depth`. That is a rare admin action, done in one `UPDATE ... WHERE path LIKE '/old/%'`
inside a transaction — and `path` is what makes that single statement possible in the first place.

**`settings` JSON argued.** Page-level presentation flags are a long tail (currently ~5, will be
~15) that no query ever filters on and no translator ever reads. Columns for them would be 15
mostly-null booleans and a migration per new toggle. See the §4.2 rule.

---

### 1.2 `page_sections`

An ordered, typed slot on a page. Holds the six universal content scalars as real columns and
everything else as JSON, per §4.2.

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key (section editor deep-links). |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. Denormalized from `pages` so section queries never need the join. |
| `page_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `pages.id`. NULL when this row is the body of a reusable `blocks` entry. |
| `block_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `blocks.id`. Set when the section is a *reference* to a global block. |
| `section_type` | `VARCHAR(100)` | no | — | Registry key (`hero.split`, `services.grid`, `stats.counter`). **Not** an FK — see §5. |
| `name` | `VARCHAR(191)` | yes | `NULL` | Internal label for the admin outline. Never rendered. |
| `anchor` | `VARCHAR(100)` | yes | `NULL` | `id` attribute for in-page anchor links and menu `#target` items. |
| `eyebrow` | `VARCHAR(191)` | yes | `NULL` | Universal scalar: kicker text above the heading. |
| `heading` | `VARCHAR(255)` | yes | `NULL` | Universal scalar: section H2. |
| `subheading` | `VARCHAR(500)` | yes | `NULL` | Universal scalar: supporting line. |
| `body` | `LONGTEXT` | yes | `NULL` | Universal scalar: rich text (Lexical JSON or sanitized HTML). |
| `media_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `media.id`. The single primary image/video. Additional media go through `mediables`. |
| `cta_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `ctas.id`. Primary call to action. |
| `secondary_cta_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `ctas.id`. Two CTAs is the observed ceiling; a third means it is a repeater and belongs in `section_blocks`. |
| `data` | `JSON` | yes | `NULL` | Type-specific **singular translatable** fields. Validated against the registry. |
| `settings` | `JSON` | yes | `NULL` | Type-specific **presentation** fields. Never translatable. |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. Doubles as the section enable/disable toggle — this is the one place `status` genuinely means "show it", and it is still `Status`, so bulk toggle is safe. |
| `publish_status` | `ENUM('draft','scheduled','published','archived')` | no | `'published'` | Defaults to `published` — a section inherits its page's gate; drafting a single section is the exception. |
| `published_at` / `expires_at` | `TIMESTAMP` | yes | `NULL` | Per-section scheduling (campaign banners). |
| `sort_order` | `INT` | no | `0` | Order within the page. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

**Indexes**

| Index | Columns | Query served |
|---|---|---|
| `UNIQUE page_sections_uuid_unique` | `(uuid)` | Route binding. |
| `IDX page_sections_render` | `(page_id, status, publish_status, sort_order)` | The public page render: all visible sections in order, one index scan. |
| `IDX page_sections_block` | `(block_id)` | "Where is this global block used?" |
| `IDX page_sections_type` | `(site_id, section_type)` | Registry migrations, "find every hero", admin filters. |
| `IDX page_sections_media` | `(media_id)` | Media usage report (§3.2). |
| `IDX page_sections_schedule` | `(publish_status, published_at, expires_at)` | The janitor job's sweep. |

**Foreign keys**

| Column | References | ON DELETE | ON UPDATE | Why |
|---|---|---|---|---|
| `page_id` | `pages.id` | `CASCADE` | `CASCADE` | A section has no meaning without its page. Soft deletes mean this only fires on force-delete. |
| `block_id` | `blocks.id` | `SET NULL` | `CASCADE` | Deleting a global block must degrade the section to a local copy, not vaporize the page. |
| `media_id` | `media.id` | `SET NULL` | `CASCADE` | Media deletion must never delete content. The public component handles missing-image state (a CLAUDE.md requirement). |
| `cta_id`, `secondary_cta_id` | `ctas.id` | `SET NULL` | `CASCADE` | Same. |
| `created_by`, `updated_by` | `users.id` | `SET NULL` | `CASCADE` | — |

**Why the six scalars are columns, not JSON.** Every section type in the observed set has a
heading; most have an eyebrow, a body, one image, one CTA. Putting them in JSON means: no FK on
`media_id` (so media deletion silently rots content), no index for "find every section with an
empty heading", and the admin form builder cannot render a consistent header editor across types.
Putting them in columns costs six mostly-populated columns. That is the correct trade.

**Why `page_id` is nullable.** A `blocks` row's content *is* a `page_sections` row with
`page_id = NULL, block_id = <self-referencing owner>`. This avoids a parallel
`block_sections` table that would duplicate every column and every index above. The invariant —
exactly one of `page_id`/`block_id` is the owner — is enforced in `PageSectionService`, not by a
CHECK constraint, because MySQL 8 CHECK constraints are honoured but produce opaque errors that
the `AppResponse` error path cannot translate.

---

### 1.3 `section_blocks`

The repeater. One row per repeated item inside a section: a stat, a feature, a timeline entry,
a testimonial slot, a pricing tier, a logo, a process step.

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key; also the stable translation address. |
| `page_section_id` | `BIGINT UNSIGNED` | no | — | FK → `page_sections.id`. Owner. |
| `parent_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `section_blocks.id`. One level of nesting (tab → tab items, accordion → rows). Depth is capped at 2 in the service. |
| `block_type` | `VARCHAR(100)` | no | `'item'` | Registry key when a section supports heterogeneous repeaters (`stat`, `feature`, `step`). |
| `label` | `VARCHAR(191)` | yes | `NULL` | Short text: stat label, feature title, step name. |
| `value` | `VARCHAR(191)` | yes | `NULL` | Short text: stat number, tier price, year. Deliberately a string — "500+" and "24/7" are not numbers. |
| `description` | `TEXT` | yes | `NULL` | Supporting copy. |
| `body` | `LONGTEXT` | yes | `NULL` | Rich text for accordion/FAQ-style repeaters. |
| `icon` | `VARCHAR(100)` | yes | `NULL` | Icon registry key (lucide name). Not a file. |
| `media_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `media.id`. Per-item image. |
| `cta_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `ctas.id`. Per-item link (pricing tier button, card link). |
| `link_type` | `ENUM('none','url','route','page','entity','anchor')` | no | `'none'` | How to resolve a bare link without a full CTA row. |
| `link_target_type` | `VARCHAR(60)` | yes | `NULL` | Morph-map alias when `link_type = 'entity'`. |
| `link_target_id` | `BIGINT UNSIGNED` | yes | `NULL` | Morph id. |
| `link_url` | `VARCHAR(500)` | yes | `NULL` | Raw URL when `link_type = 'url'` or `'anchor'`. |
| `data` | `JSON` | yes | `NULL` | Per-item long-tail fields declared by the block type. Same §4.2 rule applies recursively. |
| `settings` | `JSON` | yes | `NULL` | Per-item presentation (highlighted tier, badge colour). |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned show/hide. |
| `sort_order` | `INT` | no | `0` | Item order. **The reason this table exists.** |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

No `publish_status`/`published_at` — a repeater item does not schedule independently of its
section. Adding those columns would be five nullable columns servicing a use case
("this one stat goes live Tuesday") that has never been requested. If it is, `status` already
covers show/hide and the columns can be added without touching a single existing row.

No `created_by`/`updated_by` — the section's audit trail is the meaningful unit. A revision of a
section (§8.3, `content_revisions`) snapshots its blocks, so per-block authorship is recoverable
without 2 columns × N rows.

**Indexes**

| Index | Columns | Query served |
|---|---|---|
| `UNIQUE section_blocks_uuid_unique` | `(uuid)` | Route binding + translation addressing. |
| `IDX section_blocks_render` | `(page_section_id, status, sort_order)` | The render query: eager-load all visible items in order. |
| `IDX section_blocks_parent` | `(parent_id, sort_order)` | Nested items. |
| `IDX section_blocks_media` | `(media_id)` | Media usage report. |
| `IDX section_blocks_link_target` | `(link_target_type, link_target_id)` | "What links to this case study?" |

**Foreign keys**

| Column | References | ON DELETE | ON UPDATE |
|---|---|---|---|
| `page_section_id` | `page_sections.id` | `CASCADE` | `CASCADE` |
| `parent_id` | `section_blocks.id` | `CASCADE` | `CASCADE` |
| `media_id` | `media.id` | `SET NULL` | `CASCADE` |
| `cta_id` | `ctas.id` | `SET NULL` | `CASCADE` |

**Normalization argued (the central call — full form in §4.2).** The alternative is
`page_sections.data->items[]`. That fails on four counts, each independently sufficient:

1. **Reordering is read-modify-write under a race.** Two editors dragging in the same section
   produce a lost update. MySQL 8's `JSON_SET` on an array index does not give you a row lock
   granular enough to prevent it. `UPDATE section_blocks SET sort_order = ? WHERE id = ?` does.
2. **A JSON array index is not a stable translation address.** `data.items[2].label` changes
   meaning the moment someone inserts an item at position 0. `section_blocks.uuid` never does.
   Established decision 3 depends on this.
3. **No FK on `media_id`.** A media id inside a JSON array is an orphan waiting to happen, and
   "which sections use this image?" becomes a full-table `JSON_CONTAINS` scan.
4. **No partial update.** Toggling one stat's visibility rewrites the entire JSON document,
   which is also the entire optimistic-locking unit.

The counter-argument is one extra query per section. That is answered by a single
`with('blocks')` eager-load across all sections of a page — one query total, not one per section.

---

### 1.4 `blocks`

Reusable global content: the "Ready to talk?" CTA band, the client logo wall, the awards strip —
authored once, referenced from many pages.

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `key` | `VARCHAR(100)` | no | — | Stable developer handle (`global.cta_band`). Lets a hard-coded layout slot resolve a block without a magic id. |
| `name` | `VARCHAR(191)` | no | — | Admin-facing name. |
| `description` | `VARCHAR(500)` | yes | `NULL` | What it is and where it is used, for the editor. |
| `section_type` | `VARCHAR(100)` | no | — | Registry key. A block is always exactly one section type. |
| `is_locked` | `BOOLEAN` | no | `false` | Prevents deletion of blocks a layout depends on. |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. |
| `publish_status` | `ENUM(...)` | no | `'published'` | Editorial. |
| `published_at` / `expires_at` | `TIMESTAMP` | yes | `NULL` | Scheduling. |
| `sort_order` | `INT` | no | `0` | Admin list order. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

**Indexes:** `UNIQUE (site_id, key)` — handle lookup; `UNIQUE (uuid)`;
`IDX (site_id, status, publish_status)` — admin list.

**FKs:** `created_by`/`updated_by` → `users.id` `SET NULL` / `CASCADE`.

**Why not merged into `page_sections`.** It nearly is — a block's *content* lives in a
`page_sections` row (§1.2, `page_id = NULL`). What `blocks` adds is the identity layer: a stable
`key`, a name, a lock flag, and a single row that N sections can point at. Folding those four
columns into `page_sections` would mean every one of the thousands of page-local sections carries
a nullable `key` with a unique index on it, and "list the reusable blocks" becomes
`WHERE key IS NOT NULL` — a query the optimizer handles badly against a mostly-NULL unique index.
Two tables, clean.

**Why not translation-grouped like `pages`.** A block is not routable. Per decision 3 it gets the
`content_translations` overlay (§8.1) later, with zero changes here.

---

### 1.5 `ctas`

Every button, everywhere. One table.

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `label` | `VARCHAR(191)` | no | — | Button text. |
| `aria_label` | `VARCHAR(191)` | yes | `NULL` | Accessible name when `label` alone is ambiguous ("Learn more" × 8). WCAG AA requirement. |
| `link_type` | `ENUM('url','route','page','entity','anchor','modal','none')` | no | `'url'` | Resolution strategy. |
| `url` | `VARCHAR(500)` | yes | `NULL` | Used when `link_type = 'url'`/`'anchor'`. |
| `route_name` | `VARCHAR(191)` | yes | `NULL` | Named route when `link_type = 'route'`. Survives URL restructuring. |
| `route_params` | `JSON` | yes | `NULL` | Route parameters. Singular, never translated, never queried → JSON is correct here. |
| `page_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `pages.id` when `link_type = 'page'`. A real FK, so deleting a page surfaces the broken button. |
| `target_type` | `VARCHAR(60)` | yes | `NULL` | Morph alias when `link_type = 'entity'` (link to a service, case study, post). |
| `target_id` | `BIGINT UNSIGNED` | yes | `NULL` | Morph id. |
| `variant` | `VARCHAR(50)` | no | `'primary'` | Design-system variant key. |
| `size` | `VARCHAR(20)` | no | `'md'` | Design-system size key. |
| `icon` | `VARCHAR(100)` | yes | `NULL` | Icon registry key. |
| `icon_position` | `ENUM('none','left','right')` | no | `'none'` | Icon placement. |
| `opens_in_new_tab` | `BOOLEAN` | no | `false` | `target="_blank"` (plus `rel="noopener"`, applied by the component). |
| `is_download` | `BOOLEAN` | no | `false` | `download` attribute for asset links. |
| `rel` | `VARCHAR(100)` | yes | `NULL` | Extra `rel` tokens (`nofollow` on sponsored links). |
| `tracking_id` | `VARCHAR(100)` | yes | `NULL` | Analytics event name. Editor-settable so campaigns don't need a deploy. |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

**Indexes:** `UNIQUE (uuid)`; `IDX (target_type, target_id)` — reverse lookup;
`IDX (page_id)` — broken-link report; `IDX (site_id, status)`.

**FKs:** `page_id` → `pages.id` `SET NULL`/`CASCADE`; audit → `users.id` `SET NULL`/`CASCADE`.

**Why a table and not inline columns.** A CTA is ~17 fields. Inlining it into `page_sections`
(twice, for primary + secondary) is 34 columns; into `section_blocks` another 17; into
`menu_items` another 17. That is 68 duplicated columns and four places to fix a bug in link
resolution. One table, one `CtaResource`, one `resolveHref()` in the service.

**Why not merged with `menu_items`.** A menu item is a tree node with children, a menu
membership, and a path — it is 60% CTA and 40% something else. Merging means `ctas` grows
`menu_id`/`parent_id`/`path`/`depth` that 95% of rows leave NULL, and the menu tree query has to
filter them out of a table that also holds every button on the site. `menu_items` instead carries
the same link-resolution columns (§2.2) — accepted duplication of ~6 columns, rejected duplication
of a table.

---

### 1.6 `redirects`

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `from_path` | `VARCHAR(500)` | no | — | Source path, normalized: leading slash, no trailing slash, no host, no query. |
| `from_hash` | `CHAR(64)` | no | — | `SHA-256(site_id + from_path)`. **The indexed lookup key** — see below. |
| `to_path` | `VARCHAR(500)` | no | — | Destination path or absolute URL. |
| `status_code` | `SMALLINT UNSIGNED` | no | `301` | 301 / 302 / 307 / 308. |
| `is_regex` | `BOOLEAN` | no | `false` | Pattern redirect. Evaluated only after the exact-hash miss. |
| `preserve_query` | `BOOLEAN` | no | `true` | Append the incoming query string to the destination. |
| `source` | `ENUM('manual','slug_change','import')` | no | `'manual'` | Auto-created redirects (slug edits) are distinguishable from curated ones. |
| `hits` | `BIGINT UNSIGNED` | no | `0` | Usage counter. Lets you retire dead redirects. |
| `last_hit_at` | `TIMESTAMP` | yes | `NULL` | Last use. |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

**Indexes:** `UNIQUE (from_hash)`; `IDX (site_id, is_regex, status)` — regex candidate set;
`IDX (source)`; `IDX (uuid)`.

**Why `from_hash` and not a unique index on `from_path`.** `VARCHAR(500)` in utf8mb4 is 2000
bytes; InnoDB's index key limit is 3072 bytes with `DYNAMIC` row format, so it *fits* — but a
2000-byte key makes the index enormous and the comparison slow, and the whole repo standardises on
`191` for indexed strings precisely to avoid this. A fixed 64-byte hash is a better key and lets
`from_path` stay a full-fidelity 500 chars. This is the one place I deviate from the repo's
`191` habit, and the hash column is why it is safe.

**Why a table, and why now (Phase 1).** Slug changes are the single most common CMS-driven SEO
regression. If `redirects` does not exist on the day `pages` ships, every slug edit is a silent
404 and the auto-`source='slug_change'` behaviour has to be retrofitted onto content that already
moved. Cheap table, expensive to add late.

---

## 2. Navigation

### 2.1 `menus`

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `key` | `VARCHAR(100)` | no | — | Developer handle: `header`, `footer_services`, `legal`, `mobile`. |
| `name` | `VARCHAR(191)` | no | — | Admin label. |
| `location` | `VARCHAR(100)` | yes | `NULL` | Theme slot this menu is mounted in. |
| `max_depth` | `TINYINT UNSIGNED` | no | `3` | Editor guard-rail; enforced against `menu_items.depth`. |
| `settings` | `JSON` | yes | `NULL` | Presentation: mega-menu on/off, column count, featured-block id. |
| `is_locked` | `BOOLEAN` | no | `false` | Undeletable core menus. |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

**Indexes:** `UNIQUE (site_id, key)`; `UNIQUE (uuid)`; `IDX (site_id, location, status)`.

### 2.2 `menu_items`

Adjacency list with denormalized `path` and `depth`, per decision 9.

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key; stable translation address for the overlay. |
| `menu_id` | `BIGINT UNSIGNED` | no | — | FK → `menus.id`. |
| `parent_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `menu_items.id`. NULL = top level. |
| `path` | `VARCHAR(255)` | no | — | Materialized ancestor id path: `/1/14/37/`. Enables single-query subtree ops. |
| `depth` | `TINYINT UNSIGNED` | no | `0` | Denormalized ancestor count. Enforces `menus.max_depth` without a recursive query. |
| `label` | `VARCHAR(191)` | no | — | Displayed text. |
| `aria_label` | `VARCHAR(191)` | yes | `NULL` | Accessible name override. |
| `description` | `VARCHAR(500)` | yes | `NULL` | Mega-menu item subtitle. |
| `icon` | `VARCHAR(100)` | yes | `NULL` | Icon registry key. |
| `media_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `media.id`. Mega-menu thumbnail. |
| `link_type` | `ENUM('url','route','page','entity','anchor','heading','separator','none')` | no | `'url'` | Includes `heading` and `separator` so mega-menu column titles are structurally honest instead of `href="#"` fakes — this is a real accessibility win (a `heading` renders as `<h3>`, not a focusable dead link). |
| `url` | `VARCHAR(500)` | yes | `NULL` | Raw URL. |
| `route_name` | `VARCHAR(191)` | yes | `NULL` | Named route. |
| `route_params` | `JSON` | yes | `NULL` | Route parameters. |
| `page_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `pages.id`. |
| `target_type` | `VARCHAR(60)` | yes | `NULL` | Morph alias for entity links. |
| `target_id` | `BIGINT UNSIGNED` | yes | `NULL` | Morph id. |
| `opens_in_new_tab` | `BOOLEAN` | no | `false` | `target="_blank"`. |
| `rel` | `VARCHAR(100)` | yes | `NULL` | Extra `rel` tokens. |
| `badge_label` | `VARCHAR(50)` | yes | `NULL` | "New", "Beta" pill. |
| `badge_variant` | `VARCHAR(30)` | yes | `NULL` | Pill style key. |
| `visibility` | `ENUM('always','guest','auth')` | no | `'always'` | Conditional display. |
| `settings` | `JSON` | yes | `NULL` | Per-item presentation (column span, featured flag). |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned show/hide. |
| `sort_order` | `INT` | no | `0` | Sibling order. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

**Indexes**

| Index | Columns | Query served |
|---|---|---|
| `UNIQUE menu_items_uuid_unique` | `(uuid)` | Route binding. |
| `IDX menu_items_tree` | `(menu_id, parent_id, sort_order)` | Full tree fetch, ordered, one scan. |
| `IDX menu_items_path` | `(menu_id, path)` | Subtree ops: `WHERE path LIKE '/1/14/%'`. |
| `IDX menu_items_page` | `(page_id)` | "Which menus link to this page?" — required before allowing a page delete. |
| `IDX menu_items_target` | `(target_type, target_id)` | Same for entity links. |

**FKs:** `menu_id` → `menus.id` `CASCADE`/`CASCADE`; `parent_id` → `menu_items.id` `CASCADE`/`CASCADE`;
`page_id` → `pages.id` `SET NULL`/`CASCADE`; `media_id` → `media.id` `SET NULL`/`CASCADE`.

**Adjacency + path vs nested sets, argued.** Nested sets (`lft`/`rgt`) make subtree *reads* a
single range scan, but every insert or move rewrites `lft`/`rgt` for roughly half the tree under
a table lock. Menu editing is *nothing but* reordering — drag, drop, drag again — so the write
cost is paid constantly and the read benefit is paid never, because the assembled tree is cached
wholesale under one key (§7) and rebuilt only on write. `path` recovers the two things adjacency
lacks: single-query subtree selection, and O(1) reparent-into-self rejection
(`if (str_starts_with($newParent->path, $node->path)) reject`). Cost: `path`/`depth` must be
rewritten for the moved subtree — one `UPDATE ... WHERE path LIKE ?` inside the move transaction.

---

## 3. Media

### 3.1 `media_folders`

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `parent_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `media_folders.id`. |
| `name` | `VARCHAR(191)` | no | — | Folder name. |
| `slug` | `VARCHAR(191)` | no | — | URL-safe segment. |
| `path` | `VARCHAR(500)` | no | — | Materialized folder path. |
| `depth` | `TINYINT UNSIGNED` | no | `0` | Depth cap. |
| `sort_order` | `INT` | no | `0` | Sibling order. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

**Indexes:** `UNIQUE (site_id, parent_id, slug)`; `UNIQUE (uuid)`; `IDX (site_id, path)`.
**FKs:** `parent_id` → `media_folders.id` `RESTRICT`/`CASCADE` (never orphan media silently).

### 3.2 `media`

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `folder_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `media_folders.id`. NULL = root. |
| `disk` | `VARCHAR(55)` | no | `'public'` | Filesystem disk. Matches `files.disk` width. |
| `path` | `VARCHAR(500)` | no | — | **Full path on the disk.** `files` has no such column — the single biggest reason it cannot be reused. |
| `file_name` | `VARCHAR(191)` | no | — | Stored basename. |
| `original_name` | `VARCHAR(191)` | no | — | Uploaded basename, for the editor's benefit. |
| `mime_type` | `VARCHAR(100)` | no | — | Real MIME from the file, not the client claim. |
| `extension` | `VARCHAR(20)` | no | — | Lowercased extension. |
| `media_type` | `ENUM('image','video','audio','document','archive','other')` | no | `'other'` | Coarse type for the library filter tabs. |
| `size` | `BIGINT UNSIGNED` | no | `0` | Bytes. **Integer** — `files.size` is `VARCHAR(100)`, which cannot be summed or sorted. |
| `width` | `INT UNSIGNED` | yes | `NULL` | Image/video width. Required to emit `width`/`height` attributes and prevent CLS. |
| `height` | `INT UNSIGNED` | yes | `NULL` | Image/video height. |
| `duration` | `INT UNSIGNED` | yes | `NULL` | Seconds, for video/audio. |
| `alt_text` | `VARCHAR(500)` | yes | `NULL` | Accessibility. Translatable via the overlay. `files` has no equivalent. |
| `caption` | `VARCHAR(500)` | yes | `NULL` | Displayed caption. Translatable. |
| `title` | `VARCHAR(191)` | yes | `NULL` | Library label. |
| `description` | `TEXT` | yes | `NULL` | Internal notes / licence terms. |
| `credit` | `VARCHAR(191)` | yes | `NULL` | Photographer / source attribution. |
| `focal_x` | `DECIMAL(5,4)` | yes | `NULL` | Focal point X (0–1) for art-directed cropping. |
| `focal_y` | `DECIMAL(5,4)` | yes | `NULL` | Focal point Y (0–1). |
| `blurhash` | `VARCHAR(100)` | yes | `NULL` | LQIP placeholder string. Kills layout shift without a second request. |
| `conversions` | `JSON` | yes | `NULL` | Generated derivative map: `{"thumb":{"path":..,"w":..,"h":..},"webp":{...}}`. |
| `checksum` | `CHAR(64)` | yes | `NULL` | SHA-256 of the file. Duplicate-upload detection. |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

**Indexes**

| Index | Columns | Query served |
|---|---|---|
| `UNIQUE media_uuid_unique` | `(uuid)` | Route binding. |
| `IDX media_library` | `(site_id, folder_id, media_type, created_at)` | The library grid, filtered by folder and type, newest first. |
| `IDX media_checksum` | `(site_id, checksum)` | Duplicate detection on upload. |
| `IDX media_search` | `(site_id, original_name)` | Filename search via `Filterable::scopeSearch()`. |
| `IDX media_deleted` | `(deleted_at)` | Trash view. |

**FKs:** `folder_id` → `media_folders.id` `SET NULL`/`CASCADE`; audit → `users.id` `SET NULL`/`CASCADE`.

**`conversions` as JSON, argued.** A derivative set is 3–6 entries, always read as a whole with
its parent row, never queried by, never translated, and its shape changes when the image pipeline
changes. A `media_conversions` table would be a join on every image render for zero benefit.
This is the textbook JSON case and it is the correct call. Note the contrast with §1.3: the
distinguishing property is that conversions are *machine-generated and not editor-ordered*.

### 3.3 Why `files` is superseded, not extended

`files` (`database/migrations/2025_08_25_061823_create_files_table.php`) is:

```
$table->morphs('fileable');   // fileable_type + fileable_id
$table->string('name',191); $table->string('display_name',191);
$table->string('disk',55);  $table->string('type',100);
$table->string('size',100); $table->string('extension',100);
```

Four independent defects, in descending order of severity:

1. **Wrong cardinality.** `File::fileable()` is a `morphTo` — one file belongs to exactly one
   owner. A media library is the inverse: one file, many owners, reused across pages. This is not
   a missing column; it is the wrong relationship direction. Adding `mediables` to `files` would
   leave `fileable_type`/`fileable_id` as dead-but-populated columns that
   `ModelAction::unlinkData()` still keys off.
2. **No path column.** The file's location is reconstructed at read time from
   `FilePathConstants::FILE_PATHS[$type]['path'] . '/' . $name`. That is fine for four fixed
   avatar/logo slots; it is unusable for a folder-organised library where the editor moves files.
3. **`size` is `VARCHAR(100)`.** No "storage used by folder", no sort-by-size, no quota.
4. **No `alt_text`, `width`, `height`.** Accessibility (WCAG AA) and CLS prevention are both
   non-negotiable per CLAUDE.md, and both are impossible without these.

**`files` is kept, untouched.** It still serves avatars, the company logo, favicon, and text-editor
uploads through `Fileable`/`ModelAction::saveFile()`. Ripping it out would touch `AppSetting`,
`User`, the settings service, and `ModelAction` for no CMS benefit. The two systems coexist:
`files` for fixed single-owner system assets, `media` for the editorial library.

**`MediaService` reuses `Fileable`.** `app/Traits/Common/Fileable.php` already abstracts
local/S3/FTP disk selection off `SettingKey::STORAGE`, does Intervention resizing, and handles
unlink. `MediaService` uses `use Fileable;` and calls `storeFile()` for the physical write, then
writes a `media` row instead of a `files` row. Zero duplicated storage logic.

### 3.4 `mediables`

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. Needed because `sort_order` updates target a single attachment row. |
| `media_id` | `BIGINT UNSIGNED` | no | — | FK → `media.id`. |
| `mediable_type` | `VARCHAR(60)` | no | — | Morph-map alias. **60 chars, not 255** — aliases are short by construction (§4.1). |
| `mediable_id` | `BIGINT UNSIGNED` | no | — | Owner id. |
| `collection` | `VARCHAR(60)` | no | `'default'` | Named slot: `gallery`, `logo`, `og_image`, `attachments`. |
| `sort_order` | `INT` | no | `0` | Order within the collection. |
| `created_at` / `updated_at` | `TIMESTAMP` | yes | `NULL` | Timestamps. No soft delete — detaching is a real delete. |

**Indexes**

| Index | Columns | Query served |
|---|---|---|
| `UNIQUE mediables_unique` | `(media_id, mediable_type, mediable_id, collection)` | Prevents double-attaching the same image to the same slot. |
| `IDX mediables_owner` | `(mediable_type, mediable_id, collection, sort_order)` | The eager-load: all gallery images for these case studies, in order. |
| `IDX mediables_media` | `(media_id)` | Usage report — "delete this image?" must show where it is used. |

**FKs:** `media_id` → `media.id` `CASCADE`/`CASCADE`. The morph columns get no FK (they cannot).

---

## 4. The two blocking decisions, resolved

### 4.1 Morph map scope — **retrofit `File`, in three ordered steps, across two releases**

**The constraint that decides it.** `Relation::enforceMorphMap()` is global and all-or-nothing.
Once called, *any* morph write whose class is absent from the map throws
`ClassMorphViolationException`. There is no per-relation or per-namespace scoping. So
"map only the new CMS models" is not an available option: `AppSetting::file()` (a `morphOne` on
`fileable`) and `User`'s file relations would begin throwing on the first upload after deploy.

The genuine fork is therefore:

- **(A) Non-enforcing `Relation::morphMap([...])`** covering CMS models only. Reads resolve both
  aliases and FQCNs; existing `files` rows keep working untouched. Zero migration.
- **(B) Enforcing map covering everything, with a `files` backfill.**

**Recommendation: (B).** (A) is tempting because it is free, and I want to be explicit that it is
a close call on effort. It loses on one point that I think is decisive: with a non-enforcing map,
a model that someone forgets to register writes its FQCN into `seo_meta.seoable_type` or
`mediables.mediable_type` *silently and successfully*. You discover it months later when a
namespace refactor breaks production, and the fix is a data migration over a table that by then
has hundreds of thousands of rows. With enforcement on, the same mistake is a hard exception on
the developer's first local save. Given that this schema introduces **six** morph columns across
five tables (`mediables`, `seo_meta`, `taxonomables`, `content_relations`, plus the `link_target`
and `target` pairs on `section_blocks`/`ctas`/`menu_items`), the number of chances to forget is
high enough that the guarantee is worth one backfill of a table that currently holds a few
hundred rows at most.

Secondary benefit: `VARCHAR(60)` alias columns instead of `VARCHAR(255)` FQCN columns. On
`IDX mediables_owner (mediable_type, mediable_id, collection, sort_order)` that is the difference
between a ~1000-byte and a ~250-byte index key.

**Data migration and ordering.** Three steps, and the release boundary matters.

*Release N, step 1 — register the map, non-enforcing.* In `AppServiceProvider::boot()`:
`Relation::morphMap([...])` including the legacy owners `'user' => User::class` and
`'app_setting' => AppSetting::class` alongside every new CMS model. Non-enforcing, so the existing
FQCN rows in `files.fileable_type` continue to resolve — Laravel falls back to treating an
unmapped type string as a class name. Nothing breaks. Deploy this alone if you want maximum
safety.

*Release N, step 2 — backfill, immediately after step 1 in the same `migrate` run.* A migration
named to sort **before every new CMS table migration**:
`2026_08_01_000001_backfill_files_morph_map.php`. It runs `UPDATE files SET fileable_type = ?
WHERE fileable_type = ?` once per legacy alias, inside a transaction, with a `down()` that
reverses the mapping exactly. Ordering-before matters for one reason: if the backfill fails,
`migrate` aborts and no CMS table has been created, so the rollback is a no-op rather than a
partial schema. It has no dependency on the new tables, so there is no reason to run it later.

*Release N+1, step 3 — flip to `enforceMorphMap()`.* Gate on a verification query returning zero
rows: `SELECT DISTINCT fileable_type FROM files WHERE fileable_type LIKE 'App\\\\%'`. Shipping the
flip in the *following* release means a rollback of release N does not leave enforcement on
against un-backfilled data. This is the whole reason for the two-release split.

**The map itself** (`config/morph-map.php`, consumed by `AppServiceProvider`), snake_case singular,
matching the repo's existing naming register:

```
user, app_setting                                    ← legacy, retrofitted
page, page_section, section_block, block, cta        ← core CMS
menu, menu_item                                      ← navigation
media, media_folder                                  ← media
taxonomy, taxonomy_term                              ← taxonomy
service, case_study, post, industry, technology,
team_member, testimonial, faq, job_opening,
location, accolade, client                           ← content modules
form_submission                                      ← forms
```

**Every morph column and its permitted alias set is declared in `config/morph-map.php` too**, as a
second array (`'seoable' => ['page','service','case_study',...]`). Form Requests validate the
incoming `*_type` against that list with `Rule::in()`. This is what stops an editor attaching an
SEO record to a `menu_item`.

### 4.2 `section_blocks` vs JSON `data` vs JSON `settings` — the mechanical rule

There are **three** homes, not two, and treating it as two is why this question feels hard.

> **The rule, applied in order. Stop at the first yes.**
>
> **1. Can there be more than one of it, with editor-controlled order?**
> → `section_blocks` row. **Never a JSON array.**
>
> **2. Is it one of the six universal scalars** (eyebrow, heading, subheading, body, primary media,
> primary CTA)? → typed column on `page_sections`.
>
> **3. Would a translator ever need to see this field on its own?**
> → yes: JSON `data`. → no: JSON `settings`.

Compressed to one sentence an engineer can hold in their head:

> **Cardinality decides table-vs-JSON. Translatability decides `data`-vs-`settings`.**

**Four hard invariants that make the rule enforceable rather than advisory:**

- **I1 — No translatable text inside a JSON array, ever.** A JSON array index is not a stable
  translation address (decision 3). Any array-of-objects containing editor-written text is a
  schema bug; it goes to `section_blocks`.
- **I2 — No media id inside JSON, ever.** Media references need an FK (`SET NULL` on delete) and a
  reverse-lookup index. Both die inside JSON. Single media → `page_sections.media_id` /
  `section_blocks.media_id`. Multiple → `mediables`.
- **I3 — No content-entity id inside JSON, ever.** "This section features these three case
  studies" is `content_relations` (§6.2), not `data->case_study_ids`. Same reasons as I2, plus
  eager-loading.
- **I4 — Nothing in `settings` is ever returned to a translator, and nothing in `settings` is ever
  free text.** `settings` values come from a fixed set the code defines. If an editor can type
  arbitrary prose into it, it is `data`.

**Worked examples**, so the rule is testable:

| Field | Home | Which step decided it |
|---|---|---|
| Hero headline | `page_sections.heading` | Step 2 |
| Hero background image | `page_sections.media_id` | Step 2 + I2 |
| Hero trust-badge logos (6, reorderable) | `section_blocks` (`block_type='logo'`) | Step 1 |
| Hero layout: `split` / `centered` / `full-bleed` | `settings.layout` | Step 3 → no |
| Hero background overlay opacity | `settings.overlay_opacity` | Step 3 → no |
| Stats section: each stat's number + label | `section_blocks` (`value`, `label`) | Step 1 |
| Stats section: "animate counters on scroll" | `settings.animate` | Step 3 → no |
| Pricing section: "billed annually" disclaimer | `data.billing_note` | Step 3 → yes |
| Pricing tiers | `section_blocks` | Step 1 |
| Featured case studies (editor picks 3) | `content_relations` | I3 |
| FAQ section: "Still have questions?" footer text | `data.footer_text` | Step 3 → yes |
| FAQ items | `section_blocks` **or** `content_relations` → `faqs` | Step 1; §6.2 decides which |
| Testimonial slider autoplay interval | `settings.autoplay_ms` | Step 3 → no |
| Contact section: form key to submit to | `settings.form_key` | Step 3 → no (machine value) |
| Contact section: privacy-consent copy | `data.consent_text` | Step 3 → yes |
| Video section: YouTube id | `settings.video_id` | Step 3 → no |
| Video section: transcript | `data.transcript` | Step 3 → yes |

**Yes — the registry declares it per field, and validates the declaration at boot.** Every field
descriptor carries an explicit `store` key:

```
store: 'column' | 'data' | 'settings' | 'block'
```

The registry self-check (a dev-environment assertion, not a runtime cost) rejects any section type
that violates the rule, so the rule cannot drift:

- `repeatable: true` **must** pair with `store: 'block'`.
- `translatable: true` **must not** pair with `store: 'settings'`.
- `type: 'media'` or `type: 'relation'` **must not** pair with `store: 'data'` or `'settings'` (I2, I3).
- `store: 'column'` is only legal for the six universal scalar names.

**Why not "everything in JSON, it's simpler".** Because the CMS requirement in CLAUDE.md is that
*every* field is editable, and editable means reorderable, translatable, and referentially sound.
JSON gives up all three for repeaters. **Why not "everything normalized".** Because ~40% of
section fields are presentation toggles that no query filters on and no translator reads, and a
column per toggle is a migration per design tweak — exactly the "never hardcode, never redeploy
for content" failure mode from the other direction.

**Applying it to a brand-new section type, mechanically:** list the fields, ask "more than one?"
→ block; else "one of the six?" → column; else "would a translator see it?" → `data` else
`settings`. Then run the registry self-check. No architect required.

---

## 5. Section Type Registry contract

Section types live in **PHP, not a table** (decision 6). The registry is
`app/Data/Cms/SectionTypes/` — one class per type implementing `SectionTypeContract`, discovered
and indexed by `SectionTypeRegistry` (a singleton bound in `AppServiceProvider`).

**Why not a table.** A section type's field schema is *code* — the React component that renders it
must know the same field names, and a DB-driven schema means the component and the row can drift
with no failure until render. Keeping it in PHP makes the schema and the component versioned in
the same commit, diffable in review, and testable. The `section_type` column stays a plain
`VARCHAR(100)` with no FK: an unknown key renders the missing-section fallback rather than
throwing, which is exactly the "survive missing CMS data" requirement.

**The contract** (shape, not code):

- `key(): string` — `hero.split`. Namespaced by family; the family is the admin group.
- `label(): string` — through `translate()`.
- `description(): string` — editor-facing explanation.
- `icon(): string` — icon registry key for the section picker.
- `group(): string` — admin picker grouping (`Hero`, `Content`, `Social Proof`, `Conversion`).
- `fields(): array` — ordered field descriptors (below).
- `blockTypes(): array` — descriptor sets for each `block_type` this section accepts, plus
  `min`/`max` counts.
- `relations(): array` — permitted `content_relations` types and cardinality.
- `previewComponent(): string` — the React component key, so admin preview and public render
  cannot diverge.
- `defaults(): array` — seeded `data`/`settings` for a newly added section.

**Field descriptor keys:**

| Key | Purpose |
|---|---|
| `name` | Field key. Column name, or JSON key within `data`/`settings`. |
| `label` | Editor label, via `translate()`. |
| `type` | `InputEnum` value where one fits (`text`, `textarea`, `html_text`, `select`, `switch`, `url`, `number`, `date`, `multi-select`) — **reusing `app/Enums/Settings/InputEnum.php` rather than inventing a parallel type list.** Plus CMS additions: `media`, `cta`, `relation`, `icon`, `color`, `repeater`. |
| `store` | `column` \| `data` \| `settings` \| `block`. See §4.2. |
| `translatable` | `bool`. Drives the overlay UI and the export-for-translation job. |
| `repeatable` | `bool`. Must imply `store: 'block'`. |
| `required` | `bool`. Compiled into the Form Request rules. |
| `rules` | Extra Laravel validation rules, merged after the type's implied rules. |
| `options` | For `select`/`multi-select`: a static array or an enum class name. |
| `default` | Default value. |
| `help` | Editor hint text. |
| `group` | Admin form section grouping (`Content`, `Media`, `Layout`, `Advanced`). |
| `conditional` | `['field' => 'layout', 'value' => 'split']` — show only when another field matches. |

**How the admin discovers fields.** `SectionController@create`/`@edit` calls
`SectionTypeRegistry::describe($type)` and ships the descriptor array through the standard
`AppResponse::asSuccess()->withComponent(...)` payload, alongside the current row. The React
side renders a generic form from descriptors — the same shape the existing
`resources/js/Config/crud/` configs consume, so `InputEnum` reuse is not cosmetic; it means the
existing field-rendering switch handles most types already. Bespoke React is needed only for
`media`, `cta`, `relation`, and `repeater`.

**How JSON payloads are validated.** `SectionSaveRequest::rules()` is dynamic: it reads
`section_type` from the request, asks the registry for descriptors, and compiles
`data.*`/`settings.*` rules from them — `data.billing_note => ['nullable','string','max:500']`.
Then **the request strips any key not in the descriptor set** before it reaches the service. This
is the important half: without the strip, a crafted payload writes arbitrary keys into `data`,
which then flow into the React renderer. Validation alone is not enough; the whitelist is.

**Where `translatable: true` is expressed.** Per field descriptor. It has three consumers:
(1) the routable-content editor shows the field per-locale for row-per-locale models;
(2) the `content_translations` overlay (§8.1) knows which `data` keys and which `section_blocks`
columns to write rows for — the overlay stores `field` as a dotted path
(`data.billing_note`, `label`) against a `uuid`, which is why I1 exists;
(3) an export-for-translation job can serialise exactly the translatable surface.

**Validating the registry itself.** A `cms:validate-registry` Artisan command runs the §4.2
self-check plus: every `key()` unique, every `previewComponent()` resolves to a file, every
`relations()` entry names a registered morph alias. Wire it into CI.

---

## 6. Taxonomy and relations

### 6.1 `taxonomies` / `taxonomy_terms` / `taxonomables`

**`taxonomies`**

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `key` | `VARCHAR(60)` | no | — | `service_category`, `industry`, `technology`, `post_tag`, `case_study_sector`. |
| `name` | `VARCHAR(191)` | no | — | Admin label. |
| `description` | `VARCHAR(500)` | yes | `NULL` | What it classifies. |
| `is_hierarchical` | `BOOLEAN` | no | `false` | Whether terms may nest. |
| `is_multiple` | `BOOLEAN` | no | `true` | Whether one entity may hold several terms. |
| `applies_to` | `JSON` | yes | `NULL` | Morph aliases this taxonomy may be attached to. Machine-only, never translated → JSON is correct. |
| `is_locked` | `BOOLEAN` | no | `false` | Core taxonomies cannot be deleted. |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. |
| `sort_order` | `INT` | no | `0` | Admin order. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

Indexes: `UNIQUE (site_id, key)`, `UNIQUE (uuid)`.

**`taxonomy_terms`** — routable (`/insights/topic/cloud`), so it gets the translation-group pair.

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `taxonomy_id` | `BIGINT UNSIGNED` | no | — | FK → `taxonomies.id`. |
| `translation_group_id` | `CHAR(36)` | no | — | Locale grouping. |
| `locale` | `VARCHAR(10)` | no | — | Locale. |
| `parent_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `taxonomy_terms.id`. Only when `is_hierarchical`. |
| `path` | `VARCHAR(255)` | no | — | Materialized ancestor path. |
| `depth` | `TINYINT UNSIGNED` | no | `0` | Depth. |
| `name` | `VARCHAR(191)` | no | — | Display name. |
| `slug` | `VARCHAR(191)` | no | — | URL segment. |
| `description` | `TEXT` | yes | `NULL` | Archive-page intro copy. |
| `icon` | `VARCHAR(100)` | yes | `NULL` | Icon key. |
| `color` | `VARCHAR(20)` | yes | `NULL` | Badge accent. |
| `media_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `media.id`. Archive hero image. |
| `usage_count` | `INT UNSIGNED` | no | `0` | Denormalized attachment count. Powers "hide empty terms" and tag-cloud weighting without a `COUNT(*)` per term. Recomputed on attach/detach in `TaxonomyService`. |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. |
| `publish_status` | `ENUM(...)` | no | `'published'` | Editorial. |
| `published_at` / `expires_at` | `TIMESTAMP` | yes | `NULL` | Scheduling. |
| `sort_order` | `INT` | no | `0` | Order. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

Indexes: `UNIQUE (taxonomy_id, locale, slug)` — the archive URL;
`UNIQUE (uuid)`; `IDX (translation_group_id, locale)`; `IDX (taxonomy_id, parent_id, sort_order)`;
`IDX (site_id, taxonomy_id, status, usage_count)`.
FKs: `taxonomy_id` → `taxonomies.id` `CASCADE`; `parent_id` → self `RESTRICT`;
`media_id` → `media.id` `SET NULL`.

**`taxonomables`**

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `taxonomy_term_id` | `BIGINT UNSIGNED` | no | — | FK → `taxonomy_terms.id`. |
| `taxonomable_type` | `VARCHAR(60)` | no | — | Morph alias. |
| `taxonomable_id` | `BIGINT UNSIGNED` | no | — | Owner id. |
| `is_primary` | `BOOLEAN` | no | `false` | The canonical category, for breadcrumbs and canonical URLs when an entity has several. |
| `sort_order` | `INT` | no | `0` | Display order of badges. |
| `created_at` / `updated_at` | `TIMESTAMP` | yes | `NULL` | Timestamps. |

Indexes: `UNIQUE (taxonomy_term_id, taxonomable_type, taxonomable_id)`;
`IDX (taxonomable_type, taxonomable_id, sort_order)` — badges for a loaded entity;
`IDX (taxonomy_term_id)` — the archive listing.
FK: `taxonomy_term_id` → `taxonomy_terms.id` `CASCADE`/`CASCADE`.

**Generic vs per-module, argued.** The alternative is `service_categories`,
`case_study_industries`, `post_tags`, `post_categories`, `technology_categories` + five pivots =
ten tables, five near-identical services, five near-identical admin screens, five policies. The
generic version is three tables and one `TaxonomyService`. The cost of generic is real and worth
naming: you lose per-taxonomy typed columns (a `post_tag` cannot have a field an
`industry` lacks). The escape hatch is that `industries` and `technologies` are *also* first-class
content tables (§7) when they need their own pages and rich content — taxonomy handles
*classification*, the content table handles *the entity*. An `industries` row and an `industry`
taxonomy term coexist, linked by `content_relations`. That split is deliberate and is the reason
the generic table does not need typed columns.

### 6.2 `content_relations`

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `source_type` | `VARCHAR(60)` | no | — | Morph alias of the owning side. |
| `source_id` | `BIGINT UNSIGNED` | no | — | Owner id. |
| `target_type` | `VARCHAR(60)` | no | — | Morph alias of the referenced side. |
| `target_id` | `BIGINT UNSIGNED` | no | — | Referenced id. |
| `relation_type` | `VARCHAR(60)` | no | `'related'` | `related`, `featured`, `uses_technology`, `serves_industry`, `authored_by`, `case_study_for_service`. |
| `sort_order` | `INT` | no | `0` | Editor-controlled display order. |
| `created_at` / `updated_at` | `TIMESTAMP` | yes | `NULL` | Timestamps. |

Indexes: `UNIQUE (source_type, source_id, target_type, target_id, relation_type)`;
`IDX content_relations_forward (source_type, source_id, relation_type, sort_order)` — "related
case studies for this service", the hot path; `IDX content_relations_reverse (target_type,
target_id, relation_type)` — "which services feature this case study", needed before delete.

No FKs (both sides are morphs). Orphan cleanup is a `deleting` model event on each CMS model that
purges rows on either side — registered once in a `HasContentRelations` trait, not per model.

**Generic vs typed pivots, argued.** The relation graph here is dense:
service↔case_study, service↔industry, service↔technology, case_study↔technology,
case_study↔industry, case_study↔testimonial, post↔service, post↔team_member,
job_opening↔location, plus "featured X on section Y" for six section types. Typed pivots would be
~15 tables with identical shape. The generic table costs: no referential integrity (mitigated by
the delete event), and slightly wider indexes. It buys one `RelationService`, one admin
relation-picker component, and — the real win — the section registry can declare
`relations: ['case_study' => ['max' => 3]]` and get a working picker with zero new backend code
per section type.

**When to use `content_relations` vs `section_blocks` for an FAQ section.** The rule: if the item
is a *reference to content that exists independently and is reused* (an FAQ that also appears on
`/faq`), it is `content_relations` → `faqs`. If the item exists *only* inside this section
(a one-off process step), it is `section_blocks`. The registry declares which, per section type,
so the editor is never asked.

---

## 7. Content modules

All content-module tables share the same skeleton. To avoid 14 near-identical tables of prose,
the shared skeleton is stated once and each table lists only its **distinct** columns plus its
own indexes and justification.

### 7.0 Routable-content skeleton

Applied to `services`, `case_studies`, `posts`, `industries`, `technologies`, `job_openings`:

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `translation_group_id` | `CHAR(36)` | no | — | Locale grouping (decision 3). |
| `locale` | `VARCHAR(10)` | no | — | Locale. |
| `slug` | `VARCHAR(191)` | no | — | URL segment. |
| `title` | `VARCHAR(191)` | no | — | Entity name. |
| `subtitle` | `VARCHAR(255)` | yes | `NULL` | Supporting line. |
| `excerpt` | `VARCHAR(500)` | yes | `NULL` | Card/listing summary. Explicit, not truncated body — truncation produces bad cards. |
| `body` | `LONGTEXT` | yes | `NULL` | Main rich text (Lexical). |
| `featured_media_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `media.id`. Card + hero + OG fallback. |
| `icon` | `VARCHAR(100)` | yes | `NULL` | Icon registry key. |
| `is_featured` | `BOOLEAN` | no | `false` | Homepage/listing promotion. |
| `settings` | `JSON` | yes | `NULL` | Presentation flags (§4.2 step 3 → no). |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. |
| `publish_status` | `ENUM('draft','scheduled','published','archived')` | no | `'draft'` | Editorial. |
| `published_at` / `expires_at` | `TIMESTAMP` | yes | `NULL` | Scheduling. |
| `sort_order` | `INT` | no | `0` | Manual order. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

Shared indexes on each: `UNIQUE (site_id, locale, slug)`; `UNIQUE (uuid)`;
`IDX (translation_group_id, locale)`;
`IDX (site_id, locale, publish_status, published_at)` — the listing/`->published()` scope;
`IDX (site_id, is_featured, sort_order)` — homepage rails; `IDX (featured_media_id)` — usage
report; `IDX (deleted_at)`.
Shared FKs: `featured_media_id` → `media.id` `SET NULL`/`CASCADE`; audit → `users.id`
`SET NULL`/`CASCADE`.

**Long-form body: also sectioned.** Each of these entities may additionally own `page_sections`
rows via a `page_id`-style link. Rather than adding `page_sections.service_id`,
`page_sections.post_id`, … the link is the existing `content_relations`
(`source = service, target = page_section, relation_type = 'body_section'`). One mechanism, no new
columns. `body` stays for the simple case; sections handle the designed case.

### 7.1 `services` — plus `service_type` (solutions merged in)

Distinct columns: `service_type ENUM('service','solution','capability') NOT NULL DEFAULT 'service'`
— the merge from decision 6; `parent_id BIGINT UNSIGNED NULL` FK → self `RESTRICT` (service →
sub-service); `path VARCHAR(500) NOT NULL`, `depth TINYINT UNSIGNED NOT NULL DEFAULT 0` —
same denormalization rationale as `pages`; `short_description VARCHAR(500) NULL` — the nav
mega-menu blurb, distinct from `excerpt` which is the card copy;
`starting_price VARCHAR(100) NULL` — string, because "From $X" and "Custom" are both valid;
`engagement_model VARCHAR(100) NULL`.

Extra indexes: `IDX (site_id, locale, service_type, publish_status, sort_order)` — the "list all
solutions" page; `IDX (parent_id, sort_order)`.

**Merge argued.** A "solution" and a "service" differ only in editorial framing and listing page.
Identical fields, identical templates, identical SEO shape. Two tables would mean two services,
two policies, two admin screens, and a `content_relations` graph that has to know both. One
`ENUM` column and a filtered index does the whole job. The cost is that the two can never diverge
structurally without a nullable column — acceptable, and if they do diverge, the divergent fields
go in `settings` first as a probe.

### 7.2 `case_studies` — plus `depth` (portfolio merged in)

Distinct: `depth ENUM('portfolio','case_study') NOT NULL DEFAULT 'case_study'` — the decision-6
merge; a portfolio item is a thin card, a case study is the full narrative;
`client_id BIGINT UNSIGNED NULL` FK → `clients.id` `SET NULL`;
`client_name VARCHAR(191) NULL` — for unnamed/anonymised clients where no `clients` row exists;
`challenge LONGTEXT NULL`, `solution LONGTEXT NULL`, `outcome LONGTEXT NULL` — the three narrative
beats every case study has, as columns rather than `data` keys because *every* row has them and
the listing page renders `outcome` snippets; `project_url VARCHAR(500) NULL`;
`duration_label VARCHAR(100) NULL`; `team_size SMALLINT UNSIGNED NULL`;
`started_at DATE NULL`, `completed_at DATE NULL`.

Result metrics ("+340% throughput") are **`section_blocks`**, not columns — cardinality varies,
editor orders them, rule step 1.

Extra indexes: `IDX (site_id, locale, depth, publish_status, published_at)`;
`IDX (client_id)`.

### 7.3 `posts` — insights/blog

Distinct: `post_type ENUM('article','whitepaper','news','press_release','webinar') NOT NULL
DEFAULT 'article'`; `author_id BIGINT UNSIGNED NULL` FK → `team_members.id` `SET NULL`
(the byline is a team member, not a `users` row — the author of record is editorial, the `users`
row is operational, and they are frequently different people);
`reading_minutes SMALLINT UNSIGNED NULL`; `is_gated BOOLEAN NOT NULL DEFAULT false` — whitepapers
behind a form; `gated_form_key VARCHAR(60) NULL` → `form_submissions.form_key`;
`asset_media_id BIGINT UNSIGNED NULL` FK → `media.id` — the downloadable PDF.

Extra indexes: `IDX (site_id, locale, post_type, publish_status, published_at)` — the archive,
newest-first, one index scan; `IDX (author_id)`.

### 7.4 `industries` / 7.5 `technologies`

Both take the skeleton unchanged. `industries` adds `overview LONGTEXT NULL` and
`stats_intro VARCHAR(500) NULL`. `technologies` adds `category VARCHAR(100) NULL`,
`proficiency_level ENUM('core','proficient','familiar') NOT NULL DEFAULT 'proficient'`,
`logo_media_id BIGINT UNSIGNED NULL` FK → `media.id` `SET NULL`, and
`docs_url VARCHAR(500) NULL`.

**Why these are tables and not just taxonomy terms.** Both need their own landing pages with hero,
body, SEO, and related content — that is an entity, not a label. They are *also* taxonomy terms
(see §6.1), and the pairing is by `content_relations`. Kept separate because collapsing them into
`taxonomy_terms` would mean `taxonomy_terms` grows `body`, `excerpt`, `proficiency_level`,
`docs_url` — nullable for the 95% of terms that are plain tags.

### 7.6 `team_members`

Not routable in v1 (no `/team/jane-doe` page), so **no** `translation_group_id`/`locale` — it takes
the `«identity»`/`«audit»`/`«publishing»` bundles plus:
`name VARCHAR(191) NOT NULL`; `slug VARCHAR(191) NOT NULL` (reserved for when profiles go
routable — cheap now, expensive later); `role_title VARCHAR(191) NULL`;
`department VARCHAR(100) NULL`; `bio TEXT NULL`; `photo_media_id BIGINT UNSIGNED NULL` FK →
`media.id`; `email VARCHAR(191) NULL`; `phone VARCHAR(50) NULL`;
`linkedin_url`/`twitter_url`/`github_url` `VARCHAR(500) NULL`;
`location_id BIGINT UNSIGNED NULL` FK → `locations.id` `SET NULL`;
`is_leadership BOOLEAN NOT NULL DEFAULT false`.

Indexes: `UNIQUE (site_id, slug)`; `UNIQUE (uuid)`;
`IDX (site_id, is_leadership, status, sort_order)` — the leadership grid;
`IDX (department)`; `IDX (photo_media_id)`.

**Social URLs as columns, not JSON.** Three fixed, universally-present fields that the JSON-LD
`sameAs` generator reads on every render. A JSON blob here would be `settings`-shaped, but they
fail I4's spirit — they are free-text editor input. Three columns is the honest answer. A fourth
network is a migration; that is fine, it happens once a year.

### 7.7 `testimonials`

`«identity»` + `«audit»` + `«publishing»`, plus: `quote TEXT NOT NULL`;
`author_name VARCHAR(191) NOT NULL`; `author_title VARCHAR(191) NULL`;
`client_id BIGINT UNSIGNED NULL` FK → `clients.id` `SET NULL`;
`company_name VARCHAR(191) NULL`; `author_media_id BIGINT UNSIGNED NULL` FK → `media.id`;
`rating TINYINT UNSIGNED NULL`; `source VARCHAR(100) NULL` (Clutch, G2, direct);
`source_url VARCHAR(500) NULL`; `video_media_id BIGINT UNSIGNED NULL` FK → `media.id`;
`is_featured BOOLEAN NOT NULL DEFAULT false`; `locale VARCHAR(10) NULL` — nullable here because a
testimonial is a quotation in a specific language that is *not* translated (translating a
customer's words is a legal and ethical problem). NULL means "show in all locales".

Indexes: `UNIQUE (uuid)`; `IDX (site_id, status, publish_status, is_featured, sort_order)`;
`IDX (client_id)`.

**Not merged into `section_blocks`.** Testimonials are reused across many sections and pages, have
their own admin screen, and carry review schema (JSON-LD `Review`). A section referencing three of
them is `content_relations` per I3.

### 7.8 `faqs`

`«identity»` + `«audit»` + `«publishing»` + `translation_group_id`/`locale` (FAQs are surfaced on
routable `/faq` and carry `FAQPage` JSON-LD per locale), plus:
`question VARCHAR(500) NOT NULL`; `answer LONGTEXT NOT NULL`;
`category VARCHAR(100) NULL` — a soft grouping label, deliberately *not* a taxonomy, because FAQ
grouping is display-local and never gets an archive page.

Indexes: `UNIQUE (uuid)`; `IDX (site_id, locale, status, publish_status, sort_order)`;
`IDX (site_id, locale, category, sort_order)`.

### 7.9 `job_openings`

Routable skeleton plus: `department VARCHAR(100) NULL`;
`employment_type ENUM('full_time','part_time','contract','internship','freelance')`;
`work_mode ENUM('onsite','hybrid','remote')`;
`location_id BIGINT UNSIGNED NULL` FK → `locations.id` `SET NULL`;
`seniority VARCHAR(60) NULL`; `salary_min`/`salary_max` `DECIMAL(12,2) NULL`;
`salary_currency VARCHAR(10) NULL`; `salary_period ENUM('hour','month','year') NULL`;
`show_salary BOOLEAN NOT NULL DEFAULT false`;
`responsibilities LONGTEXT NULL`, `requirements LONGTEXT NULL`, `benefits LONGTEXT NULL`;
`apply_form_key VARCHAR(60) NULL`; `apply_url VARCHAR(500) NULL`;
`closes_at TIMESTAMP NULL` — distinct from `expires_at`: `closes_at` shows a "closed" state,
`expires_at` removes the page.

Indexes: as skeleton, plus `IDX (site_id, locale, department, employment_type, publish_status)`;
`IDX (location_id)`; `IDX (closes_at)`.

`JobPosting` JSON-LD is generated from these columns — which is precisely why salary and location
are typed columns rather than `data` keys.

### 7.10 `locations` — offices

`«identity»` + `«audit»`, plus `name VARCHAR(191)`, `slug VARCHAR(191)`,
`address_line1`/`address_line2` `VARCHAR(255) NULL`, `city VARCHAR(100) NULL`,
`state VARCHAR(100) NULL`, `postal_code VARCHAR(30) NULL`, `country_code VARCHAR(2) NULL`
(matches `GlobalConfig::COUNTRIES` codes), `latitude DECIMAL(10,7) NULL`,
`longitude DECIMAL(10,7) NULL`, `timezone VARCHAR(60) NULL`, `phone VARCHAR(50) NULL`,
`email VARCHAR(191) NULL`, `is_headquarters BOOLEAN NOT NULL DEFAULT false`,
`media_id BIGINT UNSIGNED NULL` FK → `media.id`, `opening_hours JSON NULL`
(machine-shaped, feeds `LocalBusiness` JSON-LD, never editor-ordered → JSON is correct),
`status`, `sort_order`.

Indexes: `UNIQUE (site_id, slug)`; `UNIQUE (uuid)`;
`IDX (site_id, status, is_headquarters, sort_order)`; `IDX (country_code)`.

### 7.11 `accolades` — awards + certifications + partnerships merged

`«identity»` + `«audit»` + `«publishing»`, plus:
`accolade_type ENUM('award','certification','partnership','membership') NOT NULL` — decision 6;
`title VARCHAR(191) NOT NULL`; `issuer VARCHAR(191) NULL`;
`description VARCHAR(500) NULL`; `media_id BIGINT UNSIGNED NULL` FK → `media.id` (badge/logo);
`issued_at DATE NULL`; `expires_on DATE NULL` (certifications lapse);
`credential_id VARCHAR(191) NULL`; `verify_url VARCHAR(500) NULL`;
`tier VARCHAR(60) NULL` (Gold/Platinum partner); `is_featured BOOLEAN NOT NULL DEFAULT false`.

Indexes: `UNIQUE (uuid)`; `IDX (site_id, accolade_type, status, sort_order)`;
`IDX (expires_on)` — the "certification lapsing soon" admin warning.

**Merge argued.** Award, certification, partnership, and membership are the same record — a badge,
an issuer, a date, a link — differing only in label. Four tables would be four migrations, four
services, four policies, four admin screens, and a trust-strip section that has to union four
queries. One table with a type column and a filtered index. The only field that is not universal
is `tier` (partnerships) and `credential_id` (certifications); two nullable columns is a much
smaller cost than three extra tables.

### 7.12 `clients`

`«identity»` + `«audit»`, plus `name VARCHAR(191) NOT NULL`, `slug VARCHAR(191) NOT NULL`,
`logo_media_id BIGINT UNSIGNED NULL` FK → `media.id`,
`logo_dark_media_id BIGINT UNSIGNED NULL` FK → `media.id` (dark-mode logo variant — a real
requirement given the theme toggle), `website_url VARCHAR(500) NULL`,
`industry_id BIGINT UNSIGNED NULL` FK → `industries.id` `SET NULL`,
`is_anonymous BOOLEAN NOT NULL DEFAULT false` (NDA clients render as "A Fortune 500 retailer"),
`is_featured BOOLEAN NOT NULL DEFAULT false`, `status`, `sort_order`.

Indexes: `UNIQUE (site_id, slug)`; `UNIQUE (uuid)`;
`IDX (site_id, status, is_featured, sort_order)` — the logo wall; `IDX (industry_id)`.

**Not `section_blocks`.** The logo wall *looks* like a repeater, but a client is referenced from
case studies and testimonials by FK. Storing them as section blocks would mean the same logo is
re-uploaded per section and `case_studies.client_id` has nothing to point at.

### 7.13 `form_submissions` — all forms merged

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `form_key` | `VARCHAR(60)` | no | — | `contact`, `quote_request`, `job_application`, `whitepaper_download`, `newsletter`. Decision 6's merge. |
| `name` | `VARCHAR(191)` | yes | `NULL` | Promoted from payload: every form has it, and the inbox lists it. |
| `email` | `VARCHAR(191)` | yes | `NULL` | Promoted. Indexed for dedupe and lookup. |
| `phone` | `VARCHAR(50)` | yes | `NULL` | Promoted. |
| `company` | `VARCHAR(191)` | yes | `NULL` | Promoted. |
| `subject` | `VARCHAR(255)` | yes | `NULL` | Promoted. |
| `message` | `TEXT` | yes | `NULL` | Promoted. |
| `payload` | `JSON` | yes | `NULL` | Everything else, verbatim. Form fields vary per form and change without a deploy — this is the one place a schemaless bag is right. |
| `source_type` | `VARCHAR(60)` | yes | `NULL` | Morph alias of the originating entity (the job opening, the whitepaper). |
| `source_id` | `BIGINT UNSIGNED` | yes | `NULL` | Morph id. |
| `page_url` | `VARCHAR(500)` | yes | `NULL` | Where it was submitted from. |
| `referrer` | `VARCHAR(500)` | yes | `NULL` | HTTP referrer. |
| `utm` | `JSON` | yes | `NULL` | Campaign parameters. Machine data, never translated. |
| `ip_address` | `VARCHAR(45)` | yes | `NULL` | Matches `users.last_login_ip` width (IPv6-safe). |
| `user_agent` | `TEXT` | yes | `NULL` | Client string. |
| `locale` | `VARCHAR(10)` | yes | `NULL` | Submission locale, so the reply is in the right language. |
| `submission_status` | `ENUM('new','read','replied','spam','archived')` | no | `'new'` | **Named `submission_status`, not `status`** — `status` is reserved for `Status` by the traits. This is the same reasoning as `publish_status` and is exactly why decision 1 exists. |
| `is_spam` | `BOOLEAN` | no | `false` | Honeypot/rate-limit verdict. Separate from `submission_status` so an editor's manual "spam" classification and the automated one are distinguishable. |
| `assigned_to` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id` `SET NULL`. Inbox ownership. |
| `notes` | `TEXT` | yes | `NULL` | Internal follow-up notes. |
| `read_at` / `replied_at` | `TIMESTAMP` | yes | `NULL` | Workflow timestamps. |
| `status` | `ENUM('active','inactive')` | no | `'active'` | Trait-owned. Present so `Filterable`/`ModelAction` work unmodified. |
| `created_at` / `updated_at` / `deleted_at` | `TIMESTAMP` | yes | `NULL` | Timestamps + soft delete. |

Indexes: `UNIQUE (uuid)`; `IDX (site_id, form_key, submission_status, created_at)` — the inbox,
filtered by form and state, newest first; `IDX (email)`; `IDX (source_type, source_id)` —
"applications for this job"; `IDX (assigned_to, submission_status)`; `IDX (is_spam, created_at)`.

**Merge argued.** Contact, quote, application, and download-gate forms differ only in which fields
they collect. Separate tables would mean four models, four services, four policies, four inboxes,
and a notification pipeline that switches on type anyway. The six promoted columns cover the
universal fields (so the inbox list needs no JSON extraction and `email` is indexable), and
`payload` absorbs the variance. This is the single best JSON case in the schema and it passes I4
only because form submissions are never translated and never rendered publicly.

### 7.14 `newsletter_subscribers`

Kept separate from `form_submissions` despite the merge principle. `«identity»` plus
`email VARCHAR(191) NOT NULL`, `name VARCHAR(191) NULL`, `locale VARCHAR(10) NULL`,
`subscribe_status ENUM('pending','subscribed','unsubscribed','bounced') NOT NULL DEFAULT 'pending'`,
`confirmation_token CHAR(64) NULL`, `confirmed_at TIMESTAMP NULL`,
`unsubscribed_at TIMESTAMP NULL`, `source VARCHAR(100) NULL`,
`ip_address VARCHAR(45) NULL`, `status ENUM('active','inactive') NOT NULL DEFAULT 'active'`,
timestamps + `deleted_at`.

Indexes: `UNIQUE (site_id, email)` — the whole point; `UNIQUE (uuid)`;
`IDX (subscribe_status, created_at)`; `IDX (confirmation_token)`.

**Why not merged.** A subscriber is a *stateful record with a unique key and a lifecycle*
(double opt-in, unsubscribe, bounce). A submission is an immutable event. `UNIQUE (site_id, email)`
cannot exist on `form_submissions` — the same person legitimately submits the contact form twice.
Merging would put a nullable-unique index on a high-write event table and force the opt-in state
machine into `payload`. Different cardinality, different lifecycle, different table. This is the
one place I decline to merge and it is the right call.

---

## 8. SEO, translations, revisions, previews

### 8.1 `seo_meta`

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `site_id` | `BIGINT UNSIGNED` | no | `1` | Tenancy. |
| `seoable_type` | `VARCHAR(60)` | no | — | Morph alias of the owner. |
| `seoable_id` | `BIGINT UNSIGNED` | no | — | Owner id. |
| `locale` | `VARCHAR(10)` | no | — | Locale. Present even for row-per-locale owners, so a non-routable owner can hold several. |
| `meta_title` | `VARCHAR(255)` | yes | `NULL` | `<title>`. Falls back to the owner's `title`. |
| `meta_description` | `VARCHAR(500)` | yes | `NULL` | `<meta name="description">`. Falls back to `excerpt`. |
| `meta_keywords` | `VARCHAR(500)` | yes | `NULL` | Legacy; editors expect the field. |
| `canonical_url` | `VARCHAR(500)` | yes | `NULL` | Canonical override. NULL = self. |
| `robots_index` | `BOOLEAN` | no | `true` | `index`/`noindex`. |
| `robots_follow` | `BOOLEAN` | no | `true` | `follow`/`nofollow`. |
| `robots_advanced` | `VARCHAR(191)` | yes | `NULL` | `max-snippet`, `noarchive`, etc. |
| `og_title` | `VARCHAR(255)` | yes | `NULL` | Open Graph title. |
| `og_description` | `VARCHAR(500)` | yes | `NULL` | OG description. |
| `og_type` | `VARCHAR(50)` | no | `'website'` | OG type. |
| `og_media_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `media.id`. OG image (I2). |
| `twitter_card` | `VARCHAR(50)` | no | `'summary_large_image'` | Card type. |
| `twitter_title` | `VARCHAR(255)` | yes | `NULL` | Twitter title. |
| `twitter_description` | `VARCHAR(500)` | yes | `NULL` | Twitter description. |
| `twitter_media_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `media.id`. Twitter image. |
| `schema_type` | `VARCHAR(60)` | yes | `NULL` | JSON-LD `@type` override. |
| `schema_data` | `JSON` | yes | `NULL` | Extra JSON-LD properties merged over the generated graph. Machine-shaped, per-type variable → JSON is correct. |
| `focus_keyword` | `VARCHAR(191)` | yes | `NULL` | Editorial SEO scoring input. |
| `seo_score` | `TINYINT UNSIGNED` | yes | `NULL` | Computed readability/SEO score for the editor. |
| `created_by` / `updated_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id`. |
| `created_at` / `updated_at` | `TIMESTAMP` | yes | `NULL` | Timestamps. No soft delete — SEO meta dies with its owner. |

Indexes: `UNIQUE seo_meta_owner_unique (seoable_type, seoable_id, locale)` — one SEO record per
owner per locale, and the eager-load key; `UNIQUE (uuid)`;
`IDX (og_media_id)`, `IDX (twitter_media_id)` — media usage report;
`IDX (site_id, robots_index)` — the "pages excluded from sitemap" report.

FKs: `og_media_id`, `twitter_media_id` → `media.id` `SET NULL`/`CASCADE`; audit → `users.id`.

**Polymorphic vs inline, argued.** 24 SEO columns × 9 routable owners
(`pages`, `services`, `case_studies`, `posts`, `industries`, `technologies`, `job_openings`,
`taxonomy_terms`, `faqs`) = 216 duplicated columns, and adding one SEO field is a nine-table
migration plus nine resource changes. Polymorphic is one table, one `SeoService`, one
`SeoResource`, one admin panel component reused everywhere, and rows only exist for entities an
editor has actually customised — a real storage win, since most rows will fall back to defaults.
The cost is one extra query, paid once per request as `->with('seo')`, or zero when the page
render is cached (§9). Clear win.

### 8.2 `content_translations` — deferred overlay (Phase 5)

Declared here so nothing in Phases 1–4 has to change when it lands.

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `translatable_type` | `VARCHAR(60)` | no | — | Morph alias. |
| `translatable_id` | `BIGINT UNSIGNED` | no | — | Owner id. |
| `locale` | `VARCHAR(10)` | no | — | Target locale. |
| `field` | `VARCHAR(120)` | no | — | Dotted path: `heading`, `data.billing_note`, `label`. |
| `value` | `LONGTEXT` | yes | `NULL` | Translated value. |
| `is_reviewed` | `BOOLEAN` | no | `false` | Translation QA state. |
| `created_at` / `updated_at` | `TIMESTAMP` | yes | `NULL` | Timestamps. |

Indexes: `UNIQUE (translatable_type, translatable_id, locale, field)`;
`IDX (translatable_type, translatable_id, locale)` — the overlay eager-load.

Applies to the non-routable set: `page_sections`, `section_blocks`, `blocks`, `menu_items`,
`ctas`, `media` (alt/caption), `testimonials` (attributions only), `accolades`, `clients`,
`team_members`, `locations`. **`field` is a dotted path against a stable identity**, which is
exactly why I1 (§4.2) forbids translatable text inside JSON arrays — there is no stable path to
`data.items[2].label`.

**Why the split rather than one mechanism.** Routable content needs slug lookup to be a
single unique-index probe (`UNIQUE (site_id, locale, slug)`); an overlay would make every public
URL resolution a join plus a coalesce. Non-routable content is never looked up by a translated
value, so the overlay costs one extra eager-load and saves duplicating entire section trees per
locale — which would otherwise mean an editor rearranging the English homepage does not
rearrange the German one, a well-known and hated failure mode. Correct split.

### 8.3 `content_revisions`

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `uuid` | `CHAR(36)` | no | — | Route key. |
| `revisionable_type` | `VARCHAR(60)` | no | — | Morph alias. |
| `revisionable_id` | `BIGINT UNSIGNED` | no | — | Owner id. |
| `version` | `INT UNSIGNED` | no | `1` | Monotonic per owner. |
| `payload` | `LONGTEXT` | no | — | Full serialised snapshot (owner + sections + blocks + seo). `LONGTEXT`, not `JSON`, because it is opaque — never queried into, and `JSON` costs validation on every write for no benefit. |
| `label` | `VARCHAR(191)` | yes | `NULL` | Editor's note ("pre-launch copy"). |
| `is_autosave` | `BOOLEAN` | no | `false` | Autosaves are pruned aggressively; manual ones are kept. |
| `created_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id` `SET NULL`. |
| `created_at` | `TIMESTAMP` | yes | `NULL` | When. No `updated_at` — a revision is immutable. |

Indexes: `UNIQUE (revisionable_type, revisionable_id, version)`;
`IDX (revisionable_type, revisionable_id, created_at)` — the history panel;
`IDX (is_autosave, created_at)` — the pruning job.

### 8.4 `preview_tokens`

| Column | Type | Null | Default | Purpose |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED` AI | no | — | PK. |
| `token` | `CHAR(64)` | no | — | Random, unguessable. The URL parameter. |
| `previewable_type` | `VARCHAR(60)` | no | — | Morph alias. |
| `previewable_id` | `BIGINT UNSIGNED` | no | — | Owner id. |
| `revision_id` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `content_revisions.id` `CASCADE`. NULL = preview current draft. |
| `locale` | `VARCHAR(10)` | yes | `NULL` | Locale to render. |
| `expires_at` | `TIMESTAMP` | no | — | Hard expiry. Not nullable — an immortal preview token is a content leak. |
| `created_by` | `BIGINT UNSIGNED` | yes | `NULL` | FK → `users.id` `SET NULL`. Who shared it. |
| `last_used_at` | `TIMESTAMP` | yes | `NULL` | Audit. |
| `use_count` | `INT UNSIGNED` | no | `0` | Audit. |
| `created_at` / `updated_at` | `TIMESTAMP` | yes | `NULL` | Timestamps. |

Indexes: `UNIQUE (token)`; `IDX (previewable_type, previewable_id)`; `IDX (expires_at)`.

**Why a table rather than a signed URL.** A signed URL cannot be revoked, and `expires_at` in a
signature cannot be shortened after the fact. A row can be deleted. Preview links get emailed to
clients; revocability is the requirement.

---

## 9. Settings

**No schema change to `app_settings`.** The table
(`database/migrations/2025_12_04_092043_create_app_settings_table.php`) already has
`title`/`slug`/`parent_id`/`order_index`/`description`/`input_type`/`default_value`/
`input_options`/`setting_value`/`status`, with `input_type` typed by `InputEnum` and
`input_options` cast to array. It is genuinely well-built. New CMS settings are **seeded rows**
via `SettingsSeeder` + new `SettingKey` cases + `DefaultSettings::get()` entries.

**New `SettingKey` cases** (rows, not columns):
`SITE_TAGLINE`, `DEFAULT_META_TITLE_SUFFIX`, `DEFAULT_META_DESCRIPTION`, `DEFAULT_OG_MEDIA`,
`ORGANIZATION_SCHEMA_TYPE`, `ORGANIZATION_LEGAL_NAME`, `ORGANIZATION_FOUNDING_YEAR`,
`GOOGLE_ANALYTICS_ID`, `GOOGLE_TAG_MANAGER_ID`, `GOOGLE_SITE_VERIFICATION`,
`ROBOTS_TXT_EXTRA`, `SITEMAP_ENABLED`, `SITEMAP_CHANGEFREQ`, `BLOG_POSTS_PER_PAGE`,
`CASE_STUDIES_PER_PAGE`, `CONTACT_FORM_RECIPIENTS`, `CONTACT_AUTORESPONDER_ENABLED`,
`RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET`, `COOKIE_BANNER_ENABLED`, `COOKIE_POLICY_PAGE_ID`,
`PREVIEW_TOKEN_TTL_MINUTES`, `MEDIA_MAX_IMAGE_DIMENSION`, `MEDIA_AUTO_WEBP`.

**Two gotchas, both real:**
1. `app_settings.title` is `UNIQUE` and `app_settings.slug` is `UNIQUE`. New titles must be
   namespaced (`'SEO — Default Meta Title Suffix'`) or `SettingsSeeder` will collide with an
   existing row on a partially-seeded database.
2. `LanguageService::makeDefault()` uses `AppSetting::firstOrNew(['slug' => ...])` then sets
   `title` from `key_to_value()`. Any new seeded setting must have a `key_to_value()`-derivable
   title or that pattern produces a duplicate-title error on a race. Seed titles explicitly.

**The boundary rule (decision 8), stated so it is applicable:**

> **A singular scalar that applies to the whole site → `app_settings` row.
> A collection, or anything with per-row ordering, media, or translation → its own table.**

So: the default OG image is a setting (one, site-wide, a single media id). Social links are a
**table** — they are ordered, they have icons, there are 5–8, and a new network must not require a
`SettingKey` case. Concretely, social links are `menu_items` on a `social` menu; this is why
`menu_items` carries `icon`. Footer link columns: `menus`. Company address: `locations`. Company
phone/email: `app_settings` (already exist). Applying the rule takes ten seconds and gives the
same answer every time.

---

## 10. Textual ER diagram

Morph-map aliases in `«guillemets»`. Pivot tables named explicitly.

```
users ──< created_by/updated_by >── (every editor-writable table)          [SET NULL on delete]

pages «page»
  ├─ parent_id ──> pages                                    self, RESTRICT
  ├─ translation_group_id ─── (locale siblings, no FK)
  ├─ 1──N page_sections                                     page_id, CASCADE
  ├─ 1──1 seo_meta                                          morph «page», per locale
  ├─ N──1 ctas.page_id                                      SET NULL   (reverse: who links here)
  ├─ N──1 menu_items.page_id                                SET NULL   (reverse: nav usage)
  ├─ N──N media           via mediables                     morph «page»
  ├─ N──N taxonomy_terms  via taxonomables                  morph «page»
  └─ N──N *               via content_relations             morph «page»

blocks «block»
  └─ 1──N page_sections                                     block_id, SET NULL

page_sections «page_section»
  ├─ N──1 pages | blocks            (exactly one owner, service-enforced)
  ├─ N──1 media                     media_id, SET NULL
  ├─ N──1 ctas                      cta_id, secondary_cta_id, SET NULL
  ├─ 1──N section_blocks            page_section_id, CASCADE
  ├─ N──N media           via mediables                     morph «page_section»
  ├─ N──N *               via content_relations             morph «page_section»
  └─ 1──N content_translations                              morph «page_section»   [Phase 5]

section_blocks «section_block»
  ├─ N──1 page_sections             page_section_id, CASCADE
  ├─ parent_id ──> section_blocks   self, CASCADE, max depth 2
  ├─ N──1 media                     media_id, SET NULL
  ├─ N──1 ctas                      cta_id, SET NULL
  ├─ morph link_target_type/id ──> any «content» alias       (no FK)
  └─ 1──N content_translations                              morph «section_block»  [Phase 5]

ctas «cta»
  ├─ N──1 pages                     page_id, SET NULL
  └─ morph target_type/id ──> any «content» alias            (no FK)

menus «menu»
  └─ 1──N menu_items                menu_id, CASCADE

menu_items «menu_item»
  ├─ parent_id ──> menu_items       self, CASCADE   (adjacency + path/depth)
  ├─ N──1 pages                     page_id, SET NULL
  ├─ N──1 media                     media_id, SET NULL
  └─ morph target_type/id ──> any «content» alias            (no FK)

media_folders «media_folder»
  ├─ parent_id ──> media_folders    self, RESTRICT
  └─ 1──N media                     folder_id, SET NULL

media «media»
  ├─ N──N (everything) via mediables      pivot: mediables (media_id, mediable_type, mediable_id, collection)
  ├─ 1──N page_sections.media_id, section_blocks.media_id, menu_items.media_id,
  │       taxonomy_terms.media_id, team_members.photo_media_id,
  │       testimonials.author_media_id / video_media_id, clients.logo_media_id /
  │       logo_dark_media_id, accolades.media_id, locations.media_id,
  │       technologies.logo_media_id, posts.asset_media_id,
  │       seo_meta.og_media_id / twitter_media_id,
  │       <routable>.featured_media_id                       all SET NULL
  └─ (files table is NOT related to media — separate system, §3.3)

seo_meta «seo_meta»
  └─ morph seoable_type/id ──> page | service | case_study | post | industry |
                               technology | job_opening | taxonomy_term | faq
     UNIQUE (seoable_type, seoable_id, locale)

taxonomies «taxonomy»
  └─ 1──N taxonomy_terms            taxonomy_id, CASCADE

taxonomy_terms «taxonomy_term»
  ├─ parent_id ──> taxonomy_terms   self, RESTRICT
  ├─ N──1 media                     media_id, SET NULL
  ├─ 1──1 seo_meta                  morph «taxonomy_term»
  └─ N──N (everything) via taxonomables   pivot: taxonomables
                                          (taxonomy_term_id, taxonomable_type, taxonomable_id)

content_relations   (generic N──N, no FKs, both sides morph)
  source_type/source_id  ──>  any «content» alias
  target_type/target_id  ──>  any «content» alias
  relation_type: related | featured | uses_technology | serves_industry |
                 authored_by | case_study_for_service | body_section

services «service»
  ├─ parent_id ──> services         self, RESTRICT   (path/depth denormalized)
  ├─ 1──1 seo_meta                  morph «service»
  └─ N──N case_studies | industries | technologies | posts   via content_relations

case_studies «case_study»
  ├─ N──1 clients                   client_id, SET NULL
  ├─ 1──1 seo_meta                  morph «case_study»
  ├─ 1──N section_blocks (results)  via its own page_sections
  └─ N──N services | industries | technologies | testimonials  via content_relations

posts «post»
  ├─ N──1 team_members              author_id, SET NULL
  ├─ N──1 media                     asset_media_id, SET NULL
  ├─ 1──1 seo_meta                  morph «post»
  └─ N──N taxonomy_terms via taxonomables ; services via content_relations

industries «industry» ─ 1──1 seo_meta ; N──N via content_relations
technologies «technology» ─ 1──1 seo_meta ; N──1 media (logo_media_id)

team_members «team_member»
  ├─ N──1 media                     photo_media_id, SET NULL
  ├─ N──1 locations                 location_id, SET NULL
  └─ 1──N posts.author_id

testimonials «testimonial»
  ├─ N──1 clients                   client_id, SET NULL
  └─ N──1 media                     author_media_id, video_media_id, SET NULL

faqs «faq»          ─ 1──1 seo_meta ; N──N taxonomy_terms via taxonomables
accolades «accolade» ─ N──1 media
clients «client»
  ├─ N──1 media                     logo_media_id, logo_dark_media_id, SET NULL
  ├─ N──1 industries                industry_id, SET NULL
  └─ 1──N case_studies, testimonials

locations «location»
  └─ 1──N team_members, job_openings

job_openings «job_opening»
  ├─ N──1 locations                 location_id, SET NULL
  ├─ 1──1 seo_meta                  morph «job_opening»
  └─ 1──N form_submissions          morph source «job_opening»

form_submissions «form_submission»
  ├─ N──1 users                     assigned_to, SET NULL
  └─ morph source_type/id ──> job_opening | post | page | service   (no FK)

newsletter_subscribers      (standalone; UNIQUE (site_id, email))

redirects                   (standalone; UNIQUE (from_hash))

content_revisions ── morph revisionable ──> page | service | case_study | post | ...
preview_tokens    ── morph previewable  ──> same set ; revision_id ──> content_revisions, CASCADE
content_translations ── morph translatable ──> page_section | section_block | block |
                        menu_item | cta | media | testimonial | accolade | client |
                        team_member | location                                  [Phase 5]

── existing, untouched ──
files ── morph fileable ──> user | app_setting        (legacy single-owner assets, §3.3)
app_settings ── 1──1 files (morphOne)                 (extended with seeded rows only)
languages, users, roles, permissions, notification_*  (unchanged)
```

---

## 11. Publishing and scheduling

### 11.1 States

`App\Enums\Cms\ContentStatus` — `draft` | `scheduled` | `published` | `archived`.
`getValues()` is used by the migrations exactly as `Status::getValues()` is in
`create_languages_table.php`. Add an `options()` method (inherited from `EnumTrait`) so the
config-driven CRUD filter dropdown works with no extra code.

| State | `published_at` | Visible publicly | Notes |
|---|---|---|---|
| `draft` | usually NULL | no | Default for new content. |
| `scheduled` | future | not yet | Becomes visible **the moment the clock passes**, not when a job runs. |
| `published` | past | yes | The steady state. |
| `archived` | any | no | Kept for reference; excluded from listings and sitemap. |

### 11.2 The `->published()` scope — exact semantics

Applied to any content model, on the model's own table:

```
status         = 'active'
AND publish_status IN ('published', 'scheduled')
AND published_at IS NOT NULL
AND published_at <= now()
AND (expires_at IS NULL OR expires_at > now())
```

Four properties of this, each deliberate:

1. **`scheduled` is admitted once its time has passed.** This is decision 7. If Horizon is down,
   or the janitor job is stuck, or someone `php artisan queue:restart`-ed at the wrong moment,
   content still goes live. The DB clock is the source of truth; the job is a convenience.
2. **`status = 'active'` is ANDed in.** The trait-owned kill switch still works, and a bulk
   deactivate from any CRUD screen immediately hides content regardless of editorial state.
3. **It is an explicit local scope, never a global scope.** A global scope would hide drafts from
   the admin — and worse, would silently apply inside `ModelAction::handleBulkAction()`'s
   `lazyById()` traversal, making bulk operations skip drafts with no visible cause.
4. **Column order matches `IDX (site_id, locale, publish_status, published_at)`** — equality
   predicates first, the range predicate last. `expires_at` is deliberately *not* in the index:
   adding it after a range column contributes nothing to the B-tree, and it is a cheap row filter.

A companion `->scheduledDue()` scope (`publish_status = 'scheduled' AND published_at <= now()`)
serves the janitor, and `->expired()` (`expires_at <= now() AND publish_status = 'published'`)
serves the unpublish sweep.

### 11.3 The janitor

`PublishScheduledContentJob`, every five minutes via `routes/console.php`. It flips
`scheduled → published` for due rows and `published → archived` for expired rows, and forgets the
affected cache keys. **It is not on the critical path** — its only real job is keeping
`publish_status` honest so admin filters and the sitemap are accurate, and firing the
cache-invalidation and notification side effects that a pure query-time check cannot.

It uses `lazyById(100)` (matching `ModelAction::handleBulkAction()`'s existing pattern) and writes
`publish_status` **through the model**, not a mass `update()`, so the `saved` event fires and
cache invalidation happens through the normal path.

### 11.4 Preview

Flow: editor clicks Preview → `PreviewService::issue($model, $revisionId, $ttl)` creates a
`preview_tokens` row (`token = Str::random(64)`, `expires_at = now()->addMinutes(
site_settings(SettingKey::PREVIEW_TOKEN_TTL_MINUTES))`) → returns
`/preview/{token}` → the public route resolves the token, checks `expires_at > now()`, increments
`use_count`/`last_used_at`, and renders **bypassing `->published()`** and **bypassing all caching**
(`Cache-Control: no-store`, and the render path takes the uncached branch explicitly).

Three rules that are easy to get wrong and matter: a preview response is never written to the
page cache; a preview token grants access to exactly one entity, not a session; and `expires_at`
is `NOT NULL` at the schema level so no code path can mint an immortal link.

---

## 12. Caching

### 12.1 What is cached

| Key pattern | Contents | TTL | Why this granularity |
|---|---|---|---|
| `cms:page:{site}:{locale}:{path}` | Fully composed page payload: page + sections + blocks + media + CTAs + SEO. | 24h | The whole point of the 3-query warm budget. |
| `cms:page_ids:{site}:{locale}` | `path → page_id` map. | 24h | Lets a page-level invalidation find its key without a DB read. |
| `cms:menu:{site}:{locale}:{key}` | Fully built menu tree. | 24h | Decision 9 depends on this — it is why nested sets are unnecessary. |
| `cms:block:{site}:{locale}:{key}` | Rendered global block payload. | 24h | Shared across pages; invalidated once. |
| `cms:settings:cms` | CMS-scoped `app_settings` subset. | ∞ | Mirrors the existing `CacheKey::DEFAULT_SETTINGS` pattern. |
| `cms:seo:{alias}:{id}:{locale}` | Resolved SEO payload with fallbacks applied. | 24h | Fallback resolution is non-trivial; cache the result, not the row. |
| `cms:taxonomy:{site}:{locale}:{key}` | Term tree with `usage_count`. | 6h | Filter sidebars. |
| `cms:list:{module}:{site}:{locale}:{hash}` | Paginated public listing. `hash` = filters+page+sort. | 1h | Bounded by a key registry (below) so it can be purged. |
| `cms:sitemap:{site}` | Serialised sitemap index. | 6h | Regenerated on any publish. |
| `cms:redirects:{site}` | Regex redirects only. Exact matches go straight to the `from_hash` index. | ∞ | Avoids caching a table that could grow large. |
| `cms:featured:{module}:{site}:{locale}` | Featured rails for the homepage. | 6h | The homepage's biggest query saver. |

Existing keys (`CacheKey::DEFAULT_SETTINGS`, `SITE_LANGUAGES`, …) are untouched. New keys are new
`CacheKey` cases following the enum's existing convention; the `{...}` segments are appended by a
`CacheKey::for(...$parts)` helper added to the enum, so keys are never string-concatenated at call
sites.

### 12.2 Write-event → invalidation

| Write event | Keys forgotten |
|---|---|
| `Page` saved / deleted | `cms:page:{s}:{l}:{path}`, `cms:page_ids:{s}:{l}`, `cms:sitemap:{s}`, any `cms:menu:*` containing that `page_id` |
| `Page` slug changed | above, **plus** old `cms:page:{s}:{l}:{oldPath}`, plus auto-create a `redirects` row (`source='slug_change'`) |
| `PageSection` saved / deleted / reordered | owning page's key; or all pages referencing the `block_id` if it is a block body |
| `SectionBlock` saved / deleted / reordered | resolve up to the owning page; same key |
| `Block` saved | `cms:block:{s}:{l}:{key}` + every page key holding a section with that `block_id` (resolved via `IDX page_sections_block`) |
| `Menu` / `MenuItem` saved / moved / deleted | `cms:menu:{s}:{l}:{key}` (all locales of that menu) |
| `Media` saved / deleted | every owner key found via `mediables` + the direct `*_media_id` indexes; that is why every one of those FK columns is indexed |
| `SeoMeta` saved | `cms:seo:{alias}:{id}:{l}` + the owner's page key + `cms:sitemap:{s}` |
| Content module row saved | its own page key, `cms:list:{module}:*`, `cms:featured:{module}:*`, `cms:sitemap:{s}` |
| `TaxonomyTerm` saved / attached / detached | `cms:taxonomy:{s}:{l}:{key}`, `cms:list:*` for affected modules |
| `ContentRelation` changed | both sides' page keys |
| `AppSetting` saved (CMS scope) | `cms:settings:cms`, and `CacheKey::DEFAULT_SETTINGS` via the existing path |
| `Redirect` saved | `cms:redirects:{s}` |
| Janitor publishes/expires a row | that row's page key + `cms:list:*` + `cms:sitemap:{s}` |

Invalidation lives in the **service**, called explicitly after the write — exactly as
`LanguageController` does `Cache::forget(CacheKey::SITE_LANGUAGES->value)` after
`$this->service->save()`. Model observers are deliberately avoided for cache work: they fire
inside `handleBulkAction()`'s `lazyById()` loop and would issue N invalidations per bulk operation.
Services invalidate once, after the loop.

### 12.3 The `cms:list:*` wildcard problem

`Cache::forget()` cannot glob. Two ways out: cache tags (Redis/Memcached only), or a **key
registry** — a set at `cms:keys:list:{module}` holding every live list key, read and forgotten on
invalidation, then cleared. **Recommendation: the key registry.** It works on every store,
including the current `database` default, and tag flushes on Redis are O(n) over the tag set
anyway, so there is no performance argument for tags. One small helper in a `CacheInvalidation`
trait, used by every list-caching service.

### 12.4 `CACHE_STORE` — is Redis required?

`config/cache.php:18` defaults to `database`. The `database` store has **no tag support**;
`Cache::tags()` throws `BadMethodCallException` on it.

**Recommendation: strongly recommend Redis, but do not require it — and never use tags.** Horizon
already mandates Redis for queues, so the dependency exists in the stack and `CACHE_STORE=redis`
is the correct production setting; the `database` store also hammers the same MySQL instance the
page render is trying to avoid touching. But the *design* deliberately uses flat keys plus the
§12.3 registry so correctness never depends on the store. That means local development on
`database` (or `array` in tests) behaves identically, just slower. Making tags load-bearing would
create a silent class of bug where cache invalidation works in production and no-ops in CI.

Set `CACHE_STORE=redis` in `.env.example` with a comment. Do not add `Cache::tags()` anywhere.

### 12.5 The home page query budget (decision 11)

**Cold (≤12):** (1) settings, (2) languages, (3) page by path, (4) sections for page,
(5) section blocks for all sections, (6) media for `media_id` columns, (7) media via `mediables`,
(8) CTAs, (9) SEO meta, (10) `content_relations` + featured entities, (11) header menu tree,
(12) footer menu tree. **11–12 is achievable only if every one-to-many is a single batched
eager-load** — `with(['sections.blocks.media', 'sections.cta', 'seo'])`, never a lazy access
inside a Blade/Inertia loop.

**Warm (≤3):** (1) the page payload key, (2) header menu key, (3) footer menu key. Settings and
languages come from their existing infinite-TTL keys and do not count as queries.

Verification is `DB::listen` in a local middleware that logs the count per request, plus Debugbar.
Per the task instruction, no test is written for this; the budget is asserted manually until a
test phase is explicitly requested.

---

## 13. Backend layering plan

Every domain maps onto the `LanguageController`/`LanguageService` shape:

- Controller: constructor-promoted service, `$this->modelProperty = $this->getCommonProperty(
  resourcePagePrefix: 'X', routePrefix: 'backend.x')`, `$this->authorizeResource(X::class)`,
  `use ModelAction, ModelProperty;`.
- Index: `formatResourceResponse($this->service->getX(), XResource::class)` →
  `AppResponse::asSuccess()->withComponent($this->modelProperty['pagePrefix'].'Index', [...])->build()`.
- Writes: `$this->service->save($request)` → `Cache::forget(...)` → `AppResponse::asSuccess()
  ->withMessage('...')->build()`.
- Models: `HasUuid` + `UsesUuidRouting` + `Filterable` + `SoftDeletes`. **Never `BaseModel`** (§14.1).
- Resources: extend `BaseResource`, `...$this->getBaseAttributes($request)` first.

| Domain | Service(s) | Form Requests | Resources | Policies | Enums | CacheKeys | Seeders | Config-driven CRUD? |
|---|---|---|---|---|---|---|---|---|
| Pages | `PageService`, `PageTreeService` | `PageSaveRequest`, `PageStatusRequest`, `PageMoveRequest` | `PageResource`, `PageTreeResource` | `PagePolicy` | `ContentStatus`, `PageType`, `LinkType` | `CMS_PAGE`, `CMS_PAGE_IDS` | `PagePermissionSeeder`, `CorePagesSeeder` | **Partly.** List/filter/bulk yes. The tree reorder and the section editor are bespoke. |
| Sections | `PageSectionService`, `SectionTypeRegistry` | `SectionSaveRequest` (dynamic, §5), `SectionReorderRequest` | `PageSectionResource`, `SectionTypeResource` | `PageSectionPolicy` | — | — | `SectionTypeSeeder` (defaults only) | **No.** The dynamic registry-driven form is the single biggest bespoke build. |
| Blocks (repeaters) | `SectionBlockService` | `SectionBlockSaveRequest`, `SectionBlockReorderRequest` | `SectionBlockResource` | inherits `PageSectionPolicy` | `BlockType` | — | — | **No.** Inline repeater UI. |
| Global blocks | `BlockService` | `BlockSaveRequest` | `BlockResource` | `BlockPolicy` | — | `CMS_BLOCK` | `GlobalBlocksSeeder` | **Yes** for the list; section editor reused. |
| Menus | `MenuService`, `MenuTreeService` | `MenuSaveRequest`, `MenuItemSaveRequest`, `MenuItemMoveRequest` | `MenuResource`, `MenuItemResource` | `MenuPolicy`, `MenuItemPolicy` | `MenuLinkType`, `MenuVisibility` | `CMS_MENU` | `CoreMenusSeeder` | **Partly.** Menu list yes; the drag-drop tree is bespoke. |
| Media | `MediaService` (`use Fileable;`), `MediaFolderService` | `MediaUploadRequest`, `MediaUpdateRequest`, `MediaMoveRequest`, `FolderSaveRequest` | `MediaResource`, `MediaFolderResource` | `MediaPolicy`, `MediaFolderPolicy` | `MediaType`, `MediaCollection` | — | — | **No.** The library (grid, drag-upload, picker modal) is bespoke; it is reused by every other module, so build it once and well. |
| SEO | `SeoService`, `SchemaGeneratorService`, `SitemapService` | `SeoMetaSaveRequest` | `SeoMetaResource` | `SeoMetaPolicy` | `SchemaType`, `TwitterCardType` | `CMS_SEO`, `CMS_SITEMAP` | `SeoDefaultsSeeder` | **No.** A shared SEO panel component embedded in every editor. |
| Taxonomy | `TaxonomyService`, `TaxonomyTermService` | `TaxonomySaveRequest`, `TermSaveRequest` | `TaxonomyResource`, `TaxonomyTermResource` | `TaxonomyPolicy`, `TaxonomyTermPolicy` | — | `CMS_TAXONOMY` | `CoreTaxonomiesSeeder` | **Yes**, near-total. Closest analogue to `useRoleConfig.tsx`. |
| Relations | `ContentRelationService` | `RelationSyncRequest` | `ContentRelationResource` | inherits owner policy | `RelationType` | — | — | **No.** A shared relation-picker component. |
| Services / Case studies / Posts / Industries / Technologies | one service each, all extending a shared `ContentModuleService` abstract | `<X>SaveRequest`, `<X>StatusRequest` | `<X>Resource`, `<X>ListResource` | `<X>Policy` | `ServiceType`, `CaseStudyDepth`, `PostType`, `ProficiencyLevel` | `CMS_LIST`, `CMS_FEATURED` | `<X>PermissionSeeder` | **Yes**, ~80%. List/filter/bulk/status from config; only the section editor + SEO panel are shared bespoke components. |
| Team / Testimonials / FAQs / Accolades / Clients / Locations | one service each on `ContentModuleService` | `<X>SaveRequest` | `<X>Resource` | `<X>Policy` | `AccoladeType`, `EmploymentType`, `WorkMode` | — | `<X>PermissionSeeder` | **Yes**, near-total. These are flat CRUD — exactly what `useXConfig.tsx` was built for. |
| Careers | `JobOpeningService` | `JobOpeningSaveRequest` | `JobOpeningResource` | `JobOpeningPolicy` | `EmploymentType`, `WorkMode`, `SalaryPeriod` | — | `CareersPermissionSeeder` | **Yes** for list; salary/schema fields need a custom form group. |
| Forms | `FormSubmissionService`, `NewsletterService` | `FormSubmitRequest` (public), `SubmissionUpdateRequest` | `FormSubmissionResource`, `SubscriberResource` | `FormSubmissionPolicy`, `NewsletterPolicy` | `FormKey`, `SubmissionStatus`, `SubscribeStatus` | — | `FormsPermissionSeeder` | **Yes** for the inbox list; the detail view (payload rendering) is a small bespoke component. |
| Redirects | `RedirectService` | `RedirectSaveRequest`, `RedirectImportRequest` | `RedirectResource` | `RedirectPolicy` | `RedirectSource` | `CMS_REDIRECTS` | `SystemPermissionSeeder` (extend) | **Yes**, totally. Pure flat CRUD. |
| Revisions / Preview | `RevisionService`, `PreviewService` | `RevisionRestoreRequest`, `PreviewIssueRequest` | `RevisionResource` | `RevisionPolicy` | — | — | — | **No.** History drawer + diff view. |

**Repository layer: not introduced** (decision 12). `LanguageService` calls
`Language::search([...])->latest()->get()` directly, and `Filterable` already provides the reusable
query surface (`search`, `filter`, `date`, `booleanFilters`, `sortDefault`, `fetch`, `recycle`).
A repository on top of that would be a pass-through class per model with no behaviour of its own —
16 files of ceremony. If a query genuinely needs sharing across services, it becomes a **scope on
the model**, which is where `Filterable`'s own scopes live. Consistent with the codebase, and
consistent with itself.

**Shared abstract `ContentModuleService`** is the one addition to the layering. It holds the
publish/schedule transitions, slug generation with collision handling, redirect creation on slug
change, revision snapshotting, and cache invalidation — behaviour that is genuinely identical
across ten modules. It is an abstract base for services, not a repository: it holds domain
behaviour, not query plumbing. That distinction is why one is justified and the other is not.

---

## 14. Permissions

New CMS modules slot into the existing pattern with no change to `BasePermissionSeeder`.

**1. New data classes** in `app/Data/Seeder/`, matching `AdminUserPermissions::getAll()`'s
exact nested shape (`module → label, description, permissions → resource → label, permissions →
action => label`):

- `ContentPermissions.php` — module key `content`: resources `page`, `section`, `block`, `menu`,
  `cta`, `redirect`.
- `MediaPermissions.php` — module key `media`: resources `media`, `folder`.
- `CatalogPermissions.php` — module key `catalog`: resources `service`, `case-study`, `industry`,
  `technology`, `client`, `accolade`.
- `EditorialPermissions.php` — module key `editorial`: resources `post`, `faq`, `testimonial`,
  `team-member`, `taxonomy`.
- `CareerPermissions.php` — module key `career`: resources `job-opening`, `location`.
- `LeadPermissions.php` — module key `lead`: resources `submission`, `subscriber`.
- `SeoPermissions.php` — module key `seo`: resources `seo-meta`, `sitemap`, `schema`.

**2. Spread into `Permissions::getAll()`** — the only edit to an existing file, one line each,
mirroring how `NotificationPermissions::getAll()` is already spread.

**3. One seeder class per module** in `database/seeders/Permissions/`, each a four-line subclass
of `BasePermissionSeeder` returning its module name — identical to
`AdminModulePermissionSeeder.php`.

**4. Register them in `PermissionSeeder`**, which `DatabaseSeeder` already calls.

**Action vocabulary.** `BasePermissionSeeder::createModulePermissions()` names permissions
`{resourceKey}.{action}` — so `page.view`, `page.create`, `page.edit`, `page.delete`. Policies
then read `$user->hasPermissionTo('page.view')`, exactly as `LanguagePolicy` does. Beyond the CRUD
four, the CMS needs:

| Action | Meaning | Policy method it backs |
|---|---|---|
| `publish` | Move to `published`/`scheduled`. **Separate from `edit`** — a junior editor may draft but not publish. This is the core editorial-workflow control and the reason `publish_status` is a distinct column. | `PagePolicy::publish()` |
| `restore` / `force-delete` | Trash operations. Already expected by `ModelAction::authorizeBulkAction()`, which maps `RESTORE`→`restore` and `PERMANENT_DELETE`→`forceDelete`. | `restore()`, `forceDelete()` |
| `reorder` | Drag-drop sort. | `reorder()` |
| `preview` | Issue a preview token. | `preview()` |
| `translate` | Edit non-default locales. Mirrors the existing `language.translate` action. | `translate()` |
| `manage-seo` | Edit the SEO panel. Often a different person. | `SeoMetaPolicy::update()` |

**`ModelAction::authorizeBulkAction()` gap.** It `match`es on `ACTIVE`, `INACTIVE`, `DELETE`,
`PERMANENT_DELETE`, `RESTORE` and throws on anything else. There is no `publish` bulk action, and
adding one requires editing that `match`. **Recommendation: do not add it.** Bulk-publishing is a
genuinely dangerous operation and the safeguard of "one at a time, through the policy" is worth
more than the convenience. If it is later demanded, it must go through a dedicated
`BulkPublishRequest` + `PageService::bulkPublish()` that validates against
`ContentStatus::getValues()` — **not** through `handleBulkAction()`, whose validation is
hard-wired to `Status::getValues()`.

**Roles** in `app/Data/Seeder/Roles.php` gain: `Content Editor` (view/create/edit, no publish,
no delete), `Content Manager` (all content + publish), `SEO Manager` (view + `manage-seo` across
modules), `Media Manager` (media module only). Super admin is unaffected —
`isSuperAdminUser()` short-circuits.

---

## 15. Implementation roadmap

Each phase is independently shippable and leaves the app in a working state.

### Phase 0 — Morph map foundation *(blocks everything)*
Register the non-enforcing `Relation::morphMap()`; add `config/morph-map.php` with the alias list
and per-column permitted-alias sets; add the `files` backfill migration (§4.1 step 2). Add
`ContentStatus` and the other new enums. Add the `CacheKey` cases and the `CacheKey::for()` helper.
**Dependencies:** none. **Ships:** nothing user-visible; it is the substrate.

### Phase 1 — Core CMS spine
Tables: `media_folders`, `media`, `mediables`, `pages`, `page_sections`, `section_blocks`,
`blocks`, `ctas`, `menus`, `menu_items`, `seo_meta`, `redirects`. **12 tables.**
Plus: `SectionTypeRegistry` with 4–5 starter section types, the media library UI, the section
editor, the menu tree editor, the SEO panel, `PageService`/`PageSectionService`/`MediaService`/
`MenuService`/`SeoService`/`RedirectService`, all policies, `ContentPermissions` +
`MediaPermissions` + `SeoPermissions`, the `->published()` scope, the janitor job, page caching.
**Dependencies:** Phase 0. **Ships:** an admin can build and publish a real page end to end. This
is the whole product in miniature; everything after it is content types.

### Phase 2 — Publishing polish
Tables: `content_revisions`, `preview_tokens`. **2 tables.**
Plus: revision history drawer, restore, preview links, scheduled publishing UI, sitemap
generation, JSON-LD generator.
**Dependencies:** Phase 1. **Ships:** editorial confidence — nothing is unrecoverable and nothing
goes live unseen.

### Phase 3 — Taxonomy and the primary content modules
Tables: `taxonomies`, `taxonomy_terms`, `taxonomables`, `content_relations`, `services`,
`case_studies`, `clients`, `industries`, `technologies`. **9 tables.**
Plus: `CatalogPermissions`, the relation picker, config-driven CRUD screens for each,
listing/detail public routes.
**Dependencies:** Phase 1 (sections, media, SEO). **Ships:** the services and work sections of the
site.

### Phase 4 — Editorial and social proof
Tables: `posts`, `faqs`, `testimonials`, `team_members`, `accolades`. **5 tables.**
Plus: `EditorialPermissions`, blog archive with taxonomy filtering, author bylines.
**Dependencies:** Phase 3 (taxonomy, relations). **Ships:** insights/blog, about, trust sections.

### Phase 5 — Careers, leads, and translation overlay
Tables: `locations`, `job_openings`, `form_submissions`, `newsletter_subscribers`,
`content_translations`. **5 tables.**
Plus: `CareerPermissions`, `LeadPermissions`, the submissions inbox, notification wiring onto the
existing `notification_templates` infrastructure, double opt-in, and the non-routable translation
overlay with the export/import job.
**Dependencies:** Phase 1 (menus for social links), Phase 4 (posts for gated downloads).
**Ships:** careers, contact, and full multilingual.

### Phase 6 — Hardening
Enforce the morph map (§4.1 step 3). Query-budget verification middleware. Cache warming on
publish. Redirect import. Media derivative regeneration command. `cms:validate-registry` in CI.
The `sites` table if multi-site is ever confirmed (the `site_id` columns are already there).

**Running total: 12 + 2 + 9 + 5 + 5 = 33 tables.**

---

## 16. Migration ordering hazards, risks, v1 simplifications

### 16.1 Ordering hazards

1. **`media` before everything that FKs to it.** `page_sections`, `section_blocks`, `menu_items`,
   `seo_meta`, `taxonomy_terms`, and every content module have `media_id` FKs. `media_folders` →
   `media` → `mediables` must be the first three timestamps in Phase 1.
2. **`ctas` before `page_sections`** (`cta_id`, `secondary_cta_id`), but **`ctas.page_id` FKs to
   `pages`**. Circular at the table level. Resolve by creating `ctas` without `page_id`, then
   adding it in a later `Schema::table()` migration after `pages` exists. Do **not** try to order
   around it — one of the two FKs must be added separately.
3. **`pages` before `page_sections` before `section_blocks`.** Straight chain.
4. **`blocks` before `page_sections`** (`block_id`), and `page_sections.page_id` is nullable
   precisely so a block body can exist without a page. Both FKs must be nullable at creation.
5. **`taxonomies` before `taxonomy_terms` before `taxonomables`.**
6. **`clients` and `industries` before `case_studies`** (`client_id`) — a Phase 3 internal
   ordering constraint that is easy to miss because `clients` feels like a minor table.
7. **`locations` before `team_members` and `job_openings`.** `team_members` is Phase 4,
   `locations` is Phase 5 as listed — **this is an inversion.** Fix: move `locations` into Phase 4
   ahead of `team_members`, or make `team_members.location_id` a Phase 5 `Schema::table()`
   addition. Recommend moving `locations` to Phase 4; it is a 20-column standalone table with no
   dependencies.
8. **`team_members` before `posts`** (`author_id`) — but `posts` is listed before `team_members`
   in Phase 4's table list. Order the migrations `team_members` → `posts` within the phase.
9. **`content_revisions` before `preview_tokens`** (`revision_id` FK).
10. **The `files` backfill (Phase 0) must precede every new table.** Not because of a dependency,
    but so a failure aborts before any schema is created (§4.1).

### 16.2 Risks

- **`enum` columns are painful to extend in MySQL.** Adding a `ContentStatus` case is an
  `ALTER TABLE ... MODIFY` that locks and rebuilds the table on older MySQL. The codebase already
  chose `enum` everywhere (`create_users_table.php`, `create_languages_table.php`), so consistency
  wins for v1 — but `ContentStatus` is the most likely enum to grow (`pending_review`). Accept the
  risk; the tables will be small for years. If a `pending_review` state is on the roadmap at all,
  add it now rather than later.
- **`section_blocks` unbounded growth.** A logo wall with 40 clients on 30 pages is 1200 rows.
  Fine. The failure mode is an editor pasting a 500-row table as blocks. Cap `blockTypes()` with
  `max` in the registry and enforce it in `SectionSaveRequest`.
- **JSON `data` drift.** A section type's registry fields change; existing rows hold the old keys.
  Mitigation: the registry declares a `version` and a `migrate(array $data): array` hook run
  lazily on read. Not built in Phase 1, but the `version` key must exist in `data` from day one —
  retrofitting it means guessing.
- **Morph-map enforcement flip (Phase 6) is the highest-risk single change** in the plan. Gate it
  on the verification query and ship it alone.
- **Slug uniqueness across `pages.path` and content module routes.** `/services/cloud` (a page)
  and `/services/cloud` (a service detail route) can collide. Resolve by reserving route prefixes:
  a `RESERVED_PATH_PREFIXES` constant checked in `PageSaveRequest`. Cheap, and a nightmare if
  discovered after launch.
- **`usage_count` denormalization on `taxonomy_terms`** can drift if attachments are ever written
  outside `TaxonomyService`. Add a `cms:recount-taxonomy` command from the start.
- **The `page_sections` dual-owner invariant** (`page_id` XOR `block_id`) is service-enforced, not
  DB-enforced. A bad migration or a tinker session can violate it. Add it to
  `cms:validate-registry`'s checks.

### 16.3 v1 simplifications I recommend

- **No `sites` table.** `site_id` defaults to 1 everywhere. Adding the table later is a migration
  and a scope; adding the column later is 33 migrations. Correct as established.
- **No A/B testing, no personalisation, no content workflows beyond draft→published.** Each would
  add 2–4 tables and a state machine.
- **No field-level revision diffing in Phase 2** — whole-payload snapshot and restore only. Diff
  UI is a large frontend build for modest value.
- **`content_translations` deferred to Phase 5** (established). Routable content is multilingual
  from Phase 1 via row-per-locale; non-routable content is single-locale until then. State this to
  stakeholders explicitly — it is the most likely source of a surprised conversation.
- **No full-text search index.** `Filterable::scopeSearch()`'s `LIKE '%term%'` cannot use an index
  and will degrade past ~50k rows. It will not reach that in v1. When it does, the answer is
  MySQL `FULLTEXT` or Meilisearch, not a schema change.
- **No per-section caching**, only per-page. Finer granularity is more invalidation surface for
  less benefit.
- **One `settings` JSON column per table, not two.** Resist adding `meta`, `options`, `config`
  alongside it. One bag, registry-validated.

---

## 17. Known issues where this schema intersects them

### 17.1 `BaseModel::getRouteKeyName()` returns `'uid'`

**Verified:** no `uid` column exists in any of the 11 migrations. `BaseModel`
(`app/Models/BaseModel.php`) is a four-line abstract whose only behaviour is returning a route key
that matches no column. Any route-bound model extending it produces `SQLSTATE[42S22]: Column not
found` on every implicit binding — the bug is latent only because nothing currently extends it.

**This schema's response:** **no new model extends `BaseModel`.** Every route-bound CMS model uses
`use HasUuid, UsesUuidRouting;` — `HasUuid::bootHasUuid()` fills `uuid` on `creating`, and
`UsesUuidRouting::getRouteKeyName()` returns `'uuid'`, which matches the `CHAR(36) UNIQUE` column
on every table above.

**Recommended fix while nearby:** change `BaseModel::getRouteKeyName()` to return `'uuid'`, or
delete `BaseModel` entirely. Deleting is better — with `HasUuid` + `UsesUuidRouting` existing, an
abstract base whose sole purpose is a route key is redundant, and its continued existence is an
invitation to extend it. **Note the docblock in `UsesUuidRouting` also says `uid`** ("Use `uid` for
Laravel route model binding") while the code returns `'uuid'` — fix the comment at the same time,
since it is almost certainly where the `BaseModel` bug came from.

### 17.2 `Filterable::scopeRecycle()` calls `onlyTrashed()` with zero `SoftDeletes` models

**Verified:** `grep -rln "SoftDeletes" app/Models/` returns nothing. `scopeRecycle()`
(`app/Traits/Common/Filterable.php`) calls `$query->onlyTrashed()` when the request has
`is_trash`. On a model without `SoftDeletes`, that is `BadMethodCallException: Call to undefined
method ... onlyTrashed()`. The scope is currently **dead code that would throw** — and it is
reachable today: `Language` uses `Filterable`, so `GET /backend/languages?is_trash=1` throws a 500.
It has simply never been called.

Worse, `ModelAction::handleBulkAction()` unconditionally calls `->recycle()` in its
`BulkActionType::STATUS` branch. That path is live for every bulk status change; it only survives
because `recycle()` is a no-op when `is_trash` is absent from the request. A request that carries
both `is_trash` and a bulk status action would 500 today.

**This schema's response:** every content table has `deleted_at` and every content model uses
`SoftDeletes`. That **activates** `scopeRecycle()` and the `RESTORE`/`PERMANENT_DELETE` branches of
`handleBulkAction()` for the entire CMS — a genuine feature (trash + restore) that the existing
traits already implement and that has never been exercised.

**Two consequences to handle deliberately:**
1. Every content model's index query must decide whether to include trashed rows. `Filterable`'s
   composition (`Model::search([...])->recycle()->fetch()`) handles it, so services must call
   `->recycle()` — following the `isTrashRequest()` helper that already exists in
   `app/Http/Helpers/helpers.php`.
2. **`Language` still has no `SoftDeletes`.** Adding `deleted_at` to the CMS tables does not fix
   the pre-existing `Language` bug. Recommended fix while nearby: guard `scopeRecycle()` with
   `method_exists($this, 'bootSoftDeletes')` (or `in_array(SoftDeletes::class, class_uses_recursive($this))`)
   so it degrades to a no-op instead of throwing. Two lines, removes a live 500.

### 17.3 `PDO::MYSQL_ATTR_SSL_CA` deprecated in PHP 8.5, with ~27 migrations incoming

`config/database.php` lines 59 and 79 reference `PDO::MYSQL_ATTR_SSL_CA` inside the `mysql` and
`mariadb` connection option arrays. The local runtime is PHP 8.5.3, where the constant is
deprecated; each evaluation emits a deprecation notice.

**Why it intersects this work:** the options array is evaluated when the connection is
established, not per query — so it is one notice per process, not per migration. But
`php artisan migrate` running ~27 new migrations with deprecations surfacing makes real migration
errors hard to spot in the output, and CI configured with `--display-deprecations` or
`error_reporting = E_ALL` will fail the run outright.

**Fix before Phase 1** (it is two lines and it prevents a bad first migration experience): wrap the
option in a guard so the key is only added when a CA path is actually configured, e.g.
`array_filter([...])` on the extra options, or gate on
`extension_loaded('pdo_mysql') && defined('PDO::MYSQL_ATTR_SSL_CA') && env('MYSQL_ATTR_SSL_CA')`.
The environment does not set a CA path, so the option is contributing nothing today.

### 17.4 The `status` semantics trap — restated because it is load-bearing

Three separate pieces of shared machinery assume the column named `status` holds
`App\Enums\Common\Status`:

- `Filterable::scopeActive()` / `scopeInactive()` — `where('status', Status::ACTIVE)`.
- `ModelAction::validateBulkActonRequest()` — `!in_array($value, Status::getValues())` → fail.
- `ModelAction::handleBulkAction()` — `->update([BulkActionType::STATUS->value => $value])`, which
  is literally `['status' => $value]`.
- `ModelAction::getCommonFilters()` — builds the shared status filter dropdown from
  `Status::options()`.

Any table that repurposes `status` for editorial state breaks all four simultaneously, and the
failure is silent: `handleBulkAction()` uses a mass `update()`, which bypasses model events and
enum casts entirely. On a MySQL connection in non-strict mode, writing `'active'` to an
`ENUM('draft','scheduled','published','archived')` column coerces to `''` rather than erroring.
That is a content-destroying bug with no exception and no log line.

Hence: `status` (Status) everywhere, `publish_status` (ContentStatus) on content,
`submission_status` on forms, `subscribe_status` on subscribers. **Never name an editorial or
workflow column `status`.** This is the single most important convention in the document.

**One additional guard worth adding:** confirm `DB_STRICT_MODE`/`'strict' => true` in
`config/database.php`'s mysql connection. With strict mode on, the coercion above becomes a real
error instead of silent data loss — cheap insurance for the whole class of problem.
