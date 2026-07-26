import { CheckCircle2, Circle } from "lucide-react";

interface StepMeta {
    code: string;
    label: string;
    type: 'fixed' | 'dynamic';
    is_done: boolean;
    is_skippable: boolean;
    instructions?: string | null;
}


export function StepList({
    steps,
    activeCode,
    isStepClickable = false,
    onStepClick,
}: {
    steps: StepMeta[];
    activeCode: string;
    isStepClickable?: boolean;
    onStepClick?: (code: string) => void;
}) {
    return (
        <div className="space-y-1">
            {steps.map((step, idx) => {
                const isActive = step.code === activeCode;
                const isClickable = isStepClickable && !isActive;

                return (
                    <div key={step.code} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all
                  ${step.is_done ? 'bg-green-500 border-green-500 text-white'
                                        : isActive ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-background border-muted-foreground/30 text-muted-foreground'}
                  ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
                                onClick={isClickable && onStepClick ? () => onStepClick(step.code) : undefined}
                                role={isClickable ? 'button' : undefined}
                                tabIndex={isClickable ? 0 : undefined}
                                onKeyDown={isClickable && onStepClick ? (e) => e.key === 'Enter' && onStepClick(step.code) : undefined}
                            >
                                {step.is_done
                                    ? <CheckCircle2 className="w-4 h-4" />
                                    : isActive
                                        ? <span className="text-xs font-bold">{idx + 1}</span>
                                        : <Circle className="w-4 h-4 opacity-40" />}
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`w-0.5 h-6 mt-1 ${step.is_done ? 'bg-green-400' : 'bg-muted-foreground/20'}`} />
                            )}
                        </div>
                        <div
                            className={`pt-1.5 pb-2 ${isClickable ? 'cursor-pointer' : ''}`}
                            onClick={isClickable ? () => onStepClick!(step.code) : undefined}
                        >
                            <p
                                className={`text-sm font-medium leading-tight transition-colors
                  ${isActive ? 'text-blue-600 dark:text-blue-400'
                                        : step.is_done ? 'text-green-600 dark:text-green-400'
                                            : 'text-muted-foreground'}
                  ${isClickable ? 'hover:text-blue-500 dark:hover:text-blue-300' : ''}`}
                            >
                                {step.label}
                            </p>
                            {isActive && step.instructions && (
                                <p className="text-xs text-muted-foreground mt-0.5">{step.instructions}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}