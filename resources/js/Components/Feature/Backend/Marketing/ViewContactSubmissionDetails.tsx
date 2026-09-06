import { router } from '@inertiajs/react'
import { useState } from 'react'
import { Building2, Clock, Globe, Mail, MapPin, Phone, User } from 'lucide-react'

import { Badge } from '@/Components/UI/Badge'
import { Button } from '@/Components/UI/Button'
import { useTranslations } from '@/Hooks/useTranslations'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: any | null
  config?: any
}

const STATUSES = ['new', 'read', 'replied', 'archived', 'spam'] as const

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

export function ViewContactSubmissionDetails({ item, onOpenChange }: Props) {
  const { t } = useTranslations()
  const [saving, setSaving] = useState<string | null>(null)

  if (!item) {
    return null
  }

  const setStatus = (status: string) => {
    setSaving(status)
    router.patch(
      route('backend.contact-submissions.update', item.uuid),
      { handling_status: status },
      {
        preserveScroll: true,
        onFinish: () => setSaving(null),
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">{t('Status')}:</span>
        {STATUSES.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={item.handling_status === status ? 'default' : 'outline'}
            disabled={saving !== null}
            onClick={() => setStatus(status)}
            className="h-7 px-2.5 text-xs capitalize"
          >
            {saving === status ? '…' : status}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <Row icon={User} label={t('Name')} value={item.name} />
        <Row icon={Mail} label={t('Email')} value={item.email} />
        <Row icon={Phone} label={t('Phone')} value={item.phone} />
        <Row icon={Building2} label={t('Company')} value={item.company} />
      </div>

      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">{t('Message')}</p>
        <p className="whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-gray-200">
          {item.message}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-700 sm:grid-cols-3">
        <Row icon={Clock} label={t('Received')} value={item.created_at} />
        <Row icon={Clock} label={t('Replied')} value={item.replied_at} />
        <Row icon={Globe} label={t('Source')} value={item.source} />
        <Row icon={MapPin} label={t('IP')} value={item.ip} />
        <Row icon={Globe} label={t('Locale')} value={item.locale} />
      </div>

      <div className="flex flex-wrap gap-2">
        <a href={`mailto:${item.email}`} className="inline-flex">
          <Badge variant="outline" className="cursor-pointer gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {t('Reply by email')}
          </Badge>
        </a>
      </div>
    </div>
  )
}

export default ViewContactSubmissionDetails
