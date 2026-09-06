import { Clock, Globe, Mail, MapPin } from 'lucide-react'

import { Badge } from '@/Components/UI/Badge'
import { useTranslations } from '@/Hooks/useTranslations'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: any | null
  config?: any
}

function Row({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string | null }) {
  if (!value) {
    return null
  }

  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        <p className="break-words text-sm text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  )
}

export function ViewSubscriberDetails({ item }: Props) {
  const { t } = useTranslations()

  if (!item) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{item.email}</span>
        <Badge variant="outline" className="text-xs">
          {item.subscription_status_label ?? item.subscription_status}
        </Badge>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <Row icon={Clock} label={t('Opted In')} value={item.consent_at} />
        <Row icon={Clock} label={t('Unsubscribed')} value={item.unsubscribed_at} />
        <Row icon={Globe} label={t('Source')} value={item.source} />
        <Row icon={Globe} label={t('Locale')} value={item.locale} />
        <Row icon={MapPin} label={t('Consent IP')} value={item.consent_ip} />
      </div>

      <p className="text-xs text-gray-400">
        {t('Consent state is the subscriber’s to change. Use bulk actions to soft-disable or remove a record.')}
      </p>
    </div>
  )
}

export default ViewSubscriberDetails
