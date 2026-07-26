import { useEffect, useRef } from 'react'
import LoadingBar from 'react-top-loading-bar'

export function NavigationProgress() {
  const ref = useRef<any>(null)

  return (
    <LoadingBar
      color='var(--muted-foreground)'
      ref={ref}
      shadow={true}
      height={2}
    />
  )
}
