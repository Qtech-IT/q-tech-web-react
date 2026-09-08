import { useMemo } from 'react'
import { Workflow } from 'lucide-react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { SafeImage } from '@/Components/UI/SafeImage'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
import {
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise'] as const
const SIDES = ['customer', 'input', 'output'] as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/** A `node` row placed by its own `settings.side`. */
function sideOf(block: CmsSectionBlock): (typeof SIDES)[number] {
  return readOption(block.settings, 'side', SIDES, 'output')
}

/** A small circular avatar-or-icon chip, shared by every node placement. */
function NodeMark({
  block,
  size = 'md',
}: {
  block: CmsSectionBlock
  size?: 'sm' | 'md'
}) {
  const label = trimmed(block.label)
  const media = block.media ?? null
  const dimension = size === 'sm' ? 'size-9' : 'size-12'
  const iconDimension = size === 'sm' ? 'size-4' : 'size-5'

  return (
    <div
      className={cn(
        dimension,
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'border border-fx-line bg-fx-surface-2 text-fx-ink-soft'
      )}
    >
      {media?.url ? (
        <SafeImage
          src={media.url}
          alt={label ?? ''}
          width={48}
          height={48}
          className="size-full object-cover"
        />
      ) : isRegisteredNavIcon(block.icon ?? undefined) ? (
        <NavIcon name={block.icon ?? undefined} className={iconDimension} />
      ) : (
        <NavIcon name="User" className={iconDimension} />
      )}
    </div>
  )
}

/**
 * The "without / with" comparison card — two stacked rows, each a value, a
 * label, and a small track-and-thumb switch driven by `settings.enabled`.
 * Purely illustrative: the switch is not interactive, it only shows the state
 * an editor set for that row.
 */
function ComparisonCard({ stats }: { stats: CmsSectionBlock[] }) {
  if (stats.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 rounded-fx-lg border border-fx-line bg-fx-surface p-5 fx-raise-2">
      {stats.map((stat) => {
        const value = trimmed(stat.value)
        const label = trimmed(stat.label)
        const enabled = readBoolean(stat.settings, 'enabled', false)

        if (!value && !label) {
          return null
        }

        return (
          <div key={stat.uuid} className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              {value ? (
                <span className="fx-numerals text-fx-subheading font-semibold text-fx-ink">
                  {value}
                </span>
              ) : null}
              {label ? (
                <span className="text-fx-meta text-fx-ink-faint">{label}</span>
              ) : null}
            </div>

            <span
              aria-hidden="true"
              className={cn(
                'relative h-5 w-9 shrink-0 rounded-fx-pill border transition-colors duration-300 ease-fx',
                enabled
                  ? 'border-fx-accent-line bg-fx-accent'
                  : 'border-fx-line bg-fx-surface-3'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 size-3.5 rounded-full bg-fx-canvas shadow-fx-1',
                  'transition-[left] duration-300 ease-fx',
                  enabled ? 'left-[1.125rem]' : 'left-0.5'
                )}
              />
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** The customer avatar grid. Renders `null` when there are no rows to show. */
function CustomersCard({
  caption,
  customers,
}: {
  caption?: string | undefined
  customers: CmsSectionBlock[]
}) {
  if (customers.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 rounded-fx-lg border border-fx-line bg-fx-surface p-5 fx-raise-2">
      {caption ? (
        <span className="text-fx-meta font-medium text-fx-ink-faint">
          {caption}
        </span>
      ) : null}

      <ul className="grid grid-cols-3 gap-2.5">
        {customers.map((customer) => (
          <li key={customer.uuid} className="aspect-square">
            <NodeMark block={customer} size="sm" />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The team/output panel. Renders `null` when there are no rows to show. */
function TeamCard({
  caption,
  outputs,
}: {
  caption?: string | undefined
  outputs: CmsSectionBlock[]
}) {
  if (outputs.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 rounded-fx-lg border border-fx-line bg-fx-surface p-5 fx-raise-2">
      {caption ? (
        <span className="text-fx-meta font-medium text-fx-ink-faint">
          {caption}
        </span>
      ) : null}

      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-4">
        {outputs.map((node) => {
          const label = trimmed(node.label)

          return (
            <li key={node.uuid} className="flex flex-col items-center gap-2">
              <NodeMark block={node} />
              {label ? (
                <span className="text-fx-meta text-fx-ink-soft">{label}</span>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * The trust callout — a single highlighted badge with a radial glow behind
 * its icon. Renders `null` when the editor has not written a label: unlike
 * the other cards this one has no repeater backing it, so an empty label is
 * the only signal that it was never filled in.
 */
function HighlightCard({
  label,
  icon,
}: {
  label?: string | undefined
  icon?: string | undefined
}) {
  if (!label) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-fx-lg border border-fx-line bg-fx-surface p-6 text-center fx-raise-2">
      <span className="inline-flex items-center gap-2 text-fx-meta font-medium text-fx-ink-faint">
        {label}
      </span>

      <div
        aria-hidden="true"
        className="relative flex size-16 items-center justify-center rounded-full"
      >
        <span
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,var(--fx-wash-accent),transparent_70%)] blur-md"
        />
        <span className="relative flex size-14 items-center justify-center rounded-full bg-fx-accent text-fx-accent-ink shadow-fx-2">
          <NavIcon
            name={icon && isRegisteredNavIcon(icon) ? icon : 'ShieldCheck'}
            className="size-6"
          />
        </span>
      </div>
    </div>
  )
}

/**
 * The hub — the brand's own node in the middle of the diagram — with its
 * input chips fanned out to one side, connected by simple dashed rules built
 * from borders rather than an imported illustration.
 */
function HubCluster({
  hubLabel,
  inputs,
}: {
  hubLabel?: string | undefined
  inputs: CmsSectionBlock[]
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      {inputs.length > 0 ? (
        <ul className="flex items-center gap-3" aria-hidden="true">
          {inputs.map((node, position) => (
            <li key={node.uuid} className="flex items-center gap-3">
              <NodeMark block={node} size="sm" />
              {position < inputs.length - 1 ? (
                <span className="h-px w-4 border-t border-dashed border-fx-line-strong" />
              ) : null}
            </li>
          ))}
          <span className="h-px w-6 border-t border-dashed border-fx-line-strong" />
        </ul>
      ) : null}

      <div className="relative flex size-20 items-center justify-center rounded-full bg-fx-ink text-fx-canvas shadow-fx-3">
        <Workflow aria-hidden="true" className="size-8" />
      </div>

      {hubLabel ? (
        <span className="text-fx-label font-semibold text-fx-ink">
          {hubLabel}
        </span>
      ) : null}
    </div>
  )
}

/**
 * Centered headline over an illustrated "customers in, brand at the centre,
 * team/capabilities out" diagram, with a comparison callout and a trust
 * callout flanking it.
 *
 * COMPOSITION — the copy block is always centered and always first: this hero
 * has no split-column decision to make, unlike `hero.split`. The diagram
 * beneath it is an ORIGINAL abstract composition (three loose columns of
 * cards around a central hub, connected by CSS borders, no imported artwork)
 * inspired by the reference's structure, not its exact geometry or imagery.
 *
 * SURVIVES PARTIAL DATA — every card in the diagram is independently
 * optional: the comparison card needs `stat` rows, the customer grid and team
 * panel each need `node` rows on their own `side`, and the trust callout
 * needs its own label. An editor who fills in only the headline still gets a
 * correct, un-broken hero with no diagram at all.
 *
 * MOTION — `none`/`fade` pass straight through `Reveal` unchanged. `rise`
 * reveals the copy block on mount (eyebrow, heading, subheading, buttons, in
 * that order) and the whole diagram as one unit once it scrolls into view, so
 * the eye settles on the headline before the illustration competes for it.
 */
export function HeroFlow({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings
  const data = section.data

  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'rise')
  const highlightIcon = readString(settings, 'highlight_icon')

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const hubLabel = readString(data, 'hub_label')
  const customersCaption = readString(data, 'customers_caption')
  const teamCaption = readString(data, 'team_caption')
  const highlightLabel = readString(data, 'highlight_label')

  const primaryCta = section.cta ?? null
  const secondaryCta = section.secondary_cta ?? null

  const stats = useMemo(() => blocksOfType(section.blocks, 'stat'), [section.blocks])
  const nodes = useMemo(() => blocksOfType(section.blocks, 'node'), [section.blocks])
  const customers = useMemo(
    () => nodes.filter((node) => sideOf(node) === 'customer'),
    [nodes]
  )
  const inputs = useMemo(
    () => nodes.filter((node) => sideOf(node) === 'input'),
    [nodes]
  )
  const outputs = useMemo(
    () => nodes.filter((node) => sideOf(node) === 'output'),
    [nodes]
  )

  const isEmpty =
    !eyebrow &&
    !heading &&
    !subheading &&
    !primaryCta &&
    !secondaryCta &&
    stats.length === 0 &&
    nodes.length === 0 &&
    !hubLabel &&
    !highlightLabel

  if (isEmpty) {
    return null
  }

  const HeadingTag = index === 0 ? 'h1' : 'h2'
  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const hasDiagram =
    stats.length > 0 ||
    nodes.length > 0 ||
    Boolean(highlightLabel) ||
    Boolean(hubLabel)

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      containerSize="wide"
      clip
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Introduction') })}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 fx-grid-veil opacity-60"
      />

      <div className="flex flex-col items-center gap-fx-stack-lg text-center">
        {eyebrow ? (
          <Reveal preset={animation} trigger="mount" index={0}>
            <p className="inline-flex items-center gap-2.5 rounded-fx-pill border border-fx-line bg-fx-surface px-4 py-2 text-fx-eyebrow uppercase text-fx-ink-soft">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-fx-accent" />
              {eyebrow}
            </p>
          </Reveal>
        ) : null}

        {heading ? (
          <Reveal preset={animation} trigger="mount" index={1}>
            <HeadingTag
              {...(headingId ? { id: headingId } : {})}
              className={cn(
                'max-w-4xl text-balance text-fx-ink',
                index === 0 ? 'text-fx-display' : 'text-fx-title'
              )}
            >
              {heading}
            </HeadingTag>
          </Reveal>
        ) : null}

        {subheading ? (
          <Reveal preset={animation} trigger="mount" index={2}>
            <p className="max-w-2xl text-pretty text-fx-lead text-fx-ink-soft">
              {subheading}
            </p>
          </Reveal>
        ) : null}

        {primaryCta || secondaryCta ? (
          <Reveal preset={animation} trigger="mount" index={3}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <SectionCta
                cta={primaryCta}
                size="lg"
                fallbackVariant="default"
                buttonClassName={fxButton({ tone: 'solid', scale: 'lg' })}
              />
              <SectionCta
                cta={secondaryCta}
                size="lg"
                fallbackVariant="outline"
                buttonClassName={fxButton({ tone: 'outline', scale: 'lg' })}
              />
            </div>
          </Reveal>
        ) : null}
      </div>

      {hasDiagram ? (
        <Reveal preset={animation} index={4} className="mt-fx-stack-xl">
          <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-5">
              <ComparisonCard stats={stats} />
              <CustomersCard caption={customersCaption} customers={customers} />
            </div>

            <div className="order-first lg:order-none">
              <HubCluster hubLabel={hubLabel} inputs={inputs} />
            </div>

            <div className="flex flex-col gap-5">
              <HighlightCard label={highlightLabel} icon={highlightIcon} />
              <TeamCard caption={teamCaption} outputs={outputs} />
            </div>
          </div>
        </Reveal>
      ) : null}
    </Section>
  )
}

export default HeroFlow
