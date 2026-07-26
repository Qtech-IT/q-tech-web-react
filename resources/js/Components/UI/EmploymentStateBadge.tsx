import { Badge } from "./Badge";

interface EmploymentStateBadgeProps {
    status: string;
    className?: string;
}

const EmploymentStateBadge = ({ status, className = '' }: EmploymentStateBadgeProps) => {
    const statusVariants: Record<string, { className: string }> = {
        employed: {
            className: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700',
        },
        resigned: {
            className: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700',
        },
        terminated: {
            className: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700',
        },

        under_verification: {
            className: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700',
        },
        rejoined: {
            className: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700',
        },
    };

    const labels: Record<string, string> = {
        employed: 'Employed',
        resigned: 'Resigned',
        terminated: 'Terminated',
        rejoined: 'Rejoined',
        under_verification: 'Under Verification',
    };

    const key = status.toLowerCase();
    const config = statusVariants[key] ?? statusVariants.terminated;
    const label = labels[key] ?? status;

    return (
        <Badge
            variant="outline"
            className={`text-xs ${config?.className} ${className}`}
        >
            {label}
        </Badge>
    );
};

export default EmploymentStateBadge;