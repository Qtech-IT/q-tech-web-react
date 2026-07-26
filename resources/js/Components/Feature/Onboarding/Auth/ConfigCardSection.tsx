
import { useTranslations } from "@/Hooks/useTranslations";
import { cn } from "@/Utils/helpers";


export const ConfigCard: React.FC<{ title: string; icon?: React.ReactNode; isConfigured: boolean; children: React.ReactNode }> =
  ({ title, icon, isConfigured, children }) => {
    const { t } = useTranslations();
    return (
      <div className="rounded-md border p-3 shadow-xs">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="text-base font-bold text-[var(--primary-color)]">{title}</h4>
          </div>
          <p className={cn("rounded-md px-2 py-1 text-sm font-medium border", isConfigured ? "border-[#31CA73] text-[#31CA73]" : "border-[#F69B29] text-[#F69B29]")}>
            {isConfigured ? t('Setup Completed') : t('Setup Pending')}
          </p>
        </div>
        {children}
      </div>
    );
};
