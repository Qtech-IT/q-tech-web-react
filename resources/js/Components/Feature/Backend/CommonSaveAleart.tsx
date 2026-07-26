import React from "react";
import { Alert, AlertDescription } from "@/Components/UI/Alert";
import { useTranslations } from "@/Hooks/useTranslations";
import { Info } from "lucide-react";

interface CommonSaveAlertProps {
  title: string;
  description?: string | null;
}

export const CommonSaveAlert: React.FC<CommonSaveAlertProps> = ({
  title,
  description = null,
}) => {
  const { t } = useTranslations();

  return (
    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
      <Info className="w-4 h-4" />
      <AlertDescription>
        <div>
          <p className="font-medium">{t(title)}</p>
          {description && (
            <p className="mt-1 text-sm">{t(description)}</p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default CommonSaveAlert;
