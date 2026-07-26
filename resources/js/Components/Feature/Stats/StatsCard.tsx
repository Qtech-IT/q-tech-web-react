import { Badge } from '@/Components/UI/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { cn } from '@/Utils/helpers';
import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string | number | null | undefined;
  icon?: LucideIcon | undefined;
  iconColor?: string | undefined;
  iconBgColor?: string | undefined;
  description?: string | null | undefined;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100 dark:bg-blue-900',
  description = null
}: StatsCardProps) {

  const getChangeIndicator = (change: any) => {
    if (!change && change !== 0) return null;

    const isPositive = change >= 0;
    const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

    return (
      <Badge
        variant="outline"
        className={cn(
          'gap-1 shrink-0 text-xs px-1.5 py-0.5 whitespace-nowrap',
          isPositive
            ? 'text-green-600 border-green-200'
            : 'text-red-600 border-red-200'
        )}
      >
        <ChangeIcon className="w-3 h-3 shrink-0" />
        {Math.abs(Number(change))}%
      </Badge>
    );
  };

  return (
    <Card className="transition-shadow hover:shadow-lg w-full min-w-0">

      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 gap-2 min-w-0">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate min-w-0 flex-1">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn('p-2 rounded-full shrink-0', iconBgColor)}>
            <Icon className={cn('w-4 h-4', iconColor)} />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate min-w-0 flex-1">
            {value}
          </div>
          {change != null && getChangeIndicator(change)}
        </div>

        {description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}