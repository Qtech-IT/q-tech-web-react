import { handleLogout } from "@/Controllers/Backend/AuthController"
import { useForm } from "@/Hooks/useForm"
import { usePage } from "@inertiajs/react"
import { ConfirmDialog } from "./ConfirmDialog"

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {

  const { loading: isSubmitting, errors: serverErrors, submit } = useForm<any>()

  const { auth } = usePage().props as any;

  const isImpersonating: boolean = auth.isImpersonating;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isImpersonating ? 'Stop impersonating' : 'Sign out'}
      desc={
        isImpersonating
          ? 'You are currently impersonating another user. Stopping will return you to your original account.'
          : 'Are you sure you want to sign out? You will need to sign in again to access your account.'
      }
      confirmText={isImpersonating ? 'Yes, stop impersonating' : 'Yes, sign out'}
      handleConfirm={() => {
        handleLogout(submit)
        onOpenChange(false)
      }}
      isLoading={isSubmitting}
      className='sm:max-w-sm'
    />
  )
}
