import { Alert, AlertDescription } from "@/Components/UI/Alert"
import { Button } from "@/Components/UI/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/UI/Card"
import { AlertTriangle, Check, Copy, Download } from "lucide-react"
import { useState } from "react"

interface RecoveryCodesSectionProps {
  recoveryCodes: string[]
  t: (key: string) => string
}

export function RecoveryCodesSection({ recoveryCodes, t }: RecoveryCodesSectionProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text)
      if (index !== undefined) {
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
      } else {
        setCopiedAll(true)
        setTimeout(() => setCopiedAll(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyAllCodes = () => {
    const allCodes = recoveryCodes.join('\n')
    copyToClipboard(allCodes)
  }

  const downloadCodes = () => {
    const content = recoveryCodes.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'recovery-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
              <AlertTriangle className="h-5 w-5" />
              {t('Recovery Codes')}
            </CardTitle>
            <CardDescription className="text-amber-800/80 dark:text-amber-200/70">
              {t('Store these codes securely. Each code can only be used once to access your account if you lose your authenticator device.')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-amber-300 bg-amber-100/50 dark:border-amber-800 dark:bg-amber-900/20">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertDescription className="text-sm text-amber-900 dark:text-amber-100">
            {t('Save these codes in a safe place. If you lose access to your authenticator, you will need these to recover your account.')}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recoveryCodes?.map((code, i) => (
            <div
              key={i}
              className="group relative flex items-center justify-between rounded-lg border border-amber-200 bg-white px-4 py-3  text-sm shadow-sm transition-all hover:border-amber-300 hover:shadow dark:border-amber-900/50 dark:bg-amber-950/30 dark:hover:border-amber-800"
            >
              <span className="text-amber-900 dark:text-amber-100">{code}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => copyToClipboard(code, i)}
              >
                {copiedIndex === i ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-amber-600" />
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyAllCodes}
            className="border-amber-300 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-100 dark:hover:bg-amber-900/30"
          >
            {copiedAll ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t('Copied!')}
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                {t('Copy All Codes')}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCodes}
            className="border-amber-300 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-100 dark:hover:bg-amber-900/30"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('Download Codes')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}