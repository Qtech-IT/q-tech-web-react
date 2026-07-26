import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/Utils/helpers'
import { Button } from '@/Components/UI/Button'
import { Calendar } from '@/Components/UI/Calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/Components/UI/Popover'

type Range = { from?: Date; to?: Date } | null

interface DateRangePickerProps {
  value?: string | null
  onChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  value = null,
  onChange,
  placeholder = 'Pick a date range',
  disabled = false,
  className = '',
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<Range>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof value === 'string' && value.includes(' - ')) {
      const [startStr, endStr] = value.split(' - ')
      if (startStr && endStr) {
        const from = new Date(startStr)
        const to = new Date(endStr)
        if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
          setDateRange({ from, to })
          return
        }
      }
    }
    setDateRange(null)
  }, [value])

  const handleSelect = (range?: { from?: Date; to?: Date } | null) => {
    if (!range) return

    setDateRange(range)

    if (range.from && range.to) {
      const formatted = `${format(range.from, 'M/d/yyyy')} - ${format(
        range.to,
        'M/d/yyyy'
      )}`
      onChange?.(formatted)
      setTimeout(() => setIsOpen(false), 300)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && dateRange?.from && !dateRange?.to) return
    setIsOpen(open)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDateRange(null)
    onChange?.(null)
  }

  const displayText =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, 'M/d/yyyy')} - ${format(
          dateRange.to,
          'M/d/yyyy'
        )}`
      : dateRange?.from
      ? `${format(dateRange.from, 'M/d/yyyy')} - ...`
      : null

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !displayText && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText ?? placeholder}

          {displayText && (
            <span
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            >
              ✕
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange ?? undefined}
          onSelect={handleSelect}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
