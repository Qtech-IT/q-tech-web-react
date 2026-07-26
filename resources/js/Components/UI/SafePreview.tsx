import React from 'react'
import DOMPurify from 'dompurify'

interface SafePreviewProps {
  html: string
  className?:string
}

export const SafePreview: React.FC<SafePreviewProps> = ({ html ,className = null }) => {
  return (
    <div
      className="p-3 mt-1 border rounded-md bg-muted/30 "
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  )
}
