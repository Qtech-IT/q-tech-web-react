import { CommandMenu } from '@/Components/Common/Backend/CommandMenu';
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react';
const SearchContext = createContext<any>(null)

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandMenu />
    </SearchContext.Provider>
  )
}

export const useSearch = (): any => {
  const searchContext = useContext(SearchContext)
  if (!searchContext) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return searchContext
}
