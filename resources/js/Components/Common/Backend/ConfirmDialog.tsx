import * as React from 'react'
import { cn } from '@/Utils/helpers'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/UI/AlertDialog'

import { Button } from '@/Components/UI/Button'
import { Loader2 } from 'lucide-react'
import { useTranslations } from '@/Hooks/useTranslations'

interface ConfirmDialogProps {
  title: string
  desc?: string | React.ReactNode
  children?: React.ReactNode
  className?: string
  confirmText?: string
  cancelBtnText?: string
  destructive?: boolean
  isLoading?: boolean
  disabled?: boolean
  handleConfirm: () => void
  isSubmitting?: boolean
  [key: string]: any 
}

export function ConfirmDialog({
  title,
  desc,
  children,
  className,
  confirmText,
  cancelBtnText,
  destructive,
  isLoading = false,
  disabled = false,
  handleConfirm,
  isSubmitting,
  ...actions
}: ConfirmDialogProps) {

  const {t} = useTranslations();
  return (
    <AlertDialog {...actions}>
      <AlertDialogContent className={cn(className && className)}>
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{desc}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t(cancelBtnText ?? 'Cancel')}
          </AlertDialogCancel>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={disabled || isLoading}
          >
            {isLoading && <Loader2 className="animate-spin mr-2" />} {t(confirmText ?? 'Continue')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
