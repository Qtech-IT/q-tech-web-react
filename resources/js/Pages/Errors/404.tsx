import ErrorLayout from '@/Layouts/ErrorLayout'
import { FileQuestion } from 'lucide-react'

interface NotFoundProps {
  message?: string
  status?: number
}

export default function NotFound({ message, status }: NotFoundProps) {

  return (
    <ErrorLayout
      code={status || 404}
      title="Page Not Found"
      message="The page you're looking for might have been removed, had its name changed, or is temporarily unavailable."
      customMessage={message}
      icon={<FileQuestion className="w-12 h-12 text-white" />}
    />
  )
}