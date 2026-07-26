import { Button } from '@/Components/UI/Button'
import { useTranslations } from '@/Hooks/useTranslations'
import { getSiteSettings } from '@/Utils/helpers'
import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowLeft, Home, Mail } from 'lucide-react'
import { type ReactNode } from 'react'

interface ErrorLayoutProps {
  code: string | number
  title: string
  message: string
  icon: ReactNode
  showHomeButton?: boolean | undefined
  showBackButton?: boolean | undefined
  children?: ReactNode | undefined
  customMessage?: string | undefined
  contactUrl?: string | undefined
  showContact?: boolean | undefined
}

export default function ErrorLayout({
  code,
  title,
  message,
  icon,
  showHomeButton = true,
  showBackButton = true,
  children,
  customMessage,
  contactUrl,
  showContact = true
}: ErrorLayoutProps) {

  const { t } = useTranslations();

  const { props } = usePage()

  const { site_theme_settings: siteSettings } = props as any;

  const contactEmail = siteSettings
    ? getSiteSettings(siteSettings, 'site_email')
    : null;

  const hasContactUrl = contactUrl !== undefined && contactUrl !== null;
  const hasContactEmail = contactEmail !== undefined && contactEmail !== null;
  const shouldShowContact = showContact && (hasContactUrl || hasContactEmail);

  return (
    <>
      <Head title={`${code} - ${title}`} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                {icon}
              </div>
              <h1 className="text-7xl font-bold text-white mb-2">{code}</h1>
              <p className="text-xl text-white/90 break-words overflow-wrap-anywhere px-4">
                {t(title)}
              </p>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-6">


              {children}

              {(showHomeButton || showBackButton) && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  {showHomeButton && (
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        {t('Back to Home')}
                      </Link>
                    </Button>
                  )}

                  {showBackButton && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => window.history.back()}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t("Go Back")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer Text with Contact Options */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 space-y-3">
            <p className="break-words">
              {t('Error Code')}: {code}
            </p>

            {shouldShowContact && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span>{t('Need help?')}</span>

                {/* Contact Page Link */}
                {hasContactUrl && (
                  <Link
                    href={contactUrl}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline inline-flex items-center gap-1"
                  >
                    {t('Contact Support')}
                  </Link>
                )}

                {/* Or separator if both exist */}
                {hasContactUrl && hasContactEmail && (
                  <span className="text-gray-400">|</span>
                )}

                {/* Email Link */}
                {hasContactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline inline-flex items-center gap-1 break-all"
                  >
                    <Mail className="w-3 h-3" />
                    {t('Email Us')}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}