import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog';
import { Button } from '@/Components/UI/Button';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { useTranslations } from '@/Hooks/useTranslations';

type Field<T = any> = {
  key: keyof T;
  label: string;
  className?: string;
  render?: (value: any) => React.ReactNode;
};

type SpecialWarning<T = any> = {
  condition: (item: T) => boolean;
  title?: string;
  message: string;
  alertClass?: string;
  iconClass?: string;
  textClass?: string;
};

type RestoreDialogConfig<T = any> = {
  title?: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  infoMessage?: string;
  showInfoAlert?: boolean;
  showItemDetails?: boolean;
  restoreEndpoint?: string | null;
  itemDisplayFields?: Field<T>[];
  specialWarnings?: SpecialWarning<T>[];
};

type RestoreDialogProps<T = any> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: T | null;
  config?: RestoreDialogConfig<T>;
  onRestore: (id: any) => void;
  isSubmitting:boolean
};

export function RestoreDialog<T = any>({
  open,
  onOpenChange,
  item = null,
  config = {},
  onRestore,
  isSubmitting
}: RestoreDialogProps<T>) {


  const {t} = useTranslations();

  // Default configuration
  const defaultConfig: RestoreDialogConfig<T> = {
    title: t('Restore Item'),
    description: t('Are you sure you want to restore this item?'),
    itemName: 'Item',
    itemType: 'item',
    infoMessage: t('Restoring this item will make it active again.'),
    showInfoAlert: true,
    showItemDetails: true,
    restoreEndpoint: null,
    itemDisplayFields: [],
    specialWarnings: [],
  };

  const finalConfig = { ...defaultConfig, ...config };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!item) return null;

  // Special warnings
  const specialWarnings = finalConfig.specialWarnings?.filter((warning: any) =>
    warning.condition(item)
  ) || [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[500px] max-h-[90vh] flex flex-col"
       onInteractOutside={(e) => e.preventDefault()}
       onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 pr-8 text-blue-600 dark:text-blue-400">
            <RotateCcw className="w-5 h-5" />
            {finalConfig.title}
          </DialogTitle>
          <DialogDescription>{finalConfig.description}</DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-1 space-y-4">
            {/* Main Info Alert */}
            {finalConfig.showInfoAlert && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>Info:</strong> {finalConfig.infoMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Item Details */}
            {finalConfig.showItemDetails && finalConfig.itemDisplayFields?.length! > 0 && (
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                   {t('Item Details')}
                </h4>
                <div className="space-y-3">
                  {finalConfig.itemDisplayFields!.map((field: any, index: number) => (
                    <div key={index} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <span className="flex-shrink-0 min-w-0 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}:
                      </span>
                      <span className={`text-sm break-words ${field.className || 'text-gray-600 dark:text-gray-400'}`}>
                        {field.render ? field.render((item as any)[field.key]) : (item as any)[field.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Warnings */}
            {specialWarnings.map((warning: any, index: number) => (
              <Alert
                key={index}
                className={`${warning.alertClass || 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'}`}
              >
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${warning.iconClass || 'text-yellow-600 dark:text-yellow-400'}`} />
                <AlertDescription className={`${warning.textClass || 'text-yellow-800 dark:text-yellow-200'}`}>
                  <strong>{warning.title || 'Note'}:</strong> {warning.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex flex-col justify-end flex-shrink-0 gap-3 pt-4 bg-white border-t sm:flex-row dark:bg-gray-950">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="order-2 w-full sm:w-auto sm:order-1"
          >
            
             {t('Cancel')}
          </Button>
          <Button
            variant="default"
            onClick={() => onRestore?.((item as any)?.uuid ?? (item as any)?.id)}
            disabled={isSubmitting}
            className="order-1 w-full sm:w-auto sm:order-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText={`Restore`}
              loaderText="Restoring..."
              icon={isSubmitting ? null : <RotateCcw className="w-4 h-4" />}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}