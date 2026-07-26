---
name: build-section
description: End-to-end workflow for adding a new CMS-driven section or page to the QTECH agency website — content model, migration, backend, admin editing, public component, tests, review. Use whenever building a new site section (hero, services, testimonials, case studies, pricing, FAQ, contact, etc.) or a new public page.
---

# Building a CMS-driven section

Follow this in order. Do not skip to code.

## 1. Analyse

State what the section shows, what an admin must be able to change, and how it behaves with
no data, partial data, and a lot of data. Write this down before touching files.

## 2. Explore first

Never assume. Check whether a similar section, model, component, or admin form already
exists. Read `app/Http/Services/Backend/LanguageService.php` and
`resources/js/Config/crud/useRoleConfig.tsx` if you haven't this session — they define the
conventions you must match.

## 3. Content model

Design the schema, then apply the test: walk every rendered element and confirm an admin can
edit it. Every heading, image, icon, button label, link, and number. If anything would be
hardcoded, redesign.

Content tables always get: `uuid`, `slug` where addressable, `status`, `sort_order`,
`published_at`, soft deletes, timestamps, SEO fields where the thing has a URL, and indexes
on whatever gets filtered or sorted. Media goes through the `File` model and `Fileable`
trait, never a string column.

For anything non-trivial, delegate to the `cms-architect` agent.

## 4. Backend

Migration → Model (`HasUuid` + `UsesUuidRouting`) → Enums for status/type → Policy →
permission seeder entry → Form Request → Service → Resource extending `BaseResource` →
thin Controller returning via `AppResponse` → routes in `routes/backend.php` and the public
route in `routes/web.php`.

Eager-load relations. Cache what's read on every page load and `Cache::forget` it on write.

The `backend-architect` agent handles this.

## 5. Admin editing

Add the CRUD config to `resources/js/Config/crud/`, the form component, and the page under
`Pages/Backend/`. Support enable/disable, draft/publish, scheduled publishing, and reordering.
An editor who has never seen the code must be able to operate it.

## 6. Public component

Build it in `resources/js/Components/Frontend/` as a reusable, prop-driven component with
zero hardcoded content. Handle loading, empty, missing-image, and error states. Mobile-first,
correct from 320px to 1920px. Semantic and accessible. Animate with `motion`, subtly, honouring
`prefers-reduced-motion`. Reserve image dimensions so nothing shifts.

The `frontend-builder` agent handles this.

## 7. SEO

Meta title, description, canonical, Open Graph, Twitter card, and the right JSON-LD type
for the content.

## 8. Verify

```bash
./vendor/bin/pint
php artisan test
npx tsc --noEmit
npm run build
```

All four must pass. Then check the query count for the page — if a relation is accessed in a
loop, you have an N+1 and it is not done.

## 9. Review

Run the `quality-reviewer` agent on the diff. Fix what it finds. For public pages, also run
`seo-accessibility-auditor`.

## 10. Report

Say what was built, which fields are CMS-editable, what the tests cover, and anything you
deferred. Be specific about what you did not do.
