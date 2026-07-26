import { useTranslations } from "@/Hooks/useTranslations";

interface StepMeta {
    code: string;
    label: string;
    type: 'fixed' | 'dynamic';
    is_done: boolean;
    is_skippable: boolean;
    instructions?: string | null;
}
export function ProgressBar({ steps, activeCode }: { steps: StepMeta[]; activeCode: string }) {

    const activeIndex = steps.findIndex(s => s.code === activeCode);
    const progress = Math.round((activeIndex / steps.length) * 100);
    const { t } = useTranslations();
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('Step')} {activeIndex + 1} {t('of')} {steps.length}</span>
                <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex gap-1 flex-wrap">
                {steps.map(s => (
                    <span key={s.code} className={`text-[11px] px-2 py-0.5 rounded-full border font-medium
            ${s.is_done ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30'
                            : s.code === activeCode ? 'bg-blue-50  border-blue-300  text-blue-700  dark:bg-blue-900/30'
                                : 'bg-muted border-muted-foreground/20 text-muted-foreground'}`}
                    >
                        {s.label}
                    </span>
                ))}
            </div>
        </div>
    );
}