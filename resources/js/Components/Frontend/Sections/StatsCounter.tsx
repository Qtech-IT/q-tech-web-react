import { useMemo } from 'react'

import { NavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionHeader } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import { StatValue } from '@/Components/Frontend/Sections/Shared/StatValue'
import {
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { SectionComponentProps } from '@/Types/sections'

const COLUMNS = ['2', '3', '4'] as const

/**
 * Static class map, indexed by a value `readOption` has already constrained.
 *
 * Tailwind compiles by scanning source text, so a template literal like
 * `grid-cols-${n}` produces a class that exists in the DOM and nowhere in the
 * CSS. Every dynamic grid in this codebase must be a lookup, not a string.
 */
const COLUMN_CLASSES = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
} as const

/**
 * A band of counted statistics.
 *
 * Deliberately plainer than the hero: this section's only job is to make a
 * handful of numbers land, so hierarchy comes from the type scale and a hairline
 * grid rather than from cards, colour or elevation.
 *
 * Renders `null` when there is neither a header nor a single stat row — which is
 * the section's live state on a fresh install, where it exists but has not been
 * filled in yet.
 */
export function StatsCounter({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings
  const data = section.data

  const columns = readOption(settings, 'columns', COLUMNS, '4')
  const animateCounters = readBoolean(settings, 'animate', true)

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const footnote = readString(data, 'footnote')

  const stats = useMemo(() => blocksOfType(section.blocks, 'stat'), [section.blocks])

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && stats.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined

  return (
    <Section
      spacing="default"
      background="subtle"
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Key figures') })}
    >
      <div className="flex flex-col gap-fx-stack-lg">
        <SectionHeader
          eyebrow={eyebrow}
          heading={heading}
          subheading={subheading}
          headingLevel={index === 0 ? 'h1' : 'h2'}
          headingSize={index === 0 ? 'h1' : 'h2'}
          {...(headingId ? { headingId } : {})}
        />

        {stats.length > 0 ? (
          <ul
            className={cn(
              'grid gap-x-10 gap-y-fx-stack-lg',
              COLUMN_CLASSES[columns]
            )}
          >
            {stats.map((stat, position) => {
              const value = trimmed(stat.value)
              const label = trimmed(stat.label)
              const description = trimmed(stat.description)

              if (!value && !label) {
                return null
              }

              return (
                <Reveal
                  key={stat.uuid}
                  as="li"
                  preset="stagger"
                  index={position}
                  className="border-t border-fx-line-strong pt-fx-stack-md"
                >
                  {stat.icon ? (
                    <NavIcon
                      name={stat.icon}
                      className="mb-4 size-5 text-fx-accent-text"
                    />
                  ) : null}

                  {value ? (
                    <StatValue
                      value={value}
                      animateCounter={animateCounters}
                      className="fx-numerals block text-fx-stat text-fx-ink"
                    />
                  ) : null}

                  {label ? (
                    <span className="mt-3 block text-fx-body font-medium text-fx-ink">
                      {label}
                    </span>
                  ) : null}

                  {description ? (
                    <p className="mt-1.5 text-fx-body-sm text-pretty text-fx-ink-soft">
                      {description}
                    </p>
                  ) : null}
                </Reveal>
              )
            })}
          </ul>
        ) : null}

        {footnote ? (
          <p className="text-fx-meta text-fx-ink-faint">{footnote}</p>
        ) : null}
      </div>
    </Section>
  )
}

export default StatsCounter
