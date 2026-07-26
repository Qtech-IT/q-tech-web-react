import { Badge } from "./Badge";

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const LeaveStatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
    const statusVariants: Record<string, any> = {
        active: {
            variant: 'default',
            className: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700',
        },
        inactive: {
            variant: 'destructive',
            className: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700',
        },
        pending: {
            variant: 'default',
            className: 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/20 border-amber-200 dark:border-amber-700',
        },
        approved: {
            variant: 'default',
            className: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700',
        },
        rejected: {
            variant: 'destructive',
            className: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700',
        },
    };

    const statusConfig = statusVariants[status?.toLowerCase()] ?? statusVariants.inactive;

    return (
        <Badge
            variant={statusConfig.variant}
            className={`text-xs ${statusConfig.className} ${className}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

export default LeaveStatusBadge;