import { useTranslations } from '@/Hooks/useTranslations'
import ErrorLayout from '@/Layouts/ErrorLayout'
import { ServerCrash } from 'lucide-react'

interface ServerErrorProps {
  message?: string
  status?: number
  originalStatus?: number
}

export default function ServerError({ message, status, originalStatus }: ServerErrorProps) {
  const isDevelopment = import.meta.env.DEV;

  const { t } = useTranslations();

  return (
    <ErrorLayout
      code={status || 500}
      title={t(`internal_server_error`)}
      message={t(`something_went_wrong_on_our_end. We're_working_to_fix the_issue_please_try_again_later`)}
      customMessage={message}
      icon={<ServerCrash className="w-12 h-12 text-white" />}
      showBackButton={false}
    >
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
          {t('What you can do:')}
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span> {t('Refresh the page and try again')} </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>
              {t('Clear your browser cache')}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>
              {t('Contact support if the problem persists')}
            </span>
          </li>
        </ul>

        {/* Development Info */}
        {/* {isDevelopment && originalStatus === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 font-semibold mb-1">
              {t('Development Info')}:
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 ">
              {t('Generic Exception thrown (code: 0) - Message')}: {message}
            </p>
          </div>
        )}
 */}


        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200 font-semibold mb-1">
            {t('Development Info')}:
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 ">
            {t('Generic Exception thrown (code: 0) - Message')}: {message}
          </p>
        </div>


      </div>
    </ErrorLayout>
  )
}