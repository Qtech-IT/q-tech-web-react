import * as React from 'react';
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from '@/Utils/helpers';

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
    value?: number;
    className?: string;
}

function Progress({ className, value = 0, ...props }: ProgressProps) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="flex-1 w-full h-full transition-all bg-primary"
                style={{ transform: `translateX(-${100 - value}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
