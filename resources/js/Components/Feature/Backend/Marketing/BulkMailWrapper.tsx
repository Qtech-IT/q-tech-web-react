import { useMemo, useState } from 'react'
import { Eye, Send, Users } from 'lucide-react'

import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader'
import { Button } from '@/Components/UI/Button'
import { Card } from '@/Components/UI/Card'
import { useForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { MainLayout } from '@/Layouts/User/MainLayout'
import type { BreadcrumbProps } from '@/Types'

type Template = { id: number; uuid: string; name: string; subject: string }
type Audience = { label: string; eligible: number; can: boolean }

type Props = {
  title: string
  templates: Template[]
  audiences: { subscribers: Audience; contacts: Audience }
}

export function BulkMailWrapper({ title, templates, audiences }: Props) {
  const { t } = useTranslations()
  const { loading, submit } = useForm()

  const firstAllowed = audiences.subscribers.can ? 'subscribers' : audiences.contacts.can ? 'contacts' : 'subscribers'
  const [audience, setAudience] = useState<'subscribers' | 'contacts'>(firstAllowed)
  const [templateUuid, setTemplateUuid] = useState(templates[0]?.uuid ?? '')
  const [mode, setMode] = useState<'send' | 'mark'>('send')
  const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const current = audiences[audience]
  const canProceed = current.can && templateUuid !== '' && current.eligible > 0

  const breadcrumbItems: BreadcrumbProps = useMemo(
    () => [
      { label: t('Dashboard'), href: route('backend.dashboard') },
      { label: t('Send Campaign'), href: null },
    ],
    [t]
  )

  const runPreview = () => {
    setResult(null)
    void submit({
      url: route('backend.marketing.bulk-mail.preview'),
      method: 'POST',
      data: { template: templateUuid },
      onSuccess: (page: any) => {
        const p = page?.props?.flash?.data?.preview ?? page?.props?.preview
        if (p) setPreview(p)
      },
    }).catch(() => undefined)
  }

  const runSend = () => {
    setConfirming(false)
    setResult(null)
    void submit({
      url: route('backend.marketing.bulk-mail.send'),
      method: 'POST',
      data: { audience, template: templateUuid, mode },
      onSuccess: (page: any) => {
        const msg = page?.props?.flash?.success ?? t('Done.')
        setResult(msg)
      },
    }).catch(() => undefined)
  }

  return (
    <MainLayout title={title}>
      <CommonLayoutHeader
        variant="index"
        breadcrumbItems={breadcrumbItems}
        title={t('Send Campaign')}
        description={t('Send one notification template to your subscribers or to people who have contacted you')}
        icon={Send}
      />

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="flex flex-col gap-6 p-6">
          {/* Audience */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t('Audience')}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(['subscribers', 'contacts'] as const).map((key) => {
                const a = audiences[key]
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!a.can}
                    onClick={() => setAudience(key)}
                    className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${
                      audience === key
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    } ${!a.can ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      <Users className="h-4 w-4" />
                      {a.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {a.can
                        ? t(':count eligible', { count: a.eligible })
                        : t('No permission')}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Template */}
          <div>
            <label htmlFor="bm-template" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('Template')}
            </label>
            <select
              id="bm-template"
              value={templateUuid}
              onChange={(e) => {
                setTemplateUuid(e.target.value)
                setPreview(null)
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              {templates.length === 0 ? (
                <option value="">{t('No email templates available')}</option>
              ) : (
                templates.map((tpl) => (
                  <option key={tpl.uuid} value={tpl.uuid}>
                    {tpl.name} — {tpl.subject}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Mode */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t('Action')}</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="radio"
                  name="bm-mode"
                  checked={mode === 'send'}
                  onChange={() => setMode('send')}
                  className="mt-0.5"
                />
                <span>
                  {t('Send the email now')}
                  <span className="block text-xs text-gray-500">
                    {t('Each recipient is queued and delivered in the background.')}
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="radio"
                  name="bm-mode"
                  checked={mode === 'mark'}
                  onChange={() => setMode('mark')}
                  className="mt-0.5"
                />
                <span>
                  {t('Just mark as contacted')}
                  <span className="block text-xs text-gray-500">
                    {t('Stamps “last contacted” without sending — for a send you made elsewhere.')}
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={runPreview} disabled={loading || templateUuid === ''}>
              <Eye className="h-4 w-4" />
              {t('Preview')}
            </Button>
            <Button onClick={() => setConfirming(true)} disabled={loading || !canProceed}>
              <Send className="h-4 w-4" />
              {mode === 'send'
                ? t('Send to :count', { count: current.eligible })
                : t('Mark :count contacted', { count: current.eligible })}
            </Button>
          </div>

          {result ? (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
              {result}
            </p>
          ) : null}
        </Card>

        <Card className="flex flex-col gap-3 p-6">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('Preview')}</p>
          {preview ? (
            <>
              <p className="text-xs text-gray-500">
                {t('Subject')}: <span className="text-gray-800 dark:text-gray-200">{preview.subject}</span>
              </p>
              <iframe
                title={t('Email preview')}
                srcDoc={preview.html}
                className="h-[28rem] w-full rounded-md border border-gray-200 bg-white dark:border-gray-700"
              />
            </>
          ) : (
            <p className="text-sm text-gray-400">{t('Choose a template and click Preview.')}</p>
          )}
        </Card>
      </div>

      {confirming ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="max-w-md p-6">
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {mode === 'send' ? t('Send this campaign?') : t('Mark as contacted?')}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {mode === 'send'
                ? t('This queues an email to :count recipients in :audience. It cannot be recalled once sent.', {
                    count: current.eligible,
                    audience: current.label,
                  })
                : t(':count records in :audience will be stamped as contacted.', {
                    count: current.eligible,
                    audience: current.label,
                  })}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirming(false)}>
                {t('Cancel')}
              </Button>
              <Button onClick={runSend} disabled={loading}>
                {mode === 'send' ? t('Send now') : t('Mark')}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </MainLayout>
  )
}

export default BulkMailWrapper
