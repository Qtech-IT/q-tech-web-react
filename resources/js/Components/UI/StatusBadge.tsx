import { Badge } from "./Badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {

  const normalized = (status || '').toLowerCase();

  const statusVariants: Record<string, any> = {
    active: {
      variant: 'default',
      className: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
    },


    inactive: {
      variant: 'destructive',
      className: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
    },

    pending: {
      variant: 'secondary',
      className: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
    },

    approved: {
      variant: 'default',
      className: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
    },

    rejected: {
      variant: 'destructive',
      className: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
    },

    declined: {
      variant: 'destructive',
      className: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
    },
  };

  const statusConfig =
    statusVariants[normalized] || statusVariants.pending;

  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : 'Unknown';

  return (
    <Badge
      variant={statusConfig.variant}
      className={`text-xs ${statusConfig.className} ${className}`}
    >
      {label}
    </Badge>
  );
};

export default StatusBadge;