// Components/Backend/Profile/OtpVerificationModal.tsx

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/UI/Dialog'
import { Button } from '@/Components/UI/Button'
import { Input } from '@/Components/UI/Input'
import { Alert, AlertDescription } from '@/Components/UI/Alert'
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslations } from '@/Hooks/useTranslations'
import axios from 'axios'
import { router } from '@inertiajs/react'
import toast from 'react-hot-toast'
import { FormLabel } from '@/Components/UI/Form'

interface OtpVerificationModalProps {
  open: boolean
  onClose: () => void
  email: string
  routePrefix: string
}

export function OtpVerificationModal({ open, onClose, email, routePrefix }: OtpVerificationModalProps) {
  const { t } = useTranslations()
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (open && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [open, timer])

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP')
      return
    }

    setIsVerifying(true)
    setError('')
   

    try {
      const response = await axios.post(route(`${routePrefix}.verify-email-otp`), {
        otp,
        email
      })

      if (response.data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.reload({ only: ['user'] })
          onClose()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError('')

    try {
      const response = await axios.post(route(`${routePrefix}.resend-otp`))

      if (response.data.success) {
        setTimer(60)
        setCanResend(false)
        setError('')
        toast.success(response.data.message)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setIsResending(false)
    }
  }

  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6)
    setOtp(numericValue)
    setError('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}
    >
      <DialogContent
         onInteractOutside={(e) => e.preventDefault()}
         onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-primary" />
            <DialogTitle>{t('Verify Email')}</DialogTitle>
          </div>
          <DialogDescription>
            {t('We sent a 6-digit verification code to')} <strong>{email}</strong>
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {t('Email verified successfully!')}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* OTP Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium ">{t('Enter OTP')} </label>
              
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                placeholder="000000"
                className="text-center text-2xl tracking-widest  mt-2"
                disabled={isVerifying}
              />
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Timer */}
            {!canResend && timer > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                {t('Resend OTP in')} {timer}s
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleVerify}
                disabled={isVerifying || otp.length !== 6}
                className="flex-1"
              >
                {isVerifying ? t('Verifying...') : t('Verify')}
              </Button>

              <Button
                onClick={handleResend}
                disabled={!canResend || isResending}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? t('Sending...') : t('Resend')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}