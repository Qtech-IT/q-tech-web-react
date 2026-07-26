import * as React from 'react'
import { Loader2, Save } from 'lucide-react'

type ButtonLoaderProps = {
  isSubmitting?: boolean
  btnText?: string
  loaderText?: string
  icon?: React.ReactNode | null,
  initialIcon?:boolean,
  showButtonText?:boolean
}

function ButtonLoader({
  isSubmitting = false,
  btnText = 'Save Changes',
  loaderText = 'Saving...',
  icon = null,
  initialIcon = true,
  showButtonText = true
  
}: ButtonLoaderProps) {
  return (
    <>
      {isSubmitting ? (
        <Loader2 key="loader" className="w-4 h-4 animate-spin" />
      ) : (

        initialIcon && (
        <React.Fragment key="icon">
          {icon ? icon : <Save className="w-4 h-4" />}
        </React.Fragment>)
      )}
      {showButtonText && <span key="text">{isSubmitting ? loaderText : btnText}</span>}
    </>
  )
}

export { ButtonLoader }
