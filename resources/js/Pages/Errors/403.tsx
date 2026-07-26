import ErrorLayout from '@/Layouts/ErrorLayout'
import { ShieldAlert } from 'lucide-react'

interface ForbiddenProps {
  message?: string
  status?: number
}

export default function Forbidden({ message, status }: ForbiddenProps) {
  return (
    <ErrorLayout
      code={status || 403}
      title="Access Forbidden"
      message="You don't have permission to access this resource. Please contact your administrator if you believe this is an error."
      customMessage={message}
      icon={<ShieldAlert className="w-12 h-12 text-white" />}
    />
  )
}