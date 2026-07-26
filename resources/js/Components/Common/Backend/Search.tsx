import { Button } from '@/Components/UI/Button'
import { useSearch } from '@/Contexts/Backend/SearchProvider'
import { cn } from '@/Utils/helpers'
import { SearchIcon } from 'lucide-react'

interface SearchProps {
  className?: string
  placeholder?: string
}

export function Search({ className = '', placeholder = 'Search' }: SearchProps) {
  const { setOpen } = useSearch() as { setOpen: (open: boolean) => void }

  return (
    <Button
      variant='outline'
      className={cn(
        'bg-muted/25 group text-muted-foreground hover:bg-accent relative h-8 w-full flex-1 justify-start rounded-md text-sm font-normal shadow-none sm:w-40 sm:pe-12 md:flex-none lg:w-52 xl:w-64',
        className
      )}
      onClick={() => setOpen(true)}
    >
      <SearchIcon
        aria-hidden='true'
        className='absolute start-1.5 top-1/2 -translate-y-1/2'
        size={16}
      />
      <span className='ms-4'>{placeholder}</span>
      <kbd className='bg-muted group-hover:bg-accent pointer-events-none absolute end-[0.3rem] top-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5  text-[11px] font-medium opacity-100 select-none sm:flex'>
        <span className='text-xs'>⌘</span>K
      </kbd>
    </Button>
  )
}
