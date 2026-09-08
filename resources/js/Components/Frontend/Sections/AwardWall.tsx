import { useMemo } from 'react'
import { Award } from 'lucide-react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { SafeImage } from '@/Components/UI/SafeImage'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { highlightHeading } from '@/Components/Frontend/Sections/Shared/highlight'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
import { SectionHeader } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import type { HeadingLevel } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import {
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const COLUMNS = ['2', '3', '4'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

/** Mirrors `AwardWallType::kindOptions()`. */
const KINDS = [
  'award',
  'certification',
  'partner',
  'compliance',
  'recognition',
] as const

type Accent = (typeof ACCENTS)[number]
type Kind = (typeof KINDS)[number]

/**
 * A credential's hue comes from its KIND, not from its position.
 *
 * Every other repeater in this registry cycles colour by index, because there
 * the hue is decoration. Here it is information: once a reader learns that
 * amber means "award" they can scan the wall by colour, and a cycled palette
 * would reshuffle that meaning every time an editor reorders a row. A
 * per-card `settings.accent` still overrides it — an editor who wants their
 * ISO badge in brand blue gets it.
 */
const KIND_ACCENTS: Record<Kind, Accent> = {
  award: 'amber',
  certification: 'teal',
  partner: 'violet',
  compliance: 'brand',
  recognition: 'rose',
}

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind scans source text, so none of these may be assembled at runtime.
 */

/** The kind pill. Hue as ink on a wash of itself. */
const PILL_CLASSES = {
  brand: 'bg-fx-mark-brand/12 text-fx-mark-brand',
  ink: 'bg-fx-mark-ink/10 text-fx-mark-ink',
  amber: 'bg-fx-mark-amber/12 text-fx-mark-amber',
  teal: 'bg-fx-mark-teal/12 text-fx-mark-teal',
  violet: 'bg-fx-mark-violet/12 text-fx-mark-violet',
  rose: 'bg-fx-mark-rose/12 text-fx-mark-rose',
} as const

/**
 * The icon tile, used when a card has no badge image.
 *
 * FILLED with the hue and the glyph knocked out — the same call the metric
 * cards make, and for the same reason: `--fx-mark-*` do not rebind inside an
 * inverted `Section`, so a hue used as ink would keep its light-theme value
 * on a near-black band. As a fill with `--fx-mark-glyph` on top it is legible
 * on every background this section offers.
 */
const TILE_CLASSES = {
  brand: 'bg-fx-mark-brand text-fx-mark-brand-glyph',
  ink: 'bg-fx-mark-ink text-fx-mark-ink-glyph',
  amber: 'bg-fx-mark-amber text-fx-mark-glyph',
  teal: 'bg-fx-mark-teal text-fx-mark-glyph',
  violet: 'bg-fx-mark-violet text-fx-mark-glyph',
  rose: 'bg-fx-mark-rose text-fx-mark-glyph',
} as const

/** The rail across the top of the card. Decoration — no contrast duty. */
const RAIL_CLASSES = {
  brand: 'bg-gradient-to-r from-fx-mark-brand to-fx-mark-brand/30',
  ink: 'bg-gradient-to-r from-fx-mark-ink to-fx-mark-ink/30',
  amber: 'bg-gradient-to-r from-fx-mark-amber to-fx-mark-amber/30',
  teal: 'bg-gradient-to-r from-fx-mark-teal to-fx-mark-teal/30',
  violet: 'bg-gradient-to-r from-fx-mark-violet to-fx-mark-violet/30',
  rose: 'bg-gradient-to-r from-fx-mark-rose to-fx-mark-rose/30',
} as const

/** The wash that blooms from the card's top-right corner on hover. */
const BLOOM_CLASSES = {
  brand: 'bg-[radial-gradient(70%_60%_at_100%_0%,var(--fx-mark-brand),transparent_70%)]',
  ink: 'bg-[radial-gradient(70%_60%_at_100%_0%,var(--fx-mark-ink),transparent_70%)]',
  amber: 'bg-[radial-gradient(70%_60%_at_100%_0%,var(--fx-mark-amber),transparent_70%)]',
  teal: 'bg-[radial-gradient(70%_60%_at_100%_0%,var(--fx-mark-teal),transparent_70%)]',
  violet: 'bg-[radial-gradient(70%_60%_at_100%_0%,var(--fx-mark-violet),transparent_70%)]',
  rose: 'bg-[radial-gradient(70%_60%_at_100%_0%,var(--fx-mark-rose),transparent_70%)]',
} as const

/** The verification link. */
const LINK_CLASSES = {
  brand: 'text-fx-mark-brand',
  ink: 'text-fx-mark-ink',
  amber: 'text-fx-mark-amber',
  teal: 'text-fx-mark-teal',
  violet: 'text-fx-mark-violet',
  rose: 'text-fx-mark-rose',
} as const

const COLUMN_CLASSES = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** A row worth rendering — has a title. Everything else is optional. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label))
}

function kindOf(block: CmsSectionBlock): Kind {
  return readOption(block.data, 'kind', KINDS, 'certification')
}

/**
 * One credential.
 *
 * WHEN IT HAS A VERIFICATION LINK, THE WHOLE CARD IS CLICKABLE — but the card
 * is still not an anchor. The hit area is the visible "Verify" control
 * stretched over the card with an `after` pseudo-element, so the link's
 * accessible name stays "Verify on AWS" instead of swallowing the title, the
 * issuer, the year and the note. A card with no link is not clickable at all
 * rather than being a dead hit area.
 */
function CredentialCard({
  block,
  index,
  preset,
  kindLabels,
  headingLevel,
}: {
  block: CmsSectionBlock
  index: number
  preset: 'none' | 'fade' | 'stagger'
  kindLabels: Record<Kind, string>
  headingLevel: 'h2' | 'h3' | 'h4'
}) {
  const title = trimmed(block.label)
  const issuer = trimmed(block.description)
  const year = trimmed(block.value)
  const note = trimmed(block.body)
  const badge = block.media ?? null
  const cta = block.cta ?? null
  const kind = kindOf(block)
  const accent = readOption(block.settings, 'accent', ACCENTS, KIND_ACCENTS[kind])
  const Heading = headingLevel

  return (
    <Reveal as="li" preset={preset} index={index} className="group/card flex">
      <article
        className={cn(
          'relative isolate flex flex-1 flex-col gap-4 overflow-hidden',
          'rounded-fx-xl border border-fx-line bg-fx-surface p-6 fx-raise-1',
          'transition-[border-color,box-shadow,transform] duration-300 ease-fx',
          'hover:-translate-y-1 hover:border-fx-accent-line hover:shadow-fx-3',
          // Keyboard parity with the hover state — see `TestimonialWall`.
          'has-[a:focus-visible]:border-fx-accent-line has-[a:focus-visible]:shadow-fx-3',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-1',
            RAIL_CLASSES[accent]
          )}
        />

        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 opacity-0',
            'transition-opacity duration-500 ease-fx',
            'group-hover/card:opacity-[0.10] motion-reduce:transition-none',
            BLOOM_CLASSES[accent]
          )}
        />

        <div className="flex items-start justify-between gap-4">
          {/*
           * The badge, or the icon tile. Both occupy a 48px-tall box so a wall
           * that is half-badged still lines up — which is the normal state,
           * because vendor marks arrive one programme at a time.
           */}
          {badge ? (
            <SafeImage
              src={badge.url}
              /* Decorative: the credential's name is right beside it, so
                 announcing the mark as well would double every card. An
                 editor-supplied alt wins when there is one. */
              alt={badge.alt_text ?? ''}
              {...(badge.width ? { width: badge.width } : {})}
              {...(badge.height ? { height: badge.height } : {})}
              className="h-12 w-auto max-w-[10rem] object-contain object-left"
            />
          ) : (
            <span
              aria-hidden="true"
              className={cn(
                'flex size-12 shrink-0 items-center justify-center',
                'rounded-fx-md shadow-fx-1',
                TILE_CLASSES[accent]
              )}
            >
              {isRegisteredNavIcon(block.icon ?? undefined) ? (
                <NavIcon name={block.icon ?? undefined} className="size-6" />
              ) : (
                <Award className="size-6" />
              )}
            </span>
          )}

          <span
            className={cn(
              'shrink-0 rounded-fx-pill px-3 py-1 text-fx-meta font-semibold',
              PILL_CLASSES[accent]
            )}
          >
            {kindLabels[kind]}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {title ? (
            <Heading className="text-fx-body font-semibold text-balance text-fx-ink">
              {title}
            </Heading>
          ) : null}

          {issuer || year ? (
            <p className="text-fx-body-sm text-fx-ink-faint">
              {issuer}
              {issuer && year ? (
                <span aria-hidden="true" className="px-1.5">
                  ·
                </span>
              ) : null}
              {year ? <span className="fx-numerals">{year}</span> : null}
            </p>
          ) : null}
        </div>

        {note ? (
          <p className="text-fx-body-sm text-pretty text-fx-ink-soft">{note}</p>
        ) : null}

        {cta ? (
          <div className="mt-auto pt-1">
            <SectionCta
              cta={cta}
              fallbackVariant="link"
              size="sm"
              buttonClassName={cn(
                fxButton({ tone: 'ghost', scale: 'sm' }),
                'h-auto bg-transparent px-0 hover:bg-transparent',
                LINK_CLASSES[accent],
                '[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-fx',
                'hover:[&_svg]:translate-x-0.5 hover:[&_svg]:-translate-y-0.5',
                'motion-reduce:hover:[&_svg]:translate-x-0'
              )}
              // Stretches the hit area over the whole card. The `article` is
              // `relative`, so `inset-0` resolves to it — NOT to this wrapper,
              // which is a static-position element and therefore not a
              // containing block for an absolutely positioned child.
              className="after:absolute after:inset-0 after:content-['']"
            />
          </div>
        ) : null}
      </article>
    </Reveal>
  )
}

interface CredentialGroup {
  kind: Kind
  credentials: CmsSectionBlock[]
}

/**
 * Bucket credentials by kind, in FIRST-APPEARANCE order.
 *
 * Not in `KINDS` order: the editor's sequence is the editorial decision — a
 * firm that leads on ISO wants compliance first — and sorting by a constant
 * would silently override it on every render.
 */
function groupCredentials(credentials: CmsSectionBlock[]): CredentialGroup[] {
  const groups: CredentialGroup[] = []
  const index = new Map<Kind, CredentialGroup>()

  for (const credential of credentials) {
    const kind = kindOf(credential)

    let group = index.get(kind)

    if (!group) {
      group = { kind, credentials: [] }
      index.set(kind, group)
      groups.push(group)
    }

    group.credentials.push(credential)
  }

  return groups
}

/**
 * Awards, certifications, partner badges and recognition, in one wall.
 *
 * Renders `null` when there is neither a header, nor a button, nor one
 * credential with a title.
 */
export function AwardWall({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const columns = readOption(settings, 'columns', COLUMNS, '3')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'subtle')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const groupBy = readBoolean(settings, 'group_by', true)

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  /*
   * Kind labels are translated HERE rather than stored per row: the value is
   * a fixed key, so a translator gets five strings to translate once instead
   * of the same five words repeated across every credential on the site.
   */
  const kindLabels = useMemo<Record<Kind, string>>(
    () => ({
      award: t('Award'),
      certification: t('Certification'),
      partner: t('Partner'),
      compliance: t('Compliance'),
      recognition: t('Recognition'),
    }),
    [t]
  )

  const groupTitles = useMemo<Record<Kind, string>>(
    () => ({
      award: t('Awards'),
      certification: t('Certifications'),
      partner: t('Partner Badges'),
      compliance: t('Compliance'),
      recognition: t('Industry Recognition'),
    }),
    [t]
  )

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const footnote = readString(section.data, 'footnote')
  const cta = section.cta ?? null

  const credentials = useMemo(
    () => blocksOfType(section.blocks, 'credential').filter(hasContent),
    [section.blocks]
  )

  const groups = useMemo(() => groupCredentials(credentials), [credentials])

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !cta && credentials.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const centered = align === 'center'

  // One kind across the whole wall would render a single heading over the
  // entire grid — a label pretending to be a structure.
  const grouped = groupBy && groups.length > 1

  // Same rule as the team grid: levels follow the structure. A group heading
  // sits one under the section's, and a card title one under whichever of
  // those is directly above it.
  const LEVELS = { 2: 'h2', 3: 'h3', 4: 'h4' } as const
  const groupLevel = sectionHeadingLevel === 'h1' ? 2 : 3
  const cardLevel = grouped ? groupLevel + 1 : groupLevel
  const GroupHeading = LEVELS[groupLevel as 2 | 3]
  const cardHeadingLevel = LEVELS[cardLevel as 2 | 3 | 4]

  const gridClasses = cn('grid grid-cols-1 gap-5', COLUMN_CLASSES[columns])

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Awards and certifications') })}
    >
      <div className="flex flex-col gap-fx-stack-xl">
        {hasHeader ? (
          <SectionHeader
            eyebrow={eyebrow}
            heading={headingNode}
            subheading={subheading}
            headingLevel={sectionHeadingLevel}
            headingSize={sectionHeadingLevel}
            align={centered ? 'center' : 'start'}
            preset={headerPreset}
            {...(centered ? {} : { className: 'max-w-3xl' })}
            {...(headingId ? { headingId } : {})}
          />
        ) : null}

        {credentials.length > 0 ? (
          grouped ? (
            <div className="flex flex-col gap-fx-stack-xl">
              {groups.map((group) => (
                <div key={group.kind} className="flex flex-col gap-fx-stack-md">
                  <Reveal preset={headerPreset} className="flex items-center gap-4">
                    <GroupHeading className="text-fx-subheading font-semibold text-fx-ink">
                      {groupTitles[group.kind]}
                    </GroupHeading>
                    <span aria-hidden="true" className="h-px flex-1 bg-fx-line" />
                  </Reveal>

                  <ul className={gridClasses}>
                    {group.credentials.map((credential, position) => (
                      <CredentialCard
                        key={credential.uuid}
                        block={credential}
                        index={position}
                        preset={preset}
                        kindLabels={kindLabels}
                        headingLevel={cardHeadingLevel}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className={gridClasses}>
              {credentials.map((credential, position) => (
                <CredentialCard
                  key={credential.uuid}
                  block={credential}
                  index={position}
                  preset={preset}
                  kindLabels={kindLabels}
                  headingLevel={cardHeadingLevel}
                />
              ))}
            </ul>
          )
        ) : null}

        {footnote ? (
          <p
            className={cn(
              'text-fx-meta text-fx-ink-faint',
              centered && 'text-center'
            )}
          >
            {footnote}
          </p>
        ) : null}

        {cta ? (
          <Reveal
            preset={headerPreset}
            className={cn('flex', centered ? 'justify-center' : 'justify-start')}
          >
            <SectionCta
              cta={cta}
              size="lg"
              fallbackVariant="outline"
              buttonClassName={fxButton({ tone: 'outline', scale: 'lg' })}
            />
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

export default AwardWall
