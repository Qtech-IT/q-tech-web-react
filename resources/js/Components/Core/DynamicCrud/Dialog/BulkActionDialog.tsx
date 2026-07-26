import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog';
import { Button } from '@/Components/UI/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useTranslations } from '@/Hooks/useTranslations';

type BulkAction = {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  description?: string;
};

type BulkActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItems?: any[];
  config?: {
    title?: string;
    description?: string;
    actions?: BulkAction[];
    warningMessage?: string;
    showWarningAlert?: boolean;
    confirmationRequired?: boolean;
  };
  onApply: (items: any[], actionValue: string) => void;
  loading?: boolean;
};

export const BulkActionDialog: React.FC<BulkActionDialogProps> = ({
  open,
  onOpenChange,
  selectedItems = [],
  config = {},
  onApply,
  loading = false,
  
}) => {
 

  const finalConfig = config;
  
  const [selectedAction, setSelectedAction] = useState('');

  const handleClose = () => {
    onOpenChange(false);
    setSelectedAction('');
  };

  const handleApply = () => {
    if (selectedAction && selectedItems.length > 0) {
      onApply(selectedItems, selectedAction);
      handleClose();
    }
  };

  const selectedActionConfig = finalConfig?.actions?.find(
    (action) => action.value === selectedAction
  );

  const {t} = useTranslations();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[500px]"
       onInteractOutside={(e) => e.preventDefault()}
       onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            {finalConfig.title}
          </DialogTitle>
          <DialogDescription>{finalConfig.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {finalConfig.showWarningAlert && (
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
              <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                {finalConfig.warningMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">
                {selectedItems.length} {selectedItems.length !== 1 ? t('Items') : t('Item')}{' '}
                {t('selected')}
              </span>
            </div>

            <div>

              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                 {t('Select Action')}
              </label>
              {
                finalConfig?.actions?.length === 0 ? (
                  <div className="p-4 text-sm text-gray-600 bg-gray-100 rounded dark:bg-gray-800 dark:text-gray-400">
                    {t('No actions available')}
                  </div>
                ) :
                <>
                      <Select value={selectedAction} onValueChange={setSelectedAction}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose an action to apply" />
                        </SelectTrigger>
                        <SelectContent>
                          {finalConfig?.actions?.map((action) => {
                            const IconComponent = action.icon;
                            return (
                              <SelectItem key={action.value} value={action.value}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4" />
                                  <span>{action.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                    </Select>
                </>
              }
       

            </div>

            {selectedActionConfig?.description && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>{t('Action details')} :</strong>{' '}
                   {selectedActionConfig.description}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
             {t('Cancel')}
          </Button>
          <Button
            variant={selectedAction === 'delete' ? 'destructive' : 'default'}
            onClick={handleApply}
            disabled={!selectedAction || selectedItems.length === 0 || loading}
          >
            <ButtonLoader
              isSubmitting={loading}
              btnText={`Apply ${selectedActionConfig?.label || 'Action'}`}
              loaderText={t("Applying...")}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
