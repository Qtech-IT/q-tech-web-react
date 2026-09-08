import { Loader } from 'lucide-react'
import { cn, isEmptySelectValue } from '@/Utils/helpers'
import { FormControl } from '@/Components/UI/Form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select'
import { useTranslations } from '@/Hooks/useTranslations'

interface SelectDropdownProps {
  defaultValue?: any
  onValueChange?: (value: any) => void
  isPending?: boolean
  items?: { label: string; value: any }[]
  placeholder?: string
  disabled?: boolean
  className?: string
  isControlled?: boolean
}

export function SelectDropdown({
  defaultValue,
  onValueChange,
  isPending,
  items,
  placeholder,
  disabled,
  className = '',
  isControlled = false,
}: SelectDropdownProps) {

  const defaultState = isControlled
    ? { value: defaultValue, onValueChange }
    : { defaultValue, onValueChange }


  const {t} = useTranslations();

  return (
    <Select {...(defaultState as any)}>
      <FormControl>
        <SelectTrigger disabled={disabled} className={cn(className)}>
          <SelectValue placeholder={placeholder ?? 'Select'} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {isPending ? (
          <SelectItem disabled value='loading' className='h-14'>
            <div className='flex items-center justify-center gap-2'>
              <Loader className='h-5 w-5 animate-spin' /> {t('Loading')}...
            </div>
          </SelectItem>
        ) : (
          /* Radix rejects `value=""`, so a caller's placeholder-style option
             is dropped here — `SelectValue`'s placeholder already covers it. */
          items?.filter(({ value }) => !isEmptySelectValue(value))
            .map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
