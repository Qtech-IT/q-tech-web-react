import React from 'react'
import { Card, CardContent } from '@/Components/UI/Card'
import { Button } from '@/Components/UI/Button'

interface EmptyTableStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title?: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
}

export const EmptyTableState: React.FC<EmptyTableStateProps> = ({
  icon: Icon = null,
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  buttonText = 'Create new',
  onButtonClick = undefined,
}) => {
  return (
    <Card className="border-2 border-gray-300 border-dashed bg-gray-50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        {Icon && (
          <div className="p-5 mb-4 bg-white rounded-full shadow-sm">
            <Icon className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="max-w-sm mb-6 text-center text-gray-500">{description}</p>
        {buttonText && onButtonClick && (
          <Button onClick={onButtonClick}>{buttonText}</Button>
        )}
      </CardContent>
    </Card>
  )
}

export default EmptyTableState
