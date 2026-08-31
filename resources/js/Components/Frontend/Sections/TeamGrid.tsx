import { useMemo } from 'react'

import { NavIcon } from '@/Components/Public/NavIcon'
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
const SHAPES = ['portrait', 'square'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/** Cycled by position when a member has no `settings.accent`, as everywhere. */
const ACCENT_CYCLE = ['violet', 'brand', 'amber', 'teal', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind scans source text, so none of these may be assembled at runtime.
 */

/**
 * The monogram frame, for a member with no photo yet.
 *
 * Two stacked gradients rather than one: a diagonal accent wash for the hue,
 * and a soft light source from the top-left over it. A single flat ramp behind
 * two large letters is what makes a placeholder read as a placeholder; the
 * second gradient gives the panel a direction and lets it sit beside a real
 * photograph without looking like a gap in the row.
 *
 * The highlight is held to 10% white. The mark hues are tuned to the exact
 * lightness where `--fx-mark-glyph` clears 4.5:1 in light mode, and a brighter
 * top-left would spend that headroom on the corner the initials sit nearest.
 */
const MONOGRAM_CLASSES = {
  brand:
    'bg-[radial-gradient(120%_100%_at_20%_0%,color-mix(in_oklab,var(--fx-mark-brand),white_10%),transparent_60%),linear-gradient(140deg,var(--fx-mark-brand),color-mix(in_oklab,var(--fx-mark-brand),black_25%))] text-fx-mark-brand-glyph',
  ink: 'bg-[radial-gradient(120%_100%_at_20%_0%,color-mix(in_oklab,var(--fx-mark-ink),white_10%),transparent_60%),linear-gradient(140deg,var(--fx-mark-ink),color-mix(in_oklab,var(--fx-mark-ink),black_25%))] text-fx-mark-ink-glyph',
  amber:
    'bg-[radial-gradient(120%_100%_at_20%_0%,color-mix(in_oklab,var(--fx-mark-amber),white_10%),transparent_60%),linear-gradient(140deg,var(--fx-mark-amber),color-mix(in_oklab,var(--fx-mark-amber),black_25%))] text-fx-mark-glyph',
  teal: 'bg-[radial-gradient(120%_100%_at_20%_0%,color-mix(in_oklab,var(--fx-mark-teal),white_10%),transparent_60%),linear-gradient(140deg,var(--fx-mark-teal),color-mix(in_oklab,var(--fx-mark-teal),black_25%))] text-fx-mark-glyph',
  violet:
    'bg-[radial-gradient(120%_100%_at_20%_0%,color-mix(in_oklab,var(--fx-mark-violet),white_10%),transparent_60%),linear-gradient(140deg,var(--fx-mark-violet),color-mix(in_oklab,var(--fx-mark-violet),black_25%))] text-fx-mark-glyph',
  rose: 'bg-[radial-gradient(120%_100%_at_20%_0%,color-mix(in_oklab,var(--fx-mark-rose),white_10%),transparent_60%),linear-gradient(140deg,var(--fx-mark-rose),color-mix(in_oklab,var(--fx-mark-rose),black_25%))] text-fx-mark-glyph',
} as const

/** The wash that blooms behind the card on hover. */
const BLOOM_CLASSES = {
  brand: 'bg-[radial-gradient(75%_60%_at_50%_0%,var(--fx-mark-brand),transparent_70%)]',
  ink: 'bg-[radial-gradient(75%_60%_at_50%_0%,var(--fx-mark-ink),transparent_70%)]',
  amber: 'bg-[radial-gradient(75%_60%_at_50%_0%,var(--fx-mark-amber),transparent_70%)]',
  teal: 'bg-[radial-gradient(75%_60%_at_50%_0%,var(--fx-mark-teal),transparent_70%)]',
  violet: 'bg-[radial-gradient(75%_60%_at_50%_0%,var(--fx-mark-violet),transparent_70%)]',
  rose: 'bg-[radial-gradient(75%_60%_at_50%_0%,var(--fx-mark-rose),transparent_70%)]',
} as const

/**
 * The profile icons on hover — the card's one coloured interaction.
 *
 * A static map, never `hover:text-fx-mark-${accent}`: a template literal
 * produces a class that exists in the DOM and in no stylesheet, because
 * Tailwind compiles by scanning source text and never sees the assembled
 * string.
 */
const ROLE_HOVER_CLASSES = {
  brand: 'hover:text-fx-mark-brand',
  ink: 'hover:text-fx-mark-ink',
  amber: 'hover:text-fx-mark-amber',
  teal: 'hover:text-fx-mark-teal',
  violet: 'hover:text-fx-mark-violet',
  rose: 'hover:text-fx-mark-rose',
} as const

const COLUMN_CLASSES = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
} as const

/**
 * The photo frame.
 *
 * `aspect-ratio` on the FRAME with `object-cover` on the image, never a fixed
 * height: the frame is `w-full` inside a fluid grid cell, so it scales with
 * the column at every breakpoint while the ratio holds the crop steady. That
 * is also what reserves the box before the file arrives, which keeps this
 * section's contribution to CLS at zero whatever an editor uploads.
 */
const SHAPE_CLASSES = {
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
} as const

/**
 * The scatter, by position.
 *
 * Alternating rather than random: a random offset cannot be reasoned about and
 * changes on every render. `lg:` only — below that the grid is one or two
 * columns and there is no row to scatter, just cards that look misaligned.
 *
 * A static translate, not an animation: it never moves, so it needs no
 * `motion-reduce` escape hatch, and Tailwind v4 writes `translate` as its own
 * property so it composes with the card's hover lift instead of fighting it
 * for the single `transform` slot.
 */
const STAGGER_CLASSES = ['', 'lg:translate-y-8'] as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** A row worth rendering — has a name. Everything else is optional. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label))
}

/** `data.skills`, split into pills. Commas only, trimmed, empties dropped. */
function skillsOf(block: CmsSectionBlock): string[] {
  const raw = readString(block.data, 'skills')

  if (!raw) {
    return []
  }

  return raw
    .split(',')
    .map((skill) => skill.trim())
    .filter((skill) => skill !== '')
}

/**
 * Up to two initials from a name.
 *
 * First and LAST word rather than the first two, so "Maria del Carmen Ruiz"
 * reads MR and not MD.
 */
function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter((word) => word !== '')

  if (words.length === 0) {
    return ''
  }

  const picked = words.length === 1 ? [words[0]] : [words[0], words[words.length - 1]]

  return picked
    .map((word) => firstCharacter(word ?? ''))
    .join('')
    .toUpperCase()
}

/**
 * The first character of a word — by CODE POINT, not by UTF-16 unit.
 *
 * `word.slice(0, 1)` cuts an astral-plane character (an emoji, many CJK
 * extensions) in half and renders the replacement glyph. Spreading a string
 * iterates code points, which is correct for every name this will ever see.
 */
function firstCharacter(word: string): string {
  return [...word][0] ?? ''
}

/** One profile link: the icon it uses and the href it needs. */
interface ProfileLink {
  key: string
  icon: string
  href: string
  label: string
}

/**
 * One person.
 *
 * The card is NOT a link. A team member has no page behind them in this
 * schema, and wrapping the card in an anchor to a LinkedIn profile would make
 * the whole card an outbound jump — including the parts (bio, skills) a
 * visitor is reading rather than clicking. The profile icons are the links,
 * and each one names its destination for screen readers.
 */
function MemberCard({
  block,
  index,
  preset,
  shape,
  offsetClass,
  headingLevel,
}: {
  block: CmsSectionBlock
  index: number
  preset: 'none' | 'fade' | 'stagger'
  shape: (typeof SHAPES)[number]
  /** The scatter offset for this position, or `''` when staggering is off. */
  offsetClass: string
  headingLevel: 'h2' | 'h3' | 'h4'
}) {
  const { t } = useTranslations()

  const name = trimmed(block.label)
  const role = trimmed(block.description)
  const bio = trimmed(block.body)
  const photo = block.media ?? null
  const skills = useMemo(() => skillsOf(block), [block])
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))
  const Heading = headingLevel

  const links = useMemo<ProfileLink[]>(() => {
    const email = readString(block.data, 'email')

    return [
      {
        key: 'linkedin',
        icon: 'Linkedin',
        href: readString(block.data, 'linkedin') ?? '',
        label: 'LinkedIn',
      },
      {
        key: 'github',
        icon: 'Github',
        href: readString(block.data, 'github') ?? '',
        label: 'GitHub',
      },
      {
        key: 'website',
        icon: 'Globe',
        href: readString(block.data, 'website') ?? '',
        label: t('Personal site'),
      },
      {
        key: 'email',
        icon: 'Mail',
        href: email ? `mailto:${email}` : '',
        label: t('Email'),
      },
    ].filter((link) => link.href !== '')
  }, [block.data, t])

  return (
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className={cn('group/card flex', offsetClass)}
    >
      <article
        className={cn(
          // The photo is INSET in the card rather than bleeding to its edges:
          // a visible margin of card around the picture is what makes this
          // read as a printed card on a surface instead of as a tile in a
          // grid, and it is the whole difference between the two designs.
          'relative isolate flex flex-1 flex-col gap-4 p-3',
          'rounded-fx-xl border border-fx-line bg-fx-surface fx-raise-1',
          'transition-[border-color,box-shadow,transform] duration-300 ease-fx',
          'hover:-translate-y-1 hover:border-fx-accent-line hover:shadow-fx-3',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 opacity-0',
            'transform-gpu transition-opacity duration-500 ease-fx',
            'group-hover/card:opacity-[0.10] motion-reduce:transition-none',
            BLOOM_CLASSES[accent]
          )}
        />

        {/*
         * One frame for every card, whatever is inside it — photo or
         * monogram. That is what keeps a half-shot team page on one baseline
         * instead of collapsing the rows nobody has photographed yet.
         */}
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-fx-lg bg-fx-surface-2',
            SHAPE_CLASSES[shape]
          )}
        >
          {photo ? (
            <>
              <SafeImage
                src={photo.url}
                alt={photo.alt_text ?? name ?? ''}
                {...(photo.width ? { width: photo.width } : {})}
                {...(photo.height ? { height: photo.height } : {})}
                className={cn(
                  // `object-top`, not the browser default of `center`. A 4:5
                  // frame crops a landscape or square upload hard, and a
                  // centred crop takes the middle of the body — the one part
                  // of a portrait that must survive is the head. Anchoring the
                  // crop to the top keeps the face in frame whatever ratio an
                  // editor uploads.
                  'h-full w-full object-cover object-top',
                  'transform-gpu transition-transform duration-500 ease-fx',
                  'group-hover/card:scale-105',
                  'motion-reduce:transition-none motion-reduce:group-hover/card:scale-100'
                )}
              />

              {/* Eight photographs shot by eight different people, at eight
                  different exposures, is what makes a team grid look
                  assembled rather than designed. A common wash across the
                  lower half pulls them onto one footing without touching the
                  faces, and doubles as the seat the name sits on. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fx-ink/25 via-transparent to-transparent"
              />
            </>
          ) : (
            <span
              aria-hidden="true"
              className={cn(
                'flex h-full w-full items-center justify-center',
                // Sized to the FRAME, not to the type scale. `text-fx-title`
                // left a pair of letters marooned in the middle of a 4:5
                // panel; at this size the monogram reads as the card's
                // artwork, which is what it is standing in for.
                'text-[clamp(2.25rem,7vw,3.25rem)] font-semibold tracking-tight',
                'transform-gpu transition-transform duration-500 ease-fx',
                'group-hover/card:scale-105',
                'motion-reduce:transition-none motion-reduce:group-hover/card:scale-100',
                MONOGRAM_CLASSES[accent]
              )}
            >
              {name ? initialsOf(name) : null}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
          <div className="flex flex-col gap-0.5">
            {name ? (
              // Larger and tighter than the old body-size title: on this
              // layout the name is the card's headline, not a caption.
              <Heading className="text-fx-subheading font-semibold text-balance text-fx-ink">
                {name}
              </Heading>
            ) : null}

            {role ? (
              // Neutral ink, not the accent. Six coloured role lines in a row
              // competed with the photos and left the names — the thing a
              // reader actually scans for — as the quietest text on the card.
              <p className="text-fx-body-sm text-fx-ink-faint">{role}</p>
            ) : null}
          </div>

          {bio ? (
            <p className="text-fx-body-sm text-pretty text-fx-ink-soft">{bio}</p>
          ) : null}

          {skills.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {skills.map((skill, position) => (
                <li
                  key={`${skill}-${position}`}
                  className={cn(
                    'rounded-fx-pill border border-fx-line bg-fx-surface-2',
                    'px-2.5 py-0.5 text-fx-meta font-medium text-fx-ink-soft'
                  )}
                >
                  {skill}
                </li>
              ))}
            </ul>
          ) : null}

          {links.length > 0 ? (
            <ul className="mt-auto flex flex-wrap items-center gap-1 pt-2">
              {links.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    {...(link.key === 'email'
                      ? {}
                      : { target: '_blank', rel: 'noopener noreferrer' })}
                    className={cn(
                      'flex size-9 items-center justify-center rounded-fx-md',
                      'text-fx-ink-faint transition-colors duration-200 ease-fx',
                      'hover:bg-fx-surface-2',
                      'focus-visible:outline-2 focus-visible:outline-offset-2',
                      'focus-visible:outline-fx-focus',
                      'motion-reduce:transition-none',
                      ROLE_HOVER_CLASSES[accent]
                    )}
                  >
                    {/* The icon is decorative; the accessible name is the
                        person plus the network, so a screen reader hears
                        "Ada Whitfield on LinkedIn" rather than four
                        indistinguishable "link"s per card. */}
                    <NavIcon name={link.icon} className="size-4" />
                    <span className="sr-only">
                      {name
                        ? t(':name on :network', { name, network: link.label })
                        : link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </Reveal>
  )
}

/** Members in editor order, bucketed by `value` (the department). */
interface MemberGroup {
  key: string
  label: string | undefined
  members: CmsSectionBlock[]
}

/**
 * Bucket members by department, in FIRST-APPEARANCE order.
 *
 * Not alphabetical: an editor who drags Leadership to the top means it, and a
 * sort would silently override that with "Design, Engineering, Leadership".
 * Members with no department fall into one trailing unlabelled group rather
 * than into a "Other" heading nobody wrote.
 */
function groupMembers(members: CmsSectionBlock[]): MemberGroup[] {
  const groups: MemberGroup[] = []
  const index = new Map<string, MemberGroup>()

  for (const member of members) {
    const label = trimmed(member.value)
    // Case- and space-insensitive, so "Engineering" and "engineering " are one
    // group. The FIRST spelling seen is the one rendered.
    const key = label ? label.toLocaleLowerCase() : ''

    let group = index.get(key)

    if (!group) {
      group = { key: key || 'ungrouped', label, members: [] }
      index.set(key, group)
      groups.push(group)
    }

    group.members.push(member)
  }

  return groups
}

/**
 * The team grid.
 *
 * Renders `null` when there is neither a header, nor a button, nor one member
 * with a name — the section's live state on a fresh install.
 */
export function TeamGrid({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const columns = readOption(settings, 'columns', COLUMNS, '4')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const groupBy = readBoolean(settings, 'group_by', false)
  const shape = readOption(settings, 'media_shape', SHAPES, 'portrait')
  const staggerCards = readBoolean(settings, 'stagger_cards', false)

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const footnote = readString(section.data, 'footnote')
  const cta = section.cta ?? null

  const members = useMemo(
    () => blocksOfType(section.blocks, 'member').filter(hasContent),
    [section.blocks]
  )

  const groups = useMemo(() => groupMembers(members), [members])

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !cta && members.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const centered = align === 'center'

  // Only group when there is something to group BY — every member sharing one
  // department (or none) would render a single heading over the whole grid,
  // which is a label pretending to be a structure.
  const grouped =
    groupBy && groups.length > 1 && groups.some((group) => group.label)

  /*
   * Heading levels follow the STRUCTURE, not the styling. A group heading sits
   * one level under the section's; a card title sits one under the group's
   * when there are groups, and one under the section's when there are not.
   * Computed rather than hardcoded because the section owns the `h1` at
   * position 0, which shifts everything below it up a level — and an outline
   * that skips a level does it once per person on the page.
   */
  const LEVELS = { 2: 'h2', 3: 'h3', 4: 'h4' } as const
  const groupLevel = sectionHeadingLevel === 'h1' ? 2 : 3
  const cardLevel = grouped ? groupLevel + 1 : groupLevel
  const GroupHeading = LEVELS[groupLevel as 2 | 3]
  const cardHeadingLevel = LEVELS[cardLevel as 2 | 3 | 4]

  const gridClasses = cn(
    'grid grid-cols-1 gap-5',
    COLUMN_CLASSES[columns],
    // Room for the scatter. `translate` does not affect layout, so without
    // this the nudged cards hang past the section's bottom padding and collide
    // with whatever follows.
    staggerCards && !grouped && 'lg:pb-8'
  )

  /*
   * The scatter is dropped whenever the cards are grouped: inside a group of
   * two or three people an alternating offset is not a scattered row, it is a
   * pair of cards that failed to line up.
   */
  const offsetFor = (position: number) =>
    staggerCards && !grouped
      ? (STAGGER_CLASSES[position % STAGGER_CLASSES.length] ?? '')
      : ''

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Our team') })}
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

        {members.length > 0 ? (
          grouped ? (
            <div className="flex flex-col gap-fx-stack-xl">
              {groups.map((group) => (
                <div key={group.key} className="flex flex-col gap-fx-stack-md">
                  {group.label ? (
                    <Reveal
                      preset={headerPreset}
                      className="flex items-center gap-4"
                    >
                      <GroupHeading className="text-fx-subheading font-semibold text-fx-ink">
                        {group.label}
                      </GroupHeading>
                      {/* Decorative rule that runs the width of the row —
                          the group heading's only ornament, so the grid
                          below it stays the loudest thing on the band. */}
                      <span
                        aria-hidden="true"
                        className="h-px flex-1 bg-fx-line"
                      />
                    </Reveal>
                  ) : null}

                  <ul className={gridClasses}>
                    {group.members.map((member, position) => (
                      <MemberCard
                        key={member.uuid}
                        block={member}
                        index={position}
                        preset={preset}
                        shape={shape}
                        offsetClass={offsetFor(position)}
                        headingLevel={cardHeadingLevel}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className={gridClasses}>
              {members.map((member, position) => (
                <MemberCard
                  key={member.uuid}
                  block={member}
                  index={position}
                  preset={preset}
                  shape={shape}
                  offsetClass={offsetFor(position)}
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

export default TeamGrid
