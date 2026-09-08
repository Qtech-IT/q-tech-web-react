---
name: build-section
description: Build one production-ready, fully CMS-driven public website section for the agency website. Includes analysis, content modelling, backend integration, admin editing, premium frontend implementation, SEO, performance review, and quality review. Optimised for enterprise marketing websites built with Laravel, React, Inertia, Tailwind, shadcn/ui, and Framer Motion.
---

# Building a CMS-driven section

Follow this in order. Do not skip to code.

# 0a. Pick the path first

Two modes. Choose one before doing anything else and say which you chose.

**Targeted edit** — the section type and its component already exist and the change is
scoped (new field, new setting, restyle, remove a feature, fix a defect). Do this yourself
inline. Read the section type and the component, make the edits, then go straight to §8
Verify and run ONE review pass over `git diff`. Do not spawn build agents; do not re-run
§§3–5. Most requests are this.

**Full build** — the section does not exist yet. Run the whole pipeline below.

Spawning a `backend-architect` and a `frontend-builder` to edit two files you have already
read costs several times what editing them yourself costs and adds no accuracy. An agent is
worth it when it must explore context you do not already hold. If you have read the file,
you edit the file.

# 0b. Content before code

A section renders nothing without a row to render. Before building anything, confirm — by
querying, not by assuming — that a published `Page` exists for the target route and that it
has a published `page_sections` row of the right type.

```bash
docker exec qtech_web_app php artisan tinker --execute="dump(App\Models\Page::where('is_homepage',true)->exists());"
```

`Publishable::scopePublished` requires `status = active`, a publicly-visible
`publish_status`, AND a non-null `published_at` in the past. A row missing any one of those
is invisible with no error. If there is no content, write or extend a seeder as part of the
task — an unrenderable section is not a finished section.

# 0. Think First

Do not start coding immediately.

First:

- Understand the business purpose of the section.
- Understand the user journey.
- Understand how this section contributes to conversion.
- Inspect the existing project architecture.
- Identify reusable components.
- Identify reusable backend services.
- Identify reusable CMS models.
- Explain the implementation plan.

Only after planning should implementation begin.

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


# FRONTEND DESIGN PHILOSOPHY

The public website and the admin panel are two completely different products.

Never reuse the admin panel visual design.

Never reuse admin colors.

Never reuse admin spacing.

Never reuse admin typography.

Never reuse admin cards.

Never reuse admin shadows.

Never reuse admin layout.

Never reuse admin navigation.

Create a completely independent frontend design system.

The frontend must feel like a premium enterprise marketing website.

Use shadcn/ui only as the component foundation.

Create a custom visual identity on top of shadcn.

The frontend must NOT resemble the admin panel.


# DESIGN REFERENCE

Reference website:

https://www.bairesdev.com/

The reference is for:

- Layout hierarchy
- White space
- Premium feel
- Typography rhythm
- Section flow
- Navigation behaviour
- Hero composition
- Animation quality
- Hover interactions
- Micro-interactions

Never copy:

- HTML
- CSS
- Images
- Icons
- Assets
- Copyrighted text

For the Header and Hero only:

The overall composition and interaction patterns may closely resemble the reference website, but everything must be recreated from scratch using original code, original styling, and original assets so that the implementation is clearly distinguishable and does not appear to be a direct copy.

## 6. Public Component

This is a premium enterprise marketing website.

Never create a generic Tailwind layout.

Never create a CRUD-style interface.

Never resemble the admin panel.

Every section must feel handcrafted.

Design principles:

- Premium typography
- Large whitespace
- Strong visual hierarchy
- Elegant spacing
- Beautiful hover effects
- Smooth animations
- Excellent mobile experience
- Conversion-focused layout
- Accessible
- SEO friendly

Before writing JSX:

- Explain the layout.
- Explain the spacing.
- Explain the typography.
- Explain the animations.
- Explain why this design fits the section.

Use:

- React
- Inertia
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

All components must be reusable.

No hardcoded values.

No duplicated components.

No inline styles unless absolutely necessary.

The frontend-builder agent owns this implementation.

## 7. SEO

Meta title, description, canonical, Open Graph, Twitter card, and the right JSON-LD type
for the content.

## 8. Verify

### 8a. Static gates

```bash
./vendor/bin/pint --test <only the files you changed>
npx tsc --noEmit
npm run build
```

Use `--test` and name your files. A bare `./vendor/bin/pint` reformats ~175 pre-existing
files in this repo and will bury your diff — and it silently reverts unrelated
whitespace-only working-tree changes.

### 8b. Load the actual page — NOT OPTIONAL

**All three static gates pass on a site that renders a blank page.** They passed while the
homepage had no content at all, and they passed again while the hero crashed on every
render. They prove the code compiles. They prove nothing about whether anything appears.

```bash
curl -s http://localhost/ -o /tmp/page.html -w "HTTP %{http_code}\n"
grep -c "<your section's heading text>" /tmp/page.html
```

Then assert the section's real content — heading, CTA label, every repeater row — is present
in the Inertia `data-page` payload. Zero matches means it is not done, regardless of what
the gates said.

### 8c. Check the wire format against the types

`Types/cms.ts` describes what the payload *should* look like. It is hand-written and can
disagree with what Laravel actually serialises, and when it does, `tsc` cannot see it.

Nested API Resources are the known trap: `PageSectionResource` wraps `MediaResource`,
`CtaResource` and `SectionBlockResource::collection()` individually, so `blocks` arrives as
`{ data: [...] }` while the type declares a bare array. Calling `.filter` on that throws,
`SectionBoundary` swallows it, and the section renders as nothing with no console error.
`normalizeSection` in `Utils/cms.ts` handles this at the renderer boundary — if you add a
nested resource to a section payload, extend it there.

Decode the payload and inspect the real shapes:

```bash
python3 -c "import re,html,json;s=open('/tmp/page.html').read();d=json.loads(html.unescape(re.search(r'data-page=\"([^\"]+)\"',s).group(1)));print(json.dumps(d['props']['sections'],indent=1)[:2000])"
```

To test a helper against the real payload without a browser, bundle the actual source with
esbuild and run it in node — this verifies shipped code, not a reimplementation:

```bash
./node_modules/.bin/esbuild probe.ts --bundle --format=cjs --platform=node --alias:@=./resources/js --outfile=probe.cjs
```

### 8d. Queries

Check the query count for the page — if a relation is accessed in a loop, you have an N+1
and it is not done.

## 9. Review

Scale the review to the change. A targeted edit gets ONE review pass over `git diff`, with
accessibility and SEO folded into it. A full build gets the sequence below.

Give a reviewer the diff plus only the files the diff touches. "Read this 700-line component
and its collaborators in full" costs several times more and finds the same defects — the
real ones in this section were found by grepping the admin binding and by loading the page,
not by reading the renderer end to end.

Use the quality-reviewer agent.

Review:

- Architecture
- Laravel best practices
- React best practices
- Reusability
- Component composition
- Type safety
- Performance
- Accessibility
- SEO
- Responsive behaviour

Then use the seo-accessibility-auditor agent.

Finally, perform a design review.

Compare the result against:

- BairesDev
- Stripe
- Vercel
- Linear
- Framer

If the implementation feels generic, resembles an admin dashboard, or lacks premium quality, revise it before considering the task complete.

## 10. Report

Say what was built, which fields are CMS-editable, what the tests cover, and anything you
deferred. Be specific about what you did not do.

## 11. Completion Checklist

Do not consider the task complete until all are true:

- **The section was loaded in a real browser or fetched over HTTP and its content confirmed
  present.** Compiling is not rendering.
- **Seed content exists** so the section is visible on a fresh install.
- No hardcoded frontend content
- Every visible element editable from the CMS
- Responsive from 320px to 1920px
- Accessible
- SEO friendly
- Uses reusable components
- Uses existing architecture
- No duplicate code
- No admin panel styling
- Premium enterprise appearance
- Optimised performance
- Original implementation inspired by the reference
- Self-reviewed and refined