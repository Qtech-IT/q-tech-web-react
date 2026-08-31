import type { ReactElement } from 'react'
import { Link } from '@inertiajs/react'

import type { ContentPageProps } from '@/Components/Frontend/Pages/ContentPage'
import { ContentPage } from '@/Components/Frontend/Pages/ContentPage'
import { Container } from '@/Components/Public/Container'
import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { useTranslations } from '@/Hooks/useTranslations'
import PublicLayout from '@/Layouts/Public/PublicLayout'

export type NotFoundProps = ContentPageProps

/**
 * The last-resort 404 body.
 *
 * This is the one place on the site that is allowed to hardcode copy, and only
 * because of when it renders: a fresh install where nobody has authored the
 * `/404` page yet. A blank 404 reads as a second failure stacked on the first.
 * It is translated, it is short, and it is not marketing copy — the moment an
 * editor creates a page at `/404`, that page replaces all of this.
 */
function NotFoundBody() {
  const { t } = useTranslations()

  return (
    <Section spacing="lg">
      <Container size="narrow" className="text-center">
        <p className="text-fx-eyebrow uppercase text-fx-ink-faint">
          {t('Error 404')}
        </p>

        <h1 className="mt-fx-stack-sm text-balance text-fx-display text-fx-ink">
          {t('This page could not be found')}
        </h1>

        <p className="mt-fx-stack-sm text-pretty text-fx-lead text-fx-ink-soft">
          {t(
            'The link may be out of date, or the page may have moved. The navigation above will take you anywhere on the site.'
          )}
        </p>

        <div className="mt-fx-stack-md flex justify-center">
          <Link href="/" className={fxButton({ tone: 'solid', scale: 'lg' })}>
            {t('Back to home')}
          </Link>
        </div>
      </Container>
    </Section>
  )
}

/**
 * The 404 page.
 *
 * Renders through the normal section pipeline when an editor has authored a
 * `system` page at `/404`, so the copy, artwork and "try one of these instead"
 * links are all editable — a hardcoded 404 is the one page on a CMS-driven site
 * that is guaranteed to go stale. `NotFoundBody` is what shows until then.
 *
 * The response carries a real 404 status in both cases — see
 * `PageController::notFound()`.
 */
export default function NotFound(props: NotFoundProps) {
  return <ContentPage {...props} emptyState={<NotFoundBody />} />
}

NotFound.layout = (page: ReactElement) => <PublicLayout>{page}</PublicLayout>
