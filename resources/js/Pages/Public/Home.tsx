import { PageWrapper } from '@/Components/Public/PageWrapper'
import { Section } from '@/Components/Public/Section'
import { Badge } from '@/Components/UI/Badge'
import { Button } from '@/Components/UI/Button'
import { useTranslations } from '@/Hooks/useTranslations'
import PublicLayout from '@/Layouts/Public/PublicLayout'

export interface HomeProps {
  title?: string
}

/**
 * Public homepage.
 *
 * Phase 1 deliberately ships a foundation shell, NOT marketing sections. The
 * content below exists to exercise the layout, tokens and theme system; every
 * block here is replaced by CMS-driven sections in a later phase.
 */
export default function Home({ title }: HomeProps) {
  const { t } = useTranslations()

  return (
    <PageWrapper
      title={title ?? t('Home')}
      description={t(
        'Enterprise software engineering, cloud and product teams that scale with you.'
      )}
    >
      <Section spacing="lg">
        <div className="flex max-w-3xl flex-col items-start gap-6">
          <Badge variant="secondary">{t('Phase 1 · Foundation')}</Badge>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t('The foundation is in place.')}
          </h1>

          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            {t(
              'Design tokens, the theme system and the responsive application shell are ready. Page sections will be driven entirely by the CMS.'
            )}
          </p>

          {/* Not links: `/contact` and `/case-studies` are not routed yet, so
              real anchors here would 404. They become CMS-driven CTAs once
              those pages exist. */}
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" disabled>
              {t('Contact Sales')}
            </Button>
            <Button size="lg" variant="outline" disabled>
              {t('View Our Work')}
            </Button>
          </div>
        </div>
      </Section>

      <Section background="subtle">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('What this phase delivers')}
        </h2>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: t('Design tokens'),
              body: t(
                'Typography, spacing, elevation and colour as tokens, verified for AA contrast in both themes.'
              ),
            },
            {
              title: t('Theme system'),
              body: t(
                'Light, dark and system modes, resolved on the server so there is no flash on first paint.'
              ),
            },
            {
              title: t('Application shell'),
              body: t(
                'Sticky header, accessible mega menu, mobile drawer and footer — all driven by data, not markup.'
              ),
            },
          ].map((item) => (
            <li
              key={item.title}
              className="rounded-lg border border-border bg-card p-6 shadow-e1"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </PageWrapper>
  )
}

Home.layout = (page: React.ReactElement) => <PublicLayout>{page}</PublicLayout>
