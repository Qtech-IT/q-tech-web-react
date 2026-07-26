# QTECH — Enterprise IT Agency Website

Premium, fully CMS-driven agency website. Design inspiration only from bairesdev.com —
never copy their markup, CSS, assets, or copy. Build original implementations.

## Stack

Laravel 12 · PHP 8.4+ (local runtime is 8.5.3) · MySQL · Inertia 2 · React 19 · TypeScript ·
Tailwind 4 · shadcn/ui + Radix · Framer Motion (`motion`) · Vite 7 · Spatie Permission · Horizon

## Current state

The repo is an **admin panel skeleton only**. There is no public-facing website yet.

- 176 routes, all under `/backend`: auth + 2FA, admin users, roles/permissions,
  notification templates & logs, languages, app settings, queue/failed jobs, cache, backups.
- 11 migrations, **none of them content tables**. No pages, sections, services,
  case studies, blog, FAQ, navigation, or SEO tables exist. The CMS is unbuilt.
- `routes/web.php` has no real routes. `Components/Frontend/` holds one leftover file.
- A previous crypto/trading/lending product was deliberately stripped out. If you find
  references to trade/crypto/loan/kyc/wallet, they are dead code — remove them, don't extend them.

## Architecture rules

Controllers stay thin. Business logic lives in Services. Validation lives in Form Requests.
Output goes through API Resources. No business logic in controllers, ever.

Follow SOLID, DRY, KISS. Never hardcode content — everything must be editable from the admin.

### Backend conventions (follow these exactly)

Read [app/Http/Controllers/Backend/LanguageController.php](app/Http/Controllers/Backend/LanguageController.php)
and [app/Http/Services/Backend/LanguageService.php](app/Http/Services/Backend/LanguageService.php)
as the reference implementation before writing any new backend feature.

- **Controllers** inject their service via constructor promotion, call
  `$this->getCommonProperty(resourcePagePrefix: 'Foo', routePrefix: 'backend.foos')`
  into `$this->modelProperty`, and call `$this->authorizeResource(Foo::class)`.
- **Responses** always use the `AppResponse` facade builder, never `Inertia::render` directly:
  - Page: `AppResponse::asSuccess()->withComponent($this->modelProperty['pagePrefix'].'Index', [...])->build()`
  - Action: `AppResponse::asSuccess()->withMessage('Saved successfully')->build()`
- **Resources** extend `BaseResource` and spread `...$this->getBaseAttributes($request)` first.
  That supplies id, uuid, status, formatted timestamps, and audit user metadata.
- **Collections** are shaped with the `formatResourceResponse($data, FooResource::class)` helper.
- **Models** that are route-bound use `HasUuid` + `UsesUuidRouting` (binds on the `uuid` column).
  Note: `BaseModel::getRouteKeyName()` returns `'uid'`, which matches no column — it is a bug.
  Don't extend `BaseModel` for route-bound models; use the two traits instead.
- **Enums** back every status/type column. Migrations use `$table->enum('status', Status::getValues())`.
- **Cache** must be invalidated explicitly after writes via `Cache::forget(CacheKey::SOME_KEY->value)`.
- **Strings** shown to users go through `translate('...')`.
- Useful traits in `app/Traits/Common/`: `Filterable` (adds `Model::search([...])`),
  `Fileable`, `ModelAction` (`changeStatus`), `ModelProperty`.

### Frontend conventions

- Pages in `resources/js/Pages/Backend/<Feature>/Index.tsx` are **thin** — they render a
  Wrapper component from `Components/Feature/Backend/` and pass props straight through.
- Admin CRUD screens are **config-driven**. Add a `use<Feature>Config.tsx` to
  `resources/js/Config/crud/` returning a `CrudConfig` (routes, zod `formValidationRules`,
  columns, display modes). See [useRoleConfig.tsx](resources/js/Config/crud/useRoleConfig.tsx).
  Prefer extending this pattern over hand-rolling new admin tables.
- Import via the `@/` alias. Translate UI strings with `const { t } = useTranslations()`.
- Use existing `Components/UI/` primitives before adding new ones.

## CMS requirement

Every section of every public page must be editable with no code change: text, images,
buttons, stats, icons, testimonials, FAQs, nav items, footer links, social links, SEO fields, CTAs.

Sections need: enable/disable, publish/draft, scheduled publishing, sort order, rich text,
multiple images, video, CTA management, SEO fields, slug, preview. Schema should be
translation-ready and version-ready from day one.

Public components must handle loading, empty, missing-image, missing-content, and error states.

## Quality gates

Run before calling any feature done:

```bash
./vendor/bin/pint            # PHP formatting
php artisan test             # Pest/PHPUnit
npx tsc --noEmit             # TypeScript
npm run build                # Vite build must pass
```

Targets: Lighthouse Performance ≥95, Accessibility 100, Best Practices 100, SEO 100.
WCAG AA. Mobile-first, 320px → 1920px, no overflow, no layout shift.
No N+1 queries — always eager-load. Every public page needs meta tags, Open Graph,
Twitter cards, canonical URL, and JSON-LD schema.

## Known issues (fix when touching nearby code)

- `/extract-translations` in [routes/web.php](routes/web.php) is **public, unauthenticated,
  and writes files to disk**. Guard it to `local` or move it to an Artisan command.
- 53 `.DS_Store` files are tracked in git. Needs `git rm -r --cached '*.DS_Store'`.
- `config/database.php` lines 59 and 79 use `PDO::MYSQL_ATTR_SSL_CA`, deprecated in PHP 8.5.
- `package.json` has React/Inertia/Vite/TypeScript under `devDependencies` — inverted,
  breaks `npm ci --production`.
- Three rich-text editors are installed (Lexical, Quill, react-quill-new) and two animation
  libraries (GSAP, Motion). Standardise on **Lexical** and **Motion**; remove the rest.

## Never

Commit secrets or `.env`. Copy assets or code from bairesdev.com. Hardcode user-facing
content. Put business logic in a controller. Leave placeholder or temporary code.
Ship a component that can't survive missing CMS data.
