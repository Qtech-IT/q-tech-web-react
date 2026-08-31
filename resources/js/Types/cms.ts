/**
 * CMS admin types.
 *
 * These mirror `app/Http/Resources/Backend/Cms/*` exactly. When a resource
 * gains a key, add it here rather than reaching for `any` at the call site —
 * the whole point of the section registry is that the shapes are declared
 * once and every screen reads the same contract.
 */

/** `{ value, label }` — the shape every `Enum::options()` emits. */
export interface CmsOption {
  value: string | number;
  label: string;
}

/** Audit metadata spread in by `BaseResource::getBaseAttributes()`. */
export interface CmsAuditUser {
  id?: number;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

/** Everything `getBaseAttributes()` supplies on every CMS resource. */
export interface CmsBaseAttributes {
  id: number;
  uuid: string;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  created_by?: CmsAuditUser | null;
  updated_by?: CmsAuditUser | null;
}

/**
 * `modelProperty` — built by `ModelProperty::getCommonProperty()` and shipped
 * on every backend Inertia page.
 */
export interface CmsModelProperty {
  modelDisplayName?: string | null;
  modelName?: string | null;
  resourcePagePrefix?: string | null;
  routePrefix?: string | null;
  pagePrefix?: string;
}

/** Laravel's paginator envelope as `formatResourceResponse()` emits it. */
export interface CmsPaginated<T> {
  data: T[];
  meta?: {
    current_page: number;
    from: number | null;
    to: number | null;
    total: number;
    last_page: number;
    per_page?: number;
  };
  links?: unknown;
}

/* ------------------------------------------------------------------ */
/* Section type registry                                              */
/* ------------------------------------------------------------------ */

/**
 * Where one field is persisted. Mirrors `App\Enums\Cms\FieldStore`.
 *
 * This is the descriptor the whole dynamic form hangs off: `column` writes a
 * top-level attribute on the section, `data`/`settings` write a key inside the
 * matching JSON bag, and `block` is a repeater backed by `section_blocks` rows
 * rather than a value on the section at all.
 */
export type CmsFieldStore = 'column' | 'data' | 'settings' | 'block';

/**
 * A field descriptor's `type`. Union of `App\Enums\Settings\InputEnum` (which
 * the existing CRUD field renderer already handles) and the CMS-only additions
 * in `App\Enums\Cms\FieldType`.
 */
export type CmsFieldType =
  // InputEnum
  | 'text'
  | 'number'
  | 'html_text'
  | 'textarea'
  | 'file'
  | 'select'
  | 'switch'
  | 'email'
  | 'password'
  | 'hidden'
  | 'disable'
  | 'url'
  | 'boolean'
  | 'daterange'
  | 'date'
  | 'multi-select'
  // FieldType
  | 'media'
  | 'cta'
  | 'relation'
  | 'icon'
  | 'color'
  | 'repeater';

/** One entry from `SectionField::make()`. */
export interface CmsSectionField {
  name: string;
  label: string;
  type: CmsFieldType;
  store: CmsFieldStore;
  translatable: boolean;
  repeatable: boolean;
  required: boolean;
  rules: string[];
  options: CmsOption[] | string | null;
  default: unknown;
  help: string | null;
  group: string;
  /** `{ field, value }` — hide this field unless `field` currently equals `value`. */
  conditional: { field: string; value: unknown } | null;
}

/** One repeater definition from `SectionTypeContract::blockTypes()`. */
export interface CmsBlockTypeDefinition {
  label?: string;
  fields?: CmsSectionField[];
  /** Per-level sibling cap, not a per-section row total. */
  min?: number;
  max?: number;
  [key: string]: unknown;
}

/** `SectionTypeResource` — the full descriptor payload for one section type. */
export interface CmsSectionType {
  key: string;
  label: string;
  description: string;
  icon: string;
  group: string;
  fields: CmsSectionField[];
  block_types: Record<string, CmsBlockTypeDefinition>;
  relations: Record<string, unknown>;
  preview_component: string;
  defaults: {
    data: Record<string, unknown>;
    settings: Record<string, unknown>;
  };
}

/**
 * Every shape the section-type registry can arrive in.
 *
 * `SectionTypeResource::collection()` is given an array keyed by section-type
 * key, and a keyed PHP array becomes a JSON object — so the record forms are
 * what production actually sends. Always read it through `unwrapList()`.
 */
export type CmsSectionTypesProp =
  | CmsSectionType[]
  | Record<string, CmsSectionType>
  | { data: CmsSectionType[] | Record<string, CmsSectionType> };

/** `SectionTypeRegistry::grouped()` — the section picker's menu. */
export type CmsSectionTypeGroups = Record<
  string,
  Array<{ key: string; label: string; description: string; icon: string }>
>;

/* ------------------------------------------------------------------ */
/* Media                                                              */
/* ------------------------------------------------------------------ */

export interface CmsMedia extends CmsBaseAttributes {
  folder_id: number | null;
  folder?: { uuid: string; name: string; path: string } | null;
  disk: string;
  path: string;
  url: string;
  file_name: string;
  original_name: string;
  mime_type: string;
  extension: string;
  media_type: string;
  size: number;
  size_human: string;
  /** Present so the consumer can reserve the box and avoid layout shift. */
  width: number | null;
  height: number | null;
  duration: number | null;
  alt_text: string | null;
  caption: string | null;
  title: string | null;
  description: string | null;
  credit: string | null;
  focal_x: number | null;
  focal_y: number | null;
  blurhash: string | null;
  conversions: Record<string, unknown> | null;
  /** Pivot-only; present when loaded through `mediables`. */
  collection?: string | null;
  sort_order?: number | null;
}

export interface CmsMediaFolder extends CmsBaseAttributes {
  parent_id: number | null;
  name: string;
  slug: string;
  path: string;
  depth: number;
  sort_order: number;
  media_count?: number;
  children?: CmsMediaFolder[];
}

/** One row of `MediaService::usage()`. */
export interface CmsMediaUsage {
  type?: string;
  label?: string;
  collection?: string | null;
  url?: string | null;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ */
/* CTA                                                                */
/* ------------------------------------------------------------------ */

export interface CmsCta extends CmsBaseAttributes {
  label: string;
  aria_label: string | null;
  link_type: string;
  /** Resolved server-side by `CtaService::resolveHref()`; never re-derived. */
  href: string | null;
  url: string | null;
  route_name: string | null;
  route_params: Record<string, unknown> | null;
  page_id: number | null;
  page?: { uuid: string; title: string; path: string } | null;
  target_type: string | null;
  target_id: number | null;
  variant: string;
  size: string;
  icon: string | null;
  icon_position: string;
  opens_in_new_tab: boolean;
  is_download: boolean;
  rel: string | null;
  tracking_id: string | null;
}

/* ------------------------------------------------------------------ */
/* Pages, sections, repeater items                                    */
/* ------------------------------------------------------------------ */

export interface CmsSectionBlock extends CmsBaseAttributes {
  page_section_id: number;
  parent_id: number | null;
  block_type: string;
  label: string | null;
  /** A string by design: "500+" and "24/7" are both legitimate. */
  value: string | null;
  description: string | null;
  body: string | null;
  icon: string | null;
  media?: CmsMedia | null;
  cta?: CmsCta | null;
  link_type: string;
  link_target_type: string | null;
  link_target_id: number | null;
  link_url: string | null;
  data: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  sort_order: number;
  children?: CmsSectionBlock[];
}

/**
 * One page as it appears when ANOTHER page lists it — `PageCardResource`.
 *
 * Deliberately not `CmsPage`: that is the admin's shape, and a listing of
 * thirty services would otherwise ship thirty admin records to a visitor. A
 * card is addressed by `path`; the primary key is not on the public wire at
 * all.
 */
export interface CmsPageCard {
  uuid: string;
  title: string;
  path: string;
  excerpt: string | null;
  /** Lucide registry key, resolved through `NavIcon`. */
  icon: string | null;
  /** An `--fx-mark-*` hue, or null to colour it by position. */
  accent: string | null;
  page_type: string | null;
  media?: CmsMedia | null;
}

export interface CmsPageSection extends CmsBaseAttributes {
  page_id: number | null;
  block_id: number | null;
  section_type: string;
  /** False when the type was removed from the registry — render the fallback. */
  is_known_type: boolean;
  type_label: string | null;
  preview_component: string | null;
  name: string | null;
  anchor: string | null;
  eyebrow: string | null;
  heading: string | null;
  subheading: string | null;
  body: string | null;
  media?: CmsMedia | null;
  cta?: CmsCta | null;
  secondary_cta?: CmsCta | null;
  data: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  blocks?: CmsSectionBlock[];
  gallery?: CmsMedia[];
  /**
   * Other PAGES this section lists.
   *
   * Present only on section types that implement `ResolvesCollection`
   * server-side — today that is `collection.index` alone. Attached by
   * `PageRenderService::withCollections()` AFTER the page cache is read, so it
   * is fresh even when the rest of the payload is not; see that method for why
   * that separation matters.
   */
  collection?: CmsPageCard[];
  /** Editorial state. Distinct from `status`, which is the kill switch. */
  publish_status: string;
  published_at: string | null;
  expires_at: string | null;
  sort_order: number;
}

export interface CmsPage extends CmsBaseAttributes {
  title: string;
  slug: string;
  path: string;
  depth: number;
  locale: string;
  translation_group_id: string | null;
  parent_id: number | null;
  parent?: { uuid: string; title: string; path: string } | null;
  page_type: string;
  template: string;
  is_homepage: boolean;
  is_indexable: boolean;
  settings: Record<string, unknown> | null;
  publish_status: string;
  published_at: string | null;
  expires_at: string | null;
  sort_order: number;
  /** Mirrors the `->published()` scope in memory, so no query per row. */
  is_live: boolean;
  /** System and home pages are structurally undeletable. */
  is_deleteable: boolean;
  sections?: CmsPageSection[];
  seo?: CmsSeoMeta | null;
  sections_count?: number;
}

export interface CmsBlock extends CmsBaseAttributes {
  key: string;
  name: string;
  description: string | null;
  section_type: string;
  type_label: string | null;
  is_locked: boolean;
  publish_status: string;
  published_at: string | null;
  expires_at: string | null;
  sort_order: number;
  usages_count?: number;
  is_deleteable: boolean;
  body?: CmsPageSection | null;
}

/* ------------------------------------------------------------------ */
/* Menus                                                              */
/* ------------------------------------------------------------------ */

export interface CmsMenuItem extends CmsBaseAttributes {
  menu_id: number;
  parent_id: number | null;
  path: string | null;
  depth: number;
  label: string;
  aria_label: string | null;
  description: string | null;
  icon: string | null;
  media?: CmsMedia | null;
  link_type: string;
  /** Headings and separators render as real elements, never dead links. */
  is_structural: boolean;
  href: string | null;
  url: string | null;
  route_name: string | null;
  route_params: Record<string, unknown> | null;
  page_id: number | null;
  page?: { uuid: string; title: string; path: string } | null;
  target_type: string | null;
  target_id: number | null;
  opens_in_new_tab: boolean;
  rel: string | null;
  badge_label: string | null;
  badge_variant: string | null;
  visibility: string;
  settings: Record<string, unknown> | null;
  sort_order: number;
  children?: CmsMenuItem[];
}

export interface CmsMenu extends CmsBaseAttributes {
  key: string;
  name: string;
  location: string | null;
  max_depth: number;
  settings: Record<string, unknown> | null;
  is_locked: boolean;
  items_count?: number;
  is_deleteable: boolean;
  items?: CmsMenuItem[];
}

/* ------------------------------------------------------------------ */
/* Redirects & SEO                                                    */
/* ------------------------------------------------------------------ */

export interface CmsRedirect extends CmsBaseAttributes {
  from_path: string;
  to_path: string;
  status_code: number;
  is_regex: boolean;
  preserve_query: boolean;
  source: string;
  is_automatic: boolean;
  hits: number;
  last_hit_at: string | null;
}

export interface CmsSeoMeta extends CmsBaseAttributes {
  seoable_type: string;
  seoable_id: number;
  locale: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  robots_index: boolean;
  robots_follow: boolean;
  robots_advanced: string | null;
  og_title: string | null;
  og_description: string | null;
  og_type: string | null;
  og_media?: CmsMedia | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_media?: CmsMedia | null;
  schema_type: string | null;
  schema_data: Record<string, unknown> | null;
  focus_keyword: string | null;
  seo_score: number | null;
}

/* ------------------------------------------------------------------ */
/* Page props                                                         */
/* ------------------------------------------------------------------ */

/** Props every CMS admin screen receives from `AppResponse::withComponent()`. */
export interface CmsPageBaseProps {
  title: string;
  modelProperty: CmsModelProperty;
  statuses?: CmsOption[];
}

/** `backend.pages.sections` — the page builder. */
export interface PageBuilderProps extends CmsPageBaseProps {
  data: CmsPaginated<CmsPageSection> | CmsPageSection[];
  page: { data: CmsPage } | CmsPage;
  /**
   * `SectionTypeResource::collection($registry->all())`. The registry is keyed
   * by section-type key, so this arrives as `{ data: { 'hero.split': {…} } }`
   * — a JSON object, not an array. `unwrapList()` accepts both shapes; never
   * index this prop directly.
   */
  sectionTypes: CmsSectionTypesProp;
  sectionTypeGroups: CmsSectionTypeGroups;
  publishStatuses: CmsOption[];
}

/**
 * A node of `backend.pages.tree`. Shaped by `PageTreeResource`, which nests
 * `children` server-side so the whole hierarchy arrives without a query per
 * level — do not re-derive nesting from `parent_id` on the client.
 */
export interface CmsPageTreeNode {
  id: number;
  uuid: string;
  parent_id: number | null;
  title: string;
  slug: string;
  path: string;
  depth: number;
  locale: string;
  page_type: string | null;
  is_homepage: boolean;
  status: string | null;
  publish_status: string | null;
  sort_order: number;
  children?: CmsPageTreeNode[];
}

/** `backend.pages.tree` — read-only hierarchy view. */
export interface PageTreeProps extends CmsPageBaseProps {
  data: { data: CmsPageTreeNode[] } | CmsPageTreeNode[];
}

/** `backend.menus.items` — the menu builder. */
export interface MenuBuilderProps extends CmsPageBaseProps {
  data: CmsPaginated<CmsMenuItem> | CmsMenuItem[];
  menu: { data: CmsMenu } | CmsMenu;
  linkTypes: CmsOption[];
  visibilities: CmsOption[];
}

/** `backend.media.index` — the media library. */
export interface MediaLibraryProps extends CmsPageBaseProps {
  data: CmsPaginated<CmsMedia>;
  folders: CmsPaginated<CmsMediaFolder> | CmsMediaFolder[];
  mediaTypes: CmsOption[];
}

/** The owner a `SeoPanel` or media attachment addresses, by morph alias. */
export interface CmsMorphOwner {
  type: string;
  id: number;
}
